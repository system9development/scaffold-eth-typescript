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
  mainnetTokens: mainnetTokensOrig,
  mainnetBdamm,
  bdammPoolInfo,
  dammPoolInfo,
} = require('../config');

const mainnetTokens = {
  ...mainnetTokensOrig,
  ...mainnetBdamm,
};

dotenv.config();

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96))
const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2)).toString();
// const uniswapV3Pools = Object.fromEntries(
//   // [...Object.entries(uniswapV3PoolAddresses), ['USDC_BDAMM', bdammPoolInfo.address]].map(
//   Object.entries(uniswapV3PoolAddresses).map(
//     ([tokenName, poolAddress]) => {
//       const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, mainnetProvider);
//       const poolData = { reader: poolContract };
//       // return the data synchronously but patch in the token0/1 values when the promise resolves
//       Promise.all([
//         poolContract.token0(),
//         poolContract.token1(),
//       ]).then(([token0, token1]) => Object.assign(poolData, { token0, token1 }));
//       return [
//         tokenName,
//         poolData,
//       ];
//     }
//   ),
// );

const uniswapV3Pools = Object.fromEntries(
  Object.entries(uniswapV3PoolAddresses).map(([tokenName, poolAddress]) => {
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
  })
);

/*
  Get the price of baseToken expressed in quoteToken, e.g. if your LP is AAA/BBB and 1 AAA = 2 BBB,
  then getUniV3ToTokenPrice('AAA', 'BBB') will resolve to 2, and getUniV3ToTokenPrice('BBB', 'AAA') will
  resolve to 0.5
*/
const getUniV3ToTokenPrice = async (baseToken, quoteToken) => {
  const { decimals: baseTokenDecimals } = mainnetTokens[baseToken];
  const { decimals: quoteTokenDecimals } = mainnetTokens[quoteToken];
  const baseTokenIsBase = `${baseToken}_${quoteToken}` in uniswapV3Pools;
  const baseTokenIsQuote = `${quoteToken}_${baseToken}` in uniswapV3Pools;
  if (!baseTokenIsBase && !baseTokenIsQuote) {
    return 0;
  }
  const poolData = baseTokenIsBase
    ? uniswapV3Pools[`${baseToken}_${quoteToken}`]
    : uniswapV3Pools[`${quoteToken}_${baseToken}`];

  const slot0Data = await poolData.reader.slot0();
  // @ts-ignore
  const sqrtPrice = BigNumber(slot0Data[0].toString());
  // @ts-ignore
  const decimalAdjustment = BigNumber(10).pow(
    baseTokenIsBase
      ? quoteTokenDecimals - baseTokenDecimals
      : baseTokenDecimals - quoteTokenDecimals
  );
  if (baseTokenIsBase) {
    // @ts-ignore
    return sqrtPrice.pow(2).dividedBy(Q192).dividedBy(decimalAdjustment).toNumber();
  } else {
    // @ts-ignore
    return new BigNumber(1).dividedBy(
      sqrtPrice.pow(2).dividedBy(Q192)
    // @ts-ignore
    ).times(decimalAdjustment).toNumber();
  }
}


const getUniV3BdammPrice = async () => {
  const poolData = uniswapV3Pools['USDC_BDAMM'];
  const slot0Data = await poolData.reader.slot0();
  // @ts-ignore
  const sqrtPrice = BigNumber(slot0Data[0].toString());
  // @ts-ignore
  const decimalAdjustment = BigNumber(10).pow(12); // bdamm decimals - usdc decimals
  // @ts-ignore
  return new BigNumber(1).dividedBy(
    sqrtPrice.pow(2).dividedBy(Q192)
  // @ts-ignore
  ).times(decimalAdjustment).toNumber();
};

const getUniV3DammPrice = async () => {
  const poolData = uniswapV3Pools['USDC_DAMM'];
  const slot0Data = await poolData.reader.slot0();
  // @ts-ignore
  const sqrtPrice = BigNumber(slot0Data[0].toString());
  // @ts-ignore
  const decimalAdjustment = BigNumber(10).pow(12); // bdamm decimals - usdc decimals
  // @ts-ignore
  return new BigNumber(1).dividedBy(
    sqrtPrice.pow(2).dividedBy(Q192)
  // @ts-ignore
  ).times(decimalAdjustment).toNumber();
};

/**
 *
 * @param {string} token - the token symbol
 * @param {number} ethPriceUsd - the price of ethereum in USD
 */

const getUniV3USDPrice = async (token, ethPriceUsd) => {
  if (token === 'BDAMM') {
    return getUniV3BdammPrice();
  }
  if (token === 'DAMM') {
    return getUniV3DammPrice();
  }
  const { decimals: tokenDecimals } = mainnetTokens[token];
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
  // @ts-ignore
  const decimalAdjustment = BigNumber(10).pow(tokenIsBase ? 18 - tokenDecimals : tokenDecimals - 18);
  if (tokenIsBase) {
    // @ts-ignore
    return sqrtPrice.pow(2).dividedBy(Q192).times(ethPriceUsd).dividedBy(decimalAdjustment).toNumber();
  } else {
    // @ts-ignore
    return new BigNumber(ethPriceUsd).dividedBy(
      sqrtPrice.pow(2).dividedBy(Q192)
    // @ts-ignore
    ).times(decimalAdjustment).toNumber();
  }
};

module.exports = {
  getUniV3USDPrice,
  getUniV3ToTokenPrice,
};
