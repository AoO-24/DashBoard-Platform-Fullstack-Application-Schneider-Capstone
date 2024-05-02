import React from 'react';
import BarChartTruckDriverSalary from '../../charts/BarChartTruckDriverSalary';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    // Calculate the average salary and work hours
    const averageSalary = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const averageHours = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    // Assuming formatValue returns a string formatted with a currency symbol by default,
    // we would want to adjust the format for the work hours here:
    // For example, if formatValue adds currency and you want just the number rounded to one decimal:
    const formattedSalary = formatValue(averageSalary); // This keeps the salary formatted with the currency
    const formattedHours = Math.round(averageHours * 10) / 10; // Rounds work hours to one decimal without currency

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: tailwindConfig().theme.colors.green[500], fontWeight: 'bold' }}>
                {formattedSalary} Average Monthly Salary
            </span>
            <span style={{ color: tailwindConfig().theme.colors.blue[500], fontWeight: 'bold' }}>
                {formattedHours} hrs Average Monthly Work Hours
            </span>
        </div>
    );
}



function DashboardCardTruckDriverSalary() {
    const chartData = {
        labels: [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun',
        ],
        datasets: [
            {
                label: 'Average Salary',
                data: [4150 + 1500, 4050 + 1500, 3000 + 1500, 3100 + 1500, 2500 + 1500, 2900 + 1500], // Set to approx 4655 each month
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y-salary',
                type: 'bar', // Specify as bar chart
            },
            {
                //hourly 28.75
                label: 'Average Work Hours',
                data: [150, 160, 100, 120, 90, 110], // Varied hours to show instability
                borderColor: tailwindConfig().theme.colors.blue[400],
                backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background for line chart
                type: 'line', // Specify as line chart
                yAxisID: 'y-hours',
            }
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Truck Driver Salary and Work Hours Stats</h2>
            </header>
            <SummaryComponent data={chartData} />
            <BarChartTruckDriverSalary data={chartData} width={595} height={248} />
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>
                    Consider establishing a consistent schedule to optimize productivity and keep a healthy work-life balance</p>
            </div>
        </div>
    );
}

export default DashboardCardTruckDriverSalary;
