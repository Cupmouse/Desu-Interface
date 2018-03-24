import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/fontawesome-free-solid';

import { getBoardContractAt, getThreadContractAt } from '../../contract/contract_util';
import { genPathToThread, genPathToNewThread } from '../../pathgenerator';
import { propTypeBigNumber } from '../proptypes_util';

import ViewController from '../layout/ViewController';


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

    // Get addresses of threads in the board
    const threadAddresses = board.getThreadArray.call(0, 25);
    // Abandon unnecessary empty elements from responded array
    const threadAddressesTrailed = threadAddresses[0].slice(0, threadAddresses[1]);

    Promise.all(threadAddressesTrailed.map(async (threadAddress) => {
      const thread = getThreadContractAt(threadAddress);
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
