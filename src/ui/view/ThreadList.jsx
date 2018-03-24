import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import threadABI from '../../contract/threadABI';
import boardABI from '../../contract/boardABI';
import getWeb3 from '../../web3integration';

const fitText = (str) => {
  if (str.length > 50 - 3) {
    return str.substr(0, 47).concat('...');
  }
  return str;
};

const ThreadElement = props => (
  <div className="threadlist-element">
    <span className="threadlist-title">{fitText(props.title)}</span>
    <span className="threadlist-text">{fitText(props.text)}</span>
    <span className="threadlist-nop">nop: {props.numberOfPosts.toString()}</span>
  </div>
);


ThreadElement.propTypes = {
  title: PropTypes.string.isRequired,
  numberOfPosts: PropTypes.instanceOf(Web3.prototype.BigNumber).isRequired,
  text: PropTypes.string.isRequired,
};

export default class ThreadList extends Component {
  static get propTypes() {
    return {
      match: PropTypes.shape({
        params: PropTypes.shape({
          boardAddress: PropTypes.string.isRequired,
        }),
      }).isRequired,
    };
  }

  componentWillMount() {
    const web3 = getWeb3();

    const board = web3.eth.contract(boardABI).at(this.props.match.params.boardAddress);

    // Get addresses of threads in the board
    const threadAddresses = board.getThreadArray.call(0, 25, { from: web3.eth.accounts[0] });
    // Abandon unnecessary empty elements from responded array
    const threadAddressesTrailed = threadAddresses[0].slice(0, threadAddresses[1]);

    Promise.all(threadAddressesTrailed.map(async (threadAddress) => {
      const thread = web3.eth.contract(threadABI).at(threadAddress);
      const title = thread.getTitle.call();
      const numberOfPosts = thread.getNumberOfPosts.call();
      const text = thread.getPostText.call(0);

      return {
        address: threadAddress,
        title,
        text,
        numberOfPosts,
      };
    })).then((threads) => {
      this.setState({ threads });
    });
  }

  render() {
    if (this.state == null) {
      return ('loading...');
    }

    return (
      <div className="threadlist-wrapper">
        {this.state.threads.map(thread =>
            (<ThreadElement
              key={thread.address}
              title={thread.title}
              numberOfPosts={thread.numberOfPosts}
              text={thread.text}
            />))}
      </div>
    );
  }
}
