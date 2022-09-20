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
  const Comptroller = await ethers.getContract<IComptroller>('ComptrollerImplementation');
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const currentImplementation = await Unitroller.callStatic.comptrollerImplementation();
  if (currentImplementation === Comptroller.address) {
    console.log('skipping Unitroller._setPendingImplementation; already set');
  } else {
    // updating comptroller implementation
    console.log(`setting Unitroller comptroller implementation to ${Comptroller.address}`)
    await (await Unitroller._setPendingImplementation(Comptroller.address)).wait();
    console.log(`Comptroller: becoming Unitroller at ${Unitroller.address}`);
    await (await Comptroller._become(Unitroller.address)).wait();
    if (await Comptroller.getCompAddress() !== await (Comptroller.attach(Unitroller.address).getCompAddress())) {
      console.log(`Updating comp address to ${await Comptroller.getCompAddress()}`);
      await (await Comptroller.attach(Unitroller.address).updateCompAddress()).wait();
    }
  }
};
export default func;
func.tags = ['core'];
