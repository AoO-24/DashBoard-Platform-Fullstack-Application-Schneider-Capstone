import React from 'react';
import VehicleHealthChart from '../../charts/VehicleHealthChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCardVehicleHealth() {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Maintenance',
                data: [2, 3, 2, 4, 3, 3],
                backgroundColor: tailwindConfig().theme.colors.blue[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
                yAxisID: 'y',
                barPercentage: 0.66,
                categoryPercentage: 0.66,
                order: 2, // Set the order to 1 for the bar chart dataset
            },
            {
                label: 'Repairs',
                data: [1, 0, 2, 1, 0, 1],
                type: 'line',
                borderColor: tailwindConfig().theme.colors.red[500],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                yAxisID: 'y',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: tailwindConfig().theme.colors.red[500],
                pointBorderColor: tailwindConfig().theme.colors.white,
                pointBorderWidth: 2,
                order: 1, // Set the order to 2 for the line chart dataset
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Vehicle Maintenance and Repair Log</h2>
            </header>
            <div className="px-5 py-3">
                <VehicleHealthChart data={chartData} width={600} height={350} />
            </div>
        </div>
    );
}

export default DashboardCardVehicleHealth;