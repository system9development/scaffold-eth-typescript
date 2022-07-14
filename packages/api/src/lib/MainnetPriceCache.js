const ethers = require('ethers');
const { getChainlinkUSDPrice } = require('./Chainlink');
const { getUniV3USDPrice, getUniV3ToTokenPrice } = require('./UniswapV3');
const { getUniV2USDPrice, getUniV2ToTokenPrice } = require('./UniswapV2');
const BlockCache = require('./BlockCache');
const { uniswapV2PoolAddresses, uniswapV3PoolAddresses } = require('../config');

/*
  Cache the prices of each token at each block. Upon receiving new price for a token for the current block, discard any old data
*/

class MainnetPriceCache extends BlockCache {
  #blockNumber;
  #provider;
  #isInitialized = false;
  #prices = {};
  #isMainnet = true;

  /*
    an array of functions passed in as arguments to MainnetPriceCache.onPriceUpdate(), which are run every time
    the price of any of the tracked tokens updates on a given block
  */
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
    const potentialV3PriceMarkets = Object.keys(uniswapV3PoolAddresses)
      .filter((market) => market.startsWith(`${symbol}_`) || market.endsWith(`_${symbol}`));
    for (let i = 0; i < potentialV3PriceMarkets.length; i += 1) {
      const [matchingMarketBase, matchingMarketQuote] = potentialV3PriceMarkets[i].split('_');
      const quote = matchingMarketBase === symbol
        ? matchingMarketQuote
        : matchingMarketBase;
      if (this.getPriceBySymbol(quote)) {
        const uniV3Price = await getUniV3ToTokenPrice(symbol, quote);
        if (uniV3Price) {
          const newTokenUsdPrice = uniV3Price * this.getPriceBySymbol(quote);
          if (!newTokenUsdPrice || newTokenUsdPrice === this.getPriceBySymbol(symbol)) {
            return false;
          }
          this.setPriceBySymbol(symbol, newTokenUsdPrice);
          return true;
        }
      }
    }
    const potentialV2PriceMarkets = Object.keys(uniswapV2PoolAddresses)
      .filter((market) => market.startsWith(`${symbol}_`) || market.endsWith(`_${symbol}`));
    for (let i = 0; i < potentialV2PriceMarkets.length; i += 1) {
      const [matchingMarketBase, matchingMarketQuote] = potentialV2PriceMarkets[i].split('_');
      const quote = matchingMarketBase === symbol
        ? matchingMarketQuote
        : matchingMarketBase;
      if (this.getPriceBySymbol(quote)) {
        const uniV2Price = await getUniV2ToTokenPrice(symbol, quote);
        const newTokenUsdPrice = uniV2Price * this.getPriceBySymbol(quote);
        if (!newTokenUsdPrice || newTokenUsdPrice === this.getPriceBySymbol(symbol)) {
          return false;
        }
        this.setPriceBySymbol(symbol, newTokenUsdPrice)
        return true;
      }
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

  get isMainnet() {
    return this.#isMainnet;
  }

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
