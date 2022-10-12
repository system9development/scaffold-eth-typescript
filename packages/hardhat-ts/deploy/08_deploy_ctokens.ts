/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { CErc20Delegate as ICTokenDelegate } from 'generated/contract-types/CErc20Delegate';
import { ComptrollerG7 as IComptroller } from 'generated/contract-types/ComptrollerG7';
import { EIP20Interface as IERC20 } from 'generated/contract-types/EIP20Interface';
import { JumpRateModelV2 as IJumpRateModelV2 } from 'generated/contract-types/JumpRateModelV2';
import { Unitroller as IUnitroller } from 'generated/contract-types/Unitroller';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import {
  mainnetTokens,
  IMainnetMetaData,
  STABLECOIN_UNDERLYING_SYMBOLS_SET,
  CHAIN_ID as CHAIN_ID_ORIG,
  aaveMarkets,
  compoundMarkets,
  IExternalDeployment,
} from '../../api/src/config';

const CHAIN_ID = CHAIN_ID_ORIG === 31336 ? 1 : CHAIN_ID_ORIG;

// const { HARDHAT_TARGET_NETWORK } = process.env;
// const tokenData = ['mainnet', 'homestead'].includes(HARDHAT_TARGET_NETWORK ?? '') ? mainnetTokens : goerliTokens;
const tokenData = mainnetTokens;
const aaveTokenEntries = Object.entries(aaveMarkets as { [key: string]: IExternalDeployment});
const compoundTokenEntries = Object.entries(compoundMarkets as { [key: string]: IExternalDeployment});

// unused:
const dTokens: string[] = [];

