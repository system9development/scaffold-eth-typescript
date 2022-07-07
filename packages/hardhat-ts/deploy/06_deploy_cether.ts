import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { WhitePaperInterestRateModel as IWhitePaperInterestRateModel } from 'generated/contract-types/WhitePaperInterestRateModel';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const BN = ethers.BigNumber;

  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const WhitePaperInterestRateModel = await ethers.getContract<IWhitePaperInterestRateModel>('WhitePaperInterestRateModel');
  const CEther = await deploy('dETH', {
    contract: 'CEther',
    from: deployer,
    log: true,
    args: [
      Comptroller.address,
      WhitePaperInterestRateModel.address,
      BN.from('200000000000000000000000000'),
      'dToken Ether',
      'dETH',
      8,
      deployer,
    ],
  });
  await Comptroller._supportMarket(CEther.address);
};

export default func;
func.tags = ['dETH'];
