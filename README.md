# dAMM

This repo was created from scaffold-eth-typescript to manage contract deployments and testing.

Essentially, it uses hardhat (with hardhat-deploy) to manage the contracts.

The repo also contains code for running the API server


## Overview

- Contracts can be found in `packages/hardhat-ts/contracts`
- `hardhat-deploy` deployment scripts can be found in `packages/hardhat-ts/deploy`
- run `yarn hardhat` to get a list of all the tasks. Run `yarn hardhat taskname` to run the task.

## Important directories and files

- `.env`: Contains env shared by several applications and scripts in this repo
- `packages/hardhat-ts`: The main path for the dAMM contracts, deployment info, and configuration. Also a yarn workspace
- `scripts`: Contains deploy and redeploy bash scripts called by `yarn deploy` and `yarn redeploy`
  These delegate to `hardhat deploy` (via `yarn contracts:deploy` and `yarn contracts:redeploy`), and can modify tags used when deploying contracts.
  (hardhat-deploy works by calling an ordered series of deploy scripts which can be conditionally selected via these tags)
- `packages/hardhat-ts/deploy`: Contains the scripts to deploy dAMM to an ethereum-like node
- `packages/hardhat-ts/generated`: Contains generated artifacts from compilation and deployment (things like transaction receipts that hardhat-deploy needs).
- `packages/hardhat-ts/generated/deployments`: Contains a directory for each chain deployed to, containing deployment artifacts for the deployment on that chain. These are committed for mainnet and goerli, but shouldn't be committed for localhost or forked networks
- `packages/hardhat-ts/mnemonics/mnemonic.secret`: Contains a mnemonic to be used for deployments. This is shared by the team for ease of deploying to testnets, but should *only* be used on testnets (no actual funds). A new mnemonic can be generated if desired by running `yarn generate`
- `packages/hardhat-ts/generated/contract-types`: Contains Typechain-generated type files for interacting with the contracts
- `packages/hardhat-ts/scripts/jsonupdate.ts`: Contains some tooling for generating config files used by the front-end from deployment artifacts
- `packages/hardhat-ts/api/`: Contains the dAMM REST API subproject
- `packages/common/src/generated/hardhat_contracts.json`: Hardhat deploy stores all abis and addresses for deployed contracts in one file here

The interface for the `hardhat_contracts.json` file is as follows:

```
{
   [chainId: number]: {
      name: string;
      chainId: string;
      contracts: {
         [contractName: string]: {
            address: string;
            abi: ContractAbi;
         }
      }
   }[]
}
```

Note that the values indexed by number at the top level are *arrays* of length 1

### Commands to run

Running the app

1. install your dependencies, `open a new command prompt`

   ```bash
   yarn install
   ```

2. start a hardhat node

   ```bash
   yarn chain
   ```

3. 
   ```bash
   # build hardhat & external contracts types
   yarn contracts:build
   # deploy your hardhat contracts
   yarn deploy
   ```

5. other commands

   ```bash
   # rebuild all contracts, incase of inconsistent state
   yarn contracts:rebuild
   # run hardhat commands for the workspace, or see all tasks
   yarn hardhat 'xxx' # e.g. yarn hardhat console
   # run any subgraph commands for the workspace
   yarn subgraph 'xxx'
   ```

   Other folders

   ```bash
   # for subgraph
   packages/advanced/subgraph/
   packages/advanced/services/
   ```

## Environment Variables

Set the following in `.env`

```bash
#Required for market API. Invalid value OK for deploy
ALCHEMY_API_TOKEN=
#Required for market API, and for deploying to Gorli and Mainnet only:
INFURA_API_TOKEN=

#ETHERS_NETWORK_URL=https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_TOKEN}
#ETHERS_NETWORK_URL=https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_TOKEN}
ETHERS_NETWORK_URL=http://localhost:8545
#ETHERS_CHAIN_ID=5
ETHERS_CHAIN_ID=31336
#ETHERS_CHAIN_ID=1
#ETHERS_CHAIN_ID=31337
ETHERS_NETWORK_NAME=localfork
#ETHERS_NETWORK_NAME=mainnet
#ETHERS_NETWORK_NAME=gorli
#ETHERS_NETWORK_NAME=localhost
HARDHAT_TARGET_NETWORK=localfork
#HARDHAT_TARGET_NETWORK=gorli
#HARDHAT_TARGET_NETWORK=mainnet
#HARDHAT_TARGET_NETWORK=localhost


#Optional; for verifying contracts
ETHERSCAN_API_KEY=

#Required when deploying redemption contract (addresses below are prod, set to your own address in testing)
DAMM_REDEMPTION_FEE_ADMIN=0xaC0112A1696050e64E6DD52a7Bc783a8A4DCC534
DAMM_TREASURY_ADDRESS=0xCF9A82d1132Cd88607Ea7f98E5fa67C3872550Ce
```

