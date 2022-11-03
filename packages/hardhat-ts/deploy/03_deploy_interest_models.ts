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
  // Initialized targeting flat borrow rate of 12%
  await deploy('StablecoinIRMFlat12', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.1133286894'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 9%
  await deploy('StablecoinIRMFlat9', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.086177699244'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 10.8%
  await deploy('StablecoinIRMFlat10_8', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.102556590984'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 8.4%
  await deploy('StablecoinIRMFlat8_4', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.080657903232'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 10.5%
  await deploy('StablecoinIRMFlat10_5', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.099845335944'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 8.2%
  await deploy('StablecoinIRMFlat8_2', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.078811181352'), 0, 0, parseEther('1'), deployer],
  });
  // Initialized targeting flat borrow rate of 7.5%
  await deploy('StablecoinIRMFlat7_5', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.072320658642'), 0, 0, parseEther('1'), deployer],
  });
  // Borrow rate of 5.0%
  await deploy('IRMFlat5_0', {
    contract: 'JumpRateModelV2',
    from: deployer,
    log: true,
    args: [parseEther('0.048790165536'), 0, 0, parseEther('1'), deployer],
  });
};
export default func;
func.tags = ['core'];
