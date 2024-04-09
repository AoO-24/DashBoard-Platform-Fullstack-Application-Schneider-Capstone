// In data-processing-and-plots.js

// Function to plot graphs for a selected driver
function plotGraphsForDriver(driverData) {
    const plotsSection = document.getElementById('plots');
    plotsSection.innerHTML = ''; // Clear the plots section for new content

    // Create and append a new canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'performance-analysis-chart';
    canvas.width = 600; // Increased width for additional datasets
    canvas.height = 400; // Adjusted for better visualization
    plotsSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Define gradients for each dataset
    const speedGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    speedGradient.addColorStop(0, '#007bff'); // Bright blue
    speedGradient.addColorStop(1, '#6610f2'); // Deep purple

    const fuelGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fuelGradient.addColorStop(0, '#28a745'); // Green
    fuelGradient.addColorStop(1, '#dc3545'); // Red

    const satisfactionGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    satisfactionGradient.addColorStop(0, '#ffc107'); // Yellow
    satisfactionGradient.addColorStop(1, '#fd7e14'); // Orange

    // Initialize the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Driver ' + driverData.driverNumber], // Label for clarity
            datasets: [
                {
                    label: 'Average Speed (mph)',
                    data: [driverData.averageSpeed],
                    backgroundColor: speedGradient,
                    borderColor: '#343a40', // Dark gray for contrast
                    borderWidth: 1,
                    borderRadius: 2,
                    yAxisID: 'y',
                },
                {
                    label: 'Fuel Consumption (gallons/100 miles)',
                    data: [driverData.fuelConsumption],
                    backgroundColor: fuelGradient,
                    borderColor: '#343a40', // Dark gray for contrast
                    borderWidth: 1,
                    borderRadius: 2,
                    yAxisID: 'y1',
                },
                {
                    label: 'Customer Satisfaction (1-5 scale)',
                    data: [driverData.customerSatisfaction],
                    backgroundColor: satisfactionGradient,
                    borderColor: '#343a40', // Dark gray for contrast
                    borderWidth: 1,
                    borderRadius: 2,
                    yAxisID: 'y2',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    ticks: {
                        color: '#343a40', // Dark gray for readability
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)', // Light grid lines for subtlety
                    },
                    title: {
                        display: true,
                        text: 'Speed & Fuel Consumption',
                        color: '#343a40',
                    },
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        color: '#343a40', // Dark gray for readability
                    },
                    grid: {
                        drawOnChartArea: false, // Only show the grid for this axis
                    },
                    title: {
                        display: true,
                        text: 'Fuel Consumption',
                        color: '#343a40',
                    },
                },
                y2: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        color: '#343a40', // Dark gray for readability
                    },
                    grid: {
                        drawOnChartArea: false, // No grid lines
                    },
                    title: {
                        display: true,
                        text: 'Customer Satisfaction',
                        color: '#343a40',
                    },
                },
                x: {
                    ticks: {
                        color: '#343a40', // Dark gray for axis labels
                    },
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#343a40', // Dark gray for legend text
                        font: {
                            size: 14,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#007bff',
                    bodyColor: '#6610f2',
                    borderColor: '#343a40',
                    borderWidth: 1,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    mode: 'index',
                    intersect: false,
                }
            },
            // Keep the animation as it was
            animation: {
                duration: 2000, // Slower animation for a dramatic entrance
                easing: 'easeOutElastic', // Creates a stretching effect for the bars
                onProgress: (animation) => {
                    canvas.style.opacity = animation.currentStep / animation.numSteps;
                },
            },
        }
    });
}




// Step 1: Data Processing and Analysis
fetch('data_v2.csv')
    .then(response => response.text())
    .then(csvData => {
        // Parse CSV data
        const parsedData = Papa.parse(csvData, { header: true }).data;

        // Perform data processing and analysis
        const processedData = parsedData.map(row => ({
            driverNumber: row.DRIVER_NUMBER,
            averageSpeed: parseFloat(row.AVERAGE_SPEED),
            fuelConsumption: parseFloat(row.FUEL_CONSUMPTION),
            incidents: parseInt(row.INCIDENTS),
            customerSatisfaction: parseInt(row.CUSTOMER_SATISFACTION)
        }));

        // Populate driver selection dropdown
        const driverSelect = document.getElementById('driver-select');
        processedData.forEach(data => {
            const option = document.createElement('option');
            option.value = data.driverNumber; // Use driver number as value
            option.text = data.driverNumber;
            driverSelect.add(option);
        });

        // Add event listener to driver select dropdown
        driverSelect.addEventListener('change', function () {
            const selectedDriverData = processedData.find(data => data.driverNumber === this.value);
            if (selectedDriverData) {
                plotGraphsForDriver(selectedDriverData);
            }
        });

        // Optionally, plot graphs for the first driver on initial load
        if (processedData.length > 0) {
            plotGraphsForDriver(processedData[0]);
            driverSelect.value = processedData[0].driverNumber; // Set initial selection
        }
    })
    .catch(error => console.error('Error fetching or parsing data:', error));
