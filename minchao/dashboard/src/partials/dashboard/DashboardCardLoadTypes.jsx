import React from 'react';
import LoadTypesChart from '../../charts/LoadTypesChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function DashboardCardLoadTypes() {
    const chartData = {
        labels: ['Hazardous Materials', 'Perishable Goods', 'Oversized Loads'],
        datasets: [
            {
                data: [35, 40, 25],
                backgroundColor: [
                    tailwindConfig().theme.colors.red[400],
                    tailwindConfig().theme.colors.green[400],
                    tailwindConfig().theme.colors.blue[400]
                ],
                hoverBackgroundColor: [
                    tailwindConfig().theme.colors.red[500],
                    tailwindConfig().theme.colors.green[500],
                    tailwindConfig().theme.colors.blue[500]
                ],
                borderWidth: 0.5,
                borderColor: tailwindConfig().theme.colors.slate[800],
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Types of Loads Handled</h2>
            </header>
            <div className="px-5 py-3">
                <LoadTypesChart data={chartData} width={389} height={260} />
            </div>
        </div>
    );
}

export default DashboardCardLoadTypes;