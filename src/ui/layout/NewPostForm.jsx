import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import { callWeb3Async, GAS_ESTIMATION_MODIFIER } from '../../web3integration';

export default class NewPostForm extends Component {
  static get propTypes() {
    return {
      threadAddress: PropTypes.string.isRequired,
      notificationSystem: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      newPostText: '',
      sendingTx: false,
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

    // Showing an error message and unfreeze submit button
    const errorCatcher = (error, message) => {
      console.error(error);

      const notif = {
        title: 'Error occurred',
        message,
        level: 'error',
        position: 'br',
      };

      this.props.notificationSystem().addNotification(notif);

      this.setState({ sendingTx: false });
    };

    let gasEstimate;
    callWeb3Async(thread.post.estimateGas, newPostText)
      .then((result) => {
        gasEstimate = Math.floor(result * GAS_ESTIMATION_MODIFIER);

        // Test if it can run without problems on vm
        return callWeb3Async(thread.post.call, newPostText);
      }, (error) => {
        errorCatcher(error, 'Could not estimate gas');
      })
      .then(
        () =>
          // It can, send real tx
          callWeb3Async(thread.post, newPostText, {
            // from: account,
            gas: gasEstimate,
          })
        , (error) => {
          errorCatcher(error, 'Tx simulation failed');
        },
      )
      .then(() => {
        // Transaction was accepted

        const notif = {
          title: 'New post tx sent',
          message: 'Your tx was sent to the node',
          level: 'success',
          position: 'br',
        };

        this.props.notificationSystem().addNotification(notif);

        // Set textarea blank
        this.setState({ newPostText: '' });
      }, (error) => {
        // Sending tx was failed

        if (error.message === 'authentication needed: password or unlock') {
          errorCatcher(error, 'You need to unlock your account');
        } else {
          errorCatcher(error, 'Could not send tx, see console to see more info');
        }
      });

    this.setState({ sendingTx: true });
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
          <input
            type="submit"
            disabled={this.state.sendingTx}
            value="Send"
          />
        </form>
      </div>
    );
  }
}
