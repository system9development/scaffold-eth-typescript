import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { CHAIN_ID } from '../../api/src/config';
import { Dammtroller as IDammtroller } from '../generated/contract-types/Dammtroller';
import { DammtrollerProxy as IDammtrollerProxy } from '../generated/contract-types/DammtrollerProxy';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const USDCAddress = CHAIN_ID === 1 || CHAIN_ID === 31336
    ? '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    : (await ethers.getContract('USDC')).address;
  
  await deploy('Dammtroller', {
    contract: 'Dammtroller',
    from: deployer,
    log: true,
    args: [USDCAddress],
  });
  await deploy('DammtrollerProxy', {
    contract: 'DammtrollerProxy',
    from: deployer,
    log: true,
  });
  const DammtrollerImplementation = await ethers.getContract<IDammtroller>('Dammtroller', deployer);
  const DammtrollerProxy = await ethers.getContract<IDammtrollerProxy>('DammtrollerProxy', deployer);
  const currentImplementation = await DammtrollerProxy.callStatic.comptrollerImplementation();
  if (currentImplementation === DammtrollerImplementation.address) {
    console.log('skipping DammtrollerProxy._setPendingImplementation; already set');
  } else {
    console.log(`setting DammtrollerProxy Dammtroller implementation to ${DammtrollerImplementation.address}`)
    await (await DammtrollerProxy._setPendingImplementation(DammtrollerImplementation.address)).wait();
    console.log(`Dammtroller: becoming DammtrollerProxy at ${DammtrollerProxy.address}`);
    await (await DammtrollerImplementation._become(DammtrollerProxy.address)).wait();
  }
  const Dammtroller = (await ethers.getContract<IDammtroller>('Dammtroller')).attach(DammtrollerProxy.address);
  const compAddress = await Dammtroller.getCompAddress();
  if (compAddress !== USDCAddress) {
    console.error(`Dammtroller getCompAddress returned ${compAddress}, but USDC address is ${USDCAddress}. Exiting.`);
    process.exit(1);
  }
};
export default func;
func.tags = ['dammtroller'];
