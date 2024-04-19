import React from 'react';
import WorkHoursChart from '../../charts/WorkHoursChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCardWorkHours() {
    const chartData = {
        labels: ['Work Hours', 'Non-Working Hours'],
        datasets: [
            {
                data: [160, 40],
                backgroundColor: [
                    tailwindConfig().theme.colors.emerald[400],
                    tailwindConfig().theme.colors.slate[300],
                ],
                hoverBackgroundColor: [
                    tailwindConfig().theme.colors.emerald[500],
                    tailwindConfig().theme.colors.slate[400],
                ],
                borderWidth: 1,
                borderColor: tailwindConfig().theme.colors.slate[800],
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Work Hours Analysis</h2>
            </header>
            <div className="px-5 py-3">
                <WorkHoursChart data={chartData} width={389} height={260} />
            </div>
        </div>
    );
}

export default DashboardCardWorkHours;