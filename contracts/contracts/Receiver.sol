// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/utils/Address.sol";

import {IStargateRouter} from "./Interfaces/IStargateRouter.sol";

import "./lzApp/NonblockingLzApp.sol";

contract Receiver is
    Ownable,
    ReentrancyGuard,
    NonblockingLzApp,
    KeeperCompatibleInterface
{
    using SafeERC20 for IERC20;
    using Address for address;

    /********************** VARIABLES ****************/
    ISwapRouter public immutable swapRouter;
    IStargateRouter public immutable stargateRouter;

    /********************** Stargate swap Func Type****************/
    uint8 public constant TYPE_SWAP_REMOTE = 1;

    /********************** Keeper params ****************/
    uint256 public immutable interval = 30 minutes;
    uint256 public lastTimeStamp = block.timestamp;

    uint24 public poolFee = 0;

    address public USDC;
    address public dstAddress;
    uint16 public dstchainId;

    struct Payment {
        bytes id;
        uint256 amount;
        uint256 amountUSD;
        bool risk;
    }

    mapping(bytes => Payment) public payments;
    mapping(bytes => bool) public inserted;
    bytes[] public paymentIDs;

    /********************** EVENTS *******************/

    event TransferInitiated(address asset, address from, address to);
    event Deposited(bytes indexed id, uint256 amount);

    constructor(
        ISwapRouter _swapRouter,
        IStargateRouter _stargateRouter,
        address _LzEndpoint
    ) NonblockingLzApp(_LzEndpoint) {
        swapRouter = _swapRouter;
        stargateRouter = _stargateRouter;
    }

    function updateInitialls(
        address _USDC,
        address _dstAddress,
        uint16 _dstchainId
    ) external onlyOwner {
        USDC = _USDC;
        dstAddress = _dstAddress;
        dstchainId = _dstchainId;
    }

    function Pay(
        bytes memory _id,
        IERC20 token,
        uint256 _amount,
        uint256 _amountUSD,
        bool risk
    ) public {
        token.safeTransferFrom(msg.sender, address(this), _amount);

        // Update payments and balances
        payments[_id] = Payment(_id, _amount, _amountUSD, risk);

        // Index the addresses
        if (!inserted[_id]) {
            paymentIDs.push(_id);
            inserted[_id] = true;
        }

        emit Deposited(_id, _amountUSD);

        if (risk) {
            // Initiate a single swap.
            swap(_amount, address(token), USDC, poolFee, _amountUSD);
        }
        // Send Message to  settler Contract on destination chain.
        sendMessage(_amountUSD, _id, dstchainId, dstAddress);
    }

    /*********************************************/
    /*************** UNISWAP v3 ********************/
    /*********************************************/

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

        // Approve the router to spend the tokens.
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

    /// @notice A function to perform batch swaps.
    /// @dev This function is used to perform batch swaps using the swap function.
    /// @param _swaps A struct of type `Swap` which contains the information for the swaps to be performed.
    /// @return The amount of tokens swapped out.

    struct Swap {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        uint24 poolFee;
    }

    function batchSwap(Swap[] memory _swaps)
        external
        returns (uint256 amountOut)
    {
        amountOut = 0;

        for (uint256 i; i < _swaps.length; i++) {
            amountOut += swap(
                _swaps[i].amountIn,
                _swaps[i].tokenIn,
                _swaps[i].tokenOut,
                _swaps[i].poolFee,
                _swaps[i].amountOutMin
            );
        }

        return amountOut;
    }

    /*********************************************/
    /*************** STARGATE ********************/
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

    function stargateSend(
        uint16 _chainId,
        uint16 sPoolId,
        uint16 dPoolId,
        uint256 _amount,
        uint256 amountOutMin,
        address dstAddr,
        IERC20 token
    ) internal {
        uint256 fee = _getStargateSwapFee(
            _chainId,
            abi.encodePacked(address(this)),
            abi.encodePacked(address(this))
        );
        require(
            address(this).balance > fee,
            "the balance of this contract is Low. pls send gas for message fees"
        );

        IERC20(token).approve(address(stargateRouter), _amount);
        IStargateRouter(stargateRouter).swap{value: fee}(
            _chainId, //  LayerZero chainId
            sPoolId, // source pool id
            dPoolId, // dest pool id
            payable(msg.sender), // refund adddress. extra gas (if any) is returned to this address
            _amount, // quantity to swap
            amountOutMin, // the min qty you would accept on the destination
            IStargateRouter.lzTxObj(0, 0, "0x"), // 0 additional gasLimit increase, 0 airdrop, at 0x address
            abi.encodePacked(dstAddr), // the address to send the tokens to on the destination
            bytes("") // payload to send to the destination
        );
    }

    /*********************************************/
    /**************** Layer Zero ********************/
    /*********************************************/

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal override {}

    function sendMessage(
        uint256 _amount,
        bytes memory _address,
        uint16 _dstChainId,
        address _dstAddress
    ) public payable {
        bytes memory payload = abi.encode(_amount, _address);

        uint16 version = 1;
        uint256 gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        (uint256 fee, ) = lzEndpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        require(
            address(this).balance > fee,
            "the balance of this contract is Low. pls send gas for message fees"
        );

        // send the message
        lzEndpoint.send{value: fee}(
            _dstChainId, // destination LayerZero chainId
            abi.encodePacked(_dstAddress), // send to this address on the destination
            payload, // bytes payload
            payable(msg.sender), // refund address
            address(0x0), // future parameter
            adapterParams // adapterParams
        );
    }

    /*********************** Chainlink Keepers ***************** */
    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory)
    {
        upkeepNeeded =
            ((block.timestamp - lastTimeStamp) > interval) &&
            (IERC20(USDC).balanceOf(address(this)) > 100000);
        return (upkeepNeeded, "0x0");
    }

    // Bridge the funds via the Chainlink Keeper
    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            stargateSend(
                dstchainId,
                1,
                1,
                /**send a penny Due to lack of liquidity on testnets. */
                1000,
                1000,
                dstAddress,
                IERC20(USDC)
            );
        }
    }

    function getPayments(bytes memory _id)
        public
        view
        returns (Payment memory)
    {
        return payments[_id];
    }

    function getBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    // retrive all payments and return an array containing payments of each ID
    function getAllpayments() public view returns (Payment[] memory) {
        Payment[] memory result = new Payment[](paymentIDs.length);
        for (uint256 i = 0; i < paymentIDs.length; i++) {
            result[i] = payments[paymentIDs[i]];
        }
        return result;
    }

    receive() external payable {}
}
