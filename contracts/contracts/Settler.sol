// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Interfaces/IStargateReceiver.sol";

import "./lzApp/NonblockingLzApp.sol";

contract Settler is
    Ownable,
    NonblockingLzApp,
    ReentrancyGuard,
    KeeperCompatible
{
    using SafeERC20 for IERC20;
    /*************VARIABLES *****************/

    ISwapRouter public swapRouter;
    address public USDC;
    uint256 public immutable interval = 1800;
    uint256 public lastTimeStamp = block.timestamp;
    struct Accout {
        address owner;
        uint256 balance;
        address SettlmentToken;
    }

    mapping(address => Accout) public accounts;
    mapping(address => bool) created;
    address[] public accIds;

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

    constructor(
        address _lzEndpoint,
        address _USDC,
        ISwapRouter _swapRouter
    ) NonblockingLzApp(_lzEndpoint) {
        USDC = _USDC;
        swapRouter = _swapRouter;
    }

    /// @notice Creates a new account
    /// @param _accAddress The owner of the account
    /// @param _settlmentToken The token to be used for settlement of the account.
    function createAccount(address _accAddress, address _settlmentToken)
        public
        returns (bytes memory _accountId)
    {
        require(_accAddress != address(0), "Address can't be NULL");
        require(!created[_accAddress], "Account already exists");
        accounts[_accAddress] = Accout(_accAddress, 0, _settlmentToken);
        created[_accAddress] = true;
        accIds.push(_accAddress);
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

    function swap(
        uint256 amountIn,
        address _tokenIn,
        address _tokenOut,
        uint24 _poolFee,
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

    /// @notice Withdraws tokens from an account
    /// @param _accAddress The owner of the account
    /// @param _amount The amount of tokens to withdraw

    function withdraw(
        address _accAddress,
        uint256 _amount,
        address _token
    ) public nonReentrant {
        require(msg.sender == _accAddress, "Only the owner can withdraw");
        require(accounts[_accAddress].balance >= _amount, "Not enough balance");
        accounts[_accAddress].balance -= _amount;

        // Transfer USDC to the caller.
        IERC20(_token).safeTransfer(_accAddress, _amount);

        emit Withdraw(_accAddress, _amount);
    }

    function dispatachPayments(uint24 poolFee) public {
        for (uint256 i; i < accIds.length; i++) {
            Accout memory acc = accounts[accIds[i]];
            if (acc.balance > 0) {
                uint256 amountOut = swap(
                    acc.balance,
                    USDC,
                    acc.SettlmentToken,
                    poolFee,
                    acc.balance
                );
                // call withdraw
                withdraw(accIds[i], amountOut, acc.SettlmentToken);
            }
        }
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded =
            ((block.timestamp - lastTimeStamp) > interval) &&
            (IERC20(USDC).balanceOf(address(this)) > 10000000);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        dispatachPayments(3000);
    }

    receive() external payable {}
}
