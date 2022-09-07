/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { JumpRateModelV2 as IJumpRateModelV2 } from 'generated/contract-types/JumpRateModelV2';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { mainnetTokens, goerliTokens, IMainnetMetaData } from '../../api/src/config';

const { HARDHAT_TARGET_NETWORK } = process.env;
const tokenData = ['mainnet', 'homestead'].includes(HARDHAT_TARGET_NETWORK || '') ? mainnetTokens : goerliTokens;

const dTokens: string[] = [];

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // const signer = await ethers.getSigner(deployer);
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const USDT = (await ethers.getContractOrNull('USDT'))?.address ?? tokenData.USDT.address;
  const USDC = (await ethers.getContractOrNull('USDC'))?.address ?? tokenData.USDC.address;
  // const BDAMM = await ethers.getContract('BDAMM');
  const StablecoinIRM = await ethers.getContract<IJumpRateModelV2>('StablecoinIRM');
  const WethWbtcIRM = await ethers.getContract<IJumpRateModelV2>('WethWbtcIRM');
  const AltcoinIRM = await ethers.getContract<IJumpRateModelV2>('AltcoinIRM');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation')).attach(Unitroller.address);
  const CTokenDelegate = await ethers.getContract<ICTokenDelegate>('CErc20Delegate');

  const currentlySupportedMarkets = new Set((await Comptroller.callStatic.getAllMarkets()).map(ethers.utils.getAddress));
  const [tokenList, decimalList] = Object.entries(tokenData as { [key: string]: IMainnetMetaData})
    .reduce<[string[], number[]]>((
      [symbolReduction, decimalReduction]: [string[], number[]],
      [curSymbol, curMetadata]: [string, { decimals: number }]
    ) => {
      if (curSymbol !== 'ETH') {
        symbolReduction.push(curSymbol);
        decimalReduction.push(curMetadata.decimals);
      }
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
    if (await ethers.getContractOrNull(`d${symbol}`)) {
      const dTokenContract = await ethers.getContract<ICTokenDelegate>(`d${symbol}`);
      // In case this market was already deployed, update the IRM if changed
      const interestRateModelAddress = symbol === 'WETH' || symbol === 'WBTC'
        ? WethWbtcIRM.address
        : ['USDC', 'USDT', 'DAI', 'AGEUR', 'FRAX'].includes(symbol)
        ? StablecoinIRM.address
        : AltcoinIRM.address;
      if ( interestRateModelAddress !== await dTokenContract.interestRateModel()) {
        console.log(`updating interest rate model for d${symbol} to ${interestRateModelAddress}`);
        await (await dTokenContract._setInterestRateModel(interestRateModelAddress)).wait();
      }
    } else if (symbol === 'USDT') {
      const dUSDT = await deploy('dUSDT', {
        contract: 'CErc20Delegator',
        from: deployer,
        log: true,
        args: [
          USDT,
          Comptroller.address,
          StablecoinIRM.address,
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
          USDC,
          Comptroller.address,
          StablecoinIRM.address,
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
      const underlyingAddress = (await ethers.getContractOrNull(symbol))?.address ?? tokenData[symbol].address;
      // Determine which interest rate model to use for the token
      const IRMAddress = symbol === 'WETH' || symbol === 'WBTC'
        ? WethWbtcIRM.address
        : symbol === 'DAI' || symbol === 'AGEUR' || symbol === 'FRAX'
        ? StablecoinIRM.address
        : AltcoinIRM.address;
      const dToken = await deploy(`d${symbol}`, {
        contract: 'CErc20Delegator',
        from: deployer,
        log: true,
        args: [
          underlyingAddress,
          Comptroller.address,
          IRMAddress,
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
    }

    const dTokenContract = await ethers.getContract<ICTokenDelegate>(`d${symbol}`);

    // Set the reserve factor, if unset
    const currentReserveFactor = await dTokenContract.reserveFactorMantissa();
    if (currentReserveFactor.isZero()) {
      console.log(`setting reserve factor for d${symbol}`);
      await (await dTokenContract._setReserveFactor(ethers.utils.parseUnits('0.175'))).wait();
    } else {
      console.log(`Skipping d${symbol}._setReserveFactor: already set to ${ethers.utils.formatEther(currentReserveFactor)}`);
    }
    dTokens.push(`d${symbol}`);
  }
};
export default func;
func.tags = dTokens;
