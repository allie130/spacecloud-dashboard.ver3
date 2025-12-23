import React from 'react';
import './PeriodTabs.css';

const PeriodTabs = ({ activePeriod, onPeriodChange }) => {
  const periods = [
    { id: 'daily', label: '일간' },
    { id: 'weekly', label: '주간' },
    { id: 'monthly', label: '월간' },
  ];

  return (
    <div className="period-tabs">
      {periods.map((period) => (
        <button
          key={period.id}
          className={`period-tab ${activePeriod === period.id ? 'active' : ''}`}
          onClick={() => onPeriodChange(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodTabs;
