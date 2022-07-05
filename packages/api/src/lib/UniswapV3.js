const { JSBI } = require('@uniswap/sdk');
const ethers = require('ethers');
// Not the same as ethers.BigNumber
const BigNumber = require('bignumber.js');
const dotenv = require('dotenv');
const { abi: IUniswapV3PoolABI } = require(
  '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
);

const {
  mainnetProvider,
  uniswapV3PoolAddresses,
  mainnetTokens,
} = require('../config');

dotenv.config();

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96))
const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2)).toString();
const uniswapV3Pools = Object.fromEntries(
  Object.entries(uniswapV3PoolAddresses).map(
    ([tokenName, poolAddress]) => {
      const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, mainnetProvider);
      const poolData = { reader: poolContract };
      // return the data synchronously but patch in the token0/1 values when the promise resolves
      Promise.all([
        poolContract.token0(),
        poolContract.token1(),
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

const getUniV3USDPrice = async (token, ethPriceUsd) => {
  const { address: tokenAddress, decimals: tokenDecimals } = mainnetTokens[token];
  const tokenIsBase = `${token}_ETH` in uniswapV3Pools || `${token}_WETH` in uniswapV3Pools;
  const tokenIsQuote = `ETH_${token}` in uniswapV3Pools || `WETH_${token}` in uniswapV3Pools;
  if (!tokenIsBase && !tokenIsQuote) {
    return 0;
  }
  const poolData = tokenIsBase
    ? (uniswapV3Pools[`${token}_ETH`] || uniswapV3Pools[`${token}_WETH`])
    : (uniswapV3Pools[`ETH_${token}`] || uniswapV3Pools[`WETH_${token}`]);
  const slot0Data = await poolData.reader.slot0();
  // @ts-ignore
  const sqrtPrice = BigNumber(slot0Data[0].toString());
  if (tokenIsBase) {
    // @ts-ignore
    return sqrtPrice.pow(2).dividedBy(Q192).times(ethPriceUsd).toNumber();
  } else {
    // @ts-ignore
    return new BigNumber(ethPriceUsd).dividedBy(
      sqrtPrice.pow(2).dividedBy(Q192)
    // @ts-ignore
    ).times(BigNumber(10).pow(-tokenDecimals)).toNumber();
  }
};

module.exports = {
  getUniV3USDPrice,
};
