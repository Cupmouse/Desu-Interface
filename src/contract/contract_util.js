import getWeb3 from '../web3integration';
import threadABI from './threadABI';
import boardABI from './boardABI';

export const getThreadContractAt = threadAddress =>
  getWeb3().eth.contract(threadABI).at(threadAddress);


export const getBoardContractAt = boardAddress =>
  getWeb3().eth.contract(boardABI).at(boardAddress);
