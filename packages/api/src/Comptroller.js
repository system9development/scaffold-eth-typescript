const ethers = require('ethers');
const { dammProvider } = require('./config');
const networkConfig = require('./networkConfig');

const Comptroller = new ethers.Contract(
  networkConfig['Unitroller'].address,
  networkConfig['ComptrollerImplementation'].abi,
  dammProvider,
);

module.exports = Comptroller;
