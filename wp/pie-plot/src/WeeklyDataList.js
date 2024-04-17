import React from 'react';

const WeeklyDataList = ({ data }) => {
  return (
    <div className="data-list">
    <h2>Detailed Data</h2>
    <ul>
        {data.map((item, index) => (
        <li key={index}>
            <strong>{item.day}:</strong> Driving: {item.driving} hours, Waiting: {item.waiting} hours
        </li>
        ))}
    </ul>
    </div>
  );
};

export default WeeklyDataList;
