// 文件路径: src/components/DestinationForm/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import truckImage from '../../assets/truck.jpeg'; // 确保正确导入图片
import './index.css'; // Add correct import statement for CSS file

function DestinationForm() {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加更多逻辑，比如发送到服务器
    navigate('/destination/confirmation', { state: { destination } }); // 使用state传递目的地信息
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit}>
      <label htmlFor="destination">Enter Your Destination:</label>
      <input
        type="text"
        id="destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
    <img src={truckImage} alt="Truck" className="truck-image" /> {/* 添加卡车图片 */}
  </div>
  );
}

export default DestinationForm;
