import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { generateSpacePerformanceData, formatNumber, formatCurrency } from '../data/mockData';
import { subDays, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './MetricsPage.css';
import './SpacePerformance.css';

const SpacePerformance = () => {
  const [selectedDate, setSelectedDate] = useState(subDays(new Date(), 1));
  const [sortKey, setSortKey] = useState('totalRevenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [visibleCount, setVisibleCount] = useState(30);

  const rawData = useMemo(() => generateSpacePerformanceData(100), []);

  const sortedData = useMemo(() => {
    const sorted = [...rawData].sort((a, b) => {
      if (sortDirection === 'desc') {
        return b[sortKey] - a[sortKey];
      }
      return a[sortKey] - b[sortKey];
    });
    return sorted;
  }, [rawData, sortKey, sortDirection]);

  const visibleData = sortedData.slice(0, visibleCount);

  const totals = useMemo(() => {
    return {
      bookingCount: rawData.reduce((sum, item) => sum + item.bookingCount, 0),
      paymentCount: rawData.reduce((sum, item) => sum + item.paymentCount, 0),
      usageCount: rawData.reduce((sum, item) => sum + item.usageCount, 0),
      totalRevenue: rawData.reduce((sum, item) => sum + item.totalRevenue, 0),
    };
  }, [rawData]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (key) => {
    if (sortKey === key) {
      return sortDirection === 'desc' ? ' ↓' : ' ↑';
    }
    return ' ↕';
  };

  const renderChangeIndicator = (value) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    return (
      <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'}{Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="metrics-page">
      <div className="page-header">
        <h1 className="page-title">공간별 성과 지표</h1>
        <div className="page-filters">
          <div className="date-picker-wrapper">
            <span className="date-label">📅 기준일:</span>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="yyyy.MM.dd"
              locale={ko}
              className="date-picker-input"
              maxDate={subDays(new Date(), 1)}
            />
            <span className="date-hint">(전일자 기준)</span>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">총 예약완료</div>
          <div className="summary-card-value">{formatNumber(totals.bookingCount)}건</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">총 결제완료</div>
          <div className="summary-card-value">{formatNumber(totals.paymentCount)}건</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">총 이용완료</div>
          <div className="summary-card-value">{formatNumber(totals.usageCount)}건</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">총 결제금액</div>
          <div className="summary-card-value">{formatCurrency(totals.totalRevenue)}</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <h3 className="section-title">Top Performance ({format(selectedDate, 'yyyy.MM.dd')} 기준)</h3>
          <div className="sort-controls">
            <span className="sort-label">정렬:</span>
            <select
              className="sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="totalRevenue">결제금액</option>
              <option value="bookingCount">예약완료건</option>
              <option value="paymentCount">결제완료건</option>
              <option value="usageCount">이용완료건</option>
            </select>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
            >
              {sortDirection === 'desc' ? '내림차순 ↓' : '오름차순 ↑'}
            </button>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>공간 ID</th>
                <th className="sortable" onClick={() => handleSort('bookingCount')}>
                  예약완료{getSortIcon('bookingCount')}
                </th>
                <th className="sortable" onClick={() => handleSort('paymentCount')}>
                  결제완료{getSortIcon('paymentCount')}
                </th>
                <th className="sortable" onClick={() => handleSort('usageCount')}>
                  이용완료{getSortIcon('usageCount')}
                </th>
                <th className="sortable" onClick={() => handleSort('totalRevenue')}>
                  결제금액{getSortIcon('totalRevenue')}
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((item, index) => (
                <tr key={item.spaceId}>
                  <td>{index + 1}</td>
                  <td>
                    <a
                      href={`https://www.spacecloud.kr/space/${item.spaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="space-link"
                    >
                      {item.spaceId}
                    </a>
                  </td>
                  <td>
                    {formatNumber(item.bookingCount)}건
                    {renderChangeIndicator(item.bookingChange)}
                  </td>
                  <td>
                    {formatNumber(item.paymentCount)}건
                    {renderChangeIndicator(item.paymentChange)}
                  </td>
                  <td>
                    {formatNumber(item.usageCount)}건
                    {renderChangeIndicator(item.usageChange)}
                  </td>
                  <td>
                    {formatCurrency(item.totalRevenue)}
                    {renderChangeIndicator(item.revenueChange)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCount < sortedData.length && (
            <button
              className="more-btn"
              onClick={() => setVisibleCount(prev => prev + 30)}
            >
              더보기 30개 + ({visibleCount}/{sortedData.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacePerformance;
