import React from 'react';
import { Link } from 'react-router-dom';

// Component for reporting 8 hours with back button
function EightHourReport() {
  return (
    <div className="hour-report-container">
      <h1>You reported 8 hours of driving today.</h1>
      <Link to="/" className="back-button">Back to Main Page</Link>
    </div>
  );
}

export default EightHourReport;

