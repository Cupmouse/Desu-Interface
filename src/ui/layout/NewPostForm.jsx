import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import { callWeb3Async, GAS_ESTIMATION_MODIFIER } from '../../web3integration';

export default class NewPostForm extends Component {
  static get propTypes() {
    return {
      threadAddress: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      newPostText: '',
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onTextChange(event) {
    this.setState({ newPostText: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();

    const thread = getThreadContractAt(this.props.threadAddress);

    // ESLint says use array destruct, it is disgusting but keep this please
    const { newPostText } = this.state;

    let gasEstimate;
    callWeb3Async(thread.post.estimateGas, newPostText).then((result) => {
      gasEstimate = Math.floor(result * GAS_ESTIMATION_MODIFIER);

      // Test if it can run without problems on vm
      return callWeb3Async(thread.post.call, newPostText);
    }).then(() => {
      this.setState({ newPostText: '' });

      // It can, send real tx
      return callWeb3Async(thread.post, newPostText, {
        // from: account,
        gas: gasEstimate,
      });
    });
  }

  render() {
    return (
      <div className="new-post-wrapper">
        <form onSubmit={this.onFormSubmit}>
          <textarea
            className="new-post-text"
            placeholder="Write your thoughts here..."
            value={this.state.newPostText}
            onChange={this.onTextChange}
          />
          <input type="submit" value="Send" />
        </form>
      </div>
    );
  }
}
