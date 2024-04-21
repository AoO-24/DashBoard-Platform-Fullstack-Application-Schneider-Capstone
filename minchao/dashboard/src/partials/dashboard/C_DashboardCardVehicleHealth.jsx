import React from 'react';
import VehicleHealthChart from '../../charts/VehicleHealthChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data, isPeer }) {
    const maintenanceAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const repairsAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    // Updated color selections for better contrast
    const maintenanceColor = isPeer ? tailwindConfig().theme.colors.amber[600] : tailwindConfig().theme.colors.green[600];
    const repairsColor = isPeer ? tailwindConfig().theme.colors.orange[600] : tailwindConfig().theme.colors.red[600];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: maintenanceColor, fontWeight: 'bold' }}>
                {formatValue(maintenanceAvg)} Average Maintenance
            </span>
            <span style={{ color: repairsColor, fontWeight: 'bold' }}>
                {formatValue(repairsAvg)} Average Repairs
            </span>
        </div>
    );
}

function DashboardCardVehicleHealth() {
    const truckDriverData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Maintenance',
                data: [2, 3, 2, 4, 3, 3],
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y',
                order: 2,
            },
            {
                label: 'Repairs',
                data: [1, 0, 2, 1, 0, 1],
                borderColor: tailwindConfig().theme.colors.red[500],
                type: 'line',
                order: 1,
            }
        ]
    };

    const peerData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Peer Maintenance',
                data: [1, 2, 2, 3, 2, 2],
                backgroundColor: tailwindConfig().theme.colors.amber[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.amber[500],
                yAxisID: 'y',
                order: 2,
            },
            {
                label: 'Peer Repairs',
                data: [0, 1, 1, 2, 1, 0],
                borderColor: tailwindConfig().theme.colors.orange[500],
                type: 'line',
                order: 1,
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Vehicle Maintenance and Repair Log</h2>
            </header>


            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={truckDriverData} isPeer={false} />
                    <VehicleHealthChart data={truckDriverData} width={600} height={350} />
                </div>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={peerData} isPeer={true} />
                    <VehicleHealthChart data={peerData} width={600} height={350} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>
                    Review and optimize maintenance schedules to reduce repair frequency and costs.
                </p>
            </div>
        </div>
    );

}

export default DashboardCardVehicleHealth;
