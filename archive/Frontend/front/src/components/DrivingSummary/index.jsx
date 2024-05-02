
import React from "react";
import { Link } from 'react-router-dom';

function DrivingSummary() {
    return (
      <div className="summary-container">
        <h1>Driving Summary:</h1>
        <Link to="/feel_unwell" className="summary-button">Feel unwell? Click here</Link>
        <Link to="/summary_question" className="summary-button">Having question about this summary? Click here</Link>
      </div>
    );
  }

export default DrivingSummary;