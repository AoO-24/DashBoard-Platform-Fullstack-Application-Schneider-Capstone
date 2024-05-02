import React from 'react';
import './AboutUs.css'; // 确保有对应的CSS文件
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <p>Welcome to Schneider Trucking, your reliable partner in transportation and logistics.</p>
      <p>Since our founding in 1935, Schneider has been a leading provider of transportation, logistics and related services. Our commitment to integrity, safety, and sustainability drives us to deliver excellence to our clients worldwide.</p>
      <h2>Our Mission</h2>
      <p>To provide the safest, most reliable transportation services, while continuously improving to meet our customers' needs.</p>
      <h2>Contact Us</h2>
      <p>For more information about our services, please get in touch:</p>
      <ul>
        <li>Email: contact@schneidertrucking.com</li>
        <li>Phone: 1-800-123-4567</li>
        <li>Address: 1234 Trucking Blvd, Green Bay, WI</li>
      </ul>
      <Link to="/" className="back-to-home-link">Back to Home Page</Link>
    </div>
  );
}

export default AboutUs;
