import React from 'react';
import TimeAdherenceChart from '../../charts/TimeAdherenceChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data }) {
    const countsDeparture = data.datasets[0].data.reduce((acc, delay) => {
        acc.early += delay < 0 ? 1 : 0;
        acc.late += delay > 0 ? 1 : 0;
        return acc;
    }, { early: 0, late: 0 });

    const countsArrival = data.datasets[1].data.reduce((acc, delay) => {
        acc.early += delay < 0 ? 1 : 0;
        acc.late += delay > 0 ? 1 : 0;
        return acc;
    }, { early: 0, late: 0 });

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ color: tailwindConfig().theme.colors.green[500], fontWeight: 'bold' }}>
                    {countsDeparture.early} Times Early Departure
                </span>
                <br />
                <span style={{ color: tailwindConfig().theme.colors.red[500], fontWeight: 'bold' }}>
                    {countsDeparture.late} Times Late Departure
                </span>
            </div>
            <div style={{ textAlign: 'center' }}>
                <span style={{ color: tailwindConfig().theme.colors.green[500], fontWeight: 'bold' }}>
                    {countsArrival.early} Times Early Arrival
                </span>
                <br />
                <span style={{ color: tailwindConfig().theme.colors.red[500], fontWeight: 'bold' }}>
                    {countsArrival.late} Times Late Arrival
                </span>
            </div>
        </div>
    );
}

function DashboardCardTimeAdherence() {
    const chartData = {
        labels: ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5'],
        datasets: [
            {
                label: 'Departure Delay',
                data: [5, -3, 0, 2, -1, 4],
                backgroundColor: tailwindConfig().theme.colors.red[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.red[500],
                borderColor: tailwindConfig().theme.colors.red[700],
                borderWidth: 1,
            },
            {
                label: 'Arrival Delay',
                data: [3, -2, 1, 0, -2, 5],
                backgroundColor: tailwindConfig().theme.colors.blue[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
                borderColor: tailwindConfig().theme.colors.blue[700],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full md:col-span-8 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Time Adherence Log</h2>
            </header>
            <SummaryComponent data={chartData} />
            <div className="px-5 py-3">
                <TimeAdherenceChart data={chartData} width={600} height={350} />
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Consider redistributing work hours to improve employee satisfaction and productivity.</p>
            </div>
        </div>
    );
}

export default DashboardCardTimeAdherence;