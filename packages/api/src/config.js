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
const dammProvider = NETWORK_URL && CHAIN_ID ? new ethers.providers.StaticJsonRpcProvider(
  NETWORK_URL,
  {
    name: NETWORK_NAME,
    chainId: CHAIN_ID
  }
) : mainnetProvider;

const goerliTokens = {
  "AAVE": {
    "address": "0x53128A42E8c52D96065031644B3DbC136ee14825",
    "coingeckoId": "aave",
    "decimals": 18
  },
  "AGEUR": {
    "address": "0x01a8bFD46883562212B94F6CCbF451E3F88F8a32",
    "coingeckoId": "ageur",
    "decimals": 18
  },
  "ANGLE": {
    "address": "0x8eDe66aF4B32e580498f31517463109Df86959Eb",
    "coingeckoId": "angle-protocol",
    "decimals": 18
  },
  "APE": {
    "address": "0x1A0fc6D6065da966389A4DdA864110804D1eaedD",
    "coingeckoId": "apecoin",
    "decimals": 18
  },
  "CNV": {
    "address": "0x3b4a5F6309F458E8254949144cd97dE0DB95cfeC",
    "coingeckoId": "concave",
    "decimals": 18
  },
  "COMP": {
    "address": "0xeaddc9B19A86963E08323D8F0cD7Bb266d57bAf5",
    "coingeckoId": "compound-governance-token",
    "decimals": 18
  },
  "CRV": {
    "address": "0x331400F969C71a6Fa08C2Bc5F0b30cFB33B1070a",
    "coingeckoId": "curve-dao-token",
    "decimals": 18
  },
  "CVX": {
    "address": "0x9E705143926b227397DE3491B51c67629842975d",
    "coingeckoId": "convex-finance",
    "decimals": 18
  },
  "DAI": {
    "address": "0xE79416455409419FcffeC6eD744F1b37A100ECE3",
    "coingeckoId": "dai",
    "decimals": 18
  },
  "ETH": {
    "address": "",
    "coingeckoId": "ethereum",
    "decimals": 18,
  },
  "FRAX": {
    "address": "0x541F80F4bC4Af050679281C923394B1Cf9B6fFa8",
    "coingeckoId": "frax",
    "decimals": 18
  },
  "FXS": {
    "address": "0xC66786080106C89733c7aC2ab4f355CcFce42330",
    "coingeckoId": "frax-share",
    "decimals": 18
  },
  "KNC": {
    "address": "0x42b2f0b1c77381B8208EC26FEae88E85371f406f",
    "coingeckoId": "kyber-network-crystal",
    "decimals": 18
  },
  "LINK": {
    "address": "0x98E823419133d1167A751393ec357377796415D9",
    "coingeckoId": "chainlink",
    "decimals": 18
  },
  "MATIC": {
    "address": "0x4De2ebeAE9bFDfD0acf128fB2C949B6330C3a2f6",
    "coingeckoId": "matic-network",
    "decimals": 18
  },
  "SNX": {
    "address": "0xD191748a5f9856C1393931b3149C9b08F7900Ab5",
    "coingeckoId": "havven",
    "decimals": 18
  },
  "STETH": {
    "address": "0x780116B4FCc29E1674b351089B4D847F74dc31dc",
    "coingeckoId": "staked-ether",
    "decimals": 18
  },
  "UNI": {
    "address": "0x8B55fa20D95f167BE166E882346262471d34F1dB",
    "coingeckoId": "uniswap",
    "decimals": 18
  },
  "USDC": {
    "address": "0x332Da217c42CEfc57d133b5624291F88B8ac6b6D",
    "coingeckoId": "usd-coin",
    "decimals": 6
  },
  "USDT": {
    "address": "0x29A14c43a26CD86f08744eF7afe1BBc73941AbD0",
    "coingeckoId": "tether",
    "decimals": 6
  },
  "WBTC": {
    "address": "0xc9c66d0302cb187094471735Ad7B477c09e16199",
    "coingeckoId": "wrapped-bitcoin",
    "decimals": 8
  },
  "WETH": {
    "address": "0x635F77FE6D1e0DC382f70532A3292Eab31bE31Ff",
    "coingeckoId": "weth",
    "decimals": 18
  },
  "WOO": {
    "address": "0xa285134097eFfE738C26E6a56353293e2EFA5d9E",
    "coingeckoId": "woo-network",
    "decimals": 18
  },
};

