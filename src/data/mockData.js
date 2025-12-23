import { subDays, format } from 'date-fns';

// Helper function to generate random number
const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to calculate change percentage
const calcChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

// Generate dates for the last N days
const generateDates = (days) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return dates;
};

// 1. Signup Metrics (회원가입 지표)
export const generateSignupData = (days = 30) => {
  const dates = generateDates(days);
  let previousGuest = randomNum(30, 50);
  let previousHost = randomNum(10, 25);

  return dates.map((date, index) => {
    const guest = randomNum(25, 60);
    const host = randomNum(8, 30);
    const guestChange = index === dates.length - 1 ? 0 : calcChange(guest, previousGuest);
    const hostChange = index === dates.length - 1 ? 0 : calcChange(host, previousHost);

    previousGuest = guest;
    previousHost = host;

    return {
      date,
      guest,
      host,
      total: guest + host,
      guestChange: parseFloat(guestChange),
      hostChange: parseFloat(hostChange),
      totalChange: parseFloat(calcChange(guest + host, previousGuest + previousHost))
    };
  });
};

// 2. Listing Process Metrics (입점 프로세스 지표)
export const generateListingData = (days = 30) => {
  const dates = generateDates(days);

  return dates.map((date, index) => {
    const newRegistration = randomNum(15, 40);
    const inspection = randomNum(10, 35);
    const rejected = randomNum(3, 12);
    const success = randomNum(8, 25);

    const prevNew = randomNum(15, 40);
    const prevInspection = randomNum(10, 35);
    const prevRejected = randomNum(3, 12);
    const prevSuccess = randomNum(8, 25);

    return {
      date,
      newRegistration,
      inspection,
      rejected,
      success,
      total: newRegistration + inspection + rejected + success,
      newRegistrationChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(newRegistration, prevNew)),
      inspectionChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(inspection, prevInspection)),
      rejectedChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(rejected, prevRejected)),
      successChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(success, prevSuccess))
    };
  });
};

// 3. Booking/Payment Metrics (예약/결제 지표)
export const generateBookingData = (days = 30) => {
  const dates = generateDates(days);

  return dates.map((date, index) => {
    const directPayment = randomNum(80, 150);
    const approvalPayment = randomNum(40, 90);
    const bookingComplete = directPayment + approvalPayment;
    const paymentComplete = randomNum(100, 200);
    const usageComplete = randomNum(80, 180);

    const prevDirect = randomNum(80, 150);
    const prevApproval = randomNum(40, 90);

    return {
      date,
      directPayment,
      approvalPayment,
      total: directPayment + approvalPayment,
      bookingComplete,
      paymentComplete,
      usageComplete,
      directPaymentChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(directPayment, prevDirect)),
      approvalPaymentChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(approvalPayment, prevApproval)),
      totalChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(directPayment + approvalPayment, prevDirect + prevApproval))
    };
  });
};

// 4. Space Performance (공간별 성과 지표)
export const generateSpacePerformanceData = (count = 100) => {
  const spaces = [];

  for (let i = 1; i <= count; i++) {
    const spaceId = 10000 + randomNum(1, 90000);
    const bookingCount = randomNum(5, 100);
    const paymentCount = randomNum(3, 80);
    const usageCount = randomNum(2, 70);
    const totalRevenue = randomNum(100000, 5000000);

    spaces.push({
      spaceId,
      spaceName: `공간 ${spaceId}`,
      bookingCount,
      paymentCount,
      usageCount,
      totalRevenue,
      bookingChange: parseFloat((Math.random() * 40 - 20).toFixed(1)),
      paymentChange: parseFloat((Math.random() * 40 - 20).toFixed(1)),
      usageChange: parseFloat((Math.random() * 40 - 20).toFixed(1)),
      revenueChange: parseFloat((Math.random() * 40 - 20).toFixed(1))
    });
  }

  return spaces.sort((a, b) => b.totalRevenue - a.totalRevenue);
};

// 5. Revenue Metrics (매출 지표)
export const generateRevenueData = (days = 30) => {
  const dates = generateDates(days);

  return dates.map((date, index) => {
    const paymentAmount = randomNum(5000000, 20000000);
    const transactionAmount = randomNum(4000000, 18000000);

    const prevPayment = randomNum(5000000, 20000000);
    const prevTransaction = randomNum(4000000, 18000000);

    return {
      date,
      paymentAmount,
      transactionAmount,
      paymentChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(paymentAmount, prevPayment)),
      transactionChange: index === dates.length - 1 ? 0 : parseFloat(calcChange(transactionAmount, prevTransaction))
    };
  });
};

// Aggregate data by week
export const aggregateByWeek = (data, valueKeys) => {
  const weeks = {};

  data.forEach(item => {
    const date = new Date(item.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    if (!weeks[weekKey]) {
      weeks[weekKey] = { date: weekKey };
      valueKeys.forEach(key => {
        weeks[weekKey][key] = 0;
      });
    }

    valueKeys.forEach(key => {
      weeks[weekKey][key] += item[key] || 0;
    });
  });

  return Object.values(weeks).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Aggregate data by month
export const aggregateByMonth = (data, valueKeys) => {
  const months = {};

  data.forEach(item => {
    const monthKey = item.date.substring(0, 7);

    if (!months[monthKey]) {
      months[monthKey] = { date: monthKey };
      valueKeys.forEach(key => {
        months[monthKey][key] = 0;
      });
    }

    valueKeys.forEach(key => {
      months[monthKey][key] += item[key] || 0;
    });
  });

  return Object.values(months).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Calculate totals
export const calculateTotals = (data, valueKeys) => {
  const totals = {};
  valueKeys.forEach(key => {
    totals[key] = data.reduce((sum, item) => sum + (item[key] || 0), 0);
  });
  return totals;
};

// Format number with commas
export const formatNumber = (num) => {
  return num?.toLocaleString('ko-KR') || '0';
};

// Format currency
export const formatCurrency = (num) => {
  return num?.toLocaleString('ko-KR') + '원' || '0원';
};
