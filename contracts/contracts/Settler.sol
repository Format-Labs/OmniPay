// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

contract Settler {
    // This contract allows a user to create an account that can receive tokens
    // It should produce a unique address for each account

    struct Accout {
        address owner;
        uint256 balance;
    }

    mapping(address => Accout) public accounts;

    // This function allows a user to create an account
    function createAccount(address _owner) public returns (bytes32 _accountId) {
        require(_owner != address(0), "Address can't be NULL");
        require(accounts[_owner].owner != _owner, "Account already exists");
        accounts[_owner] = Accout(_owner, 0);
        // Abi.encodePacked of the address of the account
        return keccak256(abi.encodePacked(_owner));
    }

    // This function allows a user to deposit tokens into their account
    function deposit(address _owner, uint256 _amount) public {
        accounts[_owner].balance += _amount;
    }

    // This function allows a user to withdraw tokens from their account
    function withdraw(address _owner, uint256 _amount) public {
        accounts[_owner].balance -= _amount;
    }

    // This function allows a user to check the balance of their account
    function getBalance(address _owner) public view returns (uint256) {
        return accounts[_owner].balance;
    }
}
