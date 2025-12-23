import React from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="date-range-picker">
      <span className="date-label">📅</span>
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="yyyy.MM.dd"
        locale={ko}
        className="date-picker-input"
      />
      <span className="date-separator">~</span>
      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat="yyyy.MM.dd"
        locale={ko}
        className="date-picker-input"
      />
    </div>
  );
};

export default DateRangePicker;
