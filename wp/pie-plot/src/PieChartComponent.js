import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
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

  return <Pie data={chartData} options={options} />;
};

export default PieChartComponent;
