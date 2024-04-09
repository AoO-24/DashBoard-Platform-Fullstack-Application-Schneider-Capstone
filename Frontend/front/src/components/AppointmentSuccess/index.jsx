import React from "react";
import { Link } from "react-router-dom";

function AppointmentSuccess() {
    return (
      <div className="success-container">
        <h1>Reserved successfully!</h1>
        <Link to="/" className="back-button">Back to Main Page</Link>
      </div>
    );
  }

  export default AppointmentSuccess;