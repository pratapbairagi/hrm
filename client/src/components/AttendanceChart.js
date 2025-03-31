import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

const AttendanceChart = ({ attendanceData }) => {
  const chartData = {
    labels: attendanceData.dates,
    datasets: [
      {
        label: 'Attendance',
        data: attendanceData.attendanceCounts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return <Line data={chartData} />;
};

// Usage inside the Dashboard component
<AttendanceChart attendanceData={attendanceData} />
