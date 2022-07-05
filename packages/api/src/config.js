const contractsConfig = require('../../common/src/generated/hardhat_contracts.json');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config();

const NETWORK_URL = process.env.ETHERS_NETWORK_URL || 'http://localhost:8545';
const CHAIN_ID = parseInt(process.env.ETHERS_CHAIN_ID) || 31337;
const NETWORK_NAME = process.env.ETHERS_NETWORK_NAME || 'localhost';
const { ALCHEMY_API_TOKEN } = process.env;

if (!ALCHEMY_API_TOKEN) {
  console.error('ALCHEMY_API_TOKEN is required in environment. Check your .env file');
}

const provider = new ethers.providers.JsonRpcProvider(
  NETWORK_URL,
  {
    name: NETWORK_NAME,
    chainId: CHAIN_ID
  }
);

const mainnetProvider = new ethers.providers.AlchemyProvider('homestead', ALCHEMY_API_TOKEN);

const networkConfig = contractsConfig[CHAIN_ID]?.find((config) => config.name === NETWORK_NAME)?.contracts;

if (!networkConfig) {
  console.error(`no network config found for ${NETWORK_NAME} with chainID ${CHAIN_ID}}`);
  process.exit(1);
}

const mainnetTokens = {
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
  CVX_USD: '0xd962fC30A72A84cE50161031391756Bf2876Af5D'
};

const uniswapV3PoolAddresses = {
  'RBN_ETH': '0x94981F69F7483AF3ae218CbfE65233cC3c60d93a', // TVL ~2.5M USD
  'ETH_BTRFLY': '0xdF9aB3C649005EbFDf682d2302ca1f673e0d37a2', // TVL ~1.5M USD
}
const uniswapV2PoolAddresses = {
  'WOO_ETH': '0x6AdA49AECCF6E556Bb7a35ef0119Cc8ca795294A', // TVL ~3M USD
};

module.exports = {
  provider,
  networkConfig,
  mainnetProvider,
  mainnetTokens,
  chainlinkOracleAddresses,
  uniswapV3PoolAddresses,
  uniswapV2PoolAddresses,
};