## Deploying
### Deploying to a hardhat node (localnet):

- Ensure `ETHERS_NETWORK_NAME` and `HARDHAT_TARGET_NETWORK` above are set to `localhost`
- Ensure `ETHERS_NETWORK_URL` above is set to `http://localhost:8545`
- Ensure `ETHERS_CHAIN_ID` above is set to 31337
- Run `yarn chain` in one terminal to start the node.
- Run `yarn deploy` in another terminal to deploy contracts

The philosophy when deploying to a hardhat node is that the entire system should be deployed from scratch. Additionally, test tokens will be deployed to represent underlying tokens like USDC, etc.

### Deploying to goerli:

- Ensure `ETHERS_NETWORK_NAME` and `HARDHAT_TARGET_NETWORK` above are set to `gorli` (sic)
- Ensure `ETHERS_NETWORK_URL` above is set to `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_TOKEN}` (replace ALCHEMY_API_TOKEN)
- Ensure `ETHERS_CHAIN_ID` is set to 5
- Run `yarn deploy`

When deploying to Goerli, hardhat-deploy should read existing deployment information from `packages/hardhat-ts/generated/deployments/gorli/`, and new contracts will be deployed as specified by the deploy scripts.

With hardhat deploy, all deployed contracts are associated with a *handle*, or a string that references the contract deployment, and is used to reference the contract in hardhat-deploy generated metadata files.

For example, the code to deploy the comptroller implementation in the first deploy script is:

```
   await deploy('ComptrollerImplementation', {
   contract: 'ComptrollerG7',
   from: deployer,
   log: true,
   args: [BDAMM.address],
   });
```

Here, hardhat-deploy tracks the deployment with the name `ComptrollerImplementation`. When running `yarn hardhat deploy` multiple times for the same network, it should avoid redeploying this contract, as long as the deployment args, the contract bytecode, and the address of the deployer are the same.

If any of the above change, the contract will be re-deployed, and metadata used by hardhat-deploy to track the deployment will be updated accordingly.

Note that the shared testnet mnemonic is used to prevent redeploying to Goerli. If you run `yarn deploy` without any new contracts or changes, it should run through the deploy scripts without making any transactions (other than to update Oracle prices)

On the goerli deployment, like the hardhat node, tokens representing underlyings have been deployed

### Deploying to a fork of mainnet:

Before deploying to mainnet, the script changes should be run on a fork of mainnet to ensure nothing unexpected happens. For example, misconfiguration in the scripts can lead to redeploying contracts unintentionally, or calling functions which modify contract state in undesireable ways.

Typically the deploy scripts should check the state of a contract to see if it matches the intended state, before attempting to set it.

For example, when setting the interest rate model for a market, it should check if that interest rate model is already set, and only send a transaction to set it if it's unset, or set to the wrong interest rate model. This results in many read operations when running the deploy, but should prevent duplicate, unnecessary, or incorrect transactions.

To deploy a fork of mainnet to ensure there will be no unintended side effects from deploying to mainnet, do the following:

- Ensure you have the latest changes from the repo, specifically the files in `packages/hardhat-ts/generated/deployments/mainnet/`
- copy the above directory to a directory called `localfork/`, for example:

```
rm -r packages/hardhat-ts/generated/deployments/localfork \
&& cp -r \
  packages/hardhat-ts/generated/deployments/mainnet \
  packages/hardhat-ts/generated/deployments/localfork
```
- Change the `.chainId` file at `packages/hardhat-ts/generated/deployments/localfork/.chainId` to contain `31336` instead of `1`
- Change the `blockNumber` variable in the `hardhatNetworkConfig` definition in `packages/hardhat-ts/hardhat.config.ts` to reference a recent block number
- Set the following in `.env`:

```
ETHERS_NETWORK_NAME=localfork
HARDHAT_TARGET_NETWORK=localfork
ETHERS_CHAIN_ID=31336
ETHERS_NETWORK_URL=http://localhost:8545
```

