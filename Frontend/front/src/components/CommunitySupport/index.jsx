import React from 'react';
import { Link } from 'react-router-dom';
import './CommunitySupport.css';


function CommunitySupport() {
  return (
    <>
    <div className="community-support-container">
      <h1>Community Support</h1>
      <p>Welcome to the Schneider Trucking Community Support page. Here, you can find resources, share experiences, and connect with other trucking professionals.</p>
      
      <h2>Resources</h2>
      <p>Explore our extensive library of resources to help you navigate challenges on the road:</p>
      <ul>
        <li><a href="https://www.schneidertruckingexample.com/resources" target="_blank" rel="noopener noreferrer">Safety Guidelines</a></li>
        <li><a href="https://www.schneidertruckingexample.com/resources" target="_blank" rel="noopener noreferrer">Maintenance Tips</a></li>
        <li><a href="https://www.schneidertruckingexample.com/resources" target="_blank" rel="noopener noreferrer">Regulatory Updates</a></li>
      </ul>
      
      <h2>Forum</h2>
      <p>Join our community forum to ask questions, share tips, and connect with peers:</p>
      <Link to="/forum">Visit the Forum</Link>
      
      <h2>Contact Support</h2>
      <p>If you need direct assistance, our support team is here to help:</p>
      <p>Email: <a href="mailto:support@schneidertruckingexample.com">support@schneidertruckingexample.com</a></p>
      <p>Phone: 1-800-555-1234</p>
    </div>
    <Link to="/" className="back-to-home-link">Back to Home Page</Link>
    </>
  );
}

export default CommunitySupport;
