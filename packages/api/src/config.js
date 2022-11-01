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
    chainId: NETWORK_NAME === 'localfork' ? 31336 : CHAIN_ID
  }
) : mainnetProvider;

// Currently unused:
const goerliTokens = {
  "AAVE": {
    "address": "0xAab60cfb471E77E8CEf9e3a6949DC1cfe43e203e",
    "coingeckoId": "aave",
    "decimals": 18
  },
  "AGEUR": {
    "address": "0x0bdb8996f14e930dD57Ea1742A9A79efd78A7B9d",
    "coingeckoId": "ageur",
    "decimals": 18
  },
  "ANGLE": {
    "address": "0x3ad4Db18bf70982956CF9bC299473442bfB5c840",
    "coingeckoId": "angle-protocol",
    "decimals": 18
  },
  "APE": {
    "address": "0x836ac8eA22123a42bC8A99C6E9a551ACC254754B",
    "coingeckoId": "apecoin",
    "decimals": 18
  },
  "BTRFLY": {
    "address": "0x5829435707ACeDb5260aa0A4f619C377Bd577F8c",
    "coingeckoId": "redacted",
    "decimals": 18
  },
  "CNV": {
    "address": "0x54E66997016a4AbD937568c8E0427Ab3D21121b2",
    "coingeckoId": "concave",
    "decimals": 18
  },
  "COMP": {
    "address": "0xCCAE1Ec628ef597de687Af1cE5F8984c5216c019",
    "coingeckoId": "compound-governance-token",
    "decimals": 18
  },
  "CRV": {
    "address": "0x73bd0c08C14C46D1ac5255d8BDcD820dF1F15878",
    "coingeckoId": "curve-dao-token",
    "decimals": 18
  },
  "CVX": {
    "address": "0x3708e3C7cB5e97ebF22279094010DACEeb3dDBCe",
    "coingeckoId": "convex-finance",
    "decimals": 18
  },
  "DAI": {
    "address": "0xFA8cAD58729B1A1Ae3d4A6D108f274AC2F0d5c2B",
    "coingeckoId": "dai",
    "decimals": 18
  },
  "ETH": {
    "address": "",
    "coingeckoId": "ethereum",
    "decimals": 18,
  },
  "FRAX": {
    "address": "0xCDBD0971B7D80e9562d7Bb2B4bDb272b174EC0Da",
    "coingeckoId": "frax",
    "decimals": 18
  },
  "FXS": {
    "address": "0x81aC2295da65F584b6aab5921Ad67eE5913a3e11",
    "coingeckoId": "frax-share",
    "decimals": 18
  },
  "KNC": {
    "address": "0x015d036f0F28c381ac50984e928C6478c5c582C7",
    "coingeckoId": "kyber-network-crystal",
    "decimals": 18
  },
  "LINK": {
    "address": "0xdC10b764a93902f45388EeB97E67d79B26d3e409",
    "coingeckoId": "chainlink",
    "decimals": 18
  },
  "MATIC": {
    "address": "0xFBb4225574a4E2e7f01D79B0eCcff38e5DB60471",
    "coingeckoId": "matic-network",
    "decimals": 18
  },
  "RBN": {
    "address": "0x2ed2acF6E66f6b34cB83d6f5Ea5Fb97898e62b9A",
    "coingeckoId": "ribbon-finance",
    "decimals": 18
  },
  "SNX": {
    "address": "0x3932124F30204DE056F7E6A6F4c070ba950Ad3e4",
    "coingeckoId": "havven",
    "decimals": 18
  },
  "STETH": {
    "address": "0x0AB3Ee1f014C75579a8B20F7e6690F18a98740d2",
    "coingeckoId": "staked-ether",
    "decimals": 18
  },
  "UNI": {
    "address": "0xa4218f0591c0D6afCb71d7070CA0178F8488Cd73",
    "coingeckoId": "uniswap",
    "decimals": 18
  },
  "USDC": {
    "address": "0x8623C22c571F6fe9494Fe80277848a4901aDD8ba",
    "coingeckoId": "usd-coin",
    "decimals": 6
  },
  "USDT": {
    "address": "0x6AE467061A81636aA153385977f865D1b9A956FE",
    "coingeckoId": "tether",
    "decimals": 6
  },
  "WBTC": {
    "address": "0x7Bcf24B72e70b2251E9A43448Fbdbe255E589C59",
    "coingeckoId": "wrapped-bitcoin",
    "decimals": 8
  },
  "WETH": {
    "address": "0xB6d381409fE32b416D29D9A4C377eC31BE19C303",
    "coingeckoId": "weth",
    "decimals": 18
  },
  "WOO": {
    "address": "0xDF38cD69e30bd2c090a9CE9a466c0aA8E03e2488",
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
  "BTRFLY": {
    "address": "0xc55126051b22ebb829d00368f4b12bde432de5da",
    "coingeckoId": "redacted",
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
  "TUSD": {
    "address": "0x0000000000085d4780b73119b644ae5ecd22b376",
    "coingeckoId": "",
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
      underlyingDecimals: 6,
      coingeckoId: "compound-usd-coin",
    },
    "5": {
      address: "0x73506770799Eb04befb5AaE4734e58C2C624F493",
      decimals: 8,
      underlyingDecimals: 6,
      coingeckoId: "compound-usd-coin",
    },
  },
  CUSDT: {
    "1": {
      address: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
      decimals: 8,
      underlyingDecimals: 6,
      coingeckoId: "compound-usdt",
    },
    // "5": {
    //   address: "0x5A74332C881Ea4844CcbD8458e0B6a9B04ddb716",
    //   decimals: 8,
    //   underlyingDecimals: 6,
    //   coingeckoId: "compound-usdt",
    // },
  },
  CDAI: {
    "1": {
      address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "cdai",
    },
    // "5": {
    //   address: "0x0545a8eaF7ff6bB6F708CbB544EA55DBc2ad7b2a",
    //   decimals: 8,
    //   underlyingDecimals: 18,
    //   coingeckoId: "cdai",
    // },
  },
  CETH: {
    "1": {
      address: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "compound-ether",
    },
    "5": {
      address: "0x64078a6189Bf45f80091c6Ff2fCEe1B15Ac8dbde",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "compound-ether",
    },
  },
  CLINK: {
    "1": {
      address: "0xFAce851a4921ce59e912d19329929CE6da6EB0c7",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "compound-chainlink-token",
    },
    // "5": {
    //   address: "0x73506770799Eb04befb5AaE4734e58C2C624F493",
    //   decimals: 8,
    //   underlyingDecimals: 18,
    //   coingeckoId: "compound-chainlink-token",
    // },
  },
  CUNI: {
    "1": {
      address: "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "compound-uniswap",
    },
    // "5": {
    //   address: "0x2073d38198511F5Ed8d893AB43A03bFDEae0b1A5",
    //   decimals: 8,
    //   underlyingDecimals: 18,
    //   coingeckoId: "compound-uniswap",
    // },
  },
  CTUSD: {
    "1": {
      address: "0x12392F67bdf24faE0AF363c24aC620a2f67DAd86",
      decimals: 8,
      underlyingDecimals: 18,
      coingeckoId: "",
    },
    // "5": {
    //   address: "0x73506770799Eb04befb5AaE4734e58C2C624F493",
    //   decimals: 8,
    //   underlyingDecimals: 18,
    //   coingeckoId: "",
    // },
  },
  CWBTC: {
    "1": {
      address: "0xccF4429DB6322D5C611ee964527D42E5d685DD6a",
      decimals: 8,
      underlyingDecimals: 8,
      coingeckoId: "compound-wrapped-btc",
    },
    // "5": {
    //   address: "0xDa6F609F3636062E06fFB5a1701Df3c5F1ab3C8f",
    //   decimals: 8,
    //   underlyingDecimals: 8,
    //   coingeckoId: "compound-wrapped-btc",
    // },
  },
};

const aaveMarkets = {
  AUSDC: {
    "1": {
      address: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
      decimals: 6,
      underlyingDecimals: 6,
      coingeckoId: "aave-usdc",
    },
    "5": {
      address: "0x935c0F6019b05C787573B5e6176681282A3f3E05",
      decimals: 6,
      underlyingDecimals: 6,
      coingeckoId: "aave-usdc",
    },
  },
  AUSDT: {
    "1": {
      address: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
      decimals: 6,
      underlyingDecimals: 6,
      coingeckoId: "aave-usdt",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 6,
    //   underlyingDecimals: 6,
    //   coingeckoId: "aave-usdt",
    // },
  },
  ADAI: {
    "1": {
      address: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
      decimals: 18,
      underlyingDecimals: 18,
      coingeckoId: "aave-dai",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 18,
    //   underlyingDecimals: 18,
    //   coingeckoId: "aave-dai",
    // },
  },
  AETH: {
    "1": {
      address: "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
      decimals: 18,
      underlyingDecimals: 18,
      coingeckoId: "aave-weth",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 18,
    //   underlyingDecimals: 18,
    //   coingeckoId: "aave-weth",
    // },
  },
  ALINK: {
    "1": {
      address: "0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0",
      decimals: 18,
      underlyingDecimals: 18,
      coingeckoId: "aave-link",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 18,
    //   underlyingDecimals: 18,
    //   coingeckoId: "aave-link",
    // },
  },
  AUNI: {
    "1": {
      address: "0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1",
      decimals: 18,
      underlyingDecimals: 18,
      coingeckoId: "aave-uni",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 18,
    //   underlyingDecimals: 18,
    //   coingeckoId: "aave-uni",
    // },
  },
  ATUSD: {
    "1": {
      address: "0x101cc05f4a51c0319f570d5e146a8c625198e636",
      decimals: 18,
      underlyingDecimals: 18,
      coingeckoId: "aave-tusd",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 18,
    //   underlyingDecimals: 18,
    //   coingeckoId: "aave-tusd",
    // },
  },
  AWBTC: {
    "1": {
      address: "0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656",
      decimals: 8,
      underlyingDecimals: 8,
      coingeckoId: "aave-wbtc",
    },
    // "5": {
    //   address: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    //   decimals: 8,
    //   underlyingDecimals: 8,
    //   coingeckoId: "aave-wbtc",
    // },
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
  TUSD_USD: '0xec746eCF986E2927Abd291a2A1716c940100f8Ba',
};

const uniswapV3PoolAddresses = {
  RBN_ETH: '0x94981F69F7483AF3ae218CbfE65233cC3c60d93a', // TVL ~2.5M USD
  ETH_BTRFLY: '0x3e6E23198679419cD73bB6376518dCc5168c8260',
  AGEUR_USDC: '0x735a26a57A0A0069dfABd41595A970faF5E1ee8b',
  USDC_BDAMM: '0x1971f78a7636632101e06931e0856be2f9bceC02',
  USDC_DAMM: '0x9481b31eCc2EE62F9D3165ab4bFe5E9064CA4e7A',
  /* ---- Test pools ---- */
  USDC_ETH: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
  ETH_USDT: '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36',
};

const uniswapV2PoolAddresses = {
  WOO_ETH: '0x6AdA49AECCF6E556Bb7a35ef0119Cc8ca795294A', // TVL ~3M USD
  AGEUR_ANGLE: '0x1f4c763BdE1D4832B3EA0640e66Da00B98831355', // TVL ~1M USD
  CNV_DAI: '0x84d53cba013d0163bb07d65d5123d1634bc2a575',
  /* ---- Test pools ---- */
  USDC_ETH: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
  ETH_USDT: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
};

const bdammPoolInfo = {
  type: 'univ3',
  address: '0x1971f78a7636632101e06931e0856be2f9bceC02',
  decimals: 18,
};

const dammPoolInfo = {
  type: 'univ3',
  address: '0x9481b31eCc2EE62F9D3165ab4bFe5E9064CA4e7A',
  decimals: 18,
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
  'ADAI',
  'ATUSD',
  'CUSDC',
  'CTUSD',
  'CDAI',
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
  bdammPoolInfo,
  dammPoolInfo,
};
