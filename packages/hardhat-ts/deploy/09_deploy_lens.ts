// import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('Lens', {
    from: deployer,
    log: true,
    contract: 'CompoundLens',
  });
  // const existingLens = await ethers.getContractOrNull('Lens');
  // if (existingLens === null) {
  //   await deploy('Lens', {
  //     from: deployer,
  //     log: true,
  //     contract: 'CompoundLens',
  //   });
  // } else {
  //   console.log('Skipping Lens deployment; already deployed');
  // }
};

export default func;
func.tags = ['core'];
