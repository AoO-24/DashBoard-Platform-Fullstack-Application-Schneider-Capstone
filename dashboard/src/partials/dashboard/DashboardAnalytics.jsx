import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function DashboardAnalytics() {
  const data = {
    labels: ['Fuel Efficiency', 'Safety Record', 'On-Time Delivery', 'Compliance', 'Customer Feedback', 'Vehicle Maintenance'],
    datasets: [{
      label: 'Driver Performance',
      data: [80, 95, 90, 85, 88, 92], // Example scores for each metric
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(75, 192, 192)'
    }]
  };

  const options = {
    scales: {
      r: {
        grid: {
          color: 'rgba(200, 200, 200, 0.8)' // Lighter grid lines
        },
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 16 // Change the font size here
          },
          // Optional: if you want to change the font color, you can add it here as well
          color: '#444' // This will set the font color to a darker grey
        },
        ticks: {
          // This will change the label font size
          font: {
            size: 12 // Set the size you want for the labels
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 5 // Thicker lines
      },
      point: {
        radius: 10 // More prominent points
      }
    },
    plugins: {
      legend: {
        position: 'top', // Align legend with other charts
        labels: {
          font: {
            size: 14 // Adjust font size to match other charts
          }
        }
      },
      tooltip: {
        enabled: true, // Enable tooltips
        mode: 'index',
        intersect: false
      }
    },
    maintainAspectRatio: true // Maintain the aspect ratio
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-center items-center w-full h-full">
        <div style={{ width: '50%', height: 'auto' }}> {/* Adjust width and height here */}
          <Radar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