const mainnetTokens = {
  "AAVE": {
    "address": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    "coingeckoId": "aave",
    "decimals": 18
  },
  "AGEUR": {
    "address": "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8",
    "coingeckoId": "ageur",
    "decimals": 18
  },
  "ANGLE": {
    "address": "0x31429d1856aD1377A8A0079410B297e1a9e214c2",
    "coingeckoId": "angle-protocol",
    "decimals": 18
  },
  "APE": {
    "address": "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    "coingeckoId": "apecoin",
    "decimals": 18
  },
  "CNV": {
    "address": "0x000000007a58f5f58e697e51ab0357bc9e260a04",
    "coingeckoId": "concave",
    "decimals": 18
  },
  "COMP": {
    "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    "coingeckoId": "compound-governance-token",
    "decimals": 18
  },
  "CRV": {
    "address": "0xD533a949740bb3306d119CC777fa900bA034cd52",
    "coingeckoId": "curve-dao-token",
    "decimals": 18
  },
  "CVX": {
    "address": "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    "coingeckoId": "convex-finance",
    "decimals": 18
  },
  "DAI": {
    "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "coingeckoId": "dai",
    "decimals": 18
  },
  "ETH": {
    "address": "",
    "coingeckoId": "ethereum",
    "decimals": 18
  },
  "FRAX": {
    "address": "0x853d955aCEf822Db058eb8505911ED77F175b99e",
    "coingeckoId": "frax",
    "decimals": 18
  },
  "FXS": {
    "address": "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
    "coingeckoId": "frax-share",
    "decimals": 18
  },
  "KNC": {
    "address": "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
    "coingeckoId": "kyber-network-crystal",
    "decimals": 18
  },
  "LINK": {
    "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "coingeckoId": "chainlink",
    "decimals": 18
  },
  "MATIC": {
    "address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "coingeckoId": "matic-network",
    "decimals": 18
  },
  "RBN": {
    "address": "0x6123B0049F904d730dB3C36a31167D9d4121fA6B",
    "coingeckoId": "ribbon-finance",
    "decimals": 18
  },
  "SNX": {
    "address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    "coingeckoId": "havven",
    "decimals": 18
  },
  "STETH": {
    "address": "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    "coingeckoId": "staked-ether",
    "decimals": 18
  },
  "UNI": {
    "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "coingeckoId": "uniswap",
    "decimals": 18
  },
  "USDC": {
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "coingeckoId": "usd-coin",
    "decimals": 6
  },
  "USDT": {
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "coingeckoId": "tether",
    "decimals": 6
  },
  "WBTC": {
    "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "coingeckoId": "wrapped-bitcoin",
    "decimals": 8
  },
  "WETH": {
    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "coingeckoId": "weth",
    "decimals": 18
  },
  "WOO": {
    "address": "0x4691937a7508860F876c9c0a2a617E7d9E945D4B",
    "coingeckoId": "woo-network",
    "decimals": 18
  }
};

const compoundMarkets = {
  CUSDC: {
    "1": {
      address: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
      decimals: 8,
    },
    "5": {
      address: "0x73506770799Eb04befb5AaE4734e58C2C624F493",
      decimals: 8,
    },
  },
  CUSDT: {
    "1": {
      address: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
      decimals: 8,
    },
    "5": {
      address: "0x5A74332C881Ea4844CcbD8458e0B6a9B04ddb716",
      decimals: 8,
    },
  },
};

const aaveMarkets = {
  AUSDC: {
    "1": {
      address: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
      decimals: 6,
    },
    "5": {
      address: "0x935c0F6019b05C787573B5e6176681282A3f3E05",
      decimals: 6,
    },
  },
  AUSDT: {
    "1": {
      address: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
      decimals: 6,
    },
    "5": {
      address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
      decimals: 6,
    },
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

const BLOCKS_PER_YEAR = 2629800;

const STABLECOIN_UNDERLYING_SYMBOLS_SET = new Set([
  'USDC',
  'USDT',
  'DAI',
  'AGEUR',
  'FRAX',
  'AUSDC',
  'AUSDT',
  'ABUSD',
  'ADAI',
  'AFRAX',
  'ALUSD',
  'ATUSD',
  'AUSDP',
  'CUSDC',
  'CTUSD',
  'CDAI',
  'CFEI'
]);

module.exports = {
  dammProvider,
  mainnetProvider,
  mainnetTokens,
  goerliTokens,
  compoundMarkets,
  aaveMarkets,
  chainlinkOracleAddresses,
  uniswapV3PoolAddresses,
  uniswapV2PoolAddresses,
  BLOCKS_PER_YEAR,
  STABLECOIN_UNDERLYING_SYMBOLS_SET,
  CHAIN_ID,
};
