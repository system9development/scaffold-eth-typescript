const { mainnetTokens, dammProvider } = require('../api/src/config');

/*
  Takes a list of addresses via the command line, and seeds them with
  ETH and underlying tokens (as needed)
*/

const addressesToSeed = process.env.SEED_ARGS.split(' ')
  .map((address) => {
    try {
      return ethers.utils.getAddress(address);
    } catch (e) {
      return false;
    }
  }).filter(Boolean);

console.log(`seeding ${addressesToSeed}`);
const main = async () => {
  const deployer = await ethers.getNamedSigner('deployer');
  const tokenEntries = Object.entries(mainnetTokens);
  for (let i = 0; i < tokenEntries.length; i += 1) {
    const [token, metadata] = tokenEntries[i];
    const contract = token === 'ETH' ? null : await ethers.getContract(token);
    if (!(['USDC', 'USDT', 'ETH'].includes(token))) {
      // seed deployer:
      const deployerBalance = await contract.balanceOf(deployer.address);
      const deployerBalanceFormatted = ethers.utils.formatUnits(deployerBalance, metadata.decimals);
      if (parseFloat(deployerBalanceFormatted) <= (addressesToSeed.length * 1000000)) {
        console.log(`minting 1 million ${token} to deployer`);
        await (await contract.mint(deployer.address, ethers.utils.parseUnits('1000000', metadata.decimals))).wait();
      } else {
        console.log(`deployer has ${deployerBalanceFormatted} ${token}`);
      }
    }
    for (let i = 0; i < addressesToSeed.length; i += 1) {
      const address = addressesToSeed[i];
      if (!contract) {
        // 'token' is actually ETH
        const addressBalance = await dammProvider.getBalance(address);
        if (addressBalance.lt((1e16).toString())) {
          if (dammProvider?.network?.chainId === 31337) {
            console.log(`sending 1 ETH to ${addressBalance}`);
            await (await deployer.sendTransaction({ to: address, value: ethers.utils.parseEther("1.0")})).wait();
          } else {
            console.log(`sending 0.1 ETH to ${addressBalance}`);
            await (await deployer.sendTransaction({ to: address, value: ethers.utils.parseEther("0.1")})).wait();
          }
        } else {
          console.log(`address ${address} has ${ethers.utils.formatEther(addressBalance)} ETH`);
        }
      } else {
        const addressBalance = await contract.balanceOf(address);
        if (addressBalance.isZero()) {
          console.log(`sending 1000 ${token} to ${address}`);
          await (await contract.transfer(address, ethers.utils.parseUnits('1000', metadata.decimals))).wait();
        } else {
          console.log(`${address} has balance of ${addressBalance.toString()} ${token}`);
        }
      }
    };
  };    
};

main();
