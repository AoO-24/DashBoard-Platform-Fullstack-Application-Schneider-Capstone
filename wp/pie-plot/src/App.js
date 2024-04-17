import React from 'react';
import PieChartComponent from './PieChartComponent';
import WeeklyDataList from './WeeklyDataList'; // Make sure to create this component
import rawData from './data.json';
import './App.css';

const App = () => {
  return (
  <main>
    <h1>Weekly Summary</h1>
    <PieChartComponent />
    <WeeklyDataList data={rawData} />
  </main>
  );
};

export default App;
