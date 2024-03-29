/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  GovernorBravoDelegateStorageV1,
  GovernorBravoDelegateStorageV1Interface,
} from "../GovernorBravoDelegateStorageV1";

const _abi = [
  {
    inputs: [],
    name: "admin",
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
    inputs: [],
    name: "comp",
    outputs: [
      {
        internalType: "contract CompInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
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
    inputs: [],
    name: "initialProposalId",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "latestProposalIds",
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
    name: "pendingAdmin",
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
    inputs: [],
    name: "proposalCount",
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
    name: "proposalThreshold",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "forVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "againstVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "abstainVotes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "canceled",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "timelock",
    outputs: [
      {
        internalType: "contract TimelockInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingDelay",
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
    name: "votingPeriod",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102d6806100206000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80635c60da1b116100715780635c60da1b14610203578063b58131b014610216578063d33219b41461021f578063da35c66414610232578063f851a4401461023b578063fc4eee421461024e57600080fd5b8063013cf08b146100b957806302a251a314610185578063109d0af81461019c57806317977c61146101c757806326782247146101e75780633932abb1146101fa575b600080fd5b61012a6100c7366004610257565b600a60208190526000918252604090912080546001820154600283015460078401546008850154600986015496860154600b870154600c9097015495976001600160a01b0390951696939592949193919290919060ff808216916101009004168a565b604080519a8b526001600160a01b0390991660208b0152978901969096526060880194909452608087019290925260a086015260c085015260e084015215156101008301521515610120820152610140015b60405180910390f35b61018e60045481565b60405190815260200161017c565b6009546101af906001600160a01b031681565b6040516001600160a01b03909116815260200161017c565b61018e6101d5366004610270565b600b6020526000908152604090205481565b6001546101af906001600160a01b031681565b61018e60035481565b6002546101af906001600160a01b031681565b61018e60055481565b6008546101af906001600160a01b031681565b61018e60075481565b6000546101af906001600160a01b031681565b61018e60065481565b60006020828403121561026957600080fd5b5035919050565b60006020828403121561028257600080fd5b81356001600160a01b038116811461029957600080fd5b939250505056fea2646970667358221220c2dc9f1e270c7633b20fe01f865a3433eb3061e25a6b470b46f2108492135d2a64736f6c634300080d0033";

type GovernorBravoDelegateStorageV1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovernorBravoDelegateStorageV1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovernorBravoDelegateStorageV1__factory extends ContractFactory {
  constructor(...args: GovernorBravoDelegateStorageV1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "GovernorBravoDelegateStorageV1";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<GovernorBravoDelegateStorageV1> {
    return super.deploy(
      overrides || {}
    ) as Promise<GovernorBravoDelegateStorageV1>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): GovernorBravoDelegateStorageV1 {
    return super.attach(address) as GovernorBravoDelegateStorageV1;
  }
  connect(signer: Signer): GovernorBravoDelegateStorageV1__factory {
    return super.connect(signer) as GovernorBravoDelegateStorageV1__factory;
  }
  static readonly contractName: "GovernorBravoDelegateStorageV1";
  public readonly contractName: "GovernorBravoDelegateStorageV1";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernorBravoDelegateStorageV1Interface {
    return new utils.Interface(_abi) as GovernorBravoDelegateStorageV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovernorBravoDelegateStorageV1 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as GovernorBravoDelegateStorageV1;
  }
}
