import { DAMM as IDAMM } from 'generated/contract-types/DAMM';
import { DAMMProxy as IProxy } from 'generated/contract-types/DAMMProxy';
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
  console.log('address', dammImplementation.address);
  const damm = await deploy('DAMMProxy', {
    from: deployer,
    log: true,
    contract: 'DAMMProxy',
    args: [
      ethers.utils.id('initialize()').substring(0, 10),
      dammImplementation.address,
    ]
  });
  const bdamm = await ethers.getContract('BDAMM');
  await deploy('Swap', {
    from: deployer,
    log: true,
    contract: 'Swap',
    args: [
      bdamm.address,
      damm.address
    ],
  });
};

export default func;
func.tags = ['core', 'damm'];
