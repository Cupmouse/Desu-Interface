import React from 'react';
import { Link } from 'react-router-dom';

import { genPathToBoard } from '../../pathgenerator';
import AccountStatus from './AccountStatus';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0x00a1ab1c8f0f92a3b16c285793e89c60b5efafb8')}>Threads</Link>
    </nav>
    <AccountStatus />
  </header>
);

export default Header;
