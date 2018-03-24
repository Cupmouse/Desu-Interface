import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './layout/Header';
import ViewWrapper from './layout/ViewWrapper';

// Render layout design

const Root = () => (
  <BrowserRouter>
    <div className="app-wrapper">
      <Header />
      <ViewWrapper />
    </div>
  </BrowserRouter>
);

export default Root;
