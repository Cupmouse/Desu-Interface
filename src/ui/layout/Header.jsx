import React from 'react';
import { Link } from 'react-router-dom';

import { genPathToBoard } from '../../pathgenerator';
import AccountStatus from './AccountStatus';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0x8c486e8d75b9965cf593ef220598f24801c80e7b')}>Official board</Link>
    </nav>
    <AccountStatus />
  </header>
);

export default Header;
