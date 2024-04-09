import React from "react";
import { Link } from "react-router-dom"; // Corrected import statement

function Report() {
  return (
    <div className="report-time-container">
      <h1>How many hours did you drive today?</h1>
      <div className="buttons-container">
        <Link to="/report/6hour" className="time-button">
          6 Hour
        </Link>
        <Link to="/report/8hour" className="time-button">
          8 Hour
        </Link>
        <Link to="/report/9hour" className="time-button">
          9 Hour
        </Link>
      </div>
    </div>
  );
}

export default Report;
