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

  const { parseUnits } = ethers.utils;
  const dUSDC = await ethers.getContract<IUSDC>('dUSDC');
  const dUSDT = await ethers.getContract('dUSDT');
  const dETH = await ethers.getContract('dETH');
  // const dEther = await ethers.getContract('dETH');
  const previousPriceUSDC = await Oracle.getUnderlyingPrice(dUSDC.address);
  const previousPriceUSDT = await Oracle.getUnderlyingPrice(dUSDT.address);
  const previousPriceETH = await Oracle.getUnderlyingPrice(dETH.address);
  if (previousPriceUSDC.eq(0)) {
    console.log('setting underlying price for dUSDC');
    await (await Oracle.setUnderlyingPrice(dUSDC.address, parseUnits('1', 36 - 6))).wait();
  } else {
    console.log('underlying price for dUSDC is already set; skipping Oracle.setUnderlyingPrice call');
  }
  if (previousPriceUSDT.eq(0)) {
    console.log('setting underlying price for dUSDT');
    await (await Oracle.setUnderlyingPrice(dUSDT.address, parseUnits('1', 36 - 6))).wait();
  } else {
    console.log('underlying price for dUSDT is already set; skipping Oracle.setUnderlyingPrice call');
  }
  if (previousPriceETH.eq(0)) {
    console.log('setting underlying price for dETH to $1510');
    await (await Oracle.setUnderlyingPrice(dETH.address, parseUnits('1510', 36 - 18))).wait();
  } else {
    console.log('underlying price for dETH is already set; skipping Oracle.setUnderlyingPrice call');
  }
};

export default func;
func.tags = ['Oracle'];
