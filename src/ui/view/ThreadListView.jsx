import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/fontawesome-free-solid';

import { getBoardContractAt, getThreadContractAt } from '../../contract/contract_util';
import { genPathToThread, genPathToNewThread } from '../../pathgenerator';
import { propTypeBigNumber } from '../proptypes_util';

import ViewController from './ViewController';
import getWeb3, { callWeb3Async } from '../../node/web3integration';


const fitText = (str) => {
  if (str.length > 50 - 3) {
    return str.substr(0, 47).concat('...');
  }
  return str;
};

const ThreadElement = props => (
  <div className="threadlist-element">
    <span className="threadlist-title"><Link to={genPathToThread(props.address)}>{fitText(props.title)}</Link></span>
    <span className="threadlist-text">{fitText(props.text)}</span>
    <span className="threadlist-nop">nop: {props.numberOfPosts.toString()}</span>
  </div>
);


ThreadElement.propTypes = {
  address: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  numberOfPosts: propTypeBigNumber.isRequired,
  text: PropTypes.string.isRequired,
};

export default class ThreadListView extends Component {
  static get propTypes() {
    return {
      match: PropTypes.shape({
        params: PropTypes.shape({
          boardAddress: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      newThreadEvent: null,
      threadBumpedEvent: null,
    };

    this.controllerElements = {
      newThread: {
        link: genPathToNewThread(props.match.params.boardAddress),
        icon: faPlus,
        text: 'New Thread',
      },
    };
  }

  componentWillMount() {
    let boardCached;

    const getBoard = async () => {
      if (boardCached === undefined) {
        return getBoardContractAt(this.props.match.params.boardAddress);
      }

      return boardCached;
    };

    const updateList = () => {
      let threadInstances;

      // Get addresses of threads in the board
      getBoard()
        .then(board => callWeb3Async(board.getThreadArray.call, 0, 25))
        .then((threadAddresses) => {
          // Abandon unnecessary empty elements from responded array
          const threadAddressesTrailed = threadAddresses[0].slice(0, threadAddresses[1]);

          threadInstances = threadAddressesTrailed.map(address => getThreadContractAt(address));
        }).then(() => Promise.all(threadInstances.map(async (thread) => {
          try {
            const title = await callWeb3Async(thread.getTitle.call);
            const numberOfPosts = await callWeb3Async(thread.getNumberOfPosts.call);
            const text = await callWeb3Async(thread.getPostText.call, 0);

            return {
              address: thread.address,
              title,
              text,
              numberOfPosts,
            };
          } catch (error) {
            if (error.message === 'new BigNumber() not a base 16 number: ') {
              // Thread are removed, replace it with random thing
              // Getting data of dead thread is going to throw nonsense error like
              // bigNumber not a 16 number
              return {
                address: thread.address,
                title: 'にゃーん',
                text: 'にゃーん',
                numberOfPosts: new (getWeb3()).BigNumber(-2222),
              };
            }

            // Show error other than an error above

            console.error(error);

            return {
              address: thread.address,
              title: 'えらー',
              text: 'えらー',
              numberOfPosts: new (getWeb3()).BigNumber(-1),
            };
          }
        })))
        .then((threads) => { this.setState({ threads }); });
    };

    const watchCallback = (error) => {
      if (error) {
        console.error(error);
        return;
      }

      // Straight up update list
      updateList();
    };

    getBoard().then((board) => {
      const newThreadEvent = board.NewThread();
      newThreadEvent.watch(watchCallback);

      const threadBumpedEvent = board.ThreadBumped();
      threadBumpedEvent.watch(watchCallback);

      this.setState({ newThreadEvent, threadBumpedEvent });
    });

    updateList();
  }

  componentWillUnmount() {
    if (this.state.newThreadEvent !== null) {
      this.state.newThreadEvent.stopWatching((error) => { if (error) console.error(error); });
    }
    if (this.state.threadBumpedEvent !== null) {
      this.state.threadBumpedEvent.stopWatching((error) => { if (error) console.error(error); });
    }
  }

  render() {
    if (!this.state || typeof this.state.threads === 'undefined') {
      return ('loading...');
    }

    return (
      <div className="view">
        <ViewController elements={this.controllerElements} />
        <div className="content threadlist-wrapper">
          {this.state.threads.map(thread =>
            (<ThreadElement
              key={thread.address}
              address={thread.address}
              title={thread.title}
              numberOfPosts={thread.numberOfPosts}
              text={thread.text}
            />))}
        </div>
      </div>
    );
  }
}
