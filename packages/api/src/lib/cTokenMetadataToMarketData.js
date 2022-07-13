const ethers = require('ethers');
const BigNumber = require('bignumber.js');

const cTokenMetadataToMarketData = ({
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
}, {
  name,
  symbol,
  underlyingSymbol,
  underlyingName,
  underlyingPriceUsd,
  blockNumber,
}) => {
  const underlying = underlyingAssetAddress;
  const totalReservesUsd = underlyingPriceUsd ? ethers.utils.formatUnits(
    // @ts-ignore
    new BigNumber(totalReserves.toString()).times(underlyingPriceUsd).toString(),
    8,
  ) : '0.0'; // ternery is necessary because underlyingPrice might not always be set
  const totalSupplyUsd = underlyingPriceUsd ? ethers.utils.formatUnits(
    // @ts-ignore
    new BigNumber(totalSupply.toString()).times(underlyingPriceUsd).toString(),
    8,
  ) : '0.0';
  const totalBorrowsUsd = underlyingPriceUsd ? ethers.utils.formatUnits(
    // @ts-ignore
    new BigNumber(totalBorrows.toString()).times(underlyingPriceUsd).toString(),
    8,
  ) : '0.0';
  const liquidity = (parseFloat(totalReservesUsd) + parseFloat(totalSupplyUsd) - parseFloat(totalBorrowsUsd)).toString();
  return {
    address: cToken,
    symbol,
    name,
    underlyingAddress: underlying,
    underlyingName,
    underlyingSymbol,
    underlyingDecimal: underlyingDecimals.toNumber(),
    dammSpeeds: compSupplySpeed.toString(),
    borrowerDailyDamm: compBorrowSpeed.toString(),
    supplierDailyDamm: compSupplySpeed.toString(),
    // venusBorrowIndex (unused)
    // venusSupplyIndex (unused)
    borrowRatePerBlock: borrowRatePerBlock.toString(),
    supplyRatePerBlock: supplyRatePerBlock.toString(),
    exchangeRate: exchangeRateCurrent.toString(),
    underlyingPrice: underlyingPriceUsd,
    totalBorrows: totalBorrows.toString(),
    totalBorrows2: ethers.utils.formatUnits(totalBorrows, 8),
    totalBorrowsUsd,
    // totalBorrowsUsd: parseFloat(ethers.utils.formatUnits(totalBorrows, 8)) * mainnetCache.getPriceBySymbol(underlyingSymbol),
    totalSupply: totalSupply.toString(),
    totalSupply2: ethers.utils.formatUnits(totalSupply, 8),
    totalSupplyUsd,
    // totalSupplyUsd: parseFloat(ethers.utils.formatUnits(totalSupply, 8)) * mainnetCache.getPriceBySymbol(underlyingSymbol),
    cash: totalCash.toString(),
    totalReserves: totalReserves.toString(),
    reserveFactor: reserveFactorMantissa.toString(),
    collateralFactor: collateralFactorMantissa.toString(),
    borrowApy: borrowRatePerBlock.toString(), // need to multiply by blocks per year and also format by decimals?
    supplyApy: supplyRatePerBlock.toString(), // ditto
    // borrowDammApy (???)
    // supplyDammApy (???)
    liquidity,
    // tokenPrice: (get from oracle ???)
    // totalDistributed: (???)
    // totalDistributed2: (???)
    borrowCaps: borrowCap.toString(),
    lastCalculatedBlockNumber: blockNumber,
    borrowerCount: 1, // (???)
    supplierCount: 1, // (???)
  };
};

module.exports = cTokenMetadataToMarketData;
