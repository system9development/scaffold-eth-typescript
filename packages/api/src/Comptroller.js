const ethers = require('ethers');
const { provider, networkConfig } = require('./config');

const Comptroller = new ethers.Contract(
  networkConfig['Unitroller'].address,
  networkConfig['ComptrollerImplementation'].abi,
  provider,
);

module.exports = Comptroller;
