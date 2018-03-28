import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { getBoardContractAt } from '../../contract/contract_util';
import { callWeb3Async, GAS_ESTIMATION_MODIFIER } from '../../web3integration';
import { genPathToBoard } from '../../pathgenerator';

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
      redirect: false,
      processing: false,
    };
  }

  onSubmit(event) {
    // Stop browser from reloading
    event.preventDefault();

    // Disable inputs and buttons
    this.setState({ processing: true });

    // This is the same as title = this.state.title, text = this.state.text
    const { title, text } = this.state;

    let board;
    let gasEstimate;

    // Get contract manipulator
    getBoardContractAt(this.props.match.params.boardAddress).then((result) => {
      board = result;
      return callWeb3Async(board.isAlive.call);
    }).then((isAlive) => {
      if (isAlive === false) {
        throw new Error('Board contract is dead (selfdestructed) aborting operation');
      }
    })// Get the estimation of gas costs
      .then(() => callWeb3Async(board.makeNewThread.estimateGas, title, text))
      .then((result) => {
        gasEstimate = Math.floor(result * GAS_ESTIMATION_MODIFIER);

        // Test if it generates error
        return callWeb3Async(board.makeNewThread.call, title, text, { gas: gasEstimate });
      })
      .then(() => callWeb3Async(board.makeNewThread, title, text, { gas: gasEstimate }))
      .then(() => { this.setState({ redirect: true }); });
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
        <form className="new-thread-form" onSubmit={(event) => { this.onSubmit(event); }}>
          <label className="new-thread-form-label">
            <span>Title:</span>
            <input
              type="text"
              onChange={(event) => { this.onTitleChange(event); }}
              value={this.state.title}
              disabled={this.state.processing}
            />
          </label>
          <label className="new-thread-form-label">
            <span>Text:</span>
            <textarea
              className="new-thread-form-text"
              onChange={(event) => { this.onTextChange(event); }}
              value={this.state.text}
              disabled={this.state.processing}
            />
          </label>
          <input id="text-textarea" type="submit" value="Submit" disabled={this.state.processing} />
        </form>
        {this.state.redirect ? (<Redirect to={genPathToBoard(this.props.match.params.boardAddress)} push />) : ''}
      </div>
    );
  }
}
