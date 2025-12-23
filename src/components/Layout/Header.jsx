import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-text">SpaceCloud</span>
        <span className="logo-badge">Metrics</span>
      </div>
      <div className="header-right">
        <span className="user-info">관리자</span>
      </div>
    </header>
  );
};

export default Header;
