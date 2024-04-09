import { Link } from "react-router-dom";
import React from "react";


function SummaryQuestion() {
    return (
      <div className="question-container">
        <p>What is the driving hour you think?</p>
        <p>For claiming question, call 5363335252</p>
        <p>Or text 6261116536</p>
        <Link to="/" className="back-button">Back to Main Page</Link>
      </div>
    );
  }

  export default SummaryQuestion;
  