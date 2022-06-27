const { ethers } = require('ethers');
const { provider, networkConfig } = require('./config');

const Lens = new ethers.Contract(
  networkConfig['Lens'].address,
  networkConfig['Lens'].abi,
  provider
);

module.exports = Lens;
