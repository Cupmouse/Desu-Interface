import Web3 from 'web3';

const DEFAULT_PROVIDER_URL = 'http://localhost:8545';

let localWeb3;
let isProvidedFromGlobal;

/**
 * Call this the very first to prepare provider connection!!!
 */
export const initWeb3 = () => {
  if (typeof localWeb3 !== 'undefined') {
    throw new Error('Web3 already have been initialized');
  }

  if (typeof web3 !== 'undefined') {
    // Use provided one
    localWeb3 = new Web3(web3.currentProvider);
    isProvidedFromGlobal = true;
  } else {
    // If web3 is not prepared, make new and set provider
    localWeb3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_PROVIDER_URL));
    isProvidedFromGlobal = false;
  }
};

export const changeWeb3ProviderURL = (url) => {
  if (typeof localWeb3 === 'undefined') {
    throw new Error('Web3 manager has not initialized yet, you first have to call init()');
  }
  if (isProvidedFromGlobal) {
    throw new Error('An web3 instance is provided from another program, you can not change a provider');
  }

  // Change a provider of web3
  localWeb3 = new Web3(new Web3.providers.HttpProvider(url));
};

const getWeb3 = () => localWeb3;

export default getWeb3;
