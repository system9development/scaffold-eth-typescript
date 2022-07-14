const ethers = require('ethers');
const {
  uniswapV2PoolAddresses,
  mainnetProvider,
  mainnetTokens,
} = require('../config');
const { abi: IUniswapV2PoolABI } = require('@uniswap/v2-core/build/IUniswapV2Pair.json');
const BigNumber = require('bignumber.js');

const uniswapV2Pools = Object.fromEntries(
  Object.entries(uniswapV2PoolAddresses).map(
    ([marketName, poolAddress]) => {
      const poolContract = new ethers.Contract(poolAddress, IUniswapV2PoolABI, mainnetProvider);
      const poolData = { reader: poolContract };
      // return the data synchronously but patch in the token0/1 values when the promise resolves
      Promise.all([
        poolContract.token0(),
        poolContract.token1()
      ]).then(([token0, token1]) => Object.assign(poolData, { token0, token1 }));
      return [
        marketName,
        poolData,
      ];
    }
  ),
);

/*
  Get the price of baseToken expressed in quoteToken, e.g. if your LP is AAA/BBB and 1 AAA = 2 BBB,
  then getUniV2ToTokenPrice('AAA', 'BBB') will resolve to 2, and getUniV2ToTokenPrice('BBB', 'AAA') will
  resolve to 0.5
*/
const getUniV2ToTokenPrice = async (baseToken, quoteToken) => {
  const { decimals: baseDecimals } = mainnetTokens[baseToken];
  const { decimals: quoteDecimals } = mainnetTokens[baseToken];
  const baseTokenIsBase = `${baseToken}_${quoteToken}` in uniswapV2Pools;
  const baseTokenIsQuote = `${quoteToken}_${baseToken}` in uniswapV2Pools;
  if (!baseTokenIsBase && !baseTokenIsQuote) {
    return 0;
  }
  const poolData = baseTokenIsBase
    ? uniswapV2Pools[`${baseToken}_${quoteToken}`]
    : uniswapV2Pools[`${quoteToken}_${baseToken}`];

  const reserves = await poolData.reader.getReserves();
  // @ts-ignore
  const reserves0 = BigNumber(ethers.utils.formatUnits(reserves[0], baseTokenIsBase ? baseDecimals : quoteDecimals).toString());
  // @ts-ignore
  const reserves1 = BigNumber(ethers.utils.formatUnits(reserves[1], baseTokenIsBase ? quoteDecimals : baseDecimals).toString());

  return baseTokenIsBase
    ? reserves1.dividedBy(reserves0).toNumber()
    : reserves0.dividedBy(reserves1).toNumber();
}
/**
 * 
 * @param {string} token - the token symbol
 * @param {number} ethPriceUsd - the price of ethereum in USD
 */
const getUniV2USDPrice = async (token, ethPriceUsd) => {
  const { decimals: tokenDecimals } = mainnetTokens[token];
  const tokenIsBase = `${token}_ETH` in uniswapV2Pools || `${token}_WETH` in uniswapV2Pools;
  const tokenIsQuote = `ETH_${token}` in uniswapV2Pools || `WETH_${token}` in uniswapV2Pools;
  if (!tokenIsBase && !tokenIsQuote) {
    return 0;
  }
  const poolData = tokenIsBase
    ? (uniswapV2Pools[`${token}_ETH`] || uniswapV2Pools[`${token}_WETH`])
    : (uniswapV2Pools[`ETH_${token}`] || uniswapV2Pools[`WETH_${token}`]);

  const reserves = await poolData.reader.getReserves();
  // @ts-ignore
  const reserves0 = BigNumber(ethers.utils.formatUnits(reserves[0], tokenIsBase ? tokenDecimals : 18).toString());
  // @ts-ignore
  const reserves1 = BigNumber(ethers.utils.formatUnits(reserves[1], tokenIsQuote ? tokenDecimals : 18).toString());

  if (tokenIsBase) {
    return reserves1.dividedBy(reserves0).times(ethPriceUsd).toNumber()
  } else {
    return reserves0.dividedBy(reserves1).times(ethPriceUsd).toNumber();
  }
};

module.exports = {
  getUniV2USDPrice,
  getUniV2ToTokenPrice,
};
