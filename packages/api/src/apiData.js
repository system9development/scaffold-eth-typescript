const ethers = require('ethers');
const { provider, networkConfig } = require('./config');
const Comptroller = require('./Comptroller');
const Lens = require('./Lens');


const Erc20ReadAbi = JSON.stringify([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]);

const CTokenReadAbi = JSON.stringify([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function underlying() view returns (address)",
]);

/**
 * map contract addresses to { name, decimals, symbol, reader }
 */
const tokens = {};

/*
  Takes the array of stract and converts it to JSON with additional info from 'tokens'
  See: https://github.com/compound-finance/compound-protocol/blob/a3214f67b73310d547e00fc578e8355911c9d376/contracts/Lens/CompoundLens.sol#L48-L66
*/
const cTokenMetadataToJson = async ([
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
]) => {
  const underlying = tokens[cToken].underlying;
  return {
    address: cToken,
    symbol: tokens[cToken].symbol,
    name: tokens[cToken].name,
    underlyingAddress: underlying,
    underlyingName: underlying ? tokens[underlying].name : "ETH",
    underlyingSymbol: underlying ? tokens[underlying].symbol : "ETH",
    underlyingDecimal: underlying ? tokens[underlying].decimals : 18,
    dammSpeeds: compSupplySpeed.toString(),
    borrowerDailyDamm: compBorrowSpeed.toString(),
    supplierDailyDamm: compSupplySpeed.toString(),
    // venusBorrowIndex (unused)
    // venusSupplyIndex (unused)
    borrowRatePerBlock: borrowRatePerBlock.toString(),
    supplyRatePerBlock: supplyRatePerBlock.toString(),
    exchangeRate: exchangeRateCurrent.toString(),
    // underlyingPrice (get from oracle?)
    totalBorrows: totalBorrows.toString(),
    totalBorrows2: ethers.utils.formatUnits(totalBorrows, 8),
    // totalBorrowsUsd (convert from oracle?)
    totalSupply: totalSupply.toString(),
    totalSupply2: ethers.utils.formatUnits(totalSupply, 8),
    // totalSupplyUsd (convert from oracle?)
    cash: totalCash.toString(),
    totalReserves: totalReserves.toString(),
    reserveFactor: reserveFactorMantissa.toString(),
    collateralFactor: collateralFactorMantissa.toString(),
    borrowApy: borrowRatePerBlock.toString(), // need to multiply by blocks per year and also format by decimals?
    supplyApy: supplyRatePerBlock.toString(), // ditto
    // borrowDammApy (???)
    // supplyDammApy (???)
    // liquidity: (totalReservesUsd + totalSupplyUsd - totalBorrowsUsd ???)
    // tokenPrice: (get from oracle ???)
    // totalDistributed: (???)
    // totalDistributed2: (???)
    borrowCaps: borrowCap.toString(),
    lastCalculatedBlockNumber: await provider.getBlockNumber(),
    borrowerCount: 1, // (???)
    supplierCount: 1, // (???)
  };
};

/**
 * addTokenDataForMarket
 * 
 * @param {string} market - the market address
 */
const addTokenDataForMarket = async (market) => {
  const marketReader = new ethers.Contract(market, CTokenReadAbi, provider);
  const cEtherReader = new ethers.Contract(market, Erc20ReadAbi, provider);
  const name = await marketReader.name();
  const symbol = await marketReader.symbol();
  const decimals = await marketReader.decimals();
  let underlying = null;
  try {
    underlying = await marketReader.underlying();
    tokens[market] = {
      name,
      symbol,
      decimals,
      reader: marketReader,
      underlying,
    };
  } catch {
    // market is cether; don't set underlying
    tokens[market] = {
      name,
      symbol,
      decimals,
      reader: cEtherReader,
      underlying, // null
    };
  };
  if (underlying) {
    const underlyingReader = new ethers.Contract(underlying, Erc20ReadAbi, provider);
    const underlyingName = await underlyingReader.name();
    const underlyingSymbol = await underlyingReader.symbol();
    const underlyingDecimals = await underlyingReader.decimals();
    tokens[underlying] = {
      name: underlyingName,
      symbol: underlyingSymbol,
      decimals: underlyingDecimals,
      reader: underlyingReader,
    };
  }
}
const apiData = async () => {
  // Gets an array of addresses
  const markets = await Comptroller.getAllMarkets();
  for (let i = 0; i < markets.length; i += 1) {
    const market = markets[i];
    if (!(market in tokens)) {
      await addTokenDataForMarket(market);
    }
  };
  const lensDataList = await Lens.callStatic.cTokenMetadataAll(markets);
  const response = {
    status: true,
    data: {
      markets: await Promise.all(lensDataList.map(cTokenMetadataToJson)),
    },
  };
  return response;
};

module.exports = apiData;
