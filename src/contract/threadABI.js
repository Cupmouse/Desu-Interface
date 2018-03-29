export default [
  {
    constant: true,
    inputs: [
      {
        name: 'fromPostNumber',
        type: 'uint256',
      },
      {
        name: 'maxCount',
        type: 'uint256',
      },
    ],
    name: 'getPosterArray',
    outputs: [
      {
        name: 'posters',
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
    constant: true,
    inputs: [
      {
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'getPoster',
    outputs: [
      {
        name: 'poster',
        type: 'address',
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
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'removePost',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'fromPostNumber',
        type: 'uint256',
      },
      {
        name: 'maxCount',
        type: 'uint256',
      },
    ],
    name: 'getPostTextArray',
    outputs: [
      {
        name: 'texts',
        type: 'string[]',
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
    constant: true,
    inputs: [],
    name: 'getNumberOfPosts',
    outputs: [
      {
        name: 'numberOfPosts',
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
        name: 'fromPostNumber',
        type: 'uint256',
      },
      {
        name: 'maxCount',
        type: 'uint256',
      },
    ],
    name: 'getPostTimestampArray',
    outputs: [
      {
        name: 'timestamps',
        type: 'uint256[]',
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
    inputs: [
      {
        name: 'text',
        type: 'string',
      },
    ],
    name: 'post',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'getPostText',
    outputs: [
      {
        name: 'text',
        type: 'string',
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
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'getPostAt',
    outputs: [
      {
        name: '_poster',
        type: 'address',
      },
      {
        name: 'timestamp',
        type: 'uint256',
      },
      {
        name: 'text',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getParentBoard',
    outputs: [
      {
        name: '_parentBoard',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'destructThread',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'getPostTimestamp',
    outputs: [
      {
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getTitle',
    outputs: [
      {
        name: '_title',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_parentBoard',
        type: 'address',
      },
      {
        name: 'threadPoster',
        type: 'address',
      },
      {
        name: '_title',
        type: 'string',
      },
      {
        name: 'text',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'PostRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'postNumber',
        type: 'uint256',
      },
    ],
    name: 'NewPost',
    type: 'event',
  },
];
