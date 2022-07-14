const { dammProvider, mainnetProvider, mainnetTokens } = require('./config');
const Comptroller = require('./Comptroller');
const MainnetPriceCache = require('./lib/MainnetPriceCache');
const DammTokenCache = require('./lib/DammTokenCache');

const mainnetCache = new MainnetPriceCache(
  mainnetProvider,
  Object.keys(mainnetTokens),
);

const dammTokenCache = new DammTokenCache(
  dammProvider,
  Comptroller,
  mainnetCache,
);

const apiData = async () => {
  // Gets an array of addresses
  const metadata = dammTokenCache.getDammMetadata()

  const response = {
    status: true,
    data: {
      markets: metadata,
      mainnetBlock: mainnetProvider.blockNumber,
      dammNetBlock: dammProvider.blockNumber,
    },
  };
  return response;
};

module.exports = apiData;
