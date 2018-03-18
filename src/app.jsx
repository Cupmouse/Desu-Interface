import React from 'react';
import { render } from 'react-dom';
import Header from './ui/layout/Header';
import { initWeb3 } from './web3integration';

import './less/main.less';


// Initialize web3. Get web3 from environment variable if it is available
initWeb3();

// Render layout design

render(<Header />, document.getElementById('app-header'));