- Start the hardhat node: `yarn chain`
- Some changes may be necessary in the hardhat or hardhat-deploy dependency `.js` files in `node_modules`. From my notes (may be incomplete):
```javascript
helpers.js:
    const availableAccounts = {'0xf2E055D3204aD73C7C51DE2668435B76C727a92f': true, '0xf2e055d3204ad73c7c51de2668435b76c727a92f': true};

DeploymentsManager.js
        if (this.network.autoImpersonate) {
            for (const address of [...unknownAccounts, '0xf2E055D3204aD73C7C51DE2668435B76C727a92f', '0xf2E055D3204aD73C7C51DE2668435B76C727a92f'.toLowerCase()]) {
                if (this.network.name === 'hardhat' || this.network.name === 'localfork') {
                    await this.network.provider.request({
// Still looking for a way to do the above without patching the hardhat code
```
- Connect to the hardhat console `yarn hardhat console` and run the following command to ensure the deployer can be impersonated:

```javascript
await hre.network.provider.request({
   method: "hardhat_impersonateAccount",
   params: ['0xf2E055D3204aD73C7C51DE2668435B76C727a92f']
})
```

- `yarn deploy`

When using a fork of mainnet, it may be useful to use some other hardhat-node-specific RPC commands to do things like simulate transactions. Here are some sample commands that might be useful:
### Deploying to mainnet:

* Mainnet deployment is managed by a deployer at address `0xf2E055D3204aD73C7C51DE2668435B76C727a92f` which is signed by a Ledger, using Frame.
* relevant `.env` variables should be set to `mainnet`, `1`, Alchemy RPC URL, etc.
* After deploying, changes to `packages/hardhat-ts/generated/deployments` as well as `packages/common/src/generated/hardhat_contracts.json` should be committed

Because the changes to all metadata files are tracked, this should allow users who don't have deployer access to do some kinds of investigation, such as:

* Forking mainnet and trying to call various functions as the deployer or other impersonated users (e.g. "what happens if the largest holder of gdAMM claims USDC?")
* Running the deploy script with the oracle deploy script skipped, to ensure no unintended transactions are made (the oracle deploy script will typically create a transaction, so that *does* need to be skipped)
* [callStatic](https://docs.ethers.io/v5/api/contract/contract/#contract-callStatic) on functions in hardhat console to evaluate "what would happen" without needing to impersonate an account


## Important notes about deployment:

### Patching the ComptrollerImplementation solidity code

Compound hardcoded the COMP token address in their ComptrollerG7 contract (the implementation contract for which Unitroller is the proxy). In order to make testing easier, we wanted this to be parameterized; however, we didn't have a good way to do this until later (used in the dammtroller contract for dAMM->gdAMM staking)

In dAMM, the `bdAMM` token fulfills the role of `Comp` in Compound. Therefore, we do the following in the Comptroller hardhat-deploy script when deploying the Comptroller, which might confuse people running `yarn deploy`:

- Get the deployed address of bdAMM and check the Comptroller solidity source to see if the `getComp()` function returns it (if you switched networks and/or deployer accounts it likely would have a different value)
- If the `getComp()` function body matches the `bdAMM` address, continue with the comptroller deployment. Otherwise, modify the ComptrollerG7.sol file with the correct address and exit the deployment (exiting is required because re-running `yarn deploy` will trigger recompilation of the changed `.sol` file)

In the Dammtroller/DammtrollerProxy (equivalents of Comptroller/Unitroller) we resolved the above issue without needing to exit the deploy script by adding a `_compAddress` address variable to the shared storage (defined in `packages/hardhat-ts/contracts/Dammtroller/ComptrollerStorage.sol`), setting it in the implementation's constructor(to the address of USDC), and setting it (to the address of USDC) in the proxy storage to the value of the implementation's `getCompAddress()` call when the proxy initially gets the implementation set.

### Oracle deployment

Since there are no liquidations in dAMM, it's not critical to have an accurate oracle price for all the tokens in the system.

Additionally, we didn't have a straightforward way to do this, since many of the tokens supported in dAMM do not have accurate chainlink or Univ2 price sources (Compound only supports tokens with both an on-chain USD-quoted Chainlink price feed and a liquid UniV2 pool, which is used as a fallback, so their oracle can't be used directly). Since the most accurate on-chain price sources for tokens supported by dAMM may be UniV2/UniV3 pools, or non-USD-quoted Chainlink price feeds, the necessary logic to maintain an accurate oracle would be more involved.

