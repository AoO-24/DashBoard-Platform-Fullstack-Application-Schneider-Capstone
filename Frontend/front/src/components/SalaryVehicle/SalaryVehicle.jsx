import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const SalaryVehicle = () => {
  const [driverData, setDriverData] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [driverInfo, setDriverInfo] = useState(null);

  useEffect(() => {
    // Function to parse the CSV file and update the state
    async function fetchData() {
      const response = await fetch('/data.csv');
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the csv text

      console.log("CSV data:", csv);
      const parsedData = Papa.parse(csv, { header: true, dynamicTyping: true }).data;
      // Clean up the data by trimming whitespace from keys and values
    const cleanedData = parsedData.map(driver => {
    const cleanedDriver = {};
    Object.keys(driver).forEach(key => {
      const trimmedKey = key.trim(); // Remove whitespace from keys
      cleanedDriver[trimmedKey] = driver[key].toString().trim(); // Remove whitespace from values
    });
    return cleanedDriver;
  });
  
  setDriverData(cleanedData);
    //   setDriverData(parsedData);
    }

    fetchData();
  }, []);

  const dataForChart = driverInfo ? [
    {
      name: 'salary',
      value: driverInfo.salary, // Replace with your actual base salary calculation
    },
    {
      name: 'size_of_vehicle',
      value: driverInfo.size_of_vehicle * 2000, // Example: Size multiplier
    },
    {
      name: 'level_of_dangerousness',
      value: driverInfo.level_of_dangerousness * 3000, // Example: Danger multiplier
    },
    {
      name: 'urban_rural',
      value: driverInfo.urban_rural === 'Rural' ? 5000 : 0, // Example: Rural bonus
    }
  ] : [];

  const handleSearch = () => {
    console.log("Searching for driver ID:", searchID);
    
    // Trim the search ID and ensure it's a string
    const trimmedSearchID = searchID.trim();
    // Find the driver, and ensure that the comparison is done with string values
    const driver = driverData.find(d => String(d.DriverID).trim() === trimmedSearchID);
  
    if (driver) {
      // If the driver is found, log the info and set the driverInfo state
      console.log("Found driver:", driver);
  
      // Prepare the driver info, ensuring all data is treated as strings
      const driverInfo = {
        DriverID: String(driver.DriverID).trim(),
        salary: String(driver.salary).trim(),
        size_of_vehicle: String(driver.size_of_vehicle).trim(),
        level_of_dangerousness: String(driver.level_of_dangerousness).trim(),
        urban_rural: String(driver.urban_rural).trim()
      };
  
      setDriverInfo(driverInfo);
    } else {
      console.log("Driver not found");
      setDriverInfo('Driver not found');
    }
  };
  
  

  return (
    <div>
      <h1>Driver Information</h1>
      <input
        type="text"
        placeholder="Enter Driver ID (1-100)"
        value={searchID}
        onChange={(e) => setSearchID(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      
      {driverInfo && (
        typeof driverInfo === 'string' ? <p>{driverInfo}</p> :
        <div>
          <p>Salary: ${driverInfo.salary}</p>
          <p>Size of Vehicle(1-5): {driverInfo.size_of_vehicle}</p>
          <p>Level of Dangerousness(1-5): {driverInfo.level_of_dangerousness}</p>
          <p>Area(urban or rural): {driverInfo.urban_rural}</p>
        </div>
      )}

{dataForChart.length > 0 && (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dataForChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis domain={[0, 'dataMax + 10000']} />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
)}
    </div>
  );
};

export default SalaryVehicle;
