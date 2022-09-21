import fs from 'fs';

import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const PATH_TO_COMPTROLLER_SOL = '../hardhat-ts/contracts/ComptrollerG7.sol';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const BDAMM = await ethers.getContract('BDAMM');
  // If BDAMM was deployed/redeployed in the previous step, replace address in contract and exit
  const comptrollerContractCode = fs.readFileSync(PATH_TO_COMPTROLLER_SOL).toString();
  const comptrollerContractCodeUpdated = comptrollerContractCode
    .replace(/return 0x[a-fA-F0-9]{40};/, `return ${BDAMM.address};`);
  if (comptrollerContractCode === comptrollerContractCodeUpdated) {
    await deploy('ComptrollerImplementation', {
      contract: 'ComptrollerG7',
      from: deployer,
      log: true,
      args: [BDAMM.address],
    });
  } else {
    fs.writeFileSync(PATH_TO_COMPTROLLER_SOL, comptrollerContractCodeUpdated);
    console.error(`Updating ComptrollerG7.sol with new BDAMM address ${BDAMM.address}.`);
    console.error('Run `yarn deploy` again to trigger rebuild and deploy');
    console.error("IMPORTANT: If this is a mainnet deployment, the updated ComptrollerG7.sol should be committed\nafter re-running to prevent redeploys");
    process.exit(1);
  }
};
export default func;
func.tags = ['core'];
