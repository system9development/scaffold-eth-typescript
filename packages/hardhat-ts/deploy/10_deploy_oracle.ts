import axios from 'axios';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { SimplePriceOracle as IOracle } from 'generated/contract-types/SimplePriceOracle';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { mainnetTokens } from '../../api/src/config';

interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
  }
}

const getTokenAddress = async (symbol: string): Promise<string> => {
  if (symbol === 'ETH') {
    return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  }
  return (await ethers.getContract(symbol)).address;
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
  console.log(`setting Comptroller price oracle to ${Oracle.address}`);
  await (await Comptroller._setPriceOracle(Oracle.address)).wait();

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
  const coingeckoIdQueryString = Object.values(mainnetTokens)
    .map(({ coingeckoId }: { coingeckoId: string}): string => coingeckoId)
    .toString();
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
    return emptyResponse
  });
  console.log('price fetched from Coingecko', JSON.stringify(priceData));

  let priceChanged = false;
  const priceDataKeys = Object.keys(priceData);
  for (let i = 0; i < priceDataKeys.length && !priceChanged; i += 1) {
    const coingeckoId = priceDataKeys[i];
    const symbol = coingeckoIdToSymbols[coingeckoId];
    const dToken = await ethers.getContract(`d${symbol}`);
    const previousPriceBigNumber = await Oracle.getUnderlyingPrice(dToken.address);
    const previousPrice = parseFloat(
      ethers.utils.formatUnits(previousPriceBigNumber, 36 - mainnetTokens[symbol].decimals),
    );
    const currentPrice = priceData[coingeckoId].usd;
    if (Math.abs((previousPrice - currentPrice)/currentPrice) > 0.25) {
      // Set all prices again if any price is more than 25% away from the previous price
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
        symbolReduction.push(curSymbol);
        decimalReduction.push(curMetadata.decimals);
        return [symbolReduction, decimalReduction];
      }, [[], []]);
    const tokenAddresses = await Promise.all(symbols.map(getTokenAddress));
    const priceValues = symbols.map((symbol, idx) => {
      const priceForSymbol = priceData[mainnetTokens[symbol].coingeckoId].usd;
      return ethers.utils.parseUnits(priceForSymbol.toString(), 36 - decimals[idx]);
    });

    console.log('updating oracle with the following tokens and prices');
    for (let i = 0; i < tokenAddresses.length; i += 1) {
      console.log(`${tokenAddresses[i]} (${symbols[i]}/${decimals[i]}): ${priceValues[i].toString()}`);
    }
    await (await Oracle.setDirectPrices(tokenAddresses, priceValues)).wait();
  }
};

export default func;
func.tags = ['Oracle'];
