const ethers = require('ethers');
const { dammProvider, networkConfig } = require('./config');

const Comptroller = new ethers.Contract(
  networkConfig['Unitroller'].address,
  networkConfig['ComptrollerImplementation'].abi,
  dammProvider,
);

module.exports = Comptroller;
