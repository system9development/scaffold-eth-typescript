/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  GovernorBravoInterface,
  GovernorBravoInterfaceInterface,
} from "../GovernorBravoInterface";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "getActions",
    outputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "signatures",
        type: "string[]",
      },
      {
        internalType: "bytes[]",
        name: "calldatas",
        type: "bytes[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "getReceipt",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "hasVoted",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "support",
            type: "uint8",
          },
          {
            internalType: "uint96",
            name: "votes",
            type: "uint96",
          },
        ],
        internalType: "struct GovernorBravoInterface.Receipt",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        components: [
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
        internalType: "struct GovernorBravoInterface.Proposal",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class GovernorBravoInterface__factory {
  static readonly abi = _abi;
  static createInterface(): GovernorBravoInterfaceInterface {
    return new utils.Interface(_abi) as GovernorBravoInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovernorBravoInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as GovernorBravoInterface;
  }
}
