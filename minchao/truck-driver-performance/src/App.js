import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function App() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    fetch('/data.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setDrivers(results.data);
          }
        });
      })
      .catch(error => console.error("Error loading CSV:", error));
  }, []);

  const handleSelectDriver = (event) => {
    setSelectedDriver(event.target.value);
  };

  const getChartData = () => {
    const driverData = drivers.find(d => d.DriverID === selectedDriver);
    return {
      labels: ['Damage', 'Loss', 'Delay', 'Satisfaction'],
      datasets: [
        {
          label: `Performance for ${selectedDriver}`,
          data: driverData ? [driverData.Damage, driverData.Loss, driverData.Delay, driverData.Satisfaction] : [0, 0, 0, 0],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }
      ]
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Truck Driver Performance</h1>
        <select value={selectedDriver} onChange={handleSelectDriver}>
          <option value="">Select a Driver</option>
          {drivers.map((driver, index) => (
            <option key={index} value={driver.DriverID}>{driver.DriverID}</option>
          ))}
        </select>
        <div className="chart-container" style={{ width: '50%', height: '50%' }}> 
          <Radar data={getChartData()} options={{
            scales: {
              r: {
                angleLines: {
                  display: false
                },
                suggestedMin: 0,
                suggestedMax: 100
              }
            }
          }} />
        </div>
      </header>
    </div>
  );
}

export default App;
