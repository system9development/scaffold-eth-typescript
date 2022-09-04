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
import type { Reservoir, ReservoirInterface } from "../Reservoir";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "dripRate_",
        type: "uint256",
      },
      {
        internalType: "contract EIP20Interface",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "target_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "drip",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dripRate",
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
    name: "dripStart",
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
    name: "dripped",
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
    name: "target",
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
    name: "token",
    outputs: [
      {
        internalType: "contract EIP20Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161056a38038061056a83398101604081905261002f91610087565b436000908155600193909355600280546001600160a01b039384166001600160a01b031991821617909155600380549290931691161790556004556100ca565b6001600160a01b038116811461008457600080fd5b50565b60008060006060848603121561009c57600080fd5b8351925060208401516100ae8161006f565b60408501519092506100bf8161006f565b809150509250925092565b610491806100d96000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806388a91a8a1461006757806395f632b3146100835780639f678cca1461008c578063d326159214610094578063d4b839921461009d578063fc0c546a146100c8575b600080fd5b61007060005481565b6040519081526020015b60405180910390f35b61007060045481565b6100706100db565b61007060015481565b6003546100b0906001600160a01b031681565b6040516001600160a01b03909116815260200161007a565b6002546100b0906001600160a01b031681565b6002546040516370a0823160e01b81523060048201526000916001600160a01b031690829082906370a0823190602401602060405180830381865afa158015610128573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014c9190610384565b6001546000805460045460035494955092939092916001600160a01b039091169043906101ad8661017d878561039d565b6040518060400160405280601281526020017164726970546f74616c206f766572666c6f7760701b8152506102b6565b905060006101e782866040518060400160405280601381526020017264656c74614472697020756e646572666c6f7760681b81525061030a565b905060006101f58983610344565b9050600061022887836040518060400160405280600c81526020016b1d185d5d1bdb1bd9da58d85b60a21b81525061035d565b600481815560405163a9059cbb60e01b81526001600160a01b0389811692820192909252602481018590529192508c169063a9059cbb906044016020604051808303816000875af1158015610281573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102a591906103c2565b50909b9a5050505050505050505050565b6000836000036102c857506000610303565b838302836102d686836103e4565b1483906102ff5760405162461bcd60e51b81526004016102f69190610406565b60405180910390fd5b5090505b9392505050565b6000818484111561032e5760405162461bcd60e51b81526004016102f69190610406565b50600061033b848661039d565b95945050505050565b6000818311610354575081610357565b50805b92915050565b600083830182858210156102ff5760405162461bcd60e51b81526004016102f69190610406565b60006020828403121561039657600080fd5b5051919050565b6000828210156103bd57634e487b7160e01b600052601160045260246000fd5b500390565b6000602082840312156103d457600080fd5b8151801515811461030357600080fd5b60008261040157634e487b7160e01b600052601260045260246000fd5b500490565b600060208083528351808285015260005b8181101561043357858101830151858201604001528201610417565b81811115610445576000604083870101525b50601f01601f191692909201604001939250505056fea264697066735822122046f9b99cd2c77c0638fe99f829527a61d6fa7582c72e206e71f6c021608bdae664736f6c634300080d0033";

type ReservoirConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReservoirConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Reservoir__factory extends ContractFactory {
  constructor(...args: ReservoirConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Reservoir";
  }

  deploy(
    dripRate_: BigNumberish,
    token_: string,
    target_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Reservoir> {
    return super.deploy(
      dripRate_,
      token_,
      target_,
      overrides || {}
    ) as Promise<Reservoir>;
  }
  getDeployTransaction(
    dripRate_: BigNumberish,
    token_: string,
    target_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      dripRate_,
      token_,
      target_,
      overrides || {}
    );
  }
  attach(address: string): Reservoir {
    return super.attach(address) as Reservoir;
  }
  connect(signer: Signer): Reservoir__factory {
    return super.connect(signer) as Reservoir__factory;
  }
  static readonly contractName: "Reservoir";
  public readonly contractName: "Reservoir";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReservoirInterface {
    return new utils.Interface(_abi) as ReservoirInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Reservoir {
    return new Contract(address, _abi, signerOrProvider) as Reservoir;
  }
}
