const ethers = require('ethers');
const Lens = require('../Lens');
const Erc20ReadAbi = require('../abis/Erc20Read');
const CTokenReadAbi = require('../abis/CTokenRead');
const cTokenMetadataToJson = require('./cTokenMetadataToJson');
const cTokenMetadataToMarketData = require('./cTokenMetadataToMarketData');
const MainnetPriceCache = require('./MainnetPriceCache');
const BlockCache = require('./BlockCache');

/*
  Cache static and variable metadata for each token supported by DAMM.
*/

class DammTokenCache extends BlockCache {
  #blockNumber;
  #provider;
  #isMainnet;
  #isInitialized = false;
  #mainnetCache;

  /*
    #dammTokens: An array of contract address of the damm markets (dTokens) e.g. [0x..., 0x...].

    This is initialized by awaiting Comptroller.getAllMarkets(), and will be updated asynchronously on every block.
    This will then be passed to Lens.cTokenMetadataAll(...) on every block in order to cache data which is used to serve
    the API responses.

    To avoid serially awaiting many things, if a new market is added in the comptroller, the Lens data may not be
    fetched until one or two blocks later
  */
  #dammTokens = [];
  #dammTokenAddressesToStaticData = {};

  /*
    The processed metadata from the Lens.cTokenMetadataAll
  */
  #metadata = {};

  /*
    takes an ethers provider, the Comptroller contract, and :
    - provider: The ethers provider
    - Comptroller: The ethers contract instance for the comptroller (attached to the unitroller address)
      This will be used by the DammTokenCache instance to call the getAllMarkets() function of the contract
      on every block and update the #dammTokens private instance variable.
    - mainnetCache: Provide if provider is not mainnet, will set to the mainnet cache instance
  */
  constructor(provider, Comptroller, mainnetCache) {
    super(provider);
    this.#provider = provider;
    // @ts-ignore
    this.#isMainnet = provider.network.chainId === 1;
    if (!(Comptroller instanceof ethers.Contract)) {
      throw new TypeError('Comptroller is not an ethers contract');
    }
    if (!(mainnetCache instanceof MainnetPriceCache)) {
      throw new TypeError('A MainnetPriceCache instance must be provided');
    }
    this.#mainnetCache = mainnetCache;
    this.initialize(Comptroller);
  };

