import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import getWeb3 from '../../web3integration';

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

    thread.post.estimateGas(this.state.newPostText, (error, estimate) => {
      if (error) {
        console.error(error);
        return;
      }

      // Test if it can run without problems on vm
      thread.post.call(this.state.newPostText, (error2) => {
        if (error2) {
          console.error(error2);
          return;
        }

        // It can, send real tx

        getWeb3().eth.getAccounts((error3, accounts) => {
          thread.post(this.state.newPostText, {
            from: accounts[0],
            gas: estimate,
          }, (error4, txHash) => {
            if (error4) {
              console.error(error4);
            } else {
              console.log(txHash);
            }

            this.setState({ newPostText: '' });
          });
        });
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