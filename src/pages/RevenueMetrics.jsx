import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DateRangePicker from '../components/Common/DateRangePicker';
import PeriodTabs from '../components/Common/PeriodTabs';
import DataTable from '../components/Common/DataTable';
import {
  generateRevenueData, aggregateByWeek, aggregateByMonth,
  calculateTotals, formatNumber, formatCurrency
} from '../data/mockData';
import { subDays } from 'date-fns';
import './MetricsPage.css';

const RevenueMetrics = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState('daily');

  const rawData = useMemo(() => generateRevenueData(60), []);

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [rawData, startDate, endDate]);

  const chartData = useMemo(() => {
    let data;
    const valueKeys = ['paymentAmount', 'transactionAmount'];
    switch (period) {
      case 'weekly':
        data = aggregateByWeek(filteredData, valueKeys);
        break;
      case 'monthly':
        data = aggregateByMonth(filteredData, valueKeys);
        break;
      default:
        data = filteredData;
    }
    return [...data].reverse();
  }, [filteredData, period]);

  const totals = useMemo(() => {
    return calculateTotals(filteredData, ['paymentAmount', 'transactionAmount']);
  }, [filteredData]);

  const columns = [
    { key: 'date', label: '일자', format: (v) => v },
    { key: 'paymentAmount', label: '결제액', changeKey: 'paymentChange', format: formatCurrency },
    { key: 'transactionAmount', label: '거래액', changeKey: 'transactionChange', format: formatCurrency },
  ];

  const formatYAxis = (value) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(0)}억`;
    }
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(0)}천만`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}백만`;
    }
    return formatNumber(value);
  };

  return (
    <div className="metrics-page">
      <div className="page-header">
        <h1 className="page-title">매출 지표</h1>
        <div className="page-filters">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <PeriodTabs activePeriod={period} onPeriodChange={setPeriod} />
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">총 결제액</div>
          <div className="summary-card-value">{formatCurrency(totals.paymentAmount)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">총 거래액</div>
          <div className="summary-card-value">{formatCurrency(totals.transactionAmount)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">매출 추이</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="paymentAmount"
                stroke="#704de4"
                strokeWidth={2}
                name="결제액"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="transactionAmount"
                stroke="#ffd014"
                strokeWidth={2}
                name="거래액"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          summaryRow={totals}
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default RevenueMetrics;
