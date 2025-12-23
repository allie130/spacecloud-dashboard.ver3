import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import SignupMetrics from './pages/SignupMetrics';
import ListingProcess from './pages/ListingProcess';
import BookingPayment from './pages/BookingPayment';
import SpacePerformance from './pages/SpacePerformance';
import RevenueMetrics from './pages/RevenueMetrics';
import './styles/global.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('signup');

  const renderPage = () => {
    switch (activeMenu) {
      case 'signup':
        return <SignupMetrics />;
      case 'listing':
        return <ListingProcess />;
      case 'booking':
        return <BookingPayment />;
      case 'space':
        return <SpacePerformance />;
      case 'revenue':
        return <RevenueMetrics />;
      default:
        return <SignupMetrics />;
    }
  };

  return (
    <Layout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {renderPage()}
    </Layout>
  );
}

export default App;
