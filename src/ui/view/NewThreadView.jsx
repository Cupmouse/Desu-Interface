import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getBoardContractAt } from '../../contract/contract_util';
import { getListOfAccounts } from '../../web3integration';

export default class NewThreadView extends Component {
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

    this.onSubmit.bind(this);
    this.onTitleChange.bind(this);
    this.onTextChange.bind(this);

    this.state = {
      title: '',
      text: '',
    };
  }

  onSubmit(event) {
    // Stop browser from reloading
    event.preventDefault();

    getListOfAccounts().then((accounts) => {
      console.log(accounts[0]);
      // Get contract manipulator
      const board = getBoardContractAt(this.props.match.params.boardAddress);

      // Get estimation of gas cost
      board.makeNewThread.estimateGas(this.state.title, this.state.text, (error, gasEstimate) => {

        // Test if it generates error
        board.makeNewThread.call(this.state.title, this.state.text, { from: accounts[0], gas: gasEstimate }, (error2) => {
          if (error2) {
            console.error(error2);
            return;
          }

          // Send actual contract
          board.makeNewThread(this.state.title, this.state.text,
            {
              from: accounts[0],
              gas: gasEstimate,
            },
            (error3, txHash) => {
              if (error3) {
                console.error(error3);
                return;
              }

              console.log(txHash);
            },
          );
        });
      });
    });
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  onTextChange(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    return (
      <div className="content">
        <form className="new-thread-form" onSubmit={(event) => {this.onSubmit(event)}}>
          <label className="new-thread-form-label">
            <span>Title:</span>
            <input
              type="text"
              onChange={this.onTitleChange}
              value={this.state.title}
            />
          </label>
          <label className="new-thread-form-label">
            <span>Text:</span>
            <textarea className="new-thread-form-text" onChange={this.onTextChange} value={this.state.text} />
          </label>
          <input id="text-textarea" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
