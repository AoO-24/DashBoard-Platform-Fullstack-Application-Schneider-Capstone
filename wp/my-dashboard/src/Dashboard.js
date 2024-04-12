
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'Total Time Driving',
        data: data.map(item => item.driving),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Total Time Waiting',
        data: data.map(item => item.waiting),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  return <Bar data={chartData} />;
};

export default Dashboard;
