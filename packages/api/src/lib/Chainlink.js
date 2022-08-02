const ethers = require('ethers');
const {
  chainlinkOracleAddresses,
  mainnetProvider,
} = require('../config');
const IChainlinkDataFeed = require('../abis/ChainlinkOracle');
const BigNumber = require('bignumber.js');

const chainlinkOracles = Object.fromEntries(
  Object.entries(chainlinkOracleAddresses).map(
    ([marketName, oracleAddress]) => [
      marketName,
      new ethers.Contract(oracleAddress, IChainlinkDataFeed, mainnetProvider),
    ],
  ),
);


/**
 * 
 * @param {string} token - the token symbol
 */
const getChainlinkUSDPrice = async (token, ethPriceUsd = null) => {
  // const { address: tokenAddress, decimals: tokenDecimals } = mainnetTokens[token];
  if (!(`${token}_USD` in chainlinkOracles)) {
    if (
      token === 'WBTC'
      && 'WBTC_BTC' in chainlinkOracles
      && 'BTC_USD' in chainlinkOracles
    ) {
      const btcOracle = chainlinkOracles['BTC_USD'];
      const wBtcOracle = chainlinkOracles['WBTC_BTC'];
      const [btcUsdLatestAnswer, wbtcBtcLatestAnswer] = await Promise.all([
        btcOracle.latestAnswer(),
        wBtcOracle.latestAnswer(),
      ]).catch((e) => [null, null]);
      if (!btcUsdLatestAnswer || !wbtcBtcLatestAnswer) {
        return 0;
      }
      const btcUsdPrice = ethers.utils.formatUnits(btcUsdLatestAnswer, 8);
      const wbtcBtcPrice = ethers.utils.formatUnits(wbtcBtcLatestAnswer, 8);
      // @ts-ignore
      return BigNumber(btcUsdPrice).times(wbtcBtcPrice).toNumber();
    } else if (
      token === 'WSTETH'
      && 'WSTETH_STETH' in chainlinkOracles
      && 'STETH_USD' in chainlinkOracles
    ) {
      const stethOracle = chainlinkOracles['STETH_USD'];
      const wStethOracle = chainlinkOracles['WSTETH_USD'];
      const [stethUsdLatestAnswer, wstethStethLatestAnswer] = await Promise.all([
        stethOracle.latestAnswer(),
        wStethOracle.latestAnswer(),
      ]).catch((e) => [null, null]);
      if (!stethUsdLatestAnswer || !wstethStethLatestAnswer) {
        return 0;
      }
      const stethUsdPrice = ethers.utils.formatUnits(stethUsdLatestAnswer, 8);
      const wstethStethPrice = ethers.utils.formatUnits(wstethStethLatestAnswer, 8);
      // @ts-ignore
      return BigNumber(stethUsdPrice).times(wstethStethPrice).toNumber();
    } else if (`${token}_ETH` in chainlinkOracles) {
      const tokenEthOracle = chainlinkOracles[`${token}_ETH`];
      const tokenEthLatestAnswer = await tokenEthOracle.latestAnswer().catch((e) => null);
      if (!tokenEthLatestAnswer) {
        return 0;
      }
      const tokenEthPrice = ethers.utils.formatUnits(tokenEthLatestAnswer, 18);
      // @ts-ignore
      return BigNumber(tokenEthPrice).times(ethPriceUsd).toNumber();
    } else {
      return 0;
    }
  }
  const oracle = chainlinkOracles[`${token}_USD`];
  return parseFloat(ethers.utils.formatUnits(await oracle.latestAnswer(), 8));
};

module.exports = {
  getChainlinkUSDPrice,
};
