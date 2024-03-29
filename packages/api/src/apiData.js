const BigNumber = require('bignumber.js');
const { dammProvider, mainnetProvider, mainnetTokens } = require('./config');
const Comptroller = require('./Comptroller');
const MainnetPriceCache = require('./lib/MainnetPriceCache');
const DammTokenCache = require('./lib/DammTokenCache');
const { compoundMarkets, aaveMarkets, CHAIN_ID, TARGETED_BDAMM_DAMM_DISCOUNT_RATE } = require('./config');

const underlyingTokensForChain = [...Object.keys(mainnetTokens), 'BDAMM', 'DAMM'];
if (CHAIN_ID === 1 || CHAIN_ID === 5) {
  underlyingTokensForChain.push(...Object.keys(compoundMarkets), ...Object.keys(aaveMarkets));
} else {
  underlyingTokensForChain.push(...(Object.keys(compoundMarkets).map(symbol => symbol.replace(/C/, 'd'))))
}
const mainnetCache = new MainnetPriceCache(
  mainnetProvider,
  underlyingTokensForChain,
);

const dammTokenCache = new DammTokenCache(
  dammProvider,
  Comptroller,
  mainnetCache,
);

const apiData = async () => {
  // Gets an array of addresses
  const metadata = dammTokenCache.getDammMetadata();

  const dammPrice = mainnetCache.getPriceBySymbol('DAMM');
  const response = {
    status: true,
    data: {
      // @ts-ignore
      liquidity: metadata.reduce((prev, cur) => prev.plus(cur.liquidity), new BigNumber(0)),
      // @ts-ignore
      totalSupply: metadata.reduce((prev, cur) => prev.plus(cur.totalSupplyUsd), new BigNumber(0)),
      // @ts-ignore
      totalBorrows: metadata.reduce((prev, cur) => prev.plus(cur.totalBorrowsUsd), new BigNumber(0)),
      markets: metadata,
      mainnetBlock: mainnetProvider.blockNumber,
      dammNetBlock: dammProvider.blockNumber,
      bdamm: mainnetCache.getPriceBySymbol('DAMM') * TARGETED_BDAMM_DAMM_DISCOUNT_RATE,
      damm: mainnetCache.getPriceBySymbol('DAMM'),
    },
  };
  return response;
};

const apiDataHandler = async (req, res) => {
  const { blockNumber } = req.query;
  if (blockNumber && dammProvider.blockNumber) {
    res.set('Cache-Control', "s-maxage=31536000, max-age=60"); // default cache TTL when blockNumber is specified
    if (blockNumber.search(/[^0-9]/) !== -1) {
      // Use default TTL
      res.status(400).send({ error: 'blockNumber invalid; allowed characters: 0-9' });
      return;
    }
    const blockSkew = parseInt(blockNumber) - dammProvider.blockNumber;
    if (blockSkew < -3) {
      // Use default TTL
      res.status(404).send({ error: 'blockNumber out of range' });
      return;
    }
    if (blockSkew > 0) {
      /*
        If the client's blockNumber param is ahead by one, set the TTL to 1 second.
        For every client blockNumber ahead beyond 1, increase the TTL by 7 seconds.
        This makes it unlikely the server blockNumber will catch up to the requested block
        without the cached response having expired, but still keeps the response in the cache
        long enough to prevent DDOS
      */
      res.set('Cache-Control', `s-maxage=${1 + (blockSkew - 1)*7}, max-age=60`);
    }
  } else {
    res.set('Cache-Control', "s-maxage=30, max-age=60"); // cache results for 30 seconds when no blockNumber is specified
  }
  res.send(await apiData());
}

module.exports = apiDataHandler;
