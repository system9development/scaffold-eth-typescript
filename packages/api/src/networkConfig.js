const CHAIN_ID = process.env.ETHERS_CHAIN_ID ? parseInt(process.env.ETHERS_CHAIN_ID) : 31337;
const NETWORK_NAME = process.env.ETHERS_NETWORK_NAME === 'localfork'
  ? 'mainnet'
  :  (process.env.ETHERS_NETWORK_NAME || 'localhost');

const contractsConfig = require('../../common/src/generated/hardhat_contracts.json');
const networkConfig = contractsConfig[CHAIN_ID]?.find((config) => config.name === NETWORK_NAME)?.contracts;

if (!networkConfig || !networkConfig['Unitroller'] || !networkConfig['gdAMM']) {
  console.error(`no network config found for ${NETWORK_NAME} with chainID ${CHAIN_ID}`);
  process.exit(1);
}

module.exports = networkConfig;
