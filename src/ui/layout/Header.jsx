import React from 'react';
import { Link } from 'react-router-dom';

import { genPathToBoard } from '../../pathgenerator';
import AccountStatus from './AccountStatus';

const Header = () => (
  <header className="app-header">
    <nav>
      <Link to={genPathToBoard('0x75df6d77be3f7952c8d5e616c4602602d4c22c55')}>Official board</Link>
    </nav>
    <AccountStatus />
  </header>
);

export default Header;
