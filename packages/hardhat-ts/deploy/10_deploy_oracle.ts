/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axios from 'axios';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { SimplePriceOracle as IOracle } from 'generated/contract-types/SimplePriceOracle';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { aaveMarkets, CHAIN_ID, compoundMarkets, mainnetTokens } from '../../api/src/config';

interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
  }
}

const getTokenAddress = async (symbol: string): Promise<string> => {
  if (symbol === 'ETH') {
    return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  }
  const symbolData = mainnetTokens[symbol];
  const address = (await ethers.getContractOrNull(symbol))?.address ?? symbolData.address;
  if (address !== undefined) {
    return address;
  }
  if (CHAIN_ID === 1 || CHAIN_ID === 5) {
    if (symbol in compoundMarkets) {
      return compoundMarkets[symbol][CHAIN_ID].address as string;
    }
    if (symbol in aaveMarkets) {
      return aaveMarkets[symbol][CHAIN_ID].address as string;
    }
  }
  return '';
}

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('Oracle', {
    from: deployer,
    log: true,
    contract: 'SimplePriceOracle',
  });
  const Oracle = await ethers.getContract<IOracle>('Oracle');
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const currentOracle = await Comptroller.oracle();
  if (currentOracle !== Oracle.address) {
    console.log(`setting Comptroller price oracle to ${Oracle.address}`);
    await (await Comptroller._setPriceOracle(Oracle.address)).wait();
  } else {
    console.log(`Skipping Comptroller._setPriceOracle(); already set to ${currentOracle}`);
  }

  // const dUSDC = await ethers.getContract<IUSDC>('dUSDC');
  // const dUSDT = await ethers.getContract('dUSDT');
  // const dETH = await ethers.getContract('dETH');
  // const dEther = await ethers.getContract('dETH');
  // const previousPriceUSDC = await Oracle.getUnderlyingPrice(dUSDC.address);
  // const previousPriceUSDT = await Oracle.getUnderlyingPrice(dUSDT.address);
  // const previousPriceETH = await Oracle.getUnderlyingPrice(dETH.address);

  const coingeckoIdToSymbols = Object.fromEntries(
    Object.entries(mainnetTokens)
      .map(([symbol, { coingeckoId }]: [string, { coingeckoId: string }]): [string, string] => [coingeckoId, symbol])
  );
  Object.entries(compoundMarkets).forEach(([cTokenSymbol, cTokenData]) => {
    const coingeckoId = cTokenData[1].coingeckoId;
    coingeckoIdToSymbols[coingeckoId] = cTokenSymbol;
  });
  if (CHAIN_ID === 1 || CHAIN_ID === 5) {
    Object.entries(aaveMarkets).forEach(([aTokenSymbol, aTokenData]) => {
      const coingeckoId = aTokenData[1].coingeckoId;
      coingeckoIdToSymbols[coingeckoId] = aTokenSymbol;
    });
  }
  const coingeckoIdQueryString = Object.keys(coingeckoIdToSymbols).toString();
  const { data: priceData } = await axios.get<CoinGeckoResponse>('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: coingeckoIdQueryString,
      vs_currencies: 'USD',
    },
    headers: {
      'Accept': 'application/json',
    },
  }).catch((err) => {
    console.error('error getting prices from Coingecko', err);
    const emptyResponse: { data: CoinGeckoResponse } = { data: {} };
    return emptyResponse;
  });
  console.log('price fetched from Coingecko', JSON.stringify(priceData));

  let priceChanged = false;
  const priceDataKeys = Object.keys(priceData);
  for (let i = 0; i < priceDataKeys.length && !priceChanged; i += 1) {
    const coingeckoId = priceDataKeys[i];
    const symbol = coingeckoIdToSymbols[coingeckoId];
    const decimals = symbol in mainnetTokens
      ? mainnetTokens[symbol].decimals
      : symbol in aaveMarkets
      ? aaveMarkets[symbol][1].decimals
      : symbol in compoundMarkets
      ? compoundMarkets[symbol][1].decimals
      : 0; 
    if (symbol === 'ETH') {
      continue;
    }
    const dToken = await ethers.getContract(`d${symbol}`);
    const previousPriceBigNumber = await Oracle.getUnderlyingPrice(dToken.address);
    const previousPrice = parseFloat(
      ethers.utils.formatUnits(previousPriceBigNumber, 36 - decimals),
    );
    const currentPrice = priceData[coingeckoId].usd;
    if (Math.abs((previousPrice - currentPrice)/currentPrice) > 0.25) {
      // Set all prices again if any price is more than 25% away from the previous price
      console.log(`${symbol}: old price`, previousPrice, 'current price', currentPrice)
      priceChanged = true;
    } else {
      console.log(`detected similar price for ${symbol} within 25% of current:\nPrevious: ${previousPrice}\nCurrent: ${currentPrice}`);
    }
  }
  if (priceChanged) {
    // Reduce mainnetTokens into symbols and decimals arrays to preserve order
    const [symbols, decimals] = Object.entries(mainnetTokens)
      .reduce<[string[], number[]]>((
        [symbolReduction, decimalReduction]: [string[], number[]],
        [curSymbol, curMetadata]: [string, { decimals: number }]
      ) => {
        if (curSymbol !== 'ETH') {
          symbolReduction.push(curSymbol);
          decimalReduction.push(curMetadata.decimals);
        }
        return [symbolReduction, decimalReduction];
      }, [[], []]);
    
    const tokenAddresses = await Promise.all(symbols.map(getTokenAddress));
    const priceValues = symbols.map((symbol, idx) => {
      const priceForSymbol = priceData[mainnetTokens[symbol].coingeckoId].usd;
      return ethers.utils.parseUnits(priceForSymbol.toString(), 36 - decimals[idx]);
    });
    for (let i = 0; i < Object.keys(compoundMarkets).length; i += 1) {
      const cTokenSymbol = Object.keys(compoundMarkets)[i];
      if (CHAIN_ID === 1 || CHAIN_ID === 5) {
        const { address: tokenAddress, decimals: tokenDecimals, coingeckoId } = compoundMarkets[cTokenSymbol][CHAIN_ID];
        tokenAddresses.push(tokenAddress);
        decimals.push(tokenDecimals);
        symbols.push(cTokenSymbol);
        const priceForCToken = priceData[coingeckoId].usd;
        priceValues.push(ethers.utils.parseUnits(priceForCToken.toString(), 36 - tokenDecimals));
      } else {
        const { coingeckoId } = compoundMarkets[cTokenSymbol][1];
        const tokenAddress = (await ethers.getContract(`d${cTokenSymbol.substring(1)}`)).address;
        tokenAddresses.push(tokenAddress);
        decimals.push(8);
        symbols.push(cTokenSymbol);
        const priceForCToken = priceData[coingeckoId].usd;
        priceValues.push(ethers.utils.parseUnits(priceForCToken.toString(), 28));
      }
    }
    if (CHAIN_ID === 1 || CHAIN_ID === 5) {
      for (let i = 0; i < Object.keys(aaveMarkets).length; i += 1) {
        const aTokenSymbol = Object.keys(aaveMarkets)[i];
        const { address: tokenAddress, decimals: tokenDecimals, coingeckoId } = aaveMarkets[aTokenSymbol][CHAIN_ID];
        tokenAddresses.push(tokenAddress);
        decimals.push(tokenDecimals);
        symbols.push(aTokenSymbol);
        const priceForAToken = priceData[coingeckoId].usd;
        priceValues.push(ethers.utils.parseUnits(priceForAToken.toString(), 36 - tokenDecimals));
      }
    }
    console.log('updating oracle with the following tokens and prices');
    for (let i = 0; i < tokenAddresses.length; i += 1) {
      console.log(`${tokenAddresses[i]} (${symbols[i]}/${decimals[i]}): ${priceValues[i].toString()}`);
    }
    await (await Oracle.setDirectPrices(tokenAddresses, priceValues)).wait();
  }
};

export default func;
func.tags = ['core'];
