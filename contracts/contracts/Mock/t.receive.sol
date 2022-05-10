// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

contract TReceive {
    // This contract receives depostts from a user.
    // We have to store the user information:
    // - the amount of the deposit
    // - the id of the deposit
    // - the address of the user
    // - the address of the asset
    // We should also be able to retrive all the deposit information at one time.
    // We should also be able to retrive the deposit information for a specific user.
    // We should also be able to retrive the deposit information for a specific asset.

    // Variables to store the user information
    struct Deposit {
        bytes32 id;
        uint256 amount;
        uint256 amountUSD;
        bool risk;
    }

    mapping(bytes32 => Deposit) public deposits;
    // Array of bytes32 to store the ids of the deposits
    bytes32[] public depositIDs;

    function deposit(
        bytes32 _id,
        uint256 _amount,
        uint256 _amountUsd,
        bool _risk
    ) public {
        deposits[_id] = Deposit(_id, _amount, _amountUsd, _risk);

        // Add id to the array of ids only if it does not exist yet
        for (uint i = 0; i < depositIDs.length; i++) {
            if (depositIDs[i] == _id) {
                return;
            } else {
                depositIDs.push(_id);
            }
        }
    }

    // Get all the deposits information
    function getDeposits() public view returns (Deposit[] memory) {
        Deposit[] memory result = new Deposit[](depositIDs.length);
        for (uint i = 0; i < depositIDs.length; i++) {
            result[i] = deposits[depositIDs[i]];
        }
        return result;
    }
}
