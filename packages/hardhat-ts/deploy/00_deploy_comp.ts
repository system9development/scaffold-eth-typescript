import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

// const adminAddress = process.env.ADMIN_ADDRESS;
// if (typeof adminAddress !== 'string' || adminAddress.length !== 42) {
//   console.error('ADMIN_ADDRESS environment not supplied');
//   process.exit(1);
// }

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy('BDAMM', {
    contract: 'Comp',
    from: deployer,
    log: true,
    args: [deployer],
  });
};
export default func;
func.tags = ['BDAMM'];