const getExternalUnderlyingDataFromSymbol: (symbol: string) => Promise<[string, number]> = async (symbol) => {
  const existingContract = await ethers.getContractOrNull<IERC20>(symbol);
  if (existingContract) {
    return [ existingContract.address, await existingContract.decimals() ];
  }
  if (CHAIN_ID === 1 || CHAIN_ID === 5) {
    if (symbol in tokenData) {
      return [tokenData[symbol].address, tokenData[symbol].decimals];
    }
    if (symbol in aaveMarkets) {
      const { address, decimals } = aaveMarkets[symbol][CHAIN_ID];
      return [ address, decimals ];
    }
  }
  if (symbol in compoundMarkets) {
    if (CHAIN_ID === 1 || CHAIN_ID === 5) {
      const { address, decimals } = compoundMarkets[symbol][CHAIN_ID];
      return [ address, decimals ];
    } else {
      const dTokenUnderlying = await ethers.getContractOrNull(symbol.replace(/^C/, 'd'));
      if (dTokenUnderlying) {
        return [dTokenUnderlying.address, 8];
      }
    }
  }
  throw new Error(`could not get underlying data for ${symbol}`);
}

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployerSigner = await ethers.getNamedSigner('deployer');
  // const signer = await ethers.getSigner(deployer);
  const Unitroller = await ethers.getContract<IUnitroller>('Unitroller');
  const USDT = (await ethers.getContractOrNull('USDT'))?.address ?? tokenData.USDT.address;
  const USDC = (await ethers.getContractOrNull('USDC'))?.address ?? tokenData.USDC.address;
  // const BDAMM = await ethers.getContract('BDAMM');
  const StablecoinIRM = await ethers.getContract<IJumpRateModelV2>('StablecoinIRM');
  const WethWbtcIRM = await ethers.getContract<IJumpRateModelV2>('WethWbtcIRM');
  const AltcoinIRM = await ethers.getContract<IJumpRateModelV2>('AltcoinIRM');
  const Comptroller = (await ethers.getContract<IComptroller>('ComptrollerImplementation', deployer))
    .attach(Unitroller.address);
  const CTokenDelegate = await ethers.getContract<ICTokenDelegate>('CErc20Delegate');

  const currentlySupportedMarkets = new Set((await Comptroller.callStatic.getAllMarkets()).map(ethers.utils.getAddress));
  // get list of token symbols and decimals from tokenList
  const [tokenList, decimalList] = Object
    .entries(tokenData as { [key: string]: IMainnetMetaData})
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
  for (let i = 0; i < aaveTokenEntries.length; i += 1) {
    const [ aTokenSymbol, aTokenData ] = aaveTokenEntries[i];
    if (CHAIN_ID === 1 || CHAIN_ID === 5) {
      const aTokenChainData = aTokenData[CHAIN_ID];
      if (aTokenChainData) {
        tokenList.push(aTokenSymbol);
        decimalList.push(aTokenChainData.decimals as number);
      }
    }
  }
  for (let i = 0; i < compoundTokenEntries.length; i += 1) {
    const [ cTokenSymbol, cTokenData ] = compoundTokenEntries[i];
    if (CHAIN_ID === 1 || CHAIN_ID === 5) {
      const cTokenChainData = cTokenData[CHAIN_ID];
      if (compoundTokenEntries) {
        tokenList.push(cTokenSymbol);
        decimalList.push(cTokenChainData.decimals as number);
      }
    } else {
      const dTokenSymbol = cTokenSymbol.replace(/^C/, 'd');
      const dTokenMarket = await ethers.getContractOrNull<IERC20>(dTokenSymbol);
      if (dTokenMarket) {
        // the cToken can be spoofed on localnet with a matching dToken market
        tokenList.push(cTokenSymbol);
        decimalList.push(await dTokenMarket.decimals());
      }
    }
  }
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
  const newlyDeployedMarkets = new Set<string>();
  for (let i = 0; i < tokenList.length; i += 1) {
    const symbol = tokenList[i];
    const decimals = decimalList[i];
    const existingDtokenContract = await ethers.getContractOrNull<ICTokenDelegate>(`d${symbol}`, deployer);
    if (!existingDtokenContract) {
      newlyDeployedMarkets.add(`d${symbol}`);
    }
    if (existingDtokenContract) {
      // In case this market was already deployed, update the IRM if changed
      const interestRateModelAddress = symbol === 'WETH' || symbol === 'WBTC'
        ? WethWbtcIRM.address
        : STABLECOIN_UNDERLYING_SYMBOLS_SET.has(symbol)
        ? StablecoinIRM.address
        : AltcoinIRM.address;
      if ( interestRateModelAddress !== await existingDtokenContract.interestRateModel()) {
        console.log(`updating interest rate model for d${symbol} to ${interestRateModelAddress}`);
        await (await existingDtokenContract._setInterestRateModel(interestRateModelAddress)).wait();
      }
    } else if (symbol === 'USDT') {
      await deploy('dUSDT', {
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
      dTokens.push('dUSDT');
    } else if (symbol === 'USDC') {
      await deploy('dUSDC', {
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
      dTokens.push('dUSDC');
    } else if (symbol !== 'ETH') {
      const [underlyingAddress] = await getExternalUnderlyingDataFromSymbol(symbol);
      // Determine which interest rate model to use for the token
      const IRMAddress = symbol === 'WETH' || symbol === 'WBTC'
        ? WethWbtcIRM.address
        : STABLECOIN_UNDERLYING_SYMBOLS_SET.has(symbol)
        ? StablecoinIRM.address
        : AltcoinIRM.address;
      await deploy(`d${symbol}`, {
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
    }

    const dTokenContract = await ethers.getContract<ICTokenDelegate>(`d${symbol}`, deployer);

    if (!currentlySupportedMarkets.has(ethers.utils.getAddress(dTokenContract.address))) {
      console.log(`adding d${symbol} to Comptroller active markets`);
      await (await Comptroller._supportMarket(dTokenContract.address)).wait();
      currentlySupportedMarkets.add(ethers.utils.getAddress(dTokenContract.address));
    } else {
      console.log(`Skipping Comptroller._supportMarkets for d${symbol}; already supported`);
    }
    // Set the reserve factor, if unset
    const currentReserveFactor = await dTokenContract.reserveFactorMantissa();
    if (currentReserveFactor.isZero()) {
      console.log(`setting reserve factor for d${symbol}`);
      await (await dTokenContract._setReserveFactor(ethers.utils.parseUnits('0.175'))).wait();
    } else {
      console.log(`Skipping d${symbol}._setReserveFactor: already set to ${ethers.utils.formatEther(currentReserveFactor)}`);
    }

    const currentTotalSupply = await dTokenContract.totalSupply();
    if (currentTotalSupply.isZero()) {
      const underlyingAddress = await dTokenContract.underlying();
      const underlyingContract = new ethers.Contract(
        underlyingAddress,
        JSON.stringify([
          "function decimals() view returns (uint8)",
          "function approve(address, uint256)",
          "function symbol() view returns (string)"
        ]),
        deployerSigner,
      );
      const underlyingDecimals: number = await underlyingContract.decimals();
      const underlyingSymbol: string = await underlyingContract.symbol();
      const underlyingAmountToMintString = '0.0001';
      const underlyingAmountToMint = ethers.utils.parseUnits(underlyingAmountToMintString, underlyingDecimals);
      console.log(`Approving spend of ${underlyingSymbol} to market ${dTokenContract.address}`);
      await (await underlyingContract.approve(dTokenContract.address, underlyingAmountToMint)).wait();
      console.log(`minting 0.0001 ${underlyingSymbol} of d${symbol}`);
      await (await dTokenContract.mint(underlyingAmountToMint)).wait();
      const deployerBalance = await dTokenContract.balanceOf(deployer);
      const totalSupply = await dTokenContract.totalSupply();
      if (totalSupply.isZero() || !(totalSupply.eq(deployerBalance))) {
        console.error(`total supply of d${symbol} changed during initial seed. Deployer balance is ${deployerBalance}. total supply is ${totalSupply}`);
        process.exit(1);
      }
    } else if (newlyDeployedMarkets.has(`d${symbol}`)) {
      console.log(`d${symbol} was deployed in this run, but the total supply is not zero. Check manually to ensure attacker did not mint`);
      process.exit(1);
    }
    dTokens.push(`d${symbol}`);
  }
};
export default func;
// func.tags = dTokens;
func.tags = ['core'];
