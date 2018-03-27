import React from 'react';
import { render } from 'react-dom';
import { initWeb3 } from './web3integration';

import Root from './ui/Root';

import './less/main.less';

// Initialize web3. Get web3 from environment variable if it is available
initWeb3().then(() => {
  render(<Root />, document.getElementById('app'));
});
