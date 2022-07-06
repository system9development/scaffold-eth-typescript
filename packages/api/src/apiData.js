const ethers = require('ethers');
const { provider, mainnetProvider, mainnetTokens } = require('./config');
const Comptroller = require('./Comptroller');
const Lens = require('./Lens');
const Erc20ReadAbi = require('./abis/Erc20Read');
const CTokenReadAbi = require('./abis/CTokenRead');
const BlockCache = require('./lib/BlockCache');

/**
 * map contract addresses to { name, decimals, symbol, reader }
 */

const cTokens = {};
const mainnetCache = new BlockCache(mainnetProvider, Object.keys(mainnetTokens));

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
  const {
    underlying,
    underlyingSymbol,
    underlyingName,
  } = cTokens[cToken];
  const underlyingPriceUsd = mainnetCache.getPriceBySymbol(underlyingSymbol);
  const totalReservesUsd = ethers.utils.formatUnits(totalReserves * underlyingPriceUsd, 8);
  const totalSupplyUsd = ethers.utils.formatUnits(totalSupply * underlyingPriceUsd, 8);
  const totalBorrowsUsd = ethers.utils.formatUnits(totalBorrows * underlyingPriceUsd, 8);
  const liquidity = (parseFloat(totalReservesUsd) + parseFloat(totalSupplyUsd) - parseFloat(totalBorrowsUsd)).toString();
  return {
    address: cToken,
    symbol: cTokens[cToken].symbol,
    name: cTokens[cToken].name,
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
    totalBorrowsUsd: parseFloat(ethers.utils.formatUnits(totalBorrows, 8)) * mainnetCache.getPriceBySymbol(underlyingSymbol),
    totalSupply: totalSupply.toString(),
    totalSupply2: ethers.utils.formatUnits(totalSupply, 8),
    totalSupplyUsd: parseFloat(ethers.utils.formatUnits(totalSupply, 8)) * mainnetCache.getPriceBySymbol(underlyingSymbol),
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
    lastCalculatedBlockNumber: provider.blockNumber,
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
  let underlyingAddress = null;
  try {
  //   if (!underlyingAddress) {
  //     console.error('no underlyingAddress')
  //     throw Error();
  //   } else {
  //     console.log('underlyingaddress', underlyingAddress);
  //   }
    underlyingAddress = await marketReader.underlying();
    const underlyingReader = new ethers.Contract(underlyingAddress, Erc20ReadAbi, provider);
    const underlyingSymbol = (await underlyingReader.symbol()).toUpperCase();
    const underlyingName = await underlyingReader.name();
    const underlyingDecimals = await underlyingReader.decimals();
    cTokens[market] = {
      name,
      symbol,
      decimals,
      reader: marketReader,
      underlying: underlyingAddress,
      underlyingName,
      underlyingSymbol,
      underlyingDecimals,
    };
    console.log(cTokens[market]);
  } catch (e) {
    console.log('error', e);
    // market is cether; don't set underlying
    cTokens[market] = {
      name,
      symbol,
      decimals,
      reader: cEtherReader,
      underlying: null,
      underlyingSymbol: 'ETH',
      underlyingName: 'Ether',
      underlyingDecimals: 18,
    };
  };
  // if (underlyingAddress) {
  //   const underlyingReader = new ethers.Contract(underlying, Erc20ReadAbi, provider);
  //   const underlyingName = await underlyingReader.name();
  //   const underlyingSymbol = await underlyingReader.symbol();
  //   const underlyingDecimals = await underlyingReader.decimals();
  //   cTokens[underlyingAddress] = {
  //     name: underlyingName,
  //     symbol: underlyingSymbol,
  //     decimals: underlyingDecimals,
  //     reader: underlyingReader,
  //   };
  // }
}
const apiData = async () => {
  // Gets an array of addresses
  const markets = await Comptroller.getAllMarkets();

  for (let i = 0; i < markets.length; i += 1) {
    const market = markets[i];
    if (!(market in cTokens)) {
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
