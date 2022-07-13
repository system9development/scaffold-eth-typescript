const ethers = require('ethers');
const { mainnetCache } = require('../config');
const { BigNumber } = require('bignumber.js');
/*
  Takes the array of struct and converts it to JSON with additional info from 'tokens'
  See: https://github.com/compound-finance/compound-protocol/blob/a3214f67b73310d547e00fc578e8355911c9d376/contracts/Lens/CompoundLens.sol#L48-L66
*/

const cTokenMetadataToJson = ([
  cToken,
  exchangeRateCurrent,
  supplyRatePerBlock,
  borrowRatePerBlock,
  reserveFactorMantissa,
  totalBorrows,
  totalReserves,
  totalSupply,
  totalCash,
  isListed,
  collateralFactorMantissa,
  underlyingAssetAddress,
  cTokenDecimals,
  underlyingDecimals,
  compSupplySpeed,
  compBorrowSpeed,
  borrowCap,
]) => ({
  cToken,
  exchangeRateCurrent,
  supplyRatePerBlock,
  borrowRatePerBlock,
  reserveFactorMantissa,
  totalBorrows,
  totalReserves,
  totalSupply,
  totalCash,
  isListed,
  collateralFactorMantissa,
  underlyingAssetAddress,
  cTokenDecimals,
  underlyingDecimals,
  compSupplySpeed,
  compBorrowSpeed,
  borrowCap,
});

module.exports = cTokenMetadataToJson;
