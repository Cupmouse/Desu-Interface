import threadABI from './threadABI';
import boardABI from './boardABI';

import getWeb3, { callWeb3Async } from '../web3integration';
import boardByteCode from './boardByteCode';

export const getThreadContractAt = threadAddress =>
  getWeb3().eth.contract(threadABI).at(threadAddress);


export const getBoardContractAt = async (boardAddress) => {
  const web3 = getWeb3();

  const board = web3.eth.contract(boardABI).at(boardAddress);

  // Get the runtime bytecode of this address which supposed to be board contract
  const code = await callWeb3Async(web3.eth.getCode, boardAddress);

  if (code !== boardByteCode) {
    throw new Error('Contract exists, but has invalid runtime bytecode. It can be malicious');
  }

  return board;
};
