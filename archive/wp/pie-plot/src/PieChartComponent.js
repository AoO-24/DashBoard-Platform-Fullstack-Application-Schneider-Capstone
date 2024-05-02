import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import rawData from './data.json';

// Register the components you want to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Your other imports and the rest of your component code...

const PieChartComponent = () => {
  // Calculate the total driving and waiting times
  const totalDriving = rawData.reduce((acc, curr) => acc + curr.driving, 0);
  const totalWaiting = rawData.reduce((acc, curr) => acc + curr.waiting, 0);

  const chartData = {
    labels: ['Total Driving Time', 'Total Non-Driving Time'],
    datasets: [
      {
        label: 'Weekly Summary',
        data: [totalDriving, totalWaiting],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Wrap the Pie component with a div and apply the class
  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChartComponent;
