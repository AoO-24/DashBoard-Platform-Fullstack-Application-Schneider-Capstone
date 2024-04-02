import React, { useState, useEffect } from 'react';

function RemainingHoursView({ driverId, appointmentId }) {
  // Setting state to store remaining Hours.
  const [remainingHours, setRemainingHours] = useState('Loading...');

  useEffect(() => {
    //URL
    const apiUrl = `/api/remaining-hours/${driverId}/${appointmentId}/`;

    // Request
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Update the status reflecting remaining hours
        setRemainingHours(data.remaining_hours);
      })
      .catch(error => {
        console.error('Error fetching remaining hours:', error);
        setRemainingHours('Failed to load');
      });
  }, [driverId, appointmentId]); // 依赖项数组确保了当driverId或appointmentId变化时重新发起请求

 // render
  return (
    <div>
      Remaining Hours: {remainingHours}
    </div>
  );
}

export default RemainingHoursView;
