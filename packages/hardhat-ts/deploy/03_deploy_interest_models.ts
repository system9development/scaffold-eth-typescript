import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

// const adminAddress = process.env.ADMIN_ADDRESS;
// if (typeof adminAddress !== 'string' || adminAddress.length !== 42) {
//   console.error('ADMIN_ADDRESS environment not supplied');
//   process.exit(1);
// }

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { parseEther } = ethers.utils;
  // const signer = await ethers.getSigner(deployer);
  await deploy('StablecoinIRM', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [0, parseEther('0.125'), parseEther('0.75'), parseEther('0.8'), deployer],
  });
  await deploy('WethWbtcIRM', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [0, parseEther('0.05'), parseEther('0.425'), parseEther('0.8'), deployer],
  });
  await deploy('AltcoinIRM', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [0, parseEther('0.15'), parseEther('0.9'), parseEther('0.8'), deployer],
  });
};
export default func;
func.tags = ['core'];
