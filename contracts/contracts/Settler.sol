// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "./Interfaces/IStargateReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./lzApp/NonblockingLzApp.sol";

contract Settler is Ownable {
    // This contract allows a user to create an account that can receive tokens
    // It should produce a unique address for each account

    /*************VARIABLES *****************/
    struct Accout {
        address owner;
        uint256 balance;
    }

    mapping(address => Accout) public accounts;

    struct UpdataData {
        uint256 amount;
        address owners;
    }

    // Mapping for delegation of an address
    mapping(address => bool) public delegated;

    /************* EVENTS *****************/
    event sgReceived(
        uint16 indexed _from,
        bytes _srcAddress,
        uint256 indexed _nonce,
        address indexed _token,
        uint256 _amount,
        bytes _payload
    );

    event Withdraw(address indexed _from, uint256 _amount);

    event UpdatedData(address _from, uint256 _amount);

    /// @notice Creates a new account
    /// @param _owner The owner of the account
    function createAccount(address _owner) public returns (bytes32 _accountId) {
        require(_owner != address(0), "Address can't be NULL");
        require(accounts[_owner].owner != _owner, "Account already exists");
        accounts[_owner] = Accout(_owner, 0);
        // Abi.encodePacked of the address of the account
        return keccak256(abi.encodePacked(_owner));
    }

    ///@notice gives power to an address to update Data.
    ///@param _sDelegate The address of the delegate
    function Delegate(address _sDelegate) external onlyOwner {
        require(_sDelegate != address(0), "Address can't be NULL");
        require(delegated[_sDelegate] == false, "Address already delegated");
        delegated[_sDelegate] = true;
    }

    // Modifier to check delegation
    modifier onlyDelegated(address _sDelegate) {
        require(delegated[_sDelegate] == true, "Address not delegated");
        _;
    }

    /// @notice gets balance from an account
    /// @param _owner The owner of the account
    function getBalance(address _owner) public view returns (uint256) {
        return accounts[_owner].balance;
    }

    /// @notice recives tokens from a stargate
    function sgReceive(
        uint16 _srcChainId, // the remote chainId sending the tokens
        bytes memory _srcAddress, // the remote Bridge address
        uint256 _nonce,
        address _token, // the token contract on the local chain
        uint256 amountLD, // the qty of local _token contract tokens
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

    /// @notice Updates the balance of an account
    /// @dev It recives data from an external API to updata each data.
    /// @param _data  The data to update the balance
    function UpdateBalance(UpdataData[] memory _data)
        external
        onlyDelegated(msg.sender)
    {
        for (uint256 i = 0; i < _data.length; i++) {
            accounts[_data[i].owners].balance = _data[i].amount;
            emit UpdatedData(_data[i].owners, _data[i].amount);
        }
    }

    /// @notice Withdraws tokens from an account
    /// @param _owner The owner of the account
    /// @param _amount The amount of tokens to withdraw

    function withdraw(address _owner, uint256 _amount) public {
        require(msg.sender == _owner, "Only the owner can withdraw");
        require(accounts[_owner].balance >= _amount, "Not enough balance");
        accounts[_owner].balance -= _amount;
        emit Withdraw(_owner, _amount);
    }

    receive() external payable {}
}
