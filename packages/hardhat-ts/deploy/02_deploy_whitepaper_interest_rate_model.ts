import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('WhitePaperInterestRateModel', {
    from: deployer,
    log: true,
    args: [
      // values taken from live contract at https://etherscan.io/address/0x0c3f8df27e1a00b47653fde878d68d35f00714c0#readContract
      ethers.BigNumber.from('20000000000000000'),
      ethers.BigNumber.from('100000000000000000'),
    ],
  });
};
export default func;
func.tags = ['WhitePaperInterestRateModel'];
