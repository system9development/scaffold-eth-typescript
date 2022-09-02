import '@nomiclabs/hardhat-ethers';

import fs from 'fs';
import path from 'path';

import { ethers } from 'hardhat';

interface TokenData {
  [key: string]: {
    [key: string]: string
  }
}

const getChainId = (): number => {
  const { HARDHAT_TARGET_NETWORK = '' } = process.env;
  if (HARDHAT_TARGET_NETWORK === 'goerli' || HARDHAT_TARGET_NETWORK === 'gorli') {
    return 5;
  }
  if (HARDHAT_TARGET_NETWORK === 'homestead' || HARDHAT_TARGET_NETWORK === 'mainnet') {
    return 1;
  }
  return 31337;
}

const chainId = getChainId();
const { FILE_ARG = '' } = process.env;

const data: TokenData = JSON.parse(fs.readFileSync(FILE_ARG).toString());
const baseName = path.basename(FILE_ARG);

const updateCErcTokens: (data: TokenData) => Promise<TokenData> = async (data) => {
  const tokens = Object.keys(data);
  for (let i = 0; i < tokens.length; i += 1) {
    const symbol = tokens[i];
    const contract = await ethers.getContract(`d${symbol.toUpperCase()}`);
    data[symbol][chainId] = contract.address;
  }
  return data;
}

const updateTokens: (data: TokenData) => Promise<TokenData> = async (data) => {
  const tokens = Object.keys(data).filter((symbol) => symbol.toUpperCase() !== 'ETH');
  for (let i = 0; i < tokens.length; i += 1) {
    const symbol = tokens[i];
    const contract = await ethers.getContract(symbol.toUpperCase());
    data[symbol][chainId] = contract.address;
  }
  return data;
}

const updateMain: (data: TokenData) => Promise<TokenData> = async (data) => {
  data.comptroller[chainId] = (await ethers.getContract('Unitroller')).address;
  data.oracle[chainId] = (await ethers.getContract('Oracle')).address;
  data.lens[chainId] = (await ethers.getContract('Lens')).address;
  return data;
}

if (baseName === 'tokens.json') {
  updateTokens(data)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else if (baseName === 'main.json') {
  updateMain(data)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else if (baseName === 'cErcTokens.json') {
  updateCErcTokens(data)
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.error(err));
} else {
  console.error(`file type ${baseName} not recognized`);
}

