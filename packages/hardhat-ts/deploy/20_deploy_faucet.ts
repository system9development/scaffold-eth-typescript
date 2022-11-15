import { Faucet as IFaucet } from 'generated/contract-types/Faucet';
import { USDC as IUSDC } from 'generated/contract-types/USDC';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { mainnetTokens } from '../../api/src/config';

/*
  for a token symbol, return [string, Contract] or [string, undefined]
  depending on whether hardhat has already deployed this token
*/
const getContractEntries = async (symbol: string): Promise<[string, IUSDC]> => [
  symbol,
  await ethers.getContract<IUSDC>(symbol),
];

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { parseUnits } = ethers.utils;

  const tokenList = Object.keys(mainnetTokens).filter((t) => t !== 'ETH');
  const tokenContractEntries = await Promise.all(tokenList.map(getContractEntries));

  await deploy('Faucet', {
    from: deployer,
    log: true,
    contract: 'Faucet',
    args: [tokenContractEntries.map(([, contract]) => contract.address)],
  });

  const Faucet = await ethers.getContract<IFaucet>('Faucet');

  for (let i = 0; i < tokenList.length; i += 1) {
    const [symbol, token] = tokenContractEntries[i];
    const faucetBalance = await token.balanceOf(Faucet.address);
    const amount = ethers.utils.parseUnits('100000', mainnetTokens[symbol].decimals);
    if (faucetBalance.isZero() && symbol !== 'USDT') {
      if ((await token.balanceOf(deployer)).gt(amount)) {
        console.log(`transferring 100,000 ${symbol} to faucet`);
        await token.transfer(Faucet.address, amount);
      } else {
        console.log(`minting 100,000 ${symbol} to faucet`);
        await (await token.mint(Faucet.address, parseUnits('100000', mainnetTokens[symbol].decimals))).wait();
      }
    }
  }
};

export default func;
func.tags = ['underlyings'];