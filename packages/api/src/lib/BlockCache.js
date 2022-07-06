const ethers = require('ethers');
const { getChainlinkUSDPrice } = require('./Chainlink');
const { getUniV3USDPrice } = require('./UniswapV3');
const { getUniV2USDPrice } = require('./UniswapV2');
/*
  Cache the prices of each token at each block. Upon receiving new price for a token for the current block, discard any old data
*/

class BlockCache {
  #blockNumber;
  #provider;
  #isInitialized = false;
  #prices = {};
  static #providerCaches = new Map(); // map Provider -> blockCache

  // takes an ethers provider and an array of token names
  constructor(provider, tokens) {
    if (!(provider instanceof ethers.providers.Provider)) {
      throw new TypeError(`BlockCache provider is not an ethers.js provider: ${provider}`);
    }
    if (BlockCache.#providerCaches.get(provider)) {
      return BlockCache.#providerCaches.get(provider);
    }
    this.#provider = provider;
    BlockCache.#providerCaches.set(provider, this);
    this.initialize(tokens);
  };

  async #updatePriceBySymbol(symbol) {
    const token = symbol.toUpperCase();
    if (token === 'ETH' || token === 'WETH') {
      const ethPriceUsd = await getChainlinkUSDPrice('ETH');
      this.setPriceBySymbol('ETH', ethPriceUsd);
      this.setPriceBySymbol('WETH', ethPriceUsd);
      return;
    }
    const chainLinkPrice = await getChainlinkUSDPrice(token, this.getPriceBySymbol('ETH'));
    if (chainLinkPrice) {
      this.setPriceBySymbol(token, chainLinkPrice);
      return;
    }
    const uniV3Price = await getUniV3USDPrice(token, this.getPriceBySymbol('ETH'));
    if (uniV3Price) {
      this.setPriceBySymbol(token, uniV3Price);
      return;
    }
    const uniV2Price = await getUniV2USDPrice(token, this.getPriceBySymbol('ETH'));
    if (uniV2Price) {
      this.setPriceBySymbol(token, uniV2Price);
    }
  }

  async #updatePrices() {
    const tokens = Object.keys(this.#prices);
    await Promise.all(tokens.map((token) => this.#updatePriceBySymbol(token)));
  }

  // Set blockNumber, ETH price and token prices, and add a block listener to trigger new updates
  async initialize(tokens = []) {
    if (this.#isInitialized) {
      return this;
    }
    try {
      const blockNumber = await this.#provider.getBlockNumber();
      tokens.forEach((token) => this.#prices[token] = null);
      this.#prices['ETH'] = null;
      this.#blockNumber = blockNumber;
      await this.#updatePrices();
      
      this.#provider.on('block', (blockNumber) => {
        this.#blockNumber = blockNumber;
        this.#updatePrices()
      });
      this.#isInitialized = true;
    } catch (e) {
      throw new Error(e);
    }
    return this;
  }

  get provider() {
    return this.#provider;
  }

  get blockNumber() {
    return this.#blockNumber;
  };

  getPriceBySymbol(symbol) {
    return this.#prices[symbol] || null;
  }

  setPriceBySymbol(symbol, priceUsd) {
    // @ts-ignore
    if (this.provider.blockNumber && this.provider.blockNumber !== this.blockNumber) {
      // @ts-ignore
      this.#blockNumber = this.provider.blockNumber;
    }
    this.#prices[symbol] = priceUsd;
  }
};

module.exports = BlockCache;
