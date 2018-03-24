import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ThreadList from '../view/ThreadList';

const Content = () => (
  <div className="app-content">
    <Switch>
      <Route exact path="/:boardAddress/threads" component={ThreadList} />
    </Switch>
  </div>
);

export default Content;
