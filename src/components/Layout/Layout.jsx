import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeMenu, onMenuChange }) => {
  return (
    <div className="layout">
      <Header />
      <Sidebar activeMenu={activeMenu} onMenuChange={onMenuChange} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
