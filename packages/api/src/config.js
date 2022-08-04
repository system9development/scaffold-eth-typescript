const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config();

const NETWORK_URL = process.env.ETHERS_NETWORK_URL || 'http://localhost:8545';
const CHAIN_ID = process.env.ETHERS_CHAIN_ID ? parseInt(process.env.ETHERS_CHAIN_ID) : 31337;
const NETWORK_NAME = process.env.ETHERS_NETWORK_NAME || 'localhost';
const { ALCHEMY_API_TOKEN } = process.env;

if (!ALCHEMY_API_TOKEN) {
  console.error('ALCHEMY_API_TOKEN is required in environment. Check your .env file');
  process.exit(1);
}

const mainnetProvider = new ethers.providers.AlchemyProvider('homestead', ALCHEMY_API_TOKEN);

console.log('Creating DAMM provider', NETWORK_URL, CHAIN_ID);
const dammProvider = NETWORK_URL && CHAIN_ID ? new ethers.providers.JsonRpcProvider(
  NETWORK_URL,
  {
    name: NETWORK_NAME,
    chainId: CHAIN_ID
  }
) : mainnetProvider;

const mainnetTokens = {
  ETH: {
    decimals: 18,
  },
  RBN: {
    address: '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
    decimals: 18,
  },
  WOO: {
    address: '0x4691937a7508860F876c9c0a2a617E7d9E945D4B',
    decimals: 18,
  },
  BTRFLY: {
    address: '0xC0d4Ceb216B3BA9C3701B291766fDCbA977ceC3A',
    decimals: 9,
  },
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  LINK: {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
  },
  FRAX: {
    address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    decimals: 18,
  },
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
  },
  FXS: {
    address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
    decimals: 18,
  },
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
  },
  STETH: {
    address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    decimals: 18,
  },
  KNC: {
    address: '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
    decimals: 18,
  },
  CVX: {
    address: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
    decimals: 18,
  },
  CRV: {
    address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    decimals: 18,
  },
  UNI: {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
  },
  MATIC: {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    decimals: 18,
  },
  COMP: {
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    decimals: 18,
  },
  AAVE: {
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18,
  },
  APE: {
    address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    decimals: 18,
  },
  SNX: {
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    decimals: 18,
  },
  AGEUR: {
    address: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
    decimals: 18,
  },
  ANGLE: {
    address: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
    decimals: 18,
  },
  CNV: {
    address: '0x000000007a58f5f58e697e51ab0357bc9e260a04',
    decimals: 18,
  }
};

const chainlinkOracleAddresses = {
  ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  LINK_USD: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',
  FRAX_USD: '0xB9E1E3A9feFf48998E45Fa90847ed4D467E8BcfD',
  BTC_USD: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
  WBTC_BTC: '0xfdFD9C85aD200c506Cf9e21F1FD8dd01932FBB23',
  USDC_USD: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
  USDT_USD: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  FXS_USD: '0x6Ebc52C8C1089be9eB3945C4350B68B8E4C2233f',
  DAI_USD: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  STETH_USD: '0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8',
  KNC_USD: '0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc',
  CVX_USD: '0xd962fC30A72A84cE50161031391756Bf2876Af5D',
  WSTETH_STETH: '0xB1552C5e96B312d0Bf8b554186F846C40614a540',
  CRV_USD: '0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f',
  UNI_ETH: '0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e',
  MATIC_USD: '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676',
  AAVE_USD: '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
  COMP_USD: '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5',
  APE_USD: '0xD10aBbC76679a20055E167BB80A24ac851b37056',
  SNX_USD: '0xdc3ea94cd0ac27d9a86c180091e7f78c683d3699',
  AGEUR_USD: '0xb49f677943BC038e9857d61E7d053CaA2C1734C1', // Actually using EUR/USD oracle
};

const uniswapV3PoolAddresses = {
  RBN_ETH: '0x94981F69F7483AF3ae218CbfE65233cC3c60d93a', // TVL ~2.5M USD
  ETH_BTRFLY: '0xdF9aB3C649005EbFDf682d2302ca1f673e0d37a2', // TVL ~1.5M USD
  AGEUR_USDC: '0x735a26a57A0A0069dfABd41595A970faF5E1ee8b',
  CNV_ETH: '0x0311125b58d9602352cba5c925927ecb86a5905a',
  /* ---- Test pools ---- */
  USDC_ETH: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
  ETH_USDT: '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36',
};

const uniswapV2PoolAddresses = {
  WOO_ETH: '0x6AdA49AECCF6E556Bb7a35ef0119Cc8ca795294A', // TVL ~3M USD
  AGEUR_ANGLE: '0x1f4c763BdE1D4832B3EA0640e66Da00B98831355', // TVL ~1M USD
  /* ---- Test pools ---- */
  USDC_ETH: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
  ETH_USDT: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
};

const BLOCKS_PER_YEAR = 2102400;

module.exports = {
  dammProvider,
  mainnetProvider,
  mainnetTokens,
  chainlinkOracleAddresses,
  uniswapV3PoolAddresses,
  uniswapV2PoolAddresses,
  BLOCKS_PER_YEAR,
};
