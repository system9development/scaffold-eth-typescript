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
    ([tokenName, poolAddress]) => {
      const poolContract = new ethers.Contract(poolAddress, IUniswapV2PoolABI, mainnetProvider);
      const poolData = { reader: poolContract };
      // return the data synchronously but patch in the token0/1 values when the promise resolves
      Promise.all([
        poolContract.token0(),
        poolContract.token1()
      ]).then(([token0, token1]) => Object.assign(poolData, { token0, token1 }));
      return [
        tokenName,
        poolData,
      ];
    }
  ),
);

/**
 * 
 * @param {string} token - the token symbol
 * @param {number} ethPriceUsd - the price of ethereum in USD
 */
const getUniV2USDPrice = async (token, ethPriceUsd) => {
  const { address: tokenAddress, decimals: tokenDecimals } = mainnetTokens[token];
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
};
