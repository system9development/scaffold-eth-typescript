/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ComptrollerV4Storage,
  ComptrollerV4StorageInterface,
} from "../ComptrollerV4Storage";

const _abi = [
  {
    inputs: [],
    name: "_borrowGuardianPaused",
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
    name: "_mintGuardianPaused",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allMarkets",
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
    name: "borrowCapGuardian",
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
    name: "borrowCaps",
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
    name: "borrowGuardianPaused",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "compAccrued",
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
    name: "compBorrowState",
    outputs: [
      {
        internalType: "uint224",
        name: "index",
        type: "uint224",
      },
      {
        internalType: "uint32",
        name: "block",
        type: "uint32",
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
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "compBorrowerIndex",
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
    name: "compRate",
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
    name: "compSpeeds",
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
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "compSupplierIndex",
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
    name: "compSupplyState",
    outputs: [
      {
        internalType: "uint224",
        name: "index",
        type: "uint224",
      },
      {
        internalType: "uint32",
        name: "block",
        type: "uint32",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "bool",
        name: "isListed",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "collateralFactorMantissa",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isComped",
        type: "bool",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mintGuardianPaused",
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
    name: "pauseGuardian",
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
  {
    inputs: [],
    name: "seizeGuardianPaused",
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
    name: "transferGuardianPaused",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506106a0806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80638c57804e11610104578063ca0af043116100a2578063de887e1a11610071578063de887e1a14610501578063e6653f3d14610524578063e875544614610538578063f851a4401461054157600080fd5b8063ca0af04314610490578063cc7ebdc4146104bb578063dce15449146104db578063dcfbc0c7146104ee57600080fd5b8063aa900754116100de578063aa90075414610435578063ac0b0bb71461043e578063b21be7fd14610452578063bb82aa5e1461047d57600080fd5b80638c57804e146103a15780638e8f294b146103d957806394b2294b1461042c57600080fd5b80634ada90af116101715780636d154ea51161014b5780636d154ea514610334578063731f0c2b146103575780637dc0d1d01461037a57806387f763031461038d57600080fd5b80634ada90af146102bc57806352d84d1e146102c55780636b79c38d146102d857600080fd5b806326782247116101ad578063267822471461024557806328f5f502146102585780633c94786f146102785780634a5844321461029c57600080fd5b80631d7b33d7146101d457806321af45691461020757806324a3d62214610232575b600080fd5b6101f46101e23660046105d2565b60116020526000908152604090205481565b6040519081526020015b60405180910390f35b60175461021a906001600160a01b031681565b6040516001600160a01b0390911681526020016101fe565b600c5461021a906001600160a01b031681565b60015461021a906001600160a01b031681565b6101f46102663660046105d2565b600a6020526000908152604090205481565b600c5461028c90600160a01b900460ff1681565b60405190151581526020016101fe565b6101f46102aa3660046105d2565b60186020526000908152604090205481565b6101f460065481565b61021a6102d33660046105f4565b610554565b6103106102e63660046105d2565b6012602052600090815260409020546001600160e01b03811690600160e01b900463ffffffff1682565b604080516001600160e01b03909316835263ffffffff9091166020830152016101fe565b61028c6103423660046105d2565b600e6020526000908152604090205460ff1681565b61028c6103653660046105d2565b600d6020526000908152604090205460ff1681565b60045461021a906001600160a01b031681565b600c5461028c90600160b01b900460ff1681565b6103106103af3660046105d2565b6013602052600090815260409020546001600160e01b03811690600160e01b900463ffffffff1682565b61040d6103e73660046105d2565b600b6020526000908152604090208054600182015460039092015460ff91821692911683565b60408051931515845260208401929092521515908201526060016101fe565b6101f460075481565b6101f460105481565b600c5461028c90600160b81b900460ff1681565b6101f461046036600461060d565b601460209081526000928352604080842090915290825290205481565b60025461021a906001600160a01b031681565b6101f461049e36600461060d565b601560209081526000928352604080842090915290825290205481565b6101f46104c93660046105d2565b60166020526000908152604090205481565b61021a6104e9366004610640565b61057e565b60035461021a906001600160a01b031681565b61028c61050f3660046105d2565b60096020526000908152604090205460ff1681565b600c5461028c90600160a81b900460ff1681565b6101f460055481565b60005461021a906001600160a01b031681565b600f818154811061056457600080fd5b6000918252602090912001546001600160a01b0316905081565b6008602052816000526040600020818154811061059a57600080fd5b6000918252602090912001546001600160a01b03169150829050565b80356001600160a01b03811681146105cd57600080fd5b919050565b6000602082840312156105e457600080fd5b6105ed826105b6565b9392505050565b60006020828403121561060657600080fd5b5035919050565b6000806040838503121561062057600080fd5b610629836105b6565b9150610637602084016105b6565b90509250929050565b6000806040838503121561065357600080fd5b61065c836105b6565b94602093909301359350505056fea26469706673582212201815ba7dd90d994fb630289b7dcee814599fa1c6825660e9d3b92b586bf8ca0f64736f6c634300080d0033";

type ComptrollerV4StorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ComptrollerV4StorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ComptrollerV4Storage__factory extends ContractFactory {
  constructor(...args: ComptrollerV4StorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ComptrollerV4Storage";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ComptrollerV4Storage> {
    return super.deploy(overrides || {}) as Promise<ComptrollerV4Storage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ComptrollerV4Storage {
    return super.attach(address) as ComptrollerV4Storage;
  }
  connect(signer: Signer): ComptrollerV4Storage__factory {
    return super.connect(signer) as ComptrollerV4Storage__factory;
  }
  static readonly contractName: "ComptrollerV4Storage";
  public readonly contractName: "ComptrollerV4Storage";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ComptrollerV4StorageInterface {
    return new utils.Interface(_abi) as ComptrollerV4StorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ComptrollerV4Storage {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ComptrollerV4Storage;
  }
}
