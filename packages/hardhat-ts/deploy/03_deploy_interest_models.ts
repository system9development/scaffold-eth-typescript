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
  const BN = ethers.BigNumber;
  // const signer = await ethers.getSigner(deployer);
  await deploy('WhitePaperInterestRateModel', {
    from: deployer,
    log: true,
    args: [BN.from('42048000000000000000000'), BN.from('210240000000000000000000')],
  });
  await deploy('JumpRateModelV2', {
    from: deployer,
    log: true,
    args: [0, BN.from('50000000000000000'), BN.from('1090000000000000000'), BN.from('800000000000000000'), deployer],
  });
};
export default func;
func.tags = ['JumpRateModelV2', 'WhitePaperInterestRateModel'];
