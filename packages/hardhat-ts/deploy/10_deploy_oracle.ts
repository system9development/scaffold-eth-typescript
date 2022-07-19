import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { SimplePriceOracle as IOracle } from 'generated/contract-types/SimplePriceOracle';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { USDC as IUSDC } from 'generated/contract-types/USDC';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('Oracle', {
    from: deployer,
    log: true,
    contract: 'SimplePriceOracle',
  });
  const Oracle = await ethers.getContract<IOracle>('Oracle');
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  console.log(`setting Comptroller price oracle to ${Oracle.address}`);
  await (await Comptroller._setPriceOracle(Oracle.address)).wait();

  const BN = ethers.BigNumber;
  const dUSDC = await ethers.getContract<IUSDC>('dUSDC');
  const dUSDT = await ethers.getContract('dUSDT');
  const dBDAMM = await ethers.getContract('dBDAMM');
  // const dEther = await ethers.getContract('dETH');
  console.log('setting underlying price for dUSDC');
  await (await Oracle.setUnderlyingPrice(dUSDC.address, BN.from('1000000000000000000'))).wait();
  console.log('setting underlying price for dUSDT');
  await (await Oracle.setUnderlyingPrice(dUSDT.address, BN.from('1000000000000000000'))).wait();
  // await Oracle.setUnderlyingPrice(dEther.address, BN.from('10100000000000000000000'));
  console.log('setting underlying price for dBDAMM to $2 (meaning BDAMM is considered to be $2)');
  await (await Oracle.setUnderlyingPrice(dBDAMM.address, BN.from('2000000000000000000'))).wait();
};

export default func;
func.tags = ['Oracle'];
