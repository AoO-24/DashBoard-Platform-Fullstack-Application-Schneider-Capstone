// 文件路径: src/components/DestinationSuccess/index.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function DestinationSuccess() {
  const location = useLocation();
  const { destination } = location.state; // Again, 'destination' is a string

  return (
    <div className="success-container">
      <h2>Destination Submitted Successfully!</h2>
      <p>Your destination has been recorded. Safe travels!</p>
      <iframe
        src={`https://embed.waze.com/iframe?zoom=12&lat=45.6906304&lon=-120.810983&pin=1&q=${encodeURIComponent(destination)}`}
        width="100%"
        height="400"
        title="Waze live map"
      ></iframe>
      <Link to="/" className="back-to-home-link">Back to Home Page</Link>
    </div>
  );
}

export default DestinationSuccess;