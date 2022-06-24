import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { SimplePriceOracle as IOracle } from 'generated/contract-types/SimplePriceOracle';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
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
  await Comptroller._setPriceOracle(Oracle.address);

  const BN = ethers.BigNumber;
  const cUSDC = await ethers.getContract('cUSDC');
  const cUSDT = await ethers.getContract('cUSDC');
  const cCOMP = await ethers.getContract('cCOMP');
  const cEther = await ethers.getContract('CEther');
  await Oracle.setUnderlyingPrice(cUSDC.address, BN.from('1000000000000000000'));
  await Oracle.setUnderlyingPrice(cUSDT.address, BN.from('1000000000000000000'));
  await Oracle.setUnderlyingPrice(cEther.address, BN.from('10100000000000000000000'));
  await Oracle.setUnderlyingPrice(cCOMP.address, BN.from('2000000000000000000'));
};

export default func;
func.tags = ['Oracle'];
