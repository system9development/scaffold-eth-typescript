// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../openzeppelin/Ownable.sol";
import "../openzeppelin/ERC20.sol";
import "../openzeppelin/ReentrancyGuard.sol";

// from and to are addresses of tokens who have the same decimals
contract Redemption is Ownable, ReentrancyGuard {
    ERC20 constant BDAMM = ERC20(0xfa372fF1547fa1a283B5112a4685F1358CE5574d);
    ERC20 constant DAMM = ERC20(0xb3207935FF56120f3499e8aD08461Dd403bF16b8);
    ERC20 constant USDC = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);

    uint256 redemptionUSDCPrice_;

    constructor(uint256 _redemptionUSDCPrice) {
      redemptionUSDCPrice_ = _redemptionUSDCPrice;
    }

    /* 
      amount is the amount of BDAMM to swap to DAMM 1:1 (18 decimals)
      redemptionFee is the amount of USDC to send with the redemption (6 decimals)
    */
    function swap(uint256 amount, uint256 redemptionFee) nonReentrant external {
        address user = msg.sender;
        uint256 allowanceBDAMM = BDAMM.allowance(user, address(this));
        require(amount <= allowanceBDAMM, "User has not given swap contract spend approval for BDAMM");
        uint256 requiredRedemptionFee = amount * redemptionUSDCPrice_;
        require(redemptionFee * 10**18 == requiredRedemptionFee, "Incorrect USDC redemption fee sent");
        uint256 allowanceUSDC = USDC.allowance(user, address(this));
        require(redemptionFee <= allowanceUSDC, "User has not given swap contract spend approval for USDC");
        uint256 selfBalanceDAMM = DAMM.balanceOf(address(this));
        require(amount <= selfBalanceDAMM, "Not enough DAMM liquidity");
        require(BDAMM.transferFrom(user, address(this), amount), "Could not transfer user's BDAMM to swap contract");
        require(USDC.transferFrom(user, address(this), redemptionFee), "Could not transfer user's USDC to swap contract");
        require(DAMM.transfer(user, amount), "Swap contract could not transfer DAMM to user");
    }

    function withdrawBDAMM() onlyOwner external {
        uint256 balance = BDAMM.balanceOf(address(this));
        require(BDAMM.transfer(this.owner(), balance), "Admin could not withdraw BDAMM");
    }

    function withdrawDAMM() onlyOwner external {
        uint256 balance = DAMM.balanceOf(address(this));
        require(DAMM.transfer(this.owner(), balance), "Admin could not withdraw DAMM");
    }

    function withdrawUSDC() onlyOwner external {
      uint256 balance = USDC.balanceOf(address(this));
      require(USDC.transfer(this.owner(), balance), "Admin could not withdraw USDC");
    }

    function sweepToken(ERC20 token) onlyOwner external {
      uint256 balance = token.balanceOf(address(this));
      require(token.transfer(this.owner(), balance), "Admin could not withdraw token");
    }

    function renounceOwnership() override public virtual onlyOwner {
        revert("Owner cannot renounce ownership");
    }

    function updateRedemptionUSDCPrice(uint256 _redemptionUSDCPrice) onlyOwner external {
      redemptionUSDCPrice_ =_redemptionUSDCPrice;
    }

    function redemptionUSDCPrice() public view returns (uint256) {
      return redemptionUSDCPrice_;
    }
}
