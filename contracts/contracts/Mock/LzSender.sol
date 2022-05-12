// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;
pragma abicoder v2;

import "../lzApp/NonblockingLzApp.sol";

contract LzSender is NonblockingLzApp {
    constructor(address _endpoint) NonblockingLzApp(_endpoint) {}

    function send(
        uint256 _amount,
        bytes memory _address,
        uint16 _dstChainId,
        address _dstAddress
    ) public payable {
        bytes memory payload = abi.encode(_amount, _address);

        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        // get the fees we need to pay to LayerZero for message delivery
        // uint fee = _estimateFees(payload, adapterParams, _dstChainId);
        (uint fee, ) = lzEndpoint.estimateFees(
            _dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        // pay the fees
        require(msg.value >= fee, "you need to pay the message fee");

        // send the message
        lzEndpoint.send{value: fee}(
            _dstChainId, // destination LayerZero chainId
            abi.encodePacked(_dstAddress), // send to this address on the destination
            payload, // bytes payload
            payable(msg.sender), // refund address
            address(0x0), // future parameter
            adapterParams // adapterParams (see "Advanced Features")
        );
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        // decode the payload
        (uint amount, bytes memory faddress) = abi.decode(
            _payload,
            (uint, bytes)
        );
    }
}
