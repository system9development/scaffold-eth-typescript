// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../openzeppelin/Ownable.sol";
import "../openzeppelin/ERC20.sol";
import "../openzeppelin/ReentrancyGuard.sol";

// from and to are addresses of tokens who have the same decimals
contract Swap is Ownable, ReentrancyGuard {
    ERC20 _fromToken;
    ERC20 _toToken;

    constructor(ERC20 fromToken, ERC20 toToken) {
        _fromToken = fromToken;
        _toToken = toToken;
    }

    function swap(uint256 amount) nonReentrant external {
        address user = msg.sender;
        uint256 allowance = _fromToken.allowance(user, address(this));
        require(amount <= allowance, "User has not given swap contract spend approval");
        uint256 selfBalanceToToken = _toToken.balanceOf(address(this));
        require(amount <= selfBalanceToToken, "Not enough liquidity");
        _fromToken.transferFrom(user, address(this), amount);
        _toToken.transfer(user, amount);
    }

    function withdrawFrom() onlyOwner external {
        uint256 balance = _fromToken.balanceOf(address(this));
        _fromToken.transfer(this.owner(), balance);
    }

    function withdrawTo() onlyOwner external {
        uint256 balance = _toToken.balanceOf(address(this));
        _toToken.transfer(this.owner(), balance);
    }

    function renounceOwnership() override public virtual onlyOwner {
        revert("Owner cannot renounce ownership");
    }
}
