const contractsConfig = require('../../common/src/generated/hardhat_contracts.json');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

dotenv.config();

const NETWORK_URL = process.env.ETHERS_NETWORK_URL || 'http://localhost:8545';
const CHAIN_ID = parseInt(process.env.ETHERS_CHAIN_ID) || 31337;
const NETWORK_NAME = process.env.ETHERS_NETWORK_NAME || 'localhost';

const provider = new ethers.providers.JsonRpcProvider(
  NETWORK_URL,
  {
    name: NETWORK_NAME,
    chainId: CHAIN_ID
  }
);

const networkConfig = contractsConfig[CHAIN_ID]?.find((config) => config.name === NETWORK_NAME)?.contracts;

if (!networkConfig) {
  console.error(`no network config found for ${NETWORK_NAME} with chainID ${CHAIN_ID}}`);
  process.exit(1);
}

module.exports = {
  provider,
  networkConfig,
};
