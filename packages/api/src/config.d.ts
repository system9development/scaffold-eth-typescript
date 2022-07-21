import { ethers } from 'ethers';

export const mainnetTokens: {[key: string]: { address?: string, decimals: number } };
export const dammProvider: ethers.providers.Provider & { blockNumber?: number };
export const mainnetProvider: ethers.providers.Provider & { blockNumber?: number };
export const uniswapV3PoolAddresses: {[key: string]: string};
export const uniswapV2PoolAddresses: {[key: string]: string};
export const chainlinkOracleAddresses: {[key: string]: string};