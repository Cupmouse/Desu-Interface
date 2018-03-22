import React from 'react';
import { render } from 'react-dom';
import getWeb3, { initWeb3 } from './web3integration';
import boardABI from './contract/boardAbi';

// Layout
import Header from './ui/layout/Header';
import ThreadList from './ui/view/ThreadList';

import './less/main.less';


// Initialize web3. Get web3 from environment variable if it is available
initWeb3();

// Render layout design

render(<Header />, document.getElementById('app-header'));


const web3 = getWeb3();

const board = web3.eth.contract(boardABI).at('0x692a70d2e424a56d2c6c27aa97d1a86395877b3a');

const threads = board.getThreadArray.call(0, 25, { from: web3.eth.accounts[0] });


render(<ThreadList threads={threads.slice(0, threads[1])} />, document.getElementById('app-container'));
