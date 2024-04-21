import React from 'react';
import TimeAdherenceChart from '../../charts/TimeAdherenceChart';
import { tailwindConfig } from '../../utils/Utils';

function SummaryComponent({ data, label, isPeer }) {
    const countsDeparture = data.datasets[0].data.reduce((acc, delay) => {
        acc.early = (acc.early || 0) + (delay < 0 ? 1 : 0);
        acc.late = (acc.late || 0) + (delay > 0 ? 1 : 0);
        return acc;
    }, {});

    const earlyDepartureColor = isPeer ? tailwindConfig().theme.colors.indigo[500] : tailwindConfig().theme.colors.green[500];
    const lateDepartureColor = isPeer ? tailwindConfig().theme.colors.pink[500] : tailwindConfig().theme.colors.red[500];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ color: earlyDepartureColor, fontWeight: 'bold' }}>
                    {countsDeparture.early} Times Early Departure ({label})
                </span>
                <br />
                <span style={{ color: lateDepartureColor, fontWeight: 'bold' }}>
                    {countsDeparture.late} Times Late Departure ({label})
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
                label: 'Actual Truck Driver Departure Time',
                data: [3, -1, 0, 2, -2, 4],
                backgroundColor: tailwindConfig().theme.colors.amber[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.amber[500],
                borderColor: tailwindConfig().theme.colors.amber[700],
                borderWidth: 1,
            },
            {
                label: 'Actual Truck Driver Arrival Time',
                data: [1, -4, 2, 0, -1, 5],
                backgroundColor: tailwindConfig().theme.colors.emerald[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.emerald[500],
                borderColor: tailwindConfig().theme.colors.emerald[700],
                borderWidth: 1,
            }
        ]
    };

    const peerChartData = {
        datasets: [
            {
                label: 'Actual Peer Departure Time',
                data: [2, -2, 1, 1, -1, -2],
                backgroundColor: tailwindConfig().theme.colors.rose[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.rose[500],
                borderColor: tailwindConfig().theme.colors.rose[700],
                borderWidth: 1,
            },
            {
                label: 'Actual Peer Arrival Time',
                data: [2, -1, 2, 1, -2, -1],
                backgroundColor: tailwindConfig().theme.colors.sky[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.sky[500],
                borderColor: tailwindConfig().theme.colors.sky[700],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Time Adherence Log</h2>
            </header>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={chartData} label="Truck Driver" />
                    <TimeAdherenceChart data={chartData} width={595} height={300} />
                </div>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={peerChartData} label="Peer" isPeer={true} />
                    <TimeAdherenceChart data={peerChartData} width={595} height={300} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Explore scheduling adjustments and traffic pattern analysis to improve time adherence for both truck drivers and peers.</p>
            </div>
        </div>
    );
}

export default DashboardCardTimeAdherence;