  async #initializeDammTokenStaticData(dTokenAddress) {
    if (this.#dammTokenAddressesToStaticData[dTokenAddress]) {
      return this.#dammTokenAddressesToStaticData[dTokenAddress];
    }
    const cErc20Reader = new ethers.Contract(dTokenAddress, CTokenReadAbi, this.#provider);
    const cEtherReader = new ethers.Contract(dTokenAddress, Erc20ReadAbi, this.#provider);
    let underlyingAddress = null;
    const staticData = {};
    try {
      underlyingAddress = await cErc20Reader.underlying();
      const underlyingReader = new ethers.Contract(underlyingAddress, Erc20ReadAbi, this.#provider);
      staticData.symbol = await cErc20Reader.symbol();
      staticData.name = await cErc20Reader.name();
      staticData.address = dTokenAddress;
      staticData.reader = cErc20Reader;
      staticData.underlying = underlyingAddress;
      staticData.underlyingSymbol = (await underlyingReader.symbol()).toUpperCase();
      staticData.underlyingName = await underlyingReader.name();
      staticData.underlyingDecimals = await underlyingReader.decimals();
      staticData.underlyingReader = underlyingReader;
    } catch (e) {
      // market is cETH, do nothing and leave underlyingAddress = null
      staticData.symbol = await cEtherReader.symbol();
      staticData.name = await cEtherReader.name();
      staticData.address = dTokenAddress;
      staticData.reader = cEtherReader;
      staticData.underlyingReader = null;
      staticData.underlying = null;
      staticData.underlyingSymbol = 'ETH';
      staticData.underlyingName = 'Ether';
      staticData.underlyingDecimals = 18;
      staticData.underlyingReader = null;
    }
    this.#dammTokenAddressesToStaticData[dTokenAddress] = staticData
  }


  async #updateDammMarketMetadata() {
    const rawMetadataJsonArray = (await Lens.callStatic.cTokenMetadataAll(this.#dammTokens)).map(cTokenMetadataToJson);
    this.#metadata = rawMetadataJsonArray
  }

  // Set blockNumber, ETH price and token prices, and add a block listener to trigger new updates
  async initialize(Comptroller) {
    if (this.#isInitialized) {
      return this;
    }
    const blockNumber = await this.#provider.getBlockNumber();
    this.#blockNumber = blockNumber;
    this.#dammTokens = await Comptroller.getAllMarkets();
    const dammTokenSet = new Set(this.#dammTokens);
    await Promise.all((this.#dammTokens).map((dToken) => this.#initializeDammTokenStaticData(dToken)));
    await this.#updateDammMarketMetadata();
    await this.#mainnetCache.initialize();
    this.#isInitialized = true;
    this.#provider.on('block', async (blockNumber) => {
      this.#blockNumber = blockNumber;

      const latestDammTokens = await Comptroller.getAllMarkets();
      if (!latestDammTokens || latestDammTokens.length === 0) {
        console.error('Comptroller getAllMarkets failed or reported 0 dAMM tokens; aborting update');
      }
      const latestDammTokenSet = new Set(latestDammTokens);
      const newDammTokens = [];
      const removedDammTokens = [];
      for (let i = 0; i < latestDammTokens.length; i += 1) {
        const newDammTokenAddress = latestDammTokens[i];
        if (!dammTokenSet.has(newDammTokenAddress)) {
          newDammTokens.push(newDammTokenAddress);
          dammTokenSet.add(newDammTokenAddress);
        }
      }
      for (let i = 0; i < this.#dammTokens.length; i += 1) {
        const previousDammTokenAddress = this.#dammTokens[i];
        if (!latestDammTokenSet.has(previousDammTokenAddress)) {
          removedDammTokens.push(previousDammTokenAddress);
          dammTokenSet.delete(previousDammTokenAddress);
        }
      }
      if (newDammTokens.length > 0 || removedDammTokens.length > 0) {
        removedDammTokens.forEach((removedDammToken) => {
          delete this.#dammTokenAddressesToStaticData[removedDammToken];
        });
        this.#dammTokens = latestDammTokens;
        await Promise.all((this.#dammTokens).map((dToken) => this.#initializeDammTokenStaticData(dToken)));
        this.#updateDammMarketMetadata();
      }
    });
    // Run updateDammMarketMetadata whenever a token price changes
    this.#mainnetCache.onPriceUpdate(() => { this.#updateDammMarketMetadata() });
    return this;
  }

  get provider() {
    return this.#provider;
  }

  get blockNumber() {
    return this.#blockNumber;
  };

  get dammMetadata() {
    return this.#metadata;
  }

  get dammTokens() {
    return this.#dammTokens;
  }

  get dammMetadataList() {
    return Object.values(this.#metadata);
  }

  get isMainnet() {
    return this.#isMainnet;
  }

  getDammMetadata() {
    return Object.values(this.#metadata).map((metadatum) => {
      const cTokenAddress = metadatum.cToken;
      const staticData = this.#dammTokenAddressesToStaticData[cTokenAddress];
      const { name, symbol, underlyingSymbol, underlyingName } = staticData;
      return cTokenMetadataToMarketData(metadatum, {
        name,
        symbol,
        underlyingSymbol,
        underlyingName,
        underlyingPriceUsd: this.#mainnetCache.getPriceBySymbol(underlyingSymbol),
        blockNumber: this.#mainnetCache.blockNumber,
      });
    });
  }
};

module.exports = DammTokenCache;
