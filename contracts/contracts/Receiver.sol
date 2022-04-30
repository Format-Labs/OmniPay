// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import {IStargateRouter} from "./Interfaces/IStargateRouter.sol";

contract Receiver {
    using SafeERC20 for IERC20;
    using Address for address;

    ISwapRouter public immutable swapRouter;
    IStargateRouter public immutable stargateRouter;

    uint8 public constant TYPE_SWAP_REMOTE = 1;

    constructor(ISwapRouter _swapRouter, IStargateRouter _stargateRouter) {
        swapRouter = _swapRouter;
        stargateRouter = _stargateRouter;
    }

    struct Deposit {
        bytes32 id;
        uint256 amount;
    }

    //A mapping to store all the types of tokens deposited into the contract

    mapping(bytes32 => Deposit) public deposits;

    event Deposited(bytes32 indexed id, uint256 amount);

    // A function that accepts ERC20 tokens and deposits them to the Receiver contract.
    function deposit(
        bytes32 _id,
        IERC20 token,
        uint256 _amount
    ) public {
        // token.safeTransferFrom(token, address(this), _amount);
        // Transfer the amount of tokens to the Receiver contract.
        token.safeTransferFrom(msg.sender, address(this), _amount);

        deposits[_id] = Deposit(_id, _amount);

        emit Deposited(_id, _amount);
    }

    // A function that returns the deposits of a specific id.
    function getDeposits(bytes32 _id) public view returns (Deposit memory) {
        return deposits[_id];
    }

    // Get balance of tokens in the Receiver contract.
    function getBalance(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /// @notice Internal function to perform swaps on the UniswapV3 router.
    /// @param amountIn The amount of tokens to swap in.
    /// @param _tokenIn The token to be swapped in.
    /// @param _tokenOut The token to be swapped out.
    /// @param poolFee The fee to be paid to the pool.
    /// @param amountOutMin The minimum amount of tokens to be swapped out.
    /// @return amountOut The amount of _tokenOut to be swapped out.

    function AssetSwap(
        uint256 amountIn,
        address _tokenIn,
        address _tokenOut,
        uint24 poolFee,
        uint256 amountOutMin
    ) internal returns (uint256 amountOut) {
        // Caller must approve the contract to spend the tokens.
        // Transfer specified amount of _tokenIn to the contract.
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
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    // This function performs several swaps using the swap function above.
    // It swaps various types of tokens which are passed via a struct of type `Swap`.

    /// @notice A function to perform batch swaps.
    /// @dev This function is used to perform batch swaps using the swap function.
    /// @param _swaps A struct of type `Swap` which contains the information for the swaps to be performed.
    /// @return The amount of tokens swapped out.

    struct SwapIn {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        uint24 poolFee;
    }

    function batchAssetSwap(SwapIn[] memory _swaps)
        public
        returns (uint256 amountOut)
    {
        amountOut = 0;

        for (uint256 i = 0; i < _swaps.length; i++) {
            amountOut += AssetSwap(
                _swaps[i].amountIn,
                _swaps[i].tokenIn,
                _swaps[i].tokenOut,
                _swaps[i].poolFee,
                _swaps[i].amountOutMin
            );
        }

        return amountOut;
    }

    /**********************************************/
    /********** Bridging the Funds ****************/
    /**********************************************/

    /*********************************************/
    /*********** IStargateRouter *****************/
    /*********************************************/

    ///@notice get the swap fee.
    ///@dev This is a private function that returns the swap fee.
    /// @param _dstChainId The destination chain id.
    /// @param _toAddress The address of the destination contract.
    /// @param _transferAndCallPayload The payload for the transfer and call function.
    function getSwapFee(
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
    function swap(
        uint16 _chainId,
        uint16 sPoolId,
        uint16 dPoolId,
        uint256 qty,
        uint256 amountOutMin,
        address dstAddr
    ) public payable {
        require(
            msg.value >=
                getSwapFee(
                    _chainId,
                    abi.encodePacked(address(this)),
                    abi.encodePacked(address(this))
                )
        );
        IStargateRouter(stargateRouter).swap{value: msg.value}(
            10006, // send to Fuji (use LayerZero chainId)
            sPoolId, // source pool id
            dPoolId, // dest pool id
            payable(msg.sender), // refund adddress. extra gas (if any) is returned to this address
            qty, // quantity to swap
            amountOutMin, // the min qty you would accept on the destination
            IStargateRouter.lzTxObj(0, 0, "0x"), // 0 additional gasLimit increase, 0 airdrop, at 0x address
            abi.encodePacked(dstAddr), // the address to send the tokens to on the destination
            bytes("") // bytes param, if you wish to send additional payload you can abi.encode() them here
        );
    }
}
