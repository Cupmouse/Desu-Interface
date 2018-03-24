import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ThreadListView from '../view/ThreadListView';
import NewThreadView from '../view/NewThreadView';
import ThreadView from '../view/ThreadView';
import {
  PATH_TEMPLATE_BOARD_THREAD_LIST,
  PATH_TEMPLATE_BOARD_NEW_THREAD,
  PATH_TEMPLATE_THREAD,
} from '../../pathgenerator';

const ViewWrapper = () => (
  <Switch>
    <Route exact path={PATH_TEMPLATE_BOARD_THREAD_LIST} component={ThreadListView} />
    <Route exact path={PATH_TEMPLATE_BOARD_NEW_THREAD} component={NewThreadView} />
    <Route exact path={PATH_TEMPLATE_THREAD} component={ThreadView} />
  </Switch>
);

export default ViewWrapper;
