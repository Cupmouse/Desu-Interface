import Web3 from 'web3';

const DEFAULT_PROVIDER_URL = 'http://localhost:8545';
export const GAS_ESTIMATION_MODIFIER = 1.1;

let localWeb3;
let isProvidedFromGlobal;

let accountsCached;

export const callWeb3Async = (func, ...args) => new Promise((resolve, reject) => {
  const argsCopied = args.slice();

  argsCopied.push((error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });

  func(...argsCopied);
});

// Update accounts cache to the latest one
const updateAccountCache = async () => {
  if (!localWeb3) {
    throw new Error('Web3 is not initialized');
  }

  accountsCached = await callWeb3Async(localWeb3.eth.getAccounts);

  // If default account is undefined, we just choose index 0 account if exist
  if (localWeb3.eth.defaultAccount === undefined) {
    if (accountsCached.length > 0) {
      // Set default account from cached accounts at index 0
      [localWeb3.eth.defaultAccount] = accountsCached;
    }
    // FIXME Restrict some functions if no account are not selected as default
  }
};

/* Public functions below */

/**
 * Call this the very first to prepare provider connection!!!
 */
export const initWeb3 = async () => {
  if (typeof localWeb3 !== 'undefined') {
    throw new Error('Web3 already have been initialized');
  }

  if (typeof web3 !== 'undefined') {
    // Use provided one
    localWeb3 = new Web3(web3.currentProvider);
    isProvidedFromGlobal = true;

    // Copy global default account to local web3
    localWeb3.eth.defaultAccount = web3.eth.defaultAccount;
  } else {
    // If web3 is not prepared, make new and set provider
    localWeb3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_PROVIDER_URL));
    isProvidedFromGlobal = false;
  }

  // Update accounts cache
  await updateAccountCache();

  // Get a list of accounts, updating it in interval of 5 secs
  setInterval(updateAccountCache, 5000);
};

const getWeb3 = () => {
  if (localWeb3 === undefined) {
    throw new Error('Web3 has not been initialized yet');
  }

  return localWeb3;
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

export const getListOfAccounts = async () => {
  if (accountsCached === undefined) {
    // Should fetch it from the server first
    await updateAccountCache();
  }

  return accountsCached;
};

export default getWeb3;
