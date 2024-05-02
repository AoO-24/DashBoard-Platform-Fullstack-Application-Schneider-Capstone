import React from 'react';
import { Link } from 'react-router-dom';

// Component for reporting 9 hours with back button
function NineHourReport() {
  return (
    <div className="hour-report-container">
      <h1>You reported 9 hours of driving today.</h1>
      <Link to="/" className="back-button">Back to Main Page</Link>
    </div>
  );
}

export default NineHourReport;