import React from 'react';
import BarChartDelivery from '../../charts/BarChartDelivery';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    const customerSatisfactionAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const breakageRateAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    const formattedSat = Math.round(customerSatisfactionAvg * 10) / 10;
    const formattedbreakageRate = Math.round(breakageRateAvg * 10) / 10;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: tailwindConfig().theme.colors.green[500], fontWeight: 'bold' }}>
                {formattedSat}% Average Customer Satisfaction
            </span>
            <span style={{ color: tailwindConfig().theme.colors.orange[500], fontWeight: 'bold' }}>
                {formattedbreakageRate}% Average Breakage Rate
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
                data: [88, 90, 87, 93, 95, 85],
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y-percentage',
                barPercentage: 0.8,
                categoryPercentage: 0.8,
                order: 2,
            },
            {
                label: 'Breakage Rate (%)',
                data: [3, 2.5, 3.5, 2, 2.5, 5.5],
                type: 'line',
                borderColor: tailwindConfig().theme.colors.orange[500],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                yAxisID: 'y-breakage',
                order: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100 flex items-center">
                <h2 className="font-semibold text-lg text-gray-800">Delivery & Customer Satisfaction</h2>
            </header>
            <SummaryComponent data={chartData} />
            <div className="px-5 py-3">
                <BarChartDelivery data={chartData} width={595} height={300} />
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Consider redistributing work hours to improve employee satisfaction and productivity.</p>
            </div>
        </div>
    );
}

export default DashboardCardDelivery;