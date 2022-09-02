const ethers = require('ethers');
const { getChainlinkUSDPrice } = require('./Chainlink');
const { getUniV3USDPrice } = require('./UniswapV3');
const { getUniV2USDPrice } = require('./UniswapV2');
const Lens = require('../Lens');
const Erc20ReadAbi = require('../abis/Erc20Read');
const CTokenReadAbi = require('../abis/CTokenRead');
const cTokenMetadataToJson = require('./cTokenMetadataToJson');

/*
  Cache the prices of each token at each block. Upon receiving new price for a token for the current block, discard any old data
*/

class BlockCache {
  #blockNumber;
  #provider;
  #isInitialized = false;
  #isMainnet;
  constructor(provider) {
    if (!(provider instanceof ethers.providers.Provider)) {
      throw new TypeError(`first argument is not an ethers.js provider: ${provider}`);
    }
  }
}

module.exports = BlockCache;