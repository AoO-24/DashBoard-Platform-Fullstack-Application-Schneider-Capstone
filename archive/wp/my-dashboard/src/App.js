import React from 'react';
import './App.css';
import WeeklySummaryPieChart from './WeeklySummaryPieChart';
import data from './data.json'; // Your data

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Weekly Summary</h2>
        <WeeklySummaryPieChart data={data} />
      </header>
    </div>
  );
}

export default App;
