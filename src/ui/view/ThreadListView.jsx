import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/fontawesome-free-solid';

import { getBoardContractAt, getThreadContractAt } from '../../contract/contract_util';
import { genPathToThread, genPathToNewThread } from '../../pathgenerator';
import { propTypeBigNumber } from '../proptypes_util';

import ViewController from '../layout/ViewController';
import getWeb3, { callWeb3Async } from '../../web3integration';


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

    this.controllerElements = {
      newThread: {
        link: genPathToNewThread(props.match.params.boardAddress),
        icon: faPlus,
        text: 'New Thread',
      },
      // admin: {
      //   text: 'Thread settings',
      //   pressed: () => {
      //
      //   },
      // },
    };
  }

  componentWillMount() {
    const board = getBoardContractAt(this.props.match.params.boardAddress);

    const updateList = () => {
      let threadInstances;

      // Get addresses of threads in the board
      callWeb3Async(board.getThreadArray.call, 0, 25).then((threadAddresses) => {
        // Abandon unnecessary empty elements from responded array
        const threadAddressesTrailed = threadAddresses[0].slice(0, threadAddresses[1]);

        threadInstances = threadAddressesTrailed.map(address => getThreadContractAt(address));

        return Promise.all(threadInstances.map(thread => callWeb3Async(thread.isAlive.call)));
      }).then(isAliveArray => Promise.all(threadInstances.map(async (thread, index) => {
        if (isAliveArray[index]) {
          // Thread is alive
          const title = await callWeb3Async(thread.getTitle.call);
          const numberOfPosts = await callWeb3Async(thread.getNumberOfPosts.call);
          const text = await callWeb3Async(thread.getPostText.call, 0);

          return {
            address: thread.address,
            title,
            text,
            numberOfPosts,
          };
        }

        // Thread are removed, replace it with random thing
        // Getting data of dead thread is going to throw nonsense error like
        // bigNumber not a 16 number
        return {
          address: thread.address,
          title: 'にゃーん',
          text: 'にゃーん',
          numberOfPosts: new (getWeb3()).BigNumber(252525252525252525),
        };
      }))).then((threads) => {
        this.setState({ threads });
      });
    };

    const newThreadEvent = board.NewThread();

    newThreadEvent.watch((error) => {
      if (error) {
        console.error(error);
        return;
      }

      // Straight up update list
      updateList();
    });

    const threadBumpedEvent = board.ThreadBumped();

    threadBumpedEvent.watch((error) => {
      if (error) {
        console.error(error);
        return;
      }
      updateList();
    });

    this.setState({ newThreadEvent, threadBumpedEvent });

    updateList();
  }

  componentWillUnmount() {
    this.state.newThreadEvent.stopWatching((error) => { if (error) console.error(error); });
    this.state.threadBumpedEvent.stopWatching((error) => { if (error) console.error(error); });
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
