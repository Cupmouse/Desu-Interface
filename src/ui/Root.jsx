import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './layout/Header';
import Content from './layout/Content';

// Render layout design

const Root = () => (
  <BrowserRouter>
    <div className="app-container">
      <Header />
      <Content />
    </div>
  </BrowserRouter>
);

export default Root;
