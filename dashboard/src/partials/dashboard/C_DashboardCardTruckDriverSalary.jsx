import React from 'react';
import BarChartTruckDriverSalary from '../../charts/BarChartTruckDriverSalary';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data, isPeer }) {
    const averageSalary = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const averageHours = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    const formattedSalary = formatValue(averageSalary);
    const formattedHours = Math.round(averageHours * 10) / 10;

    // Define the salary and hours colors based on whether it's peer data or not
    const salaryTextColor = isPeer ? tailwindConfig().theme.colors.purple[500] : tailwindConfig().theme.colors.green[500];
    const hoursTextColor = isPeer ? tailwindConfig().theme.colors.teal[500] : tailwindConfig().theme.colors.blue[500];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: salaryTextColor, fontWeight: 'bold' }}>
                {formattedSalary} Average {isPeer ? 'Peer' : 'James'} Salary
            </span>
            <span style={{ color: hoursTextColor, fontWeight: 'bold' }}>
                {formattedHours} hrs Average {isPeer ? 'Peer' : 'James'} Work Hours
            </span>
        </div>
    );
}


function C_DashboardCardTruckDriverSalary() {
    const truckDriverData = {
        labels: [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun',
        ],
        datasets: [
            {
                label: 'Average Truck Driver Salary',
                data: [4150 + 1500, 4050 + 1500, 3000 + 1500, 3100 + 1500, 2500 + 1500, 2900 + 1500],
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y-salary',
                type: 'bar',
            },
            {
                label: 'Average Truck Driver Work Hours',
                data: [150, 160, 100, 120, 90, 110],
                borderColor: tailwindConfig().theme.colors.blue[400],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                type: 'line',
                yAxisID: 'y-hours',
            }
        ],
    };

    const peerData = {
        labels: [
            '01-01-2020', '02-01-2020', '03-01-2020',
            '04-01-2020', '05-01-2020', '06-01-2020',
        ],
        datasets: [
            {
                label: 'Average Peer Salary',
                data: [4150 + 1000, 4150 + 1000 + 300, 4150 + 1000 + 200, 4150 + 1000 + 300, 4150 + 1000 + 400, 4150 + 1000 + 100],
                backgroundColor: tailwindConfig().theme.colors.yellow[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.yellow[500],
                yAxisID: 'y-salary',
                type: 'bar',
            },
            {
                label: 'Average Peer Work Hours',
                data: [150, 170, 160, 165, 175, 158],
                borderColor: tailwindConfig().theme.colors.red[400],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                type: 'line',
                yAxisID: 'y-hours',
            }
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">James vs Peer Salary and Work Hours</h2>
            </header>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={truckDriverData} isPeer={false} />
                    <BarChartTruckDriverSalary data={truckDriverData} width={595} height={248} isPeer={false} />
                </div>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={peerData} isPeer={true} />
                    <BarChartTruckDriverSalary data={peerData} width={595} height={248} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>{"Please considering a more scheduled work hours each month."}</p>
            </div>
        </div>
    );
}

export default C_DashboardCardTruckDriverSalary;