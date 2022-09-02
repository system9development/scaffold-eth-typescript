const { ethers } = require('ethers');
const { dammProvider } = require('./config');
const networkConfig = require('./networkConfig');

const Lens = new ethers.Contract(
  networkConfig['Lens'].address,
  networkConfig['Lens'].abi,
  dammProvider,
);

module.exports = Lens;
