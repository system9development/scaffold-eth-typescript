// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

import './helpers/hardhat-imports';

import path from 'path';

import { hardhatNamedAccounts } from '@scaffold-eth/common/src/constants';
import { getNetworks } from '@scaffold-eth/common/src/functions';
import { config as envConfig } from 'dotenv';
import glob from 'glob';
import { removeConsoleLog } from 'hardhat-preprocessor';
import { HardhatUserConfig } from 'hardhat/config';

import { getMnemonic } from './tasks/functions/mnemonic';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * NOTES:
 * - All the task are located in the tasks folder
 * - network definitions are in getNetworks in the '@scaffold-eth/common/src workspace: `'@scaffold-eth/common/src/functions`
 * - Named hardhat accounts are in the '@scaffold-eth/common/src workspace: `'@scaffold-eth/common/src/constants`
 * - Files generated by hardhat will be outputted to the ./generated folder
 */

// this loads the .env file into process.env
envConfig({ path: '../vite-app-ts/.env' });

/**
 * this loads all the tasks from the tasks folder
 */
if (process.env.BUILDING !== 'true') {
  glob.sync('./tasks/**/*.ts').forEach((file: string) => {
    require(path.resolve(file));
  });
}

/**
 * Set your target network!!!
 */
console.log('HARDHAT_TARGET_NETWORK: ', process.env.HARDHAT_TARGET_NETWORK);

/**
 * loads network list and config from '@scaffold-eth/common/src
 */
const networks = {
  ...getNetworks({
    accounts: {
      mnemonic: getMnemonic(),
      accountsBalance: '10000000000000000000000',
    },
  }),
  localhost: {
    url: 'http://localhost:8545',
    /*
      if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
      (you can put in a mnemonic here to set the deployer locally)
    */
    accounts: {
      mnemonic: getMnemonic(),
      accountsBalance: '10000000000000000000000',
    },
  },
  hardhat: {
    accounts: {
      mnemonic: getMnemonic(),
      accountsBalance: '10000000000000000000000',
    },
  },
};

/**
 * See {@link hardhatNamedAccounts} to define named accounts
 */
const namedAccounts = hardhatNamedAccounts as {
  [name: string]: string | number | { [network: string]: null | number | string };
};

export const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog((hre) => hre.network.name !== 'hardhat' && hre.network.name !== 'localhost'),
  },
  defaultNetwork: process.env.HARDHAT_TARGET_NETWORK,
  namedAccounts: namedAccounts,
  networks: networks,
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
      {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
      {
        version: '0.8.13',
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
      {
        version: '0.4.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
    ],
  },
  mocha: {
    bail: false,
    allowUncaught: false,
    require: ['ts-node/register'],
    timeout: 30000,
    slow: 9900,
    reporter: process.env.GITHUB_ACTIONS === 'true' ? 'mocha-junit-reporter' : 'spec',
    reporterOptions: {
      mochaFile: 'testresult.xml',
      toConsole: true,
    },
  },
  watcher: {
    'auto-compile': {
      tasks: ['compile'],
      files: ['./contracts'],
      verbose: false,
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
  },
  dodoc: {
    runOnCompile: false,
    debugMode: false,
    keepFileStructure: true,
    freshOutput: true,
    outputDir: './generated/docs',
    include: ['contracts'],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: './generated/contract-types',
  },
};
export default config;
