import React from 'react';
import FuelConsumptionChart from '../../charts/FuelConsumptionChart';
import { tailwindConfig } from '../../utils/Utils';

function SummaryComponent({ data, label, isPeer }) {
    // Calculate average fuel consumption
    const fuelConsumptionAvg = data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length;
    const formattedFuelConsumption = Math.round(fuelConsumptionAvg * 10) / 10;

    // Define color based on whether it's peer data or not
    const fuelColor = isPeer ? tailwindConfig().theme.colors.purple[500] : tailwindConfig().theme.colors.blue[500];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
            <span style={{ color: fuelColor, fontWeight: 'bold' }}>
                {formattedFuelConsumption} MPG Average Fuel Consumption ({label})
            </span>
        </div>
    );
}


function DashboardCardFuelConsumption() {
    const truckDriverData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Truck Driver Fuel Consumption',
                data: [7.8, 7.5, 7.0, 7.3, 7.0, 7.9],
                backgroundColor: tailwindConfig().theme.colors.blue[500],
                borderColor: tailwindConfig().theme.colors.blue[700],
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: tailwindConfig().theme.colors.blue[300],
                pointBorderColor: tailwindConfig().theme.colors.blue[700],
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };

    const peerData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Peer Fuel Consumption',
                data: [7.1, 7.2, 7.5, 7.0, 7.2, 7.1],
                backgroundColor: tailwindConfig().theme.colors.purple[500],
                borderColor: tailwindConfig().theme.colors.purple[700],
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: tailwindConfig().theme.colors.purple[300],
                pointBorderColor: tailwindConfig().theme.colors.purple[700],
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100 flex items-center">
                <h2 className="font-semibold text-lg text-gray-800">Fuel Consumption Over Time</h2>
            </header>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={truckDriverData} label="Truck Driver" />
                    <FuelConsumptionChart data={truckDriverData} width={595} height={300} />
                </div>
                <div style={{ flex: 1 }}>
                    <SummaryComponent data={peerData} label="Peer" isPeer={true} />
                    <FuelConsumptionChart data={peerData} width={595} height={300} isPeer={true} />
                </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '20px' }}>
                <p style={{ color: '#333', fontSize: '14px' }}>Consider exploring energy-efficient driving techniques and vehicle maintenance to reduce fuel consumption.</p>
            </div>
        </div>
    );
}

export default DashboardCardFuelConsumption;
