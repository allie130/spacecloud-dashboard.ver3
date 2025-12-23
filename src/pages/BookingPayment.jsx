import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DateRangePicker from '../components/Common/DateRangePicker';
import PeriodTabs from '../components/Common/PeriodTabs';
import ChartTabs from '../components/Common/ChartTabs';
import DataTable from '../components/Common/DataTable';
import {
  generateBookingData, aggregateByWeek, aggregateByMonth,
  calculateTotals, formatNumber
} from '../data/mockData';
import { subDays } from 'date-fns';
import './MetricsPage.css';

const chartTabOptions = [
  { id: 'all', label: '전체 보기' },
  { id: 'directPayment', label: '바로결제' },
  { id: 'approvalPayment', label: '승인결제' },
];

const BookingPayment = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState('daily');
  const [chartTab, setChartTab] = useState('all');

  const rawData = useMemo(() => generateBookingData(60), []);

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [rawData, startDate, endDate]);

  const chartData = useMemo(() => {
    let data;
    const valueKeys = ['directPayment', 'approvalPayment', 'total', 'bookingComplete', 'paymentComplete', 'usageComplete'];
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
    return calculateTotals(filteredData, ['directPayment', 'approvalPayment', 'total', 'bookingComplete', 'paymentComplete', 'usageComplete']);
  }, [filteredData]);

  const columns = [
    { key: 'date', label: '일자', format: (v) => v },
    { key: 'directPayment', label: '바로결제', changeKey: 'directPaymentChange' },
    { key: 'approvalPayment', label: '승인결제', changeKey: 'approvalPaymentChange' },
    { key: 'total', label: '합계', changeKey: 'totalChange' },
    { key: 'bookingComplete', label: '예약완료' },
    { key: 'paymentComplete', label: '결제완료' },
    { key: 'usageComplete', label: '이용완료' },
  ];

  const renderChart = () => {
    if (chartTab === 'all') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="directPayment"
              stroke="#704de4"
              strokeWidth={2}
              name="바로결제"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="approvalPayment"
              stroke="#ffd014"
              strokeWidth={2}
              name="승인결제"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#00c853"
              strokeWidth={2}
              name="합계"
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    const colorMap = {
      directPayment: '#704de4',
      approvalPayment: '#ffd014'
    };

    const labelMap = {
      directPayment: '바로결제',
      approvalPayment: '승인결제'
    };

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey={chartTab}
            stroke={colorMap[chartTab]}
            strokeWidth={2}
            name={labelMap[chartTab]}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="metrics-page">
      <div className="page-header">
        <h1 className="page-title">예약/결제 지표</h1>
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
        <h3 className="section-title">예약/결제 추이</h3>
        <ChartTabs tabs={chartTabOptions} activeTab={chartTab} onTabChange={setChartTab} />
        <div className="chart-container">
          {renderChart()}
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

export default BookingPayment;
