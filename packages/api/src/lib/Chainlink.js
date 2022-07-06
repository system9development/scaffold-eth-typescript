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
const getChainlinkUSDPrice = async (token, ethPriceUsd) => {
  // const { address: tokenAddress, decimals: tokenDecimals } = mainnetTokens[token];
  if (!(`${token}_USD` in chainlinkOracles)) {
    if (
      token === 'WBTC'
      && 'WBTC_BTC' in chainlinkOracles
      && 'BTC_USD' in chainlinkOracles
    ) {
      const btcOracle = chainlinkOracles['BTC_USD'];
      const wBtcOracle = chainlinkOracles['WBTC_BTC'];
      const btcUsdPrice = ethers.utils.formatUnits(await btcOracle.latestAnswer(), 8);
      const wbtcBtcPrice = ethers.utils.formatUnits(await wBtcOracle.latestAnswer(), 8);
      // @ts-ignore
      return BigNumber(btcUsdPrice).times(wbtcBtcPrice).toNumber();
    } else if (
      token === 'WSTETH'
      && 'WSTETH_STETH' in chainlinkOracles
      && 'STETH_USD' in chainlinkOracles
    ) {
      const stethOracle = chainlinkOracles['STETH_USD'];
      const wStethOracle = chainlinkOracles['WSTETH_USD'];
      const stethUsdPrice = ethers.utils.formatUnits(await stethOracle.latestAnswer(), 8);
      const wstethStethPrice = ethers.utils.formatUnits(await wStethOracle.latestAnswer(), 8);
      // @ts-ignore
      return BigNumber(stethUsdPrice).times(wstethStethPrice).toNumber();
    } else if (`${token}_ETH` in chainlinkOracles) {
      const tokenEthOracle = chainlinkOracles[`${token}_ETH`];
      const tokenEthPrice = ethers.utils.formatUnits(await tokenEthOracle.latestAnswer(), 8);
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
