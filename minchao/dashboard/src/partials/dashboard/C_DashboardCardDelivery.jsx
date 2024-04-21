import React from 'react';
import BarChartDelivery from '../../charts/BarChartDelivery';
import { tailwindConfig, formatValue } from '../../utils/Utils';

function SummaryComponent({ data, label, isPeer }) {
    const customerSatisfactionAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const breakageRateAvg = data.datasets[1].data.reduce((a, b) => a + b, 0) / data.datasets[1].data.length;

    const formattedSat = Math.round(customerSatisfactionAvg * 10) / 10;
    const formattedBreakageRate = Math.round(breakageRateAvg * 10) / 10;

    const satColor = isPeer ? tailwindConfig().theme.colors.blue[500] : tailwindConfig().theme.colors.green[500];
    const breakageColor = isPeer ? tailwindConfig().theme.colors.purple[500] : tailwindConfig().theme.colors.orange[500];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0' }}>
                <span style={{ color: satColor, fontWeight: 'bold' }}>
                    {formattedSat} Average Customer Satisfaction ({label})
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0' }}>
                <span style={{ color: breakageColor, fontWeight: 'bold' }}>
                    {formattedBreakageRate} Average Breakage Rate ({label})
                </span>
            </div>
        </div>
    );


}

function DashboardCardDelivery() {
    const truckDriverData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Customer Satisfaction (%)',
                data: [90, 90, 87, 93, 95, 85],
                backgroundColor: tailwindConfig().theme.colors.green[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
                yAxisID: 'y-percentage',
                barPercentage: 0.8,
            },
            {
                label: 'Breakage Rate (%)',
                data: [3, 2.5, 3.5, 2, 2.5, 5.5],
                borderColor: tailwindConfig().theme.colors.orange[500],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                yAxisID: 'y-breakage',
            }
        ],
    };

    const peerData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Customer Satisfaction (%)',
                data: [95, 96, 95, 95, 95, 98],
                backgroundColor: tailwindConfig().theme.colors.blue[400],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
                yAxisID: 'y-percentage',
                barPercentage: 0.8,
            },
            {
                label: 'Breakage Rate (%)',
                data: [2.5, 2.0, 2.3, 2.3, 2.0, 1.8],
                borderColor: tailwindConfig().theme.colors.purple[500],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                fill: false,
                yAxisID: 'y-breakage',
            }
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100 flex items-center">
                <h2 className="font-semibold text-lg text-gray-800">Delivery & Customer Satisfaction</h2>
            </header>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={truckDriverData} label="Truck Driver" />
                    <BarChartDelivery data={truckDriverData} width={595} height={300} />
                </div>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={peerData} label="Peer" isPeer={true} />
                    <BarChartDelivery data={peerData} width={595} height={300} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Consider exploring further measures to enhance customer satisfaction and reduce breakage rates across all teams.</p>
            </div>
        </div>
    );
}

export default DashboardCardDelivery;