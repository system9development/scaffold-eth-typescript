/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ComptrollerV1Storage,
  ComptrollerV1StorageInterface,
} from "../ComptrollerV1Storage";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "accountAssets",
    outputs: [
      {
        internalType: "contract CToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "borrowLimit",
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
    name: "borrowerArray",
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
    name: "closeFactorMantissa",
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
    name: "comptrollerImplementation",
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
    name: "liquidationIncentiveMantissa",
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
    name: "maxAssets",
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
    name: "oracle",
    outputs: [
      {
        internalType: "contract PriceOracle",
        name: "",
        type: "address",
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
    name: "pendingComptrollerImplementation",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061028f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063bb82aa5e11610071578063bb82aa5e14610131578063dce1544914610144578063dcfbc0c714610157578063de887e1a1461016a578063e87554461461019d578063f851a440146101a657600080fd5b806326782247146100ae57806328f5f502146100de5780634ada90af1461010c5780637dc0d1d01461011557806394b2294b14610128575b600080fd5b6001546100c1906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100fe6100ec36600461020d565b600a6020526000908152604090205481565b6040519081526020016100d5565b6100fe60065481565b6004546100c1906001600160a01b031681565b6100fe60075481565b6002546100c1906001600160a01b031681565b6100c161015236600461022f565b6101b9565b6003546100c1906001600160a01b031681565b61018d61017836600461020d565b60096020526000908152604090205460ff1681565b60405190151581526020016100d5565b6100fe60055481565b6000546100c1906001600160a01b031681565b600860205281600052604060002081815481106101d557600080fd5b6000918252602090912001546001600160a01b03169150829050565b80356001600160a01b038116811461020857600080fd5b919050565b60006020828403121561021f57600080fd5b610228826101f1565b9392505050565b6000806040838503121561024257600080fd5b61024b836101f1565b94602093909301359350505056fea2646970667358221220a4ae66b760757182258356e6edd1b3471e522972a830f7c18501462119cd3ec464736f6c634300080d0033";

type ComptrollerV1StorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ComptrollerV1StorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ComptrollerV1Storage__factory extends ContractFactory {
  constructor(...args: ComptrollerV1StorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ComptrollerV1Storage";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ComptrollerV1Storage> {
    return super.deploy(overrides || {}) as Promise<ComptrollerV1Storage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ComptrollerV1Storage {
    return super.attach(address) as ComptrollerV1Storage;
  }
  connect(signer: Signer): ComptrollerV1Storage__factory {
    return super.connect(signer) as ComptrollerV1Storage__factory;
  }
  static readonly contractName: "ComptrollerV1Storage";
  public readonly contractName: "ComptrollerV1Storage";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ComptrollerV1StorageInterface {
    return new utils.Interface(_abi) as ComptrollerV1StorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ComptrollerV1Storage {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ComptrollerV1Storage;
  }
}
