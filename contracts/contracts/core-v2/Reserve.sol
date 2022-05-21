// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../lzApp/NonblockingLzApp.sol";
import "../Interfaces/IStargateReceiver.sol";
import {IStargateRouter} from "../Interfaces/IStargateRouter.sol";

contract Reserve is NonblockingLzApp {
    using SafeERC20 for IERC20;

    address public USDC;

    IStargateRouter public stargateRouter;
    uint8 public constant TYPE_SWAP_REMOTE = 1;

    constructor(
        IStargateRouter _stargateRouter,
        address _endpoint,
        address _USDC
    ) NonblockingLzApp(_endpoint) {
        stargateRouter = _stargateRouter;
        USDC = _USDC;
    }

    event sgReceived(
        uint16 indexed _from,
        bytes _srcAddress,
        uint256 indexed _nonce,
        address indexed _token,
        uint256 _amount,
        bytes _payload
    );

    /// @notice recives tokens from a stargate
    function sgReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint256 _nonce,
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external {
        emit sgReceived(
            _srcChainId,
            _srcAddress,
            _nonce,
            _token,
            amountLD,
            payload
        );
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce,*/
        bytes memory _payload
    ) internal override {
        address dstAddress;
        assembly {
            dstAddress := mload(add(_srcAddress, 20))
        }

        (uint256 amounts, ) = abi.decode(_payload, (uint256, address));
        stargateSend(
            _srcChainId,
            1,
            1,
            amounts,
            amounts,
            dstAddress,
            address(USDC),
            _payload
        );
    }

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
        address token,
        bytes memory _payload
    ) public payable {
        uint256 fee = _getStargateSwapFee(
            _chainId,
            abi.encodePacked(address(this)),
            abi.encodePacked(address(this))
        );
        require(address(this).balance >= fee);

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
            bytes(_payload) // bytes param; payload to send to the destination
        );
    }

    receive() external payable {}
}
