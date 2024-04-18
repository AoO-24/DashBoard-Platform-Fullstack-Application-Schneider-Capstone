import React from 'react';
import BarChartDelivery from '../../charts/BarChartDelivery';  // Adjust the import path as needed
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    // const customerSatisfactionAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    // const fuelEfficiencyAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;
    const customerSatisfactionAvg = 10;
    const fuelEfficiencyAvg = 20;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: tailwindConfig().theme.colors.purple[500], fontWeight: 'bold' }}>
                {formatValue(customerSatisfactionAvg, 'percent')} Customer Satisfaction
            </span>
            <span style={{ color: tailwindConfig().theme.colors.orange[500], fontWeight: 'bold' }}>
                {formatValue(fuelEfficiencyAvg)} L/100 km Fuel Efficiency
            </span>
        </div>
    );
}

function DashboardCardDelivery() {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Customer Satisfaction (%)',
                data: [88, 90, 87, 93, 95, 91],
                backgroundColor: tailwindConfig().theme.colors.purple[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.purple[600],
                yAxisID: 'y-percentage',
                type: 'bar',
            },
            {
                label: 'Fuel Efficiency (L/100 km)',
                data: [10, 9.5, 9, 8.5, 8, 7.5],
                backgroundColor: tailwindConfig().theme.colors.orange[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.orange[600],
                yAxisID: 'y-efficiency',
                type: 'bar',
            }
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Delivery & Customer Satisfaction</h2>
            </header>
            <SummaryComponent data={chartData} />
            <BarChartDelivery data={chartData} width={595} height={248} />
        </div>
    );
}

export default DashboardCardDelivery;
