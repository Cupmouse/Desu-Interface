import Web3 from 'web3';

const DEFAULT_PROVIDER_URL = 'http://localhost:8545';

let localWeb3;
let isProvidedFromGlobal;

let accountsCached;

// let accountSelected;

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

  //
  // if (accountSelected === undefined) {
  //   localWeb3.
  //
  //   accountSelected = accountsCached[0];
  // }
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

    // Now update accounts
    await updateAccountCache();
  } else {
    // If web3 is not prepared, make new and set provider
    localWeb3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_PROVIDER_URL));
    isProvidedFromGlobal = false;

    // Before setting accounts, update accounts cache
    await updateAccountCache();

    if (accountsCached.length > 0) {
      // Set default account from cached accounts at index 0
      [localWeb3.eth.defaultAccount] = accountsCached;
    }
  }

  // Get a list of accounts, updating it in interval of 5 secs
  setInterval(updateAccountCache, 5000);

  console.log(localWeb3.eth.defaultAccount);
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
//
// export const getSelectedAccount = async () => {
//   if (accountSelected === undefined) {
//     accountSelected = web3.eth.defaultAccount;
//   }
//
//
//
// };

export default getWeb3;
