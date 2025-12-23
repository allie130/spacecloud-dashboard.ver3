import React from 'react';
import './ChartTabs.css';

const ChartTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="chart-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`chart-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTabs;
