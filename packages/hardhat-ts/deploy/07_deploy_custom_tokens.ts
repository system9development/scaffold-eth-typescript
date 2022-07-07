import { ethers as Ethers } from 'ethers';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { mainnetTokens } from '../../api/src/config';

/*
  for a token symbol, return [string, Contract] or [string, undefined]
  depending on whether hardhat has already deployed this token
*/
const getContractEntries = async (symbol: string): Promise<[string, Ethers.Contract | undefined]> => {
  const contract = ethers.getContract(symbol)
    .then((contract): [string, Ethers.Contract] => [symbol, contract])
    .catch((): [string, undefined] => [symbol, undefined])
  return await contract;
};

const tokenList = Object.keys(mainnetTokens).filter((t) => t !== 'ETH')

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const tokenList = Object.keys(mainnetTokens).filter((t) => t !== 'ETH')
  const tokenContractEntries = (await Promise.all(tokenList.map(getContractEntries)))
    .filter((entry): entry is [string, Ethers.Contract] => Boolean(entry[1]));
  const tokenContracts: {[key: string]: Ethers.Contract} = Object.fromEntries(tokenContractEntries);
  // const deployedTokens = Object.keys(tokenContracts);
  for (let i = 0; i < tokenList.length; i += 1) {
    const symbol = tokenList[i];
    if (symbol in mainnetTokens && !(symbol in tokenContracts)) {
      await deploy(symbol, {
        contract: 'USDC',
        from: deployer,
        log: true,
        args: [symbol, symbol, mainnetTokens[symbol].decimals],
      });
    }
  }
};

export default func;
func.tags = tokenList;