import React from 'react';
import FuelConsumptionChart from '../../charts/FuelConsumptionChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCardFuelConsumption() {
    const chartData = {
        labels: ['01/2020', '02/2020', '03/2020', '04/2020', '05/2020', '06/2020'],
        datasets: [
            {
                label: 'Fuel Consumption',
                data: [7.8, 7.5, 7.0, 7.3, 6.8, 7.9],
                backgroundColor: tailwindConfig().theme.colors.blue[500],
                borderColor: tailwindConfig().theme.colors.blue[700],
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: tailwindConfig().theme.colors.blue[300],
                pointBorderColor: tailwindConfig().theme.colors.blue[700],
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Fuel Consumption Over Time</h2>
            </header>
            <div className="px-5 py-3">
                <FuelConsumptionChart data={chartData} width={600} height={350} />
            </div>
        </div>
    );
}

export default DashboardCardFuelConsumption;