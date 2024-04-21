import React from 'react';
import DriverSafetyRecordsChart from '../../charts/DriverSafetyRecordsChart';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data, label, isPeer }) {
    const accidentsAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const violationsAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    // Define colors based on whether it's peer data or not
    const accidentColor = isPeer ? tailwindConfig().theme.colors.orange[500] : tailwindConfig().theme.colors.red[500];
    const violationColor = isPeer ? tailwindConfig().theme.colors.gray[500] : tailwindConfig().theme.colors.yellow[500];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: accidentColor, fontWeight: 'bold' }}>
                {Math.round(accidentsAvg)} Average Accidents ({label})
            </span>
            <span style={{ color: violationColor, fontWeight: 'bold' }}>
                {Math.round(violationsAvg)} Average Traffic Violations ({label})
            </span>
        </div>
    );
}

function DashboardCardSafetyRecords() {
    const truckDriverData = {
        labels: ['01-01-2020', '02-01-2020', '03-01-2020', '04-01-2020', '05-01-2020', '06-01-2020'],
        datasets: [{
            label: 'Number of Accidents',
            data: [2, 0, 3, 1, 0, 4],
            backgroundColor: tailwindConfig().theme.colors.red[400],
            hoverBackgroundColor: tailwindConfig().theme.colors.red[500],
            yAxisID: 'y-accidents',
            type: 'bar',
        }, {
            label: 'Number of Traffic Violations',
            data: [5, 2, 6, 3, 4, 5],
            borderColor: tailwindConfig().theme.colors.yellow[400],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            type: 'line',
            yAxisID: 'y-violations',
        }],
    };

    const peerData = {
        labels: ['01-01-2020', '02-01-2020', '03-01-2020', '04-01-2020', '05-01-2020', '06-01-2020'],
        datasets: [{
            label: 'Number of Accidents',
            data: [1, 1, 2, 0, 2, 3],
            backgroundColor: tailwindConfig().theme.colors.blue[400],
            hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
            yAxisID: 'y-accidents',
            type: 'bar',
        }, {
            label: 'Number of Traffic Violations',
            data: [4, 3, 5, 2, 3, 4],
            borderColor: tailwindConfig().theme.colors.green[400],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            type: 'line',
            yAxisID: 'y-violations',
        }],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Driver Safety Records Stats</h2>
            </header>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <SummaryComponent data={truckDriverData} label="Truck Driver" />
                    <DriverSafetyRecordsChart data={truckDriverData} width={595} height={248} />
                </div>
                <div>
                    <SummaryComponent data={peerData} label="Peer" isPeer={true} />
                    <DriverSafetyRecordsChart data={peerData} width={595} height={248} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Here is the suggestion: Consider strategies to reduce accidents and violations for both groups through enhanced training programs.</p>
            </div>
        </div>
    );

}

export default DashboardCardSafetyRecords;
