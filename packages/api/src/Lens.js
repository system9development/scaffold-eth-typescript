const { ethers } = require('ethers');
const { dammProvider, networkConfig } = require('./config');

const Lens = new ethers.Contract(
  networkConfig['Lens'].address,
  networkConfig['Lens'].abi,
  dammProvider,
);

module.exports = Lens;
