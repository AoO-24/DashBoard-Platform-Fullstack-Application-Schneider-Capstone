import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RemainingHours = () => {
    const [remainingHours, setRemainingHours] = useState(null);
    const [error, setError] = useState('');
    const { driverId, appointmentId } = useParams();

    useEffect(() => {
        const fetchRemainingHours = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/remaining-hours/${driverId}/${appointmentId}/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRemainingHours(data.remaining_hours);
            } catch (err) {
                setError('An error occurred while fetching data');
                console.error(err);
            }
        };

        if (driverId && appointmentId) {
            fetchRemainingHours();
        }
    }, [driverId, appointmentId]);

    return (
        <div>
            <h2>Remaining Hours</h2>
            {remainingHours !== null ? (
                <p>{remainingHours} hours remaining</p>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default RemainingHours;
