import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { JumpRateModelV2 as IJumpRateModelV2 } from 'generated/contract-types/JumpRateModelV2';
import { TetherToken as IUSDT } from 'generated/contract-types/TetherToken';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { USDC as IUSDC } from 'generated/contract-types/USDC';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';


const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const BN = ethers.BigNumber;
  // const signer = await ethers.getSigner(deployer);
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const USDT = await ethers.getContract<IUSDT>('USDT');
  const USDC = await ethers.getContract<IUSDC>('USDC');
  const COMP = await ethers.getContract('Comp');
  const JumpRateModelV2 = await ethers.getContract<IJumpRateModelV2>('JumpRateModelV2');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const CTokenDelegate = await ethers.getContract<ICTokenDelegate>('CErc20Delegate');

  // cUSDT:
  const cUSDT = await deploy('cUSDT', {
    contract: 'CErc20Delegator',
    from: deployer,
    log: true,
    args: [
      USDT.address,
      Comptroller.address,
      JumpRateModelV2.address,
      BN.from('200000000000000'),
      'Compound Tether USD',
      'cUSDT',
      8,
      deployer,
      CTokenDelegate.address,
      '0x',
    ],
  });
  // cUSDC:
  const cUSDC = await deploy('cUSDC', {
    contract: 'CErc20Delegator',
    from: deployer,
    log: true,
    args: [
      USDC.address,
      Comptroller.address,
      JumpRateModelV2.address,
      BN.from('200000000000000'),
      'Compound USD Coin',
      'cUSDC',
      8,
      deployer,
      CTokenDelegate.address,
      '0x',
    ],
  });

  // cCOMP:
  const cCOMP = await deploy('cCOMP', {
    contract: 'CErc20Delegator',
    from: deployer,
    log: true,
    args: [
      COMP.address,
      Comptroller.address,
      JumpRateModelV2.address,
      BN.from('200000000000000000000000000'),
      'Compound COMP',
      'cCOMP',
      8,
      deployer,
      CTokenDelegate.address,
      '0x',
    ],
  });
  await Comptroller._supportMarket(cUSDT.address);
  await Comptroller._supportMarket(cUSDC.address);
  await Comptroller._supportMarket(cCOMP.address);
};
export default func;
func.tags = ['cUSDT', 'cUSDC', 'cCOMP'];
