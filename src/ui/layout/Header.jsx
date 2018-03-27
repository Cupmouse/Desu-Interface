import React from 'react';
import { Link } from 'react-router-dom';
import { genPathToBoard } from '../../pathgenerator';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0xf90537eb51122f944e051b54c3bee567b6b048c4')}>Threads</Link>
    </nav>
  </header>
);

export default Header;
