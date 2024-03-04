import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            const url = `https://api.tomorrow.io/v4/timelines?location=43.0722,-89.4008&fields=temperature&units=metric&apikey=IdbClpIoU4PJgVBF66bUSPx7o7i8egxp&startTime=2024-03-04T09:00:00Z`;
            console.log(url);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                    }
                });
                const data = await response.json();
                setWeatherData(data); 
            } catch (error) {
                console.error("Error fetching weather data:", error);
                console.log("failes");
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="weather-container">
            <h1>Today's weather is:</h1>
            {weatherData ? (
                <div>
                    <p>Temperature: {weatherData?.data?.timelines[0]?.intervals[0]?.values?.temperature}°C</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <Link to="/" className="back-button">Back to Main Page</Link>
        </div>
    );
}

export default Weather;
