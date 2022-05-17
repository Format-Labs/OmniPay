// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IStargateReceiver.sol";

import "./lzApp/NonblockingLzApp.sol";

contract Settler is Ownable, NonblockingLzApp, ReentrancyGuard {
    using SafeERC20 for IERC20;
    /*************VARIABLES *****************/

    address public USDC;
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
    event UpdatedData(address indexed _from, uint256 _amount);
    event AccountCreated(address indexed _from, uint256 _amount);
    event Delegated(address indexed _from);

    constructor(address _lzEndpoint, address _USDC)
        NonblockingLzApp(_lzEndpoint)
    {
        USDC = _USDC;
    }

    /// @notice Creates a new account
    /// @param _accAddress The owner of the account
    function createAccount(address _accAddress)
        public
        returns (bytes memory _accountId)
    {
        require(_accAddress != address(0), "Address can't be NULL");
        require(
            accounts[_accAddress].owner != _accAddress,
            "Account already exists"
        );
        accounts[_accAddress] = Accout(_accAddress, 0);
        emit AccountCreated(_accAddress, 0);
        // Abi.encodePacked of the address of the account
        return abi.encodePacked(_accAddress);
    }

    ///@notice gives power to an address to update Data.
    ///@param _sDelegate The address of the delegate
    function Delegate(address _sDelegate) external onlyOwner {
        require(_sDelegate != address(0), "Address can't be NULL");
        require(delegated[_sDelegate] == false, "Address already delegated");
        delegated[_sDelegate] = true;
        emit Delegated(_sDelegate);
    }

    // Modifier to check delegation
    modifier onlyDelegated(address _sDelegate) {
        require(delegated[_sDelegate] == true, "Address not delegated");
        _;
    }

    /// @notice gets balance from an account
    /// @param _accAddress The owner of the account
    function getBalance(address _accAddress) public view returns (uint256) {
        return accounts[_accAddress].balance;
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

    /// @notice Receive from layerZero.
    function _nonblockingLzReceive(
        uint16, /*_srcChainId*/
        bytes memory, /*_srcAddress*/
        uint64, /*_nonce,*/
        bytes memory _payload
    ) internal override {
        (uint256 amount, bytes memory to) = abi.decode(
            _payload,
            (uint256, bytes)
        );

        address accAddrr;
        assembly {
            accAddrr := mload(add(to, 20))
        }

        // Update Accounts.
        accounts[accAddrr].balance += amount;
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
    /// @param _accAddress The owner of the account
    /// @param _amount The amount of tokens to withdraw

    function withdraw(address _accAddress, uint256 _amount)
        public
        nonReentrant
    {
        require(msg.sender == _accAddress, "Only the owner can withdraw");
        require(accounts[_accAddress].balance >= _amount, "Not enough balance");
        accounts[_accAddress].balance -= _amount;

        // Transfer USDC to the caller.
        IERC20(USDC).safeTransfer(_accAddress, _amount);

        emit Withdraw(_accAddress, _amount);
    }

    receive() external payable {}
}
