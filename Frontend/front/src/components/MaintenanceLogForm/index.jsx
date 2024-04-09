import React, { useState } from 'react';

function MaintenanceLogForm() {
  const [log, setLog] = useState({
    serviceDate: '',
    maintenanceType: '',
    cost: '',
    notes: ''
  });

  const handleChange = (e) => {
    setLog({
      ...log,
      [e.target.name]: e.target.value
    });
  };

  const validateInput = () => {
    if (!log.serviceDate || !log.maintenanceType || log.cost === '') {
      alert('Error: All fields except notes are required.');
      return false;
    }
    if (isNaN(log.cost)) {
      alert('Error: Cost must be a valid number.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate input before proceeding
    if (!validateInput()) {
      // Input is not valid, return early without logging the form
      return;
    }
    
    console.log(log);
    // Reset form after successful submission
    setLog({
      serviceDate: '',
      maintenanceType: '',
      cost: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label htmlFor="serviceDate">Service Date:</label>
      <input
        type="date"
        name="serviceDate"
        value={log.serviceDate}
        onChange={handleChange}
      />
      <label htmlFor="maintenanceType">Maintenance Type:</label>
      <input
        type="text"
        name="maintenanceType"
        value={log.maintenanceType}
        onChange={handleChange}
      />
      <label htmlFor="cost">Cost:</label>
      <input
        type="number"
        name="cost"
        value={log.cost}
        onChange={handleChange}
      />
      <label htmlFor="notes">Notes:</label>
      <textarea
        name="notes"
        value={log.notes}
        onChange={handleChange}
      ></textarea>
      <button type="submit">Submit Log</button>
    </form>
  );
}

  // 添加样式对象
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    gap: '10px', // 为元素间提供一点空间
  };

export default MaintenanceLogForm;