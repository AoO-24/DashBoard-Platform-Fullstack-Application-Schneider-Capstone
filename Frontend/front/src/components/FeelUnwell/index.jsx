import React from "react";
import { Link } from "react-router-dom";


function FeelUnwell() {
    return (
      <div className="appointment-container">
        <h1>Medical appointment:</h1>
        <p>The available times are:</p>
        <ul>
          <li>10 am today</li>
          <li>2 pm today</li>
          <li>6 pm today</li>
        </ul>
        <Link to="/appointment_success" className="appointment-button">10 am today</Link>
      </div>
    );
  }
  
  export default FeelUnwell;