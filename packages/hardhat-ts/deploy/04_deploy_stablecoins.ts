import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { USDC as IUSDC } from '../generated/contract-types/USDC';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const BN = ethers.BigNumber;
  // const signer = await ethers.getSigner(deployer);
  await deploy('USDT', {
    contract: 'TetherToken',
    from: deployer,
    log: true,
    args: [BN.from('1000000000000'), 'Tether USD', 'USDT', 6],
  });
  await deploy('USDC', {
    from: deployer,
    log: true,
    args: ['USD Coin', 'USDC', 6],
  });
  const USDC = await ethers.getContract<IUSDC>('USDC');
  if ((await USDC.callStatic.balanceOf(deployer)).isZero()) {
    console.log(`Minting 1,000,000 USDC to deployer address ${deployer}`);
    await (await USDC.mint(deployer, BN.from('1000000000000'))).wait();
  } else {
    console.log('skipping USDC mint; deployer address already has USDC balance');
  }
};
export default func;
func.tags = ['underlyings'];