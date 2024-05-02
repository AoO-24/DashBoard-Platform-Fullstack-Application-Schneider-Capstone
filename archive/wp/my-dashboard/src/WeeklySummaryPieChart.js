import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';

// Register the components needed for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklySummaryPieChart = ({ data }) => {
  // Calculate total driving and waiting times
  const totals = data.reduce((acc, curr) => {
    acc.driving += curr.driving;
    acc.waiting += curr.waiting;
    return acc;
  }, { driving: 0, waiting: 0 });

  // Data for the pie chart
  const pieData = {
    labels: ['Total Driving Time', 'Total Non-Driving Time'],
    datasets: [
      {
        data: [totals.driving, totals.waiting],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the pie chart to control its appearance
  const options = {
    maintainAspectRatio: false, // This allows us to set a custom size
    // Additional options can be added here
  };

  return (
    <div style={{ width: '500px', height: '500px' }}> {/* Adjust the size as needed */}
      <Pie data={pieData} options={options} />
    </div>
  );
};

export default WeeklySummaryPieChart;
