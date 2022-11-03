import { DAMM as IDAMM } from 'generated/contract-types/DAMM';
import { Redemption as IRedemption } from 'generated/contract-types/Redemption';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import {
  mainnetTokens,
  DAMM_TREASURY_ADDRESS,
  DAMM_REDEMPTION_FEE_ADMIN,
  CHAIN_ID as CHAIN_ID_ORIG,
} from '../../api/src/config';

// const CHAIN_ID = CHAIN_ID_ORIG === 31336 ? 1 : CHAIN_ID_ORIG;

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('DAMM', {
    from: deployer,
    log: true,
    contract: 'DAMM',
  });
  const dammImplementation = await ethers.getContract<IDAMM>('DAMM');
  await deploy('DAMMProxy', {
    from: deployer,
    log: true,
    contract: 'DAMMProxy',
    args: [
      ethers.utils.id('initialize()').substring(0, 10),
      dammImplementation.address,
    ]
  });
  const dammProxy = await ethers.getContract<IDAMM>('DAMMProxy');
  const damm = dammImplementation.attach(dammProxy.address);
  const bdamm = await ethers.getContract('BDAMM');
  const usdcAddress = (await ethers.getContractOrNull('USDC'))?.address ?? mainnetTokens.USDC.address;
  await deploy('Redemption', {
    from: deployer,
    log: true,
    contract: 'Redemption',
    args: [
      bdamm.address,
      damm.address,
      usdcAddress,
      DAMM_REDEMPTION_FEE_ADMIN !== '' && typeof DAMM_REDEMPTION_FEE_ADMIN === 'string' ? DAMM_REDEMPTION_FEE_ADMIN : deployer,
      DAMM_TREASURY_ADDRESS !== '' && typeof DAMM_TREASURY_ADDRESS === 'string' ? DAMM_TREASURY_ADDRESS : deployer,
      ethers.utils.parseUnits('0.3', 6),
    ],
  });
  if (CHAIN_ID_ORIG !== 1) {
    // If we're not deploying to mainnet, save a step for testing and seed the redemption contract with 100 DAMM
    const redemption = await ethers.getContract<IRedemption>('Redemption');
    const usdcFeesCollected = await redemption.totalUSDCFees();
    if (usdcFeesCollected.isZero()) {
      await damm.transfer(redemption.address, ethers.utils.parseEther('100'));
    }
  }
};

export default func;
func.tags = ['core', 'damm'];
