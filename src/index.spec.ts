import { helloWorld } from './index';

const testabi = [
  {
    constant: false,
    inputs: [
      {
        name: 'x',
        type: 'uint256',
      },
    ],
    name: 'hi',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'x',
        type: 'uint256[]',
      },
    ],
    name: 'hi1',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'x',
        type: 'uint256[2]',
      },
    ],
    name: 'hi2',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];

describe('test', () => {
  it('should import hello world variable', () => {
    expect(helloWorld).toEqual('hello world');
  });
});
