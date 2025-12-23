import React, { useState } from 'react';
import { formatNumber } from '../../data/mockData';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  summaryRow,
  pageSize = 20,
  showChange = true,
  sortable = false,
  onSort = null
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + pageSize);
  };

  const handleSort = (key) => {
    if (!sortable || !onSort) return;

    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const renderChangeIndicator = (value) => {
    if (value === undefined || value === null || value === 0) return null;
    const isPositive = value > 0;
    return (
      <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'}{Math.abs(value)}%
      </span>
    );
  };

  const getSortIcon = (key) => {
    if (!sortable) return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === 'desc' ? ' ↓' : ' ↑';
    }
    return ' ↕';
  };

  const visibleData = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={sortable && col.sortable !== false ? 'sortable' : ''}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                {col.label}
                {col.sortable !== false && getSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {summaryRow && (
            <tr className="summary-row">
              {columns.map((col) => (
                <td key={col.key}>
                  {col.key === 'date' ? '합산' :
                    col.format ? col.format(summaryRow[col.key]) : formatNumber(summaryRow[col.key])}
                </td>
              ))}
            </tr>
          )}
          {visibleData.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.format ? col.format(row[col.key]) : formatNumber(row[col.key])}
                  {showChange && col.changeKey && renderChangeIndicator(row[col.changeKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
        <button className="more-btn" onClick={handleLoadMore}>
          더보기 ({visibleCount}/{data.length})
        </button>
      )}
    </div>
  );
};

export default DataTable;
