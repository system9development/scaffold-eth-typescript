const ethers = require('ethers');
const BigNumber = require('bignumber.js');
// @ts-ignore
BigNumber.config({ POW_PRECISION: 20 });
const { BLOCKS_PER_YEAR } = require('../config.js')

const cTokenMetadataToMarketData = ({
  cToken,
  exchangeRateCurrent,
  supplyRatePerBlock,
  borrowRatePerBlock,
  reserveFactorMantissa,
  totalBorrows,
  totalReserves,
  totalSupply: totalSupplyDtoken,
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
  underlyingPriceUsd, // type number or null
  blockNumber,
}) => {
  const underlying = underlyingAssetAddress;
  // @ts-ignore
  const totalReservesFormatted = new BigNumber(ethers.utils.formatUnits(totalReserves || 0, underlyingDecimals));

  // ternery is necessary because underlyingPrice might not always be set:
  const totalReservesUsd = underlyingPriceUsd
    ? totalReservesFormatted.times(underlyingPriceUsd).toFixed(2)
    : '0.00';

  // const totalSupply = totalSupplyDtoken.toString()
  // const totalSupplyDtoken = underlyingPriceUsd ? ethers.utils.formatUnits(
  //   // @ts-ignore
  //   new BigNumber(totalSupply.toString()).times(underlyingPriceUsd).toFixed(0),
  //   8,
  // ) : '0.0';

  // get the total supply of the dToken (needs to be converted to underlying based on exchangeRate)
  // let totalSupplyDtokenFormatted = '0';
  // try {
  const totalSupplyDtokenFormatted = ethers.utils.formatUnits(
    // @ts-ignore
    totalSupplyDtoken?.toString() || 0,
    8,
  );
  // } catch (e) {
  //   console.log('throwing on totalsupplydtoken', totalSupplyDtoken, totalSupplyDtoken.toString());
  //   throw e;
  // }

  // @ts-ignore
  const totalSupplyUnderlyingFormatted = new BigNumber(totalSupplyDtokenFormatted)
    .times(exchangeRateCurrent.toString())
    // @ts-ignore
    .dividedBy((new BigNumber(10)).pow(18 + underlyingDecimals.toNumber() - 8));

  const totalSupplyUsd = underlyingPriceUsd
    // @ts-ignore
    ? (new BigNumber(underlyingPriceUsd)).times(totalSupplyUnderlyingFormatted).toFixed(2)
    : '0.00';

  // @ts-ignore
  const totalBorrowsFormatted = new BigNumber(ethers.utils.formatUnits(
    totalBorrows?.toString() || 0,
    underlyingDecimals.toNumber()),
  );
  const totalBorrowsUsd = underlyingPriceUsd
    ? totalBorrowsFormatted.times(underlyingPriceUsd).toFixed(2)
    : '0.00'

  // @ts-ignore
  const liquidity = (new BigNumber(totalReservesUsd)).plus(totalSupplyUsd).minus(totalBorrowsUsd).toFixed(2);
  // @ts-ignore
  const underlyingPriceExponent = BigNumber(10).pow(36 - underlyingDecimals.toNumber());

  const borrowRatePerBlockFormatted = ethers.utils.formatUnits(borrowRatePerBlock, 18);
  const supplyRatePerBlockFormatted = ethers.utils.formatUnits(supplyRatePerBlock, 18);

  return {
    address: cToken,
    symbol,
    name,
    underlyingAddress: underlying,
    underlyingName,
    underlyingSymbol,
    underlyingDecimal: underlyingDecimals.toNumber(),
    dammSpeeds: compSupplySpeed.toString(),
    borrowerDailyBdamm: compBorrowSpeed.toString(),
    supplierDailyBdamm: compSupplySpeed.toString(),
    // venusBorrowIndex (unused)
    // venusSupplyIndex (unused)
    borrowRatePerBlock: borrowRatePerBlock.toString(),
    supplyRatePerBlock: supplyRatePerBlock.toString(),
    exchangeRate: exchangeRateCurrent.toString(),
    underlyingPrice: underlyingPriceExponent.times(underlyingPriceUsd).toFixed(0),
    totalBorrows: totalBorrows.toString(),
    totalBorrows2: totalBorrowsFormatted.toString(),
    totalBorrowsUsd,
    totalSupply: totalSupplyDtoken.toString(),
    totalSupply2: totalSupplyUnderlyingFormatted.toString(),
    totalSupplyUsd,
    cash: totalCash.toString(),
    totalReserves: totalReservesFormatted.toString(),
    reserveFactor: reserveFactorMantissa.toString(),
    collateralFactor: collateralFactorMantissa.toString(),
    // @ts-ignore
    borrowApy: borrowRatePerBlock.isZero() ? '0' : `-${(new BigNumber(borrowRatePerBlockFormatted)).plus(1).pow(BLOCKS_PER_YEAR).minus(1).shiftedBy(2).toString()}`,
    // @ts-ignore
    supplyApy: (new BigNumber(supplyRatePerBlockFormatted)).plus(1).pow(BLOCKS_PER_YEAR).minus(1).shiftedBy(2).toString(),
    // borrowDammApy (???)
    // supplyDammApy (???)
    liquidity,
    tokenPrice: underlyingPriceUsd,
    // totalDistributed: (???)
    // totalDistributed2: (???)
    borrowCaps: borrowCap.toString(),
    lastCalculatedBlockNumber: blockNumber,
    borrowerCount: 1, // (???)
    supplierCount: 1, // (???)
  };
};

module.exports = cTokenMetadataToMarketData;
