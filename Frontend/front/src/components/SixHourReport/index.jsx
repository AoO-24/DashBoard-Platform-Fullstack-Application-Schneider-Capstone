import { Link } from "react-router-dom";
import React from "react";

// Component for reporting 6 hours with back button
function SixHourReport() {
  return (
    <div className="hour-report-container">
      <h1>You reported 6 hours of driving today.</h1>
      <Link to="/" className="back-button">
        Back to Main Page
      </Link>
    </div>
  );
}

export default SixHourReport;
