// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "../lzApp/NonblockingLzApp.sol";

contract LzReceiver is NonblockingLzApp {
    constructor(address _endpoint) NonblockingLzApp(_endpoint) {}

    mapping(bytes => uint256) public balances;

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        // decode the number of pings sent thus far
        // uint pings = abi.decode(_payload, (uint));
        (uint256 _amount, bytes memory _address) = abi.decode(
            _payload,
            (uint256, bytes)
        );
        balances[_address] += _amount;
    }

    // allow this contract to receive ether
    receive() external payable {}
}
