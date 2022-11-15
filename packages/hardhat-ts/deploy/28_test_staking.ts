/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { Dammtroller as IDammtroller } from 'generated/contract-types/Dammtroller';
import { DammtrollerProxy as IDammtrollerProxy } from 'generated/contract-types/DammtrollerProxy';
import { EIP20Interface as IERC20 } from 'generated/contract-types/EIP20Interface';
import { USDC as IUSDC } from 'generated/contract-types/USDC';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';


const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts } = hre;
  const namedAccounts = await getNamedAccounts();
  const { deployer } = namedAccounts;
  const DAMM = (await ethers.getContract<IERC20>('DAMM', deployer))
    .attach((await ethers.getContract('DAMMProxy')).address);
  const DammtrollerProxy = await ethers.getContract<IDammtrollerProxy>('DammtrollerProxy', deployer);
  const Dammtroller = (await ethers.getContract<IDammtroller>('Dammtroller')).attach(DammtrollerProxy.address);

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

  console.log('minting gdamm from 10 users');
  for (let i = 1; i <= 10; i++) {
    const amount = ethers.utils.parseEther((1000 * i).toString());
    await (await DAMM.transfer(namedAccounts[`user${i}`], amount)).wait();
    const dammConnected = DAMM.connect(await ethers.getSigner(namedAccounts[`user${i}`]));
    const gdammConnected = gdAMM.connect(await ethers.getSigner(namedAccounts[`user${i}`]));
    await (await dammConnected.approve(gdAMM.address, amount)).wait()
    await (await gdammConnected.mint(amount)).wait();
  }
  console.log('fast forwarding 65536 blocks')
  await hre.network.provider.send("hardhat_mine", ["0x10000"]);
  console.log('setting compspeed');
  await (await Dammtroller._setCompSpeed(gdAMM.address, ethers.utils.parseUnits('0.021111', 18))).wait();
  console.log('minting more gdamm');
  for (let i = 1; i <= 10; i++) {
    const amount = ethers.utils.parseEther((1000 * i).toString());
    await (await DAMM.transfer(namedAccounts[`user${i}`], amount)).wait();
    const dammConnected = DAMM.connect(await ethers.getSigner(namedAccounts[`user${i}`]));
    const gdammConnected = gdAMM.connect(await ethers.getSigner(namedAccounts[`user${i}`]));
    await (await dammConnected.approve(gdAMM.address, amount)).wait()
    await (await gdammConnected.mint(amount)).wait();
  }
  const usdc = await ethers.getContract<IUSDC>('USDC')
  const user1 = namedAccounts.user1;
  console.log(`claiming as user1, USDC balance ${ethers.utils.formatUnits(await usdc.balanceOf(user1), 6)}`);
  await (await Dammtroller['claimComp(address[],address[],bool,bool)']([user1], [gdAMM.address], false, true)).wait();
  console.log(`claim complete, new balance ${ethers.utils.formatUnits(await usdc.balanceOf(user1), 6)}`);
}

export default func;
func.tags = ['test'];