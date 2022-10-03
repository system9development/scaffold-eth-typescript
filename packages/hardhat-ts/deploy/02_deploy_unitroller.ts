import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ComptrollerG7 as IComptroller } from '../generated/contract-types/ComptrollerG7';
import { Unitroller as IUnitroller } from '../generated/contract-types/Unitroller';

// const adminAddress = process.env.ADMIN_ADDRESS;
// if (typeof adminAddress !== 'string' || adminAddress.length !== 42) {
//   console.error('ADMIN_ADDRESS environment not supplied');
//   process.exit(1);
// }

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  await deploy('Unitroller', {
    contract: 'Unitroller',
    from: deployer,
    log: true,
  });
  const ComptrollerImplementation = await ethers.getContract<IComptroller>('ComptrollerImplementation', deployer);
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller', deployer);
  const currentImplementation = await Unitroller.callStatic.comptrollerImplementation();
  if (currentImplementation === ComptrollerImplementation.address) {
    console.log('skipping Unitroller._setPendingImplementation; already set');
  } else {
    console.log(`setting Unitroller comptroller implementation to ${ComptrollerImplementation.address}`)
    await (await Unitroller._setPendingImplementation(ComptrollerImplementation.address)).wait();
    console.log(`Comptroller: becoming Unitroller at ${Unitroller.address}`);
    await (await ComptrollerImplementation._become(Unitroller.address)).wait();
  }
  const BDAMM = await ethers.getContract('BDAMM');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const compAddress = await Comptroller.getCompAddress();
  if (compAddress !== BDAMM.address) {
    console.error(`unitroller getCompAddress returned ${compAddress}, but BDAMM address is ${BDAMM.address}. Exiting.`);
    process.exit(1);
  }
};
export default func;
func.tags = ['core'];
