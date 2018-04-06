import React from 'react';
import { Link } from 'react-router-dom';

import { genPathToBoard } from '../../pathgenerator';
import AccountStatus from './AccountStatus';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0xbb772a9725d44edcabcc4b0f62fa831a11633442')}>Official board</Link>
    </nav>
    <AccountStatus />
  </header>
);

export default Header;
