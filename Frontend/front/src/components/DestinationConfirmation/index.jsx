// 文件路径: src/components/DestinationConfirmation/index.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css'; 

function DestinationConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination } = location.state; // 从state获取目的地信息

  const handleConfirm = () => {
    navigate('/destination/success', { state: { destination } });
  };

  return (
    <div className="confirmation-container">
      <h2>Confirm Your Destination</h2>
      <p>You entered: {destination}</p>
      
      <iframe 
        src="https://embed.waze.com/iframe?zoom=12&lat=45.6906304&lon=-120.810983"
        width="100%" 
        height="400"
        style={{ border: 'none', borderRadius: '8px', margin: '20px 0' }}
        title="Waze Live Map">
      </iframe>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
    
    
  );
}

export default DestinationConfirmation;
