// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/utils/Address.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import {IStargateRouter} from "../Interfaces/IStargateRouter.sol";

import "../lzApp/NonblockingLzApp.sol";

contract Receiver is NonblockingLzApp, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address;

    /********************** VARIABLES ****************/
    ISwapRouter public immutable swapRouter;
    IStargateRouter public immutable stargateRouter;

    address public USDC;
    address public reserveAddress;
    uint16 public reserveChainId;

    mapping(uint16 => address) public dstAddresses;

    uint8 public constant TYPE_SWAP_REMOTE = 1;
    uint16[] public chainIds = [
        10001,
        /*Rinkeby*/
        10006,
        /* fuji*/
        10009,
        /* mumbai*/
        1002 /* BSC*/
    ];

    struct Deposit {
        bytes id;
        mapping(address => uint256) amounts;
        uint256 amountUSD;
    }

    mapping(bytes => Deposit) public deposits;
    mapping(bytes => bool) public inserted;
    bytes[] public depositIDs;

    // mapping(bytes => mapping(address => uint256)) public balances;
    mapping(address => uint256) public balances;

    /********************** EVENTS ****************/
    event Deposited(bytes indexed id, uint256 amount);
    event Received(uint16 _srcChainId, bytes _srcAddress, uint64 _nonce);
    event sgReceived(uint16 _srcChainId, bytes _srcAddress, uint256 amount);
    event TransferInitiatedStargate(
        address asset,
        address from,
        address to,
        uint256 amount
    );

    constructor(
        ISwapRouter _swapRouter,
        IStargateRouter _stargateRouter,
        address _endpoint,
        address _USDC
    ) NonblockingLzApp(_endpoint) {
        swapRouter = _swapRouter;
        stargateRouter = _stargateRouter;
        USDC = _USDC;
    }

    function createAccount(address _account) public {
        // Check if account exists .
        require(balances[_account] == 0, "Account already exists");
        balances[_account] = 0;
        // update state globaly
        bytes memory account = abi.encodePacked(_account);
        UpdateState(chainIds, 0, account);
    }

    function destInfo(uint16 _chainId, address _destAddress) public {
        dstAddresses[_chainId] = _destAddress;
    }

    /// @notice Receive payments from the user
    /// @param _id the id of the deposit
    /// @param token the token address
    /// @param _amount the amount of the deposit
    /// @param _amountUSD the amount of the deposit in USD
    /// @param risk the risk of the deposited asset
    ///@param poolFee the fee to be paid to the pool

    function pay(
        bytes memory _id,
        IERC20 token,
        uint256 _amount,
        uint256 _amountUSD,
        bool risk,
        uint24 poolFee
    ) public {
        token.safeTransferFrom(msg.sender, address(this), _amount);
        deposits[_id].id = _id;
        deposits[_id].amounts[address(token)] = _amount;
        deposits[_id].amountUSD = _amountUSD;

        address id;
        assembly {
            id := mload(add(_id, 20))
        }

        balances[id] = _amountUSD;

        if (!inserted[_id]) {
            depositIDs.push(_id);
            inserted[_id] = true;
        }

        emit Deposited(_id, _amount);

        if (risk && !(address(token) == USDC)) {
            swap(_amount, address(token), USDC, poolFee, _amountUSD);
        }

        UpdateState(chainIds, _amountUSD, _id);
    }

    function send(
        uint256 _amountUSD,
        bytes memory _address,
        uint16 _dstChainId,
        address _dstAddress
    ) public payable {
        bytes memory payload = abi.encode(_amountUSD, _address);

        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        (uint fee, ) = lzEndpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        require(
            address(this).balance >= fee,
            "you need to pay the message fee"
        );

        lzEndpoint.send{value: fee}(
            _dstChainId, // destination LayerZero chainId
            abi.encodePacked(_dstAddress), // send to this address on the destination
            payload, // bytes payload
            payable(msg.sender), // refund address
            address(0x0), // future parameter
            adapterParams // adapterParams (see "Advanced Features")
        );
    }

    /// @notice update state globably
    function UpdateState(
        uint16[] memory _chainIds,
        uint256 _amountUSD,
        bytes memory _address
    ) internal {
        for (uint16 i = 0; i < _chainIds.length; i++) {
            send(_amountUSD, _address, _chainIds[i], dstAddresses[i]);
        }
    }

    /// @notice receive a message from contracts from othe chains
    /// @param _srcChainId the source chainId
    /// @param _srcAddress the source address
    /// @param _nonce the nonce of the message
    /// @param _payload the payload of the message

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {
        address srcAddress;
        address usrAddress;
        assembly {
            srcAddress := mload(_srcAddress)
            usrAddress := mload(add(_srcAddress, 20))
        }
        // decode the payload
        (uint256 _amount, bytes memory _address) = abi.decode(
            _payload,
            (uint256, bytes)
        );
        assembly {
            usrAddress := mload(add(_address, 20))
        }
        // Update The balances
        balances[usrAddress] = _amount;

        emit Received(_srcChainId, _srcAddress, _nonce);
    }

    function getBalance(bytes memory _id) public view returns (uint256) {
        return deposits[_id].amountUSD;
    }

    /// @notice Internal function to perform swaps on the UniswapV3 router.
    /// @param amountIn The amount of tokens to swap in.
    /// @param _tokenIn The token to be swapped in.
    /// @param _tokenOut The token to be swapped out.
    /// @param _poolFee The fee to be paid to the pool.
    /// @param amountOutMin The minimum amount of tokens to be swapped out.
    /// @return amountOut The amount of _tokenOut to be swapped out.

    function swap(
        uint256 amountIn,
        address _tokenIn,
        address _tokenOut,
        uint24 _poolFee,
        uint256 amountOutMin
    ) internal returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(
            _tokenIn,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    struct Swap {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        uint24 poolFee;
    }

    /// @notice external function to perform batch swaos.
    /// @param swaps The array of swaps to be performed.

    function batchSwap(Swap[] memory swaps) public returns (uint256 amountOut) {
        amountOut = 0;

        for (uint256 i; i < swaps.length; i++) {
            amountOut += swap(
                swaps[i].amountIn,
                swaps[i].tokenIn,
                swaps[i].tokenOut,
                swaps[i].poolFee,
                swaps[i].amountOutMin
            );
        }
    }

    /*****************************/
    /*  Bridge The funds         */
    /*****************************/

    /*********************************************/
    /*********** IStargateRouter *****************/
    /*********************************************/

    ///@notice get the swap fee.
    ///@dev This is a private function that returns the swap fee.
    /// @param _dstChainId The destination chain id.
    /// @param _toAddress The address of the destination contract.
    /// @param _transferAndCallPayload The payload for the transfer and call function.
    function _getStargateSwapFee(
        uint16 _dstChainId,
        bytes memory _toAddress,
        bytes memory _transferAndCallPayload
    ) public view returns (uint256) {
        (uint256 fee, ) = IStargateRouter(stargateRouter).quoteLayerZeroFee(
            _dstChainId,
            TYPE_SWAP_REMOTE,
            _toAddress,
            _transferAndCallPayload,
            IStargateRouter.lzTxObj(0, 0, "0x")
        );
        return fee;
    }

    // the msg.value is the "fee" that Stargate needs to pay for the cross chain message
    function stargateSend(
        uint16 _chainId,
        uint16 sPoolId,
        uint16 dPoolId,
        uint256 _amount,
        uint256 amountOutMin,
        address dstAddr,
        IERC20 token
    ) public payable {
        // get the fee
        uint256 fee = _getStargateSwapFee(
            _chainId,
            abi.encodePacked(dstAddr),
            abi.encodePacked(token, _amount)
        );
        require(
            address(this).balance >= fee,
            "load more gas to the contract bruh"
        );

        IERC20(token).approve(address(swapRouter), _amount);
        IStargateRouter(stargateRouter).swap{value: fee}(
            _chainId, //  LayerZero chainId
            sPoolId, // source pool id
            dPoolId, // dest pool id
            payable(msg.sender), // refund adddress. extra gas (if any) is returned to this address
            _amount, // quantity to swap
            amountOutMin, // the min qty you would accept on the destination
            IStargateRouter.lzTxObj(0, 0, "0x"), // 0 additional gasLimit increase, 0 airdrop, at 0x address
            abi.encodePacked(dstAddr), // the address to send the tokens to on the destination
            bytes("") // bytes param; payload to send to the destination
        );

        // emit the event
        emit TransferInitiatedStargate(
            address(token),
            address(this),
            address(this),
            _amount
        );
    }

    /*********************************************/
    /***********    Withdraw    *****************/
    /*********************************************/

    /// @notice withdraws funds of and account from the reserve contract.
    function withdraw(address _to, uint256 _amount) external {
        require(
            address(this).balance >= _amount,
            "load more gas to the contract bruh"
        );

        bytes memory payload = abi.encode(_amount, _to);

        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        // get the fees we need to pay to LayerZero for message delivery
        // uint fee = _estimateFees(payload, adapterParams, _dstChainId);
        (uint fee, ) = lzEndpoint.estimateFees(
            reserveChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        // pay the fees
        require(
            address(this).balance >= fee,
            "load more gas to the contract bruh"
        );

        // send the message
        lzEndpoint.send{value: fee}(
            reserveChainId, // destination LayerZero chainId
            abi.encodePacked(reserveAddress), // send to this address on the destination
            payload, // bytes payload
            payable(msg.sender), // refund address
            address(0x0), // future parameter
            adapterParams // adapterParams (see "Advanced Features")
        );
    }

    /// @notice recives tokens from a stargate
    /// @dev It  receives and sends the funds to the user.
    function sgReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint256, /* _nonce, */
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external nonReentrant {
        emit sgReceived(_srcChainId, _srcAddress, amountLD);

        (uint256 amount, address _to) = abi.decode(payload, (uint256, address));

        // Transfer tokens to address _to
        IERC20(_token).safeTransfer(_to, amount);
        balances[_to] -= amount;
    }

    receive() external payable {}
}
