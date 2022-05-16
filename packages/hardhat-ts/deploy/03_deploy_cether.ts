import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const adminAddress = process.env.ADMIN_ADDRESS;
if (typeof adminAddress !== 'string' || adminAddress.length !== 42) {
  console.error('ADMIN_ADDRESS environment not supplied');
  process.exit(1);
}

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const Comptroller = await ethers.getContract('ComptrollerG7', deployer);
  const WhitePaperInterestRateModel = await ethers.getContract('WhitePaperInterestRateModel', deployer);
  await deploy('CEther', {
    from: deployer,
    log: true,
    args: [
      Comptroller.address,
      WhitePaperInterestRateModel.address,
      // values taken from live contract at https://etherscan.io/token/0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5#readContract
      // initial exchange rate mantissa
      ethers.BigNumber.from('200000000000000000000000000'),
      // name
      'Compound Ether',
      // token
      'cETH',
      // decimals:
      8,
      adminAddress,
    ],
  });
};
export default func;
func.tags = ['CEther'];
