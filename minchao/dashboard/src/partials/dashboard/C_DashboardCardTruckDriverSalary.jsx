import React from 'react';
import C_BarChartTruckDriverSalary from '../../charts/C_BarChartTruckDriverSalary';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    // Calculate the averages for the truck driver and peers
    const myAverageSalary = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const myAverageHours = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;
    const peerAverageSalary = data.datasets[2].data.reduce((a, b) => a + b, 0) / data.datasets[2].data.length;
    const peerAverageHours = data.datasets[3].data.reduce((a, b) => a + b, 0) / data.datasets[3].data.length;

    // Formatting values
    const formattedMySalary = formatValue(myAverageSalary);
    const formattedMyHours = Math.round(myAverageHours * 10) / 10 + ' hrs';
    const formattedPeerSalary = formatValue(peerAverageSalary);
    const formattedPeerHours = Math.round(peerAverageHours * 10) / 10 + ' hrs';

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
            <div>
                <span style={{ color: tailwindConfig().theme.colors.green[500], fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {formattedMySalary} My Average Salary
                </span>
                <br />
                <span style={{ color: tailwindConfig().theme.colors.blue[500], fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {formattedMyHours} My Average Work Hours
                </span>
            </div>
            <div>
                <span style={{ color: 'rgba(255, 99, 132, 0.8)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {formattedPeerSalary} Peer Average Salary
                </span>
                <br />
                <span style={{ color: 'rgba(54, 162, 235, 0.8)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {formattedPeerHours} Peer Average Work Hours
                </span>
            </div>
        </div>
    );
}

function C_DashboardCardTruckDriverSalary() {
    const chartData = {
        labels: [
            '01-01-2020', '02-01-2020', '03-01-2020',
            '04-01-2020', '05-01-2020', '06-01-2020',
        ],
        datasets: [
            {
                label: 'My Average Salary',
                data: [35000, 37000, 36000, 38000, 39000, 40000],
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y-salary',
                type: 'bar',
                order: 2,

            },
            {
                label: 'My Average Work Hours',
                data: [70, 72, 68, 74, 76, 73],
                borderColor: tailwindConfig().theme.colors.blue[400],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                type: 'line',
                yAxisID: 'y-hours',
                order: 1,

            },
            {
                label: 'Peer Average Salary',
                data: [34000, 36000, 37000, 37500, 38500, 39000],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                yAxisID: 'y-salary',
                order: 2,
            },
            {
                label: 'Peer Average Work Hours',
                data: [69, 71, 69, 75, 74, 72],
                borderColor: 'rgba(54, 162, 235, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                type: 'line',
                yAxisID: 'y-hours',
                order: 1,

            },
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Truck Driver and Peer Salary and Work Hours Stats</h2>
            </header>
            <SummaryComponent data={chartData} />
            <C_BarChartTruckDriverSalary data={chartData} width={595} height={248} />
        </div>
    );
}

export default C_DashboardCardTruckDriverSalary;
