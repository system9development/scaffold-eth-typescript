import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { JumpRateModelV2 as IJumpRateModelV2 } from 'generated/contract-types/JumpRateModelV2';
import { TetherToken as IUSDT } from 'generated/contract-types/TetherToken';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { USDC as IUSDC } from 'generated/contract-types/USDC';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { mainnetTokens } from '../../api/src/config';


const dTokens: string[] = [];

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const USDT = mainnetTokens.USDT;
  const USDC = mainnetTokens.USDC;
  // const BDAMM = await ethers.getContract('BDAMM');
  const JumpRateModelV2 = await ethers.getContract<IJumpRateModelV2>('JumpRateModelV2');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const CTokenDelegate = await ethers.getContract<ICTokenDelegate>('CErc20Delegate');

  const currentlySupportedMarkets = new Set((await Comptroller.callStatic.getAllMarkets()).map(ethers.utils.getAddress));

  const [tokenList, decimalList] = Object.entries(mainnetTokens)
    .reduce<[string[], number[]]>((
      [symbolReduction, decimalReduction]: [string[], number[]],
      [curSymbol, curMetadata]: [string, { decimals: number }]
    ) => {
      symbolReduction.push(curSymbol);
      decimalReduction.push(curMetadata.decimals);
      return [symbolReduction, decimalReduction];
    }, [[], []]);

  // BDAMM and cBDAMM don't have mainnet equivalents yet.
  // const dBDAMM = await deploy('dBDAMM', {
  //   contract: 'CErc20Delegator',
  //   from: deployer,
  //   log: true,
  //   args: [
  //     BDAMM.address,
  //     Comptroller.address,
  //     JumpRateModelV2.address,
  //     BN.from('200000000000000000000000000'),
  //     'dToken Bonded dAMM',
  //     'dBDAMM',
  //     8,
  //     deployer,
  //     CTokenDelegate.address,
  //     '0x',
  //   ],
  // });

  // if (!currentlySupportedMarkets.has(ethers.utils.getAddress(dBDAMM.address))) {
  //   console.log('adding dBDAMM to Comptroller active markets');
  //   await (await Comptroller._supportMarket(dBDAMM.address)).wait();
  //   currentlySupportedMarkets.add(ethers.utils.getAddress(dBDAMM.address));
  // } else {
  //   console.log('Skipping Comptroller._supportMarkets for dBDAMM; already supported');
  // }
  // dTokens.push('dBDAMM');
  for (let i = 0; i < tokenList.length; i += 1) {
    const symbol = tokenList[i];
    const decimals = decimalList[i];
    if (symbol === 'USDT') {
      const dUSDT = await deploy('dUSDT', {
        contract: 'CErc20Delegator',
        from: deployer,
        log: true,
        args: [
          USDT.address,
          Comptroller.address,
          JumpRateModelV2.address,
          ethers.utils.parseUnits('0.02', 10 + decimals),
          'dToken Tether USD',
          'dUSDT',
          8,
          deployer,
          CTokenDelegate.address,
          '0x',
        ],
      });
      if (!currentlySupportedMarkets.has(ethers.utils.getAddress(dUSDT.address))) {
        console.log('adding dUSDT to Comptroller active markets');
        await (await Comptroller._supportMarket(dUSDT.address)).wait();
        currentlySupportedMarkets.add(ethers.utils.getAddress(dUSDT.address));
      } else {
        console.log('Skipping Comptroller._supportMarkets for dUSDT; already supported');
      }
      dTokens.push('dUSDT');
    } else if (symbol === 'USDC') {
      const dUSDC = await deploy('dUSDC', {
        contract: 'CErc20Delegator',
        from: deployer,
        log: true,
        args: [
          USDC.address,
          Comptroller.address,
          JumpRateModelV2.address,
          ethers.utils.parseUnits('0.02', 10 + decimals),
          'dToken USD Coin',
          'dUSDC',
          8,
          deployer,
          CTokenDelegate.address,
          '0x',
        ],
      });
      if (!currentlySupportedMarkets.has(ethers.utils.getAddress(dUSDC.address))) {
        console.log('adding dUSDC to Comptroller active markets');
        await (await Comptroller._supportMarket(dUSDC.address)).wait();
        currentlySupportedMarkets.add(ethers.utils.getAddress(dUSDC.address));
      } else {
        console.log('Skipping Comptroller._supportMarkets for dUSDC; already supported');
      }
      dTokens.push('dUSDC');
    } else if (symbol !== 'ETH') {
      const contract = mainnetTokens[symbol];
      const dToken = await deploy(`d${symbol}`, {
        contract: 'CErc20Delegator',
        from: deployer,
        log: true,
        args: [
          contract.address,
          Comptroller.address,
          JumpRateModelV2.address,
          ethers.utils.parseUnits('0.02', 10 + decimals),
          `dToken ${symbol}`,
          `d${symbol}`,
          8,
          deployer,
          CTokenDelegate.address,
          '0x',
        ],
      });
      if (!currentlySupportedMarkets.has(ethers.utils.getAddress(dToken.address))) {
        console.log(`adding d${symbol} to Comptroller active markets`);
        await (await Comptroller._supportMarket(dToken.address)).wait();
        currentlySupportedMarkets.add(ethers.utils.getAddress(dToken.address));
      } else {
        console.log(`Skipping Comptroller._supportMarkets for d${symbol}; already supported`);
      }
      dTokens.push(`d${symbol}`);
    }
  }
};
export default func;
func.tags = dTokens;
