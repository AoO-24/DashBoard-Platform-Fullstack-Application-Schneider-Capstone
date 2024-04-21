import React from 'react';
import LoadTypesChart from '../../charts/LoadTypesChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data, title }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px', margin: '10px 0' }}>
            <h3 style={{ color: tailwindConfig().theme.colors.slate[700], fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                {title} Summary
            </h3>
            {data.labels.map((label, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '6px 10px', borderBottom: '1px solid #ddd', marginBottom: '4px', fontSize: '14px' }}>
                    <span>{label}:</span>
                    <span style={{ fontWeight: 'bold' }}>{data.datasets[0].data[index]}</span>
                </div>
            ))}
        </div>
    );
}


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
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Types of Loads Handled for Last Month</h2>
            </header>
            <div className="px-5 py-3">
                <SummaryComponent data={chartData} title="Driver" />
                <LoadTypesChart data={chartData} width={389} height={260} />
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Summary: The goods you ship the most are perishable goods.</p>
            </div>
        </div>
    );
}

export default DashboardCardLoadTypes;