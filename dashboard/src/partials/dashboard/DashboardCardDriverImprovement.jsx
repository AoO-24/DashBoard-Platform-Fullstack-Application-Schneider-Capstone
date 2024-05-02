import React from 'react';
import DriverImprovementChart from '../../charts/DriverImprovementChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCardDriverImprovement() {
    const chartData = {
        labels: ['Improvement Areas'],
        datasets: [
            {
                label: 'Time Management',
                data: [20],
                backgroundColor: tailwindConfig().theme.colors.red[500],
            },
            {
                label: 'Fuel Efficiency',
                data: [15],
                backgroundColor: tailwindConfig().theme.colors.green[500],
            },
            {
                label: 'Safety Compliance',
                data: [30],
                backgroundColor: tailwindConfig().theme.colors.blue[500],
            },
            {
                label: 'Customer Feedback',
                data: [10],
                backgroundColor: tailwindConfig().theme.colors.yellow[500],
            },
        ],
    };

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Driver Improvement Aspects</h2>
            </header>
            <div className="px-5 py-3">
                <DriverImprovementChart data={chartData} width={595} height={248} />
            </div>
        </div>
    );
}

export default DashboardCardDriverImprovement;
