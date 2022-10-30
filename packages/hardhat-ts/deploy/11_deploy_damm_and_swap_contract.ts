import { DAMM as IDAMM } from 'generated/contract-types/DAMM';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('DAMM', {
    from: deployer,
    log: true,
    contract: 'DAMM',
  });
  const dammImplementation = await ethers.getContract<IDAMM>('DAMM');
  await deploy('DAMMProxy', {
    from: deployer,
    log: true,
    contract: 'DAMMProxy',
    args: [
      ethers.utils.id('initialize()').substring(0, 10),
      dammImplementation.address,
    ],
  });
};

export default func;
func.tags = ['core', 'damm'];
