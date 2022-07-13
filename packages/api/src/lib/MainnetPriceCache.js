const ethers = require('ethers');
const { getChainlinkUSDPrice } = require('./Chainlink');
const { getUniV3USDPrice } = require('./UniswapV3');
const { getUniV2USDPrice } = require('./UniswapV2');
const BlockCache = require('./BlockCache');

/*
  Cache the prices of each token at each block. Upon receiving new price for a token for the current block, discard any old data
*/

class MainnetPriceCache extends BlockCache {
  #blockNumber;
  #provider;
  #isInitialized = false;
  #prices = {};
  #isMainnet = true;
  #priceUpdateFns = [];

  /*
    takes an ethers provider and an array of token symbols for getting mainnet prices, e.g. [WBTC, LINK]
  */
  constructor(mainnetProvider, mainnetTokens) {
    super(mainnetProvider);
    this.#provider = mainnetProvider;
    // @ts-ignore
    this.#isMainnet = mainnetProvider.network.chainId === 1;
    this.initialize(mainnetTokens);
  };

  // Gets latest price from blockchain, updates in cache, returns true if updated with new value, otherwise false
  async #updatePriceBySymbol(symbol) {
    const token = symbol.toUpperCase();
    if (token === 'ETH' || token === 'WETH') {
      const lastEthPrice = this.getPriceBySymbol('ETH');
      const ethPriceUsd = await getChainlinkUSDPrice('ETH');
      if (!ethPriceUsd || ethPriceUsd === lastEthPrice) {
        return false;
      }
      this.setPriceBySymbol('ETH', ethPriceUsd);
      this.setPriceBySymbol('WETH', ethPriceUsd);
      return true;
    }
    const chainLinkPrice = await getChainlinkUSDPrice(token, this.getPriceBySymbol('ETH'));
    if (chainLinkPrice) {
      if (chainLinkPrice === this.getPriceBySymbol(symbol)) {
        return false;
      }
      this.setPriceBySymbol(token, chainLinkPrice);
      return true;
    }
    const uniV3Price = await getUniV3USDPrice(token, this.getPriceBySymbol('ETH'));
    if (uniV3Price) {
      if (uniV3Price === this.getPriceBySymbol(symbol)) {
        return false;
      }
      this.setPriceBySymbol(token, uniV3Price);
      return true;
    }
    const uniV2Price = await getUniV2USDPrice(token, this.getPriceBySymbol('ETH'));
    if (uniV2Price) {
      if (uniV2Price === this.getPriceBySymbol(symbol)) {
        return false;
      }
      this.setPriceBySymbol(token, uniV2Price);
      return true;
    }
    return false;
  }

  async #updateMainnetPrices() {
    const tokens = Object.keys(this.#prices);
    return await Promise.all(tokens.map((token) => this.#updatePriceBySymbol(token)));
  }

  // Set blockNumber, ETH price and token prices, and add a block listener to trigger new updates
  async initialize(mainnetTokens) {
    if (this.#isInitialized) {
      return this;
    }
    const blockNumber = await this.#provider.getBlockNumber();
    this.#blockNumber = blockNumber;
    mainnetTokens.forEach((token) => this.#prices[token] = null);
    this.#prices['ETH'] = null;
    await this.#updateMainnetPrices();
    this.#isInitialized = true;
    this.#provider.on('block', async (blockNumber) => {
      this.#blockNumber = blockNumber;
      const mainnetUpdates = await this.#updateMainnetPrices();
      if (mainnetUpdates.reduce((res1, res2) => res1 || res2)) {
        this.#priceUpdateFns.map((fn) => fn());
      }
    });
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

  onPriceUpdate(fn) {
    this.#priceUpdateFns.push(fn);
  }
};

module.exports = MainnetPriceCache;
