import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ThreadListView from '../view/ThreadListView';
import NewThreadView from '../view/NewThreadView';
import ThreadView from '../view/ThreadView';
import {
  PATH_TEMPLATE_BOARD_THREAD_LIST,
  PATH_TEMPLATE_BOARD_NEW_THREAD,
  PATH_TEMPLATE_THREAD,
} from '../../pathgenerator';

export default class ViewWrapper extends Component {
  static get propTypes() {
    return {
      notificationSystem: PropTypes.func.isRequired,
    };
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path={PATH_TEMPLATE_BOARD_THREAD_LIST}
          render={props => (
            <ThreadListView {...props} notificationSystem={this.props.notificationSystem} />
          )}
        />
        <Route
          exact
          path={PATH_TEMPLATE_BOARD_NEW_THREAD}
          render={props => (
            <NewThreadView {...props} notificationSystem={this.props.notificationSystem} />
          )}
        />
        <Route
          exact
          path={PATH_TEMPLATE_THREAD}
          render={props => (
            <ThreadView {...props} notificationSystem={this.props.notificationSystem} />
          )}
        />
      </Switch>
    );
  }
}
