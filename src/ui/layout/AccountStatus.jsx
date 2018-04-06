import React, { Component } from 'react';
import getWeb3 from '../../node/web3integration';

export default class AccountStatus extends Component {
  componentWillMount() {
    this.setState({ defaultAccount: getWeb3().defaultAccount });
  }

  render() {
    return (
      <div>
        <span>{this.state.defaultAccount}</span>
        <input type="button" value="Settings" />
      </div>
    );
  }
}
