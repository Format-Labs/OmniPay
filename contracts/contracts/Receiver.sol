// SPDX-License-Identifier: MIT

pragma solidity ~0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./Uniswap.sol";

contract Receiver {
    using SafeERC20 for IERC20;
    using Address for address;

    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public USDC;

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

    // Performing Batch Swap of tokens deposited via Uniswap.

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountMinOut,
        address _to
    ) internal {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);

        address[] memory path;
        path = new address[](3);
        path[0] = _tokenIn;
        path[1] = USDC;
        path[2] = _tokenOut;

        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountMinOut,
            path,
            _to,
            block.timestamp
        );
    }

    // A function that receives an array of token ardresses and the amount of each token and performs swaps for every token.
    function batchSwap(
        address[] memory _tokens,
        uint256[] memory _amounts,
        address _to
    ) internal {
        for (uint256 i = 0; i < _tokens.length; i++) {
            swap(_tokens[i], USDC, _amounts[i], 0, _to);
        }
    }
}
