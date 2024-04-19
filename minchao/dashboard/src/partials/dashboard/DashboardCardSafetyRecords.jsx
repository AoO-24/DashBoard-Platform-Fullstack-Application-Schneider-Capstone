import React from 'react';
import DriverSafetyRecordsChart from '../../charts/DriverSafetyRecordsChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    // Calculate average numbers and round them to the nearest whole number for clearer representation
    const accidentsAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const violationsAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: tailwindConfig().theme.colors.red[500], fontWeight: 'bold' }}>
                {accidentsAvg.toFixed(0)} Average Accidents
            </span>
            <span style={{ color: tailwindConfig().theme.colors.yellow[500], fontWeight: 'bold' }}>
                {violationsAvg.toFixed(0)} Average Traffic Violations
            </span>
        </div>
    );
}


function DashboardCardSafetyRecords() {
    const chartData = {
        labels: [
            '01-01-2020', '02-01-2020', '03-01-2020',
            '04-01-2020', '05-01-2020', '06-01-2020',
        ],
        datasets: [
            {
                label: 'Number of Accidents',
                data: [2, 0, 3, 1, 0, 4],
                backgroundColor: tailwindConfig().theme.colors.red[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.red[500],
                yAxisID: 'y-accidents',
                type: 'bar',
            },
            {
                label: 'Number of Traffic Violations',
                data: [5, 2, 6, 3, 4, 5],
                borderColor: tailwindConfig().theme.colors.yellow[400],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                type: 'line',
                yAxisID: 'y-violations',
            }
        ],

    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Driver Safety Records Stats</h2>
            </header>
            <SummaryComponent data={chartData} />
            <DriverSafetyRecordsChart data={chartData} width={595} height={248} />
        </div>
    );
}

export default DashboardCardSafetyRecords;
