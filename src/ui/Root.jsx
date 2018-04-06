import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/fontawesome-free-solid';
import NotificationSystem from 'react-notification-system';

import { initWeb3 } from '../node/web3integration';

import '../less/main.less';
import Header from './layout/Header';
import ViewWrapper from './layout/ViewWrapper';

Modal.setAppElement('#app');

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3Initialized: false,
      modalOpen: false,
    };
  }

  componentWillMount() {
    // Initialize web3. Get web3 from environment variable if it is available
    initWeb3().then(() => {
      this.setState({ web3Initialized: true });
    }, (error) => {
      console.error(error);
      this.setState({
        web3Initialized: false,
        modalOpen: true,
      });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.state.web3Initialized ? (
            <div className="app-wrapper">
              <Header />
              <ViewWrapper notificationSystem={() => this.notificationSystem} />
            </div>
          ) : ''}
          <Modal isOpen={this.state.modalOpen}>
            <h3><FontAwesomeIcon icon={faExclamationTriangle} />Could not connect to the node</h3>
            <p>
              Make sure you have installed MetaMask or have Ethereum node running in background.
            </p>
          </Modal>
          <NotificationSystem ref={(ref) => { this.notificationSystem = ref; }} />
        </div>
      </BrowserRouter>
    );
  }
}
