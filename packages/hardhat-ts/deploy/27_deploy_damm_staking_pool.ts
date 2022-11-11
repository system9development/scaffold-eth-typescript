/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { Dammtroller as IDammtroller } from 'generated/contract-types/Dammtroller';
import { DammtrollerProxy as IDammtrollerProxy } from 'generated/contract-types/DammtrollerProxy';
import { EIP20Interface as IERC20 } from 'generated/contract-types/EIP20Interface';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';


const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const DAMM = (await ethers.getContract<IERC20>('DAMM', deployer))
    .attach((await ethers.getContract('DAMMProxy')).address);
  const DammtrollerProxy = await ethers.getContract<IDammtrollerProxy>('DammtrollerProxy', deployer);
  const Dammtroller = (await ethers.getContract<IDammtroller>('Dammtroller')).attach(DammtrollerProxy.address);
  const StablecoinIRM = await ethers.getContract('StablecoinIRM');
  const CTokenDelegate = await ethers.getContract<ICTokenDelegate>('CErc20Delegate');
  await deploy('gdAMM', {
    contract: 'CErc20Delegator',
    from: deployer,
    log: true,
    args: [
      DAMM.address,
      Dammtroller.address,
      StablecoinIRM.address,
      ethers.utils.parseUnits('1', 28),
      'gdAMM',
      'GDAMM',
      8,
      deployer,
      CTokenDelegate.address,
      '0x',
    ],
  });
  const gdAMM = await ethers.getContract<ICTokenDelegate>('gdAMM', deployer);
  // const underlyingContract = new ethers.Contract(
  //   underlyingAddress,
  //   JSON.stringify([
  //     "function decimals() view returns (uint8)",
  //     "function approve(address, uint256)",
  //     "function symbol() view returns (string)",
  //     "function balanceOf(address) view returns (uint256)"
  //   ]),
  //   deployerSigner,
  // );


  const currentlySupportedMarkets = new Set((await Dammtroller.callStatic.getAllMarkets()).map(ethers.utils.getAddress));

  if (!currentlySupportedMarkets.has(gdAMM.address)) {
    console.log('activating gdAMM');
    await (await Dammtroller._supportMarket(gdAMM.address)).wait();
  } else {
    console.log('Skipping Dammtroller._supportMarkets for gdAMM; already supported');
  }


  const gdammTotalSupply = await gdAMM.totalSupply();
  if (gdammTotalSupply.gt(0)) {
    console.log('Skipping gdAMM mint; initial supply of gdAMM already minted');
  } else {
    console.log('Minting initial supply of gdAMM');
    const balanceOfDAMM = await DAMM.balanceOf(deployer);
    if (balanceOfDAMM.lt(ethers.utils.parseEther('1'))) {
      console.log(`deployer does not have enough dAMM to mint initial gdAMM: ${balanceOfDAMM}`);
      process.exit(1);
    }
    const dammAmountToMint = ethers.utils.parseEther('1');
    console.log(`Approving spend of dAMM to gdAMM market ${gdAMM.address}`);
    await (await DAMM.approve(gdAMM.address, dammAmountToMint)).wait();
    console.log(`minting 1 gdAMM`);
    await (await gdAMM.mint(dammAmountToMint)).wait();
    const gdammBalance = await gdAMM.balanceOf(deployer);
    console.log(`deployer now has balance of ${ethers.utils.formatUnits(gdammBalance, 8)}`);
  }
}

export default func;
func.tags = ['dammtroller'];