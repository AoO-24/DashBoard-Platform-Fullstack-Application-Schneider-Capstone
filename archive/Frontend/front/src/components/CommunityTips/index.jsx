import React from 'react';
import { Link } from 'react-router-dom';

function CommunityTips() {
  return (
    <div className="tips-container">
      <h1>Here are the links of some helpful information:</h1>
      <h2> </h2>
      <h2> </h2>
      <h3>https://newsinhealth.nih.gov/2020/06/safe-driving#:~:text=Always%20keep%20your%20eyes%20on,Drive%20at%20the%20speed%20limit</h3>
      <h2> </h2>
      <h3>https://www.nationwide.com/lc/resources/auto-insurance/articles/driving-safety-tips</h3>
      <h2> </h2>
      <h3>https://wisconsindot.gov/Pages/safety/education/safedriving.aspx</h3>
      
      <Link to="/" className="back-button">Back to Main Page</Link>
    </div>
  );
}

export default CommunityTips;


  