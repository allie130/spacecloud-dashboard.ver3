import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DateRangePicker from '../components/Common/DateRangePicker';
import PeriodTabs from '../components/Common/PeriodTabs';
import ChartTabs from '../components/Common/ChartTabs';
import DataTable from '../components/Common/DataTable';
import {
  generateListingData, aggregateByWeek, aggregateByMonth,
  calculateTotals, formatNumber
} from '../data/mockData';
import { subDays } from 'date-fns';
import './MetricsPage.css';

const chartTabOptions = [
  { id: 'all', label: '전체 보기' },
  { id: 'newRegistration', label: '신규등록' },
  { id: 'inspection', label: '검수할당' },
  { id: 'rejected', label: '반려' },
  { id: 'success', label: '성공' },
];

const ListingProcess = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState('daily');
  const [chartTab, setChartTab] = useState('all');

  const rawData = useMemo(() => generateListingData(60), []);

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [rawData, startDate, endDate]);

  const chartData = useMemo(() => {
    let data;
    const valueKeys = ['newRegistration', 'inspection', 'rejected', 'success', 'total'];
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
    return calculateTotals(filteredData, ['newRegistration', 'inspection', 'rejected', 'success', 'total']);
  }, [filteredData]);

  const columns = [
    { key: 'date', label: '일자', format: (v) => v },
    { key: 'newRegistration', label: '신규등록', changeKey: 'newRegistrationChange' },
    { key: 'inspection', label: '검수할당', changeKey: 'inspectionChange' },
    { key: 'rejected', label: '반려', changeKey: 'rejectedChange' },
    { key: 'success', label: '성공', changeKey: 'successChange' },
    { key: 'total', label: '합계' },
  ];

  const renderChart = () => {
    if (chartTab === 'all') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Bar dataKey="newRegistration" stackId="a" fill="#704de4" name="신규등록" />
            <Bar dataKey="inspection" stackId="a" fill="#9b7de8" name="검수할당" />
            <Bar dataKey="rejected" stackId="a" fill="#ff3a48" name="반려" />
            <Bar dataKey="success" stackId="a" fill="#00c853" name="성공" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    const colorMap = {
      newRegistration: '#704de4',
      inspection: '#9b7de8',
      rejected: '#ff3a48',
      success: '#00c853'
    };

    const labelMap = {
      newRegistration: '신규등록',
      inspection: '검수할당',
      rejected: '반려',
      success: '성공'
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
        <h1 className="page-title">입점 프로세스 지표</h1>
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
        <h3 className="section-title">입점 프로세스 추이</h3>
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

export default ListingProcess;
