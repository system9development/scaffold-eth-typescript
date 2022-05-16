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
  const Comp = await ethers.getContract('Comp', deployer);
  await deploy('ComptrollerG7', {
    from: deployer,
    log: true,
    args: [Comp.address, adminAddress],
  });
};
export default func;
func.tags = ['ComptrollerG7'];
