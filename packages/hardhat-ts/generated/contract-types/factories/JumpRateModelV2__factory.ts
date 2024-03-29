/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  JumpRateModelV2,
  JumpRateModelV2Interface,
} from "../JumpRateModelV2";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseRatePerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "multiplierPerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "jumpMultiplierPerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "kink_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "baseRatePerBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "multiplierPerBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "jumpMultiplierPerBlock",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "kink",
        type: "uint256",
      },
    ],
    name: "NewInterestParams",
    type: "event",
  },
  {
    inputs: [],
    name: "baseRatePerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "blocksPerYear",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrows",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserves",
        type: "uint256",
      },
    ],
    name: "getBorrowRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrows",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserves",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserveFactorMantissa",
        type: "uint256",
      },
    ],
    name: "getSupplyRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isInterestRateModel",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "jumpMultiplierPerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kink",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "multiplierPerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseRatePerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "multiplierPerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "jumpMultiplierPerYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "kink_",
        type: "uint256",
      },
    ],
    name: "updateJumpRateModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrows",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserves",
        type: "uint256",
      },
    ],
    name: "utilizationRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161072d38038061072d83398101604081905261002f91610112565b600080546001600160a01b0319166001600160a01b038316179055848484848461005b8585858561006a565b505050505050505050506101bc565b610077622819a08561016d565b60025561008781622819a061018f565b610099670de0b6b3a76400008561018f565b6100a3919061016d565b6001556100b3622819a08361016d565b60038190556004829055600254600154604080519283526020830191909152810191909152606081018290527f6960ab234c7ef4b0c9197100f5393cfcde7c453ac910a27bd2000aa1dd4c068d9060800160405180910390a150505050565b600080600080600060a0868803121561012a57600080fd5b855160208701516040880151606089015160808a0151939850919650945092506001600160a01b038116811461015f57600080fd5b809150509295509295909350565b60008261018a57634e487b7160e01b600052601260045260246000fd5b500490565b60008160001904831182151516156101b757634e487b7160e01b600052601160045260246000fd5b500290565b610562806101cb6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80638da5cb5b116100715780638da5cb5b1461011d578063a385fb9614610148578063b816881614610152578063b9f9850a14610165578063f14039de1461016e578063fd2da3391461017757600080fd5b806315f24053146100ae5780632037f3e7146100d45780632191f92a146100e95780636e71e2d8146101015780638726bb8914610114575b600080fd5b6100c16100bc366004610448565b610180565b6040519081526020015b60405180910390f35b6100e76100e2366004610474565b610197565b005b6100f1600181565b60405190151581526020016100cb565b6100c161010f366004610448565b610216565b6100c160015481565b600054610130906001600160a01b031681565b6040516001600160a01b0390911681526020016100cb565b6100c1622819a081565b6100c1610160366004610474565b610259565b6100c160035481565b6100c160025481565b6100c160045481565b600061018d8484846102d5565b90505b9392505050565b6000546001600160a01b031633146102045760405162461bcd60e51b815260206004820152602660248201527f6f6e6c7920746865206f776e6572206d61792063616c6c20746869732066756e60448201526531ba34b7b71760d11b606482015260840160405180910390fd5b610210848484846103a0565b50505050565b60008260000361022857506000610190565b8161023384866104bc565b61023d91906104d4565b61024f670de0b6b3a7640000856104eb565b61018d919061050a565b60008061026e83670de0b6b3a76400006104d4565b9050600061027d8787876102d5565b90506000670de0b6b3a764000061029484846104eb565b61029e919061050a565b9050670de0b6b3a7640000816102b58a8a8a610216565b6102bf91906104eb565b6102c9919061050a565b98975050505050505050565b6000806102e3858585610216565b9050600454811161032457600254670de0b6b3a76400006001548361030891906104eb565b610312919061050a565b61031c91906104bc565b915050610190565b6000600254670de0b6b3a764000060015460045461034291906104eb565b61034c919061050a565b61035691906104bc565b905060006004548361036891906104d4565b905081670de0b6b3a76400006003548361038291906104eb565b61038c919061050a565b61039691906104bc565b9350505050610190565b6103ad622819a08561050a565b6002556103bd81622819a06104eb565b6103cf670de0b6b3a7640000856104eb565b6103d9919061050a565b6001556103e9622819a08361050a565b60038190556004829055600254600154604080519283526020830191909152810191909152606081018290527f6960ab234c7ef4b0c9197100f5393cfcde7c453ac910a27bd2000aa1dd4c068d9060800160405180910390a150505050565b60008060006060848603121561045d57600080fd5b505081359360208301359350604090920135919050565b6000806000806080858703121561048a57600080fd5b5050823594602084013594506040840135936060013592509050565b634e487b7160e01b600052601160045260246000fd5b600082198211156104cf576104cf6104a6565b500190565b6000828210156104e6576104e66104a6565b500390565b6000816000190483118215151615610505576105056104a6565b500290565b60008261052757634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220a548432cb527959cd846b755df01799babace4d5548cc118065be8318b1864c764736f6c634300080d0033";

type JumpRateModelV2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: JumpRateModelV2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class JumpRateModelV2__factory extends ContractFactory {
  constructor(...args: JumpRateModelV2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "JumpRateModelV2";
  }

  deploy(
    baseRatePerYear: BigNumberish,
    multiplierPerYear: BigNumberish,
    jumpMultiplierPerYear: BigNumberish,
    kink_: BigNumberish,
    owner_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<JumpRateModelV2> {
    return super.deploy(
      baseRatePerYear,
      multiplierPerYear,
      jumpMultiplierPerYear,
      kink_,
      owner_,
      overrides || {}
    ) as Promise<JumpRateModelV2>;
  }
  getDeployTransaction(
    baseRatePerYear: BigNumberish,
    multiplierPerYear: BigNumberish,
    jumpMultiplierPerYear: BigNumberish,
    kink_: BigNumberish,
    owner_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      baseRatePerYear,
      multiplierPerYear,
      jumpMultiplierPerYear,
      kink_,
      owner_,
      overrides || {}
    );
  }
  attach(address: string): JumpRateModelV2 {
    return super.attach(address) as JumpRateModelV2;
  }
  connect(signer: Signer): JumpRateModelV2__factory {
    return super.connect(signer) as JumpRateModelV2__factory;
  }
  static readonly contractName: "JumpRateModelV2";
  public readonly contractName: "JumpRateModelV2";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): JumpRateModelV2Interface {
    return new utils.Interface(_abi) as JumpRateModelV2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): JumpRateModelV2 {
    return new Contract(address, _abi, signerOrProvider) as JumpRateModelV2;
  }
}
