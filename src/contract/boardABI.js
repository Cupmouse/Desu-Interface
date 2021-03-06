export default [
  {
    constant: false,
    inputs: [
      {
        name: 'internalId',
        type: 'uint256',
      },
    ],
    name: 'detachThreadByInternalId',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'destructBoard',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getNumberOfThreads',
    outputs: [
      {
        name: 'numberOfThreads',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'startIndex',
        type: 'uint256',
      },
      {
        name: 'maxCount',
        type: 'uint256',
      },
    ],
    name: 'getThreadArray',
    outputs: [
      {
        name: 'threads',
        type: 'address[]',
      },
      {
        name: 'foundCount',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'bumpThread',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'lockState',
        type: 'bool',
      },
    ],
    name: 'setLock',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getOwner',
    outputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isLocked',
    outputs: [
      {
        name: '_lock',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getThreadAt',
    outputs: [
      {
        name: 'thread',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getInternalIdOfIndex',
    outputs: [
      {
        name: 'internalId',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'title',
        type: 'string',
      },
      {
        name: 'text',
        type: 'string',
      },
    ],
    name: 'makeNewThread',
    outputs: [],
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
  {
    anonymous: false,
    inputs: [],
    name: 'ThreadDetached',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'ThreadBumped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'NewThread',
    type: 'event',
  },
];
