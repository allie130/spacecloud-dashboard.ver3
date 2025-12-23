import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DateRangePicker from '../components/Common/DateRangePicker';
import PeriodTabs from '../components/Common/PeriodTabs';
import DataTable from '../components/Common/DataTable';
import {
  generateSignupData, aggregateByWeek, aggregateByMonth,
  calculateTotals, formatNumber
} from '../data/mockData';
import { subDays } from 'date-fns';
import './MetricsPage.css';

const SignupMetrics = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState('daily');

  const rawData = useMemo(() => generateSignupData(60), []);

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [rawData, startDate, endDate]);

  const chartData = useMemo(() => {
    let data;
    switch (period) {
      case 'weekly':
        data = aggregateByWeek(filteredData, ['guest', 'host', 'total']);
        break;
      case 'monthly':
        data = aggregateByMonth(filteredData, ['guest', 'host', 'total']);
        break;
      default:
        data = filteredData;
    }
    return [...data].reverse();
  }, [filteredData, period]);

  const totals = useMemo(() => {
    return calculateTotals(filteredData, ['guest', 'host', 'total']);
  }, [filteredData]);

  const columns = [
    { key: 'date', label: '일자', format: (v) => v },
    { key: 'guest', label: '게스트', changeKey: 'guestChange' },
    { key: 'host', label: '호스트', changeKey: 'hostChange' },
    { key: 'total', label: '합계', changeKey: 'totalChange' },
  ];

  return (
    <div className="metrics-page">
      <div className="page-header">
        <h1 className="page-title">회원가입 지표</h1>
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

      <div className="card">
        <h3 className="section-title">회원가입 추이</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatNumber(value)}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="guest"
                stroke="#704de4"
                strokeWidth={2}
                name="게스트"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="host"
                stroke="#ffd014"
                strokeWidth={2}
                name="호스트"
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

export default SignupMetrics;