Nevertheless, it *is* useful to have a rough indication of the token prices in dAMM, since this is used to set a cap on approved borrows. Even with KYC'ed borrowers which have signed SLAs with us, setting the rough token prices makes it easier for them to avoid accidentally borrowing beyond their allowance.

The oracle prices are set in dAMM whenever the admin runs `yarn deploy`, and use REST API calls to off-chain prices sources to directly set the underlying prices in a modified version of Compound's SimplePriceOracle which takes an array of token addresses, and an array of prices to set all prices in one transaction

## Integration with other dAMM services

### Market API server

dAMM includes a REST API server which serves protocol information as JSON, modeled after the REST API server response used by Venus (since the frontend was forked from, it expected this information out of the box).

The code for the API server can be found at `packages/api`, and the config file at `packages/api/src/config.js` may need some additional configuration for on-chain price sources when new markets are added.

The following `.env` needs to be provided at `packages/api/.env` for the market API to work:

```
ETHERS_NETWORK_URL=https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_TOKEN}

#ETHERS_CHAIN_ID defaults to 31337
#ETHERS_CHAIN_ID=5
ETHERS_CHAIN_ID=1

#ETHERS_NETWORK_NAME defaults to 'localhost'
ETHERS_NETWORK_NAME=mainnet
HARDHAT_TARGET_NETWORK=mainnet

#Required:
ALCHEMY_API_TOKEN=
```

The latest data from this API can be obtained at `https://d3l3l1eop7lmql.cloudfront.net/data`, and this can also be read for a specific block number (if cached) by requesting `https://d3l3l1eop7lmql.cloudfront.net/data?blockNumber=XXXXXXX`

### Account screening API

For compliance purposes, we also maintain an account screening API at `https://chainalassist.herokuapp.com`

To generate the configuration for this service, you can run `yarn json:update path/to/chainalassist/lib/markets.json`

### dAMM frontend

The dAMM frontend is `https://app.damm.finance` and the code can be found at https://github.com/system9development/damm-frontend-venus

[Four configuration files](https://github.com/system9development/damm-frontend-venus/tree/master/src/constants/contracts/addresses) need to be maintained for the frontend to operate.

The configuration for `cErcTokens.json`, `main.json`, and `tokens.json` can be generated in this project by running `yarn json:update path/to/damm-frontend-venus/src/constants/contracts/xxxx.json`

## Overview of contract modifications from Compound

The following contracts from compound have been modified by us as follows:

### `ComptrollerG7.sol` and `ComptrollerStorage.sol`

* Added a borrower allow-list, and disabled borrows for users not in the allow-list.
* Added a borrower limit, and check the borrowers' total borrow "liquidity" to ensure it's under this limit in the borrower check
* Change hardcoded return value of `getCompAddress` (modified in deploy script, as described above)

### `Dammtroller.sol`, `DammtrollerProxy.sol`, `Dammtroller/ComptrollerStorage.sol`

These are copies of `ComptrollerG7.sol`, `Unitroller.sol`, `ComptrollerStorage.sol` with all changes described there, in addition to the changes described in the section [Patching the ComptrollerImplementation solidity code](#patching-the-comptrollerimplementation-solidity-code)

One additional change was made in the `claimComp` handling, to account for USDC having 6 decimals instead of 18 (like `Comp`/`bdAMM`): While the accounting on the Dammtroller contract uses 18 decimals to track users' redeemable USDC amounts, the amount will be divided by 1e12 in `grantCompInternal` when users claim, because USDC is only 6 decimals.
### `SimplePriceOracle.sol`

Same as compound's SimplePriceOracle, made Ownable (using OpenZeppelin Ownable contract) and with an owner-only external function:

```solidity
  function setDirectPrices(address[] calldata tokens, uint256[] calldata pricesToSet) external onlyOwner {
    require(tokens.length == pricesToSet.length, "tokens and prices must have the same length");
    for (uint i = 0; i < tokens.length; i ++) {
      setDirectPrice(tokens[i], pricesToSet[i]);
    }
  }
```

### `Comp.sol`

This is actually the bdAMM contract, a direct copy of Compound's Comp, but with a total supply of 250 million

## Original contracts in dAMM:

### `DAMM.sol` and `DAMMProxy.sol`

These constitute a basic, ownable ERC20 which is upgradeable using the UUCP proxy pattern (using OpenZeppelin contracts)

### `Redemption.sol`

A contract which handles bdAMM -> dAMM redemptions, where the user supplies 1 `bdAMM` and an admin-configurable amount of USDC to redeem one `dAMM`