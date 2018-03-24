import React from 'react';
import { Link } from 'react-router-dom';
import { genPathToBoard } from '../../pathgenerator';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0x314015151f92637ccada40be82de8e348b89cc1c')}>Threads</Link>
    </nav>
  </header>
);

export default Header;
