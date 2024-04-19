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
    labels: ['Damage', 'Loss', 'Delay', 'Satisfaction'],
    datasets: [{
      label: 'Driver Performance',
      data: [10, 5, 15, 90], 
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-center items-center p-5 w-full h-full">
        <div style={{ width: '50%', height: '50%', marginLeft: '-50px' }}> {/* Adjust marginLeft to nudge the chart to the right */}
          <Radar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
