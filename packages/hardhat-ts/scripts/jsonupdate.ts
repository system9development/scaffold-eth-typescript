import '@nomiclabs/hardhat-ethers';

import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import { CErc20 as ICErc20 } from 'generated/contract-types/CErc20';
import { ethers } from 'hardhat';

import { aaveMarkets, compoundMarkets, mainnetTokens } from '../../api/src/config';

dotenv.config();

interface TokenData {
  [key: string]: {
    [key: string]: string
  }
}

/*
  Chainalassist marketData is an array of objects that look like:
[
  {
    "name": "dAAVE",
    "configs": [
      {
        "chainId": 1,
        "address": "0xA12949ED1eD88Fd8E32c96A153B14756F2c92178",
        "underlying": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
      },
      ...
    ]
  },
  ...
]
*/

interface MarketConfig {
  chainId: number;
  address: string;
  underlying: string;
}
interface MarketData {
  name: string;
  configs: MarketConfig[];
}

const getChainId = (): number => {
  const { HARDHAT_TARGET_NETWORK = '' } = process.env;
  if (HARDHAT_TARGET_NETWORK === 'goerli' || HARDHAT_TARGET_NETWORK === 'gorli') {
    return 5;
  }
  if (
    HARDHAT_TARGET_NETWORK === 'homestead'
    || HARDHAT_TARGET_NETWORK === 'mainnet'
    || HARDHAT_TARGET_NETWORK === 'localfork'
  ) {
    return 1;
  }
  return 31337;
}

const chainId = getChainId();
const { FILE_ARG = '' } = process.env;

const data: TokenData | MarketData[] = JSON.parse(fs.readFileSync(FILE_ARG).toString());
const baseName = path.basename(FILE_ARG);

const updateCErcTokens: (data: TokenData) => Promise<TokenData> = async (data) => {
  const tokens = Object.keys(data);
  for (let i = 0; i < tokens.length; i += 1) {
    const symbol = tokens[i];
    try {
      const contract = await ethers.getContract(`d${symbol.toUpperCase()}`);
      data[symbol][chainId] = contract.address;
    } catch (e) {
      console.error(e);
      if (!(symbol in data)) {
        data[symbol] = {};
      }
      data[symbol][chainId] = "";
    }
  }
  return data;
}

const updateTokens: (data: TokenData) => Promise<TokenData> = async (data) => {
  const tokens = Object.keys(data).filter((symbol) => symbol.toUpperCase() !== 'ETH');
  for (let i = 0; i < tokens.length; i += 1) {
    const symbol = tokens[i];
    const SYMBOL = symbol.toUpperCase();
    if (chainId === 1 || chainId == 5) {
      if (SYMBOL in compoundMarkets) {
        data[symbol][chainId] = compoundMarkets[SYMBOL][chainId].address;
        continue;
      }
      if (SYMBOL in aaveMarkets) {
        data[symbol][chainId] = aaveMarkets[SYMBOL][chainId].address;
        continue;
      }
    }
    try {
      const contract = await ethers.getContract(SYMBOL);
      data[symbol][chainId] = contract.address;
    } catch (e) {
      console.error(e);
      if (!(symbol in data)) {
        data[symbol] = {};
      }
      data[symbol][chainId] = "";
    }
  }
  return data;
}

const updateChainalassistMarkets: (data: MarketData[]) => Promise<MarketData[]> = async (data) => {
  for (let i = 0; i < data.length; i += 1) {
    const marketData = data[i];
    const marketContract = await ethers.getContractOrNull<ICErc20>(marketData.name);
    if (marketContract !== null) {
      const underlying = await marketContract.underlying();
      const existingMarketConfig = marketData.configs.find((market) => market.chainId === chainId);
      if (existingMarketConfig !== undefined) {
        existingMarketConfig.address = marketContract.address;
        existingMarketConfig.underlying = underlying;
      } else {
        marketData.configs.push({
          chainId,
          underlying,
          address: marketContract.address,
        });
      }
    } else {
      console.error(`chainalassist markets config references ${marketData.name} but no contract found`);
    }
  }
  return data;
};

const updateMain: (data: TokenData) => Promise<TokenData> = async (data) => {
  data.comptroller[chainId] = (await ethers.getContract('Unitroller')).address;
  data.oracle[chainId] = (await ethers.getContract('Oracle')).address;
  data.lens[chainId] = (await ethers.getContract('Lens')).address;
  return data;
}

if (baseName === 'tokens.json') {
  updateTokens(data as TokenData)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else if (baseName === 'main.json') {
  updateMain(data as TokenData)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else if (baseName === 'cErcTokens.json') {
  updateCErcTokens(data as TokenData)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else if (baseName === 'markets.json') {
  updateChainalassistMarkets(data as MarketData[])
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err))
} else {
  console.error(`file type ${baseName} not recognized`);
}

