// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
The contract can receive Ether and Tokens.
It will map the amount recived to a unique Id provided as an input during deposit.
It will also emit an event for each deposit.
It will then perform a batch swap of tokens deposited via Uniswap.
 */
interface IReceiver {
    function deposit(bytes32 _id, uint256 _amount) external payable;

    event Deposit(bytes32 indexed _id, uint256 _amount);
}
