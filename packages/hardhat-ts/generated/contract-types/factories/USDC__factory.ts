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
import type { USDC, USDCInterface } from "../USDC";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "decimals_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260066008553480156200001657600080fd5b5060405162001dd938038062001dd9833981016040819052620000399162000414565b8282600033835162000053906005906020870190620002a1565b50825162000069906006906020860190620002a1565b5060048290556001600160a01b0381166000818152600260209081526040808320869055518581527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350506007805460ff1916905550620000d890506000336200013c565b620001047f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6336200013c565b620001307f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a336200013c565b60085550620004c39050565b6200014882826200014c565b5050565b6200016382826200018f60201b6200094a1760201c565b60008281526001602090815260409091206200018a918390620009ce6200022f821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000148576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001eb3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062000246836001600160a01b0384166200024f565b90505b92915050565b6000818152600183016020526040812054620002985750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000249565b50600062000249565b828054620002af9062000487565b90600052602060002090601f016020900481019282620002d357600085556200031e565b82601f10620002ee57805160ff19168380011785556200031e565b828001600101855582156200031e579182015b828111156200031e57825182559160200191906001019062000301565b506200032c92915062000330565b5090565b5b808211156200032c576000815560010162000331565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200036f57600080fd5b81516001600160401b03808211156200038c576200038c62000347565b604051601f8301601f19908116603f01168101908282118183101715620003b757620003b762000347565b81604052838152602092508683858801011115620003d457600080fd5b600091505b83821015620003f85785820183015181830184015290820190620003d9565b838211156200040a5760008385830101525b9695505050505050565b6000806000606084860312156200042a57600080fd5b83516001600160401b03808211156200044257600080fd5b62000450878388016200035d565b945060208601519150808211156200046757600080fd5b5062000476868287016200035d565b925050604084015190509250925092565b600181811c908216806200049c57607f821691505b602082108103620004bd57634e487b7160e01b600052602260045260246000fd5b50919050565b61190680620004d36000396000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806370a08231116100f9578063a457c2d711610097578063d539139311610071578063d5391393146103b5578063d547741f146103dc578063dd62ed3e146103ef578063e63ab1e91461040257600080fd5b8063a457c2d71461037c578063a9059cbb1461038f578063ca15c873146103a257600080fd5b80639010d07c116100d35780639010d07c1461032e57806391d148541461035957806395d89b411461036c578063a217fddf1461037457600080fd5b806370a08231146102ea57806379cc6790146103135780638456cb591461032657600080fd5b8063313ce567116101665780633f4ba83a116101405780633f4ba83a146102b157806340c10f19146102b957806342966c68146102cc5780635c975abb146102df57600080fd5b8063313ce5671461027657806336568abe1461028b578063395093511461029e57600080fd5b806318160ddd116101a257806318160ddd1461021957806323b872dd1461022b578063248a9ca31461023e5780632f2ff15d1461026157600080fd5b806301ffc9a7146101c957806306fdde03146101f1578063095ea7b314610206575b600080fd5b6101dc6101d73660046115ad565b610429565b60405190151581526020015b60405180910390f35b6101f9610454565b6040516101e89190611603565b6101dc610214366004611652565b6104e6565b6004545b6040519081526020016101e8565b6101dc61023936600461167c565b6104fe565b61021d61024c3660046116b8565b60009081526020819052604090206001015490565b61027461026f3660046116d1565b610522565b005b60085460405160ff90911681526020016101e8565b6102746102993660046116d1565b61054c565b6101dc6102ac366004611652565b6105cf565b6102746105f1565b6102746102c7366004611652565b610697565b6102746102da3660046116b8565b61073d565b60075460ff166101dc565b61021d6102f83660046116fd565b6001600160a01b031660009081526002602052604090205490565b610274610321366004611652565b61074a565b61027461075f565b61034161033c366004611718565b610803565b6040516001600160a01b0390911681526020016101e8565b6101dc6103673660046116d1565b610822565b6101f961084b565b61021d600081565b6101dc61038a366004611652565b61085a565b6101dc61039d366004611652565b6108d5565b61021d6103b03660046116b8565b6108e3565b61021d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6102746103ea3660046116d1565b6108fa565b61021d6103fd36600461173a565b61091f565b61021d7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216635a05180f60e01b148061044e575061044e826109e3565b92915050565b60606005805461046390611764565b80601f016020809104026020016040519081016040528092919081815260200182805461048f90611764565b80156104dc5780601f106104b1576101008083540402835291602001916104dc565b820191906000526020600020905b8154815290600101906020018083116104bf57829003601f168201915b5050505050905090565b6000336104f4818585610a18565b5060019392505050565b60003361050c858285610b3c565b610517858585610bb6565b506001949350505050565b60008281526020819052604090206001015461053d81610d8f565b6105478383610d99565b505050565b6001600160a01b03811633146105c15760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105cb8282610dbb565b5050565b6000336104f48185856105e2838361091f565b6105ec91906117b4565b610a18565b61061b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610822565b61068d5760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e70617573650000000000000060648201526084016105b8565b610695610ddd565b565b6106c17f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610822565b6107335760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f7665206d696e74657220726f6c6520746f206d696e740000000000000000000060648201526084016105b8565b6105cb8282610e2f565b6107473382610f1a565b50565b610755823383610b3c565b6105cb8282610f1a565b6107897f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610822565b6107fb5760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20706175736500000000000000000060648201526084016105b8565b610695611074565b600082815260016020526040812061081b90836110b1565b9392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60606006805461046390611764565b60003381610868828661091f565b9050838110156108c85760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105b8565b6105178286868403610a18565b6000336104f4818585610bb6565b600081815260016020526040812061044e906110bd565b60008281526020819052604090206001015461091581610d8f565b6105478383610dbb565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b6109548282610822565b6105cb576000828152602081815260408083206001600160a01b03851684529091529020805460ff1916600117905561098a3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061081b836001600160a01b0384166110c7565b60006001600160e01b03198216637965db0b60e01b148061044e57506301ffc9a760e01b6001600160e01b031983161461044e565b6001600160a01b038316610a7a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105b8565b6001600160a01b038216610adb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105b8565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610b48848461091f565b90506000198114610bb05781811015610ba35760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105b8565b610bb08484848403610a18565b50505050565b6001600160a01b038316610c1a5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105b8565b6001600160a01b038216610c7c5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105b8565b610c87838383611116565b6001600160a01b03831660009081526002602052604090205481811015610cff5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105b8565b6001600160a01b03808516600090815260026020526040808220858503905591851681529081208054849290610d369084906117b4565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d8291815260200190565b60405180910390a3610bb0565b6107478133611121565b610da3828261094a565b600082815260016020526040902061054790826109ce565b610dc58282611185565b600082815260016020526040902061054790826111ea565b610de56111ff565b6007805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610e855760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105b8565b610e9160008383611116565b8060046000828254610ea391906117b4565b90915550506001600160a01b03821660009081526002602052604081208054839290610ed09084906117b4565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038216610f7a5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105b8565b610f8682600083611116565b6001600160a01b03821660009081526002602052604090205481811015610ffa5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105b8565b6001600160a01b03831660009081526002602052604081208383039055600480548492906110299084906117cc565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b61107c611248565b6007805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610e123390565b600061081b838361128e565b600061044e825490565b600081815260018301602052604081205461110e5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561044e565b50600061044e565b6105478383836112b8565b61112b8282610822565b6105cb57611143816001600160a01b0316601461131e565b61114e83602061131e565b60405160200161115f9291906117e3565b60408051601f198184030181529082905262461bcd60e51b82526105b891600401611603565b61118f8282610822565b156105cb576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061081b836001600160a01b0384166114ba565b60075460ff166106955760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105b8565b60075460ff16156106955760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105b8565b60008260000182815481106112a5576112a5611858565b9060005260206000200154905092915050565b60075460ff16156105475760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b60648201526084016105b8565b6060600061132d83600261186e565b6113389060026117b4565b67ffffffffffffffff8111156113505761135061188d565b6040519080825280601f01601f19166020018201604052801561137a576020820181803683370190505b509050600360fc1b8160008151811061139557611395611858565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106113c4576113c4611858565b60200101906001600160f81b031916908160001a90535060006113e884600261186e565b6113f39060016117b4565b90505b600181111561146b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061142757611427611858565b1a60f81b82828151811061143d5761143d611858565b60200101906001600160f81b031916908160001a90535060049490941c93611464816118a3565b90506113f6565b50831561081b5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105b8565b600081815260018301602052604081205480156115a35760006114de6001836117cc565b85549091506000906114f2906001906117cc565b905081811461155757600086600001828154811061151257611512611858565b906000526020600020015490508087600001848154811061153557611535611858565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080611568576115686118ba565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061044e565b600091505061044e565b6000602082840312156115bf57600080fd5b81356001600160e01b03198116811461081b57600080fd5b60005b838110156115f25781810151838201526020016115da565b83811115610bb05750506000910152565b60208152600082518060208401526116228160408501602087016115d7565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461164d57600080fd5b919050565b6000806040838503121561166557600080fd5b61166e83611636565b946020939093013593505050565b60008060006060848603121561169157600080fd5b61169a84611636565b92506116a860208501611636565b9150604084013590509250925092565b6000602082840312156116ca57600080fd5b5035919050565b600080604083850312156116e457600080fd5b823591506116f460208401611636565b90509250929050565b60006020828403121561170f57600080fd5b61081b82611636565b6000806040838503121561172b57600080fd5b50508035926020909101359150565b6000806040838503121561174d57600080fd5b61175683611636565b91506116f460208401611636565b600181811c9082168061177857607f821691505b60208210810361179857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600082198211156117c7576117c761179e565b500190565b6000828210156117de576117de61179e565b500390565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161181b8160178501602088016115d7565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161184c8160288401602088016115d7565b01602801949350505050565b634e487b7160e01b600052603260045260246000fd5b60008160001904831182151516156118885761188861179e565b500290565b634e487b7160e01b600052604160045260246000fd5b6000816118b2576118b261179e565b506000190190565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220e2e4259b456f164c4e392a67f29bdff020f294f333154b2fa9ce705c71d2139b64736f6c634300080d0033";

type USDCConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: USDCConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class USDC__factory extends ContractFactory {
  constructor(...args: USDCConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "USDC";
  }

  deploy(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<USDC> {
    return super.deploy(
      name,
      symbol,
      decimals_,
      overrides || {}
    ) as Promise<USDC>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, decimals_, overrides || {});
  }
  attach(address: string): USDC {
    return super.attach(address) as USDC;
  }
  connect(signer: Signer): USDC__factory {
    return super.connect(signer) as USDC__factory;
  }
  static readonly contractName: "USDC";
  public readonly contractName: "USDC";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): USDCInterface {
    return new utils.Interface(_abi) as USDCInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): USDC {
    return new Contract(address, _abi, signerOrProvider) as USDC;
  }
}
