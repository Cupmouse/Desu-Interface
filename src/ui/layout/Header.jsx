import React from 'react';
import { Link } from 'react-router-dom';

import { genPathToBoard } from '../../pathgenerator';
import AccountStatus from './AccountStatus';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0x6bcd051dac34a5f32b4de06909baac04ee448920')}>Threads</Link>
    </nav>
    <AccountStatus />
  </header>
);

export default Header;
