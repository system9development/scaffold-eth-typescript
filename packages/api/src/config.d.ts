import { ethers } from 'ethers';

export interface IMainnetMetaData {
  address: string;
  decimals: number;
  coingeckoId: string;
}

type IExternalTokenChainData = {
  address: string,
  decimals: number,
  underlyingDecimals: number,
  coingeckoId: string,
};

export interface IExternalDeployment {
  "1": IExternalTokenChainData;
  "5": IExternalTokenChainData;
}

export const mainnetTokens: {[key: string]:  IMainnetMetaData};
export const goerliTokens: {[key: string]: IMainnetMetaData };
export const dammProvider: ethers.providers.Provider & { blockNumber?: number };
export const mainnetProvider: ethers.providers.Provider & { blockNumber?: number };
export const uniswapV3PoolAddresses: {[key: string]: string};
export const uniswapV2PoolAddresses: {[key: string]: string};
export const chainlinkOracleAddresses: {[key: string]: string};
export const BLOCKS_PER_YEAR: number;
export const aaveMarkets: {[key: string]: IExternalDeployment};
export const compoundMarkets: {[key: string]: IExternalDeployment};
export const STABLECOIN_UNDERLYING_SYMBOLS_SET: Set<string>;
export const CHAIN_ID: number;
