
const originalBorderWidth = 1;
const hoverBorderWidth = 8;
const originalBorderColor = '#343a40'; // Dark gray for contrast
const hoverBorderColor = '#ffdc00'; // Bright yellow for hover


function createCanvas(canvasId, width = 60, height = 40) {
    const plotsSection = document.getElementById('plots');
    const existingCanvas = document.getElementById(canvasId);
    if (existingCanvas) {
        plotsSection.removeChild(existingCanvas);
    }
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.width = width;
    canvas.height = height;
    plotsSection.appendChild(canvas);
    return canvas.getContext('2d');
}



function getPeersDataForComparison(driverData, processedData) {
    console.log("driver: ", driverData)
    console.log("processed: ", processedData)
    const peers = processedData.filter(data =>
        data.weeklySalary > driverData.weeklySalary &&
        data.routeComplexity == driverData.routeComplexity);

    if (peers.length === 0) {
        return null; // No peers found for comparison
    }

    // Calculate averages for comparison
    const averages = peers.reduce((acc, peer, index, array) => {
        // Check if it's the last row
        if (index === array.length - 1) {
            // Optionally, you can perform any final calculations or actions here
            return acc;
        }

        console.log("peer: ", peer)
        acc.averageSpeed += peer.averageSpeed;
        acc.fuelConsumption += peer.fuelConsumption;
        acc.customerSatisfaction += peer.customerSatisfaction;
        console.log("acc: ", acc)
        acc.count++;
        return acc;


    }, { averageSpeed: 0, fuelConsumption: 0, customerSatisfaction: 0, count: 0 });

    averages.averageSpeed /= averages.count;
    averages.fuelConsumption /= averages.count;
    averages.customerSatisfaction /= averages.count;

    return averages; // Return averages for plotting
}

function plotDeliveriesVsHours(processedData) {
    const ctx = createCanvas('deliveries-hours-chart', 600, 400);
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Deliveries vs Hours Worked',
                data: processedData.map(data => ({
                    x: data.hoursWorked,
                    y: data.deliveriesCompleted
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Hours Worked' },
                    beginAtZero: true
                },
                y: {
                    title: { display: true, text: 'Deliveries Completed' },
                    beginAtZero: true
                }
            }
        }
    });
}

function plotSalaryDistribution(processedData) {
    const ctx = createCanvas('salary-distribution-chart', 600, 400);
    const salaries = processedData.map(data => data.weeklySalary);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['<1000', '1000-2000', '2000-3000', '>3000'],
            datasets: [{
                label: 'Number of Drivers',
                data: [
                    salaries.filter(salary => salary < 1000).length,
                    salaries.filter(salary => salary >= 1000 && salary < 2000).length,
                    salaries.filter(salary => salary >= 2000 && salary < 3000).length,
                    salaries.filter(salary => salary > 3000).length,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Drivers'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Weekly Salary Ranges'
                    }
                }
            }
        }
    });
}


function plotTrafficImpactOnSpeed(processedData) {
    const ctx = createCanvas('traffic-speed-chart', 600, 400);
    const trafficLevels = ['Low', 'Medium', 'High'];
    const speedData = trafficLevels.map(level => {
        return {
            label: level,
            data: processedData.filter(data => data.trafficLevel === level).map(data => data.averageSpeed),
            backgroundColor: trafficLevels.indexOf(level) === 0 ? '#007bff' : (trafficLevels.indexOf(level) === 1 ? '#ffc107' : '#dc3545'),
        };
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: processedData.map(data => `Driver ${data.driverNumber}`),
            datasets: speedData
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Average Speed (mph)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}



// Alston's code
// function plotDeliveriesVsHours(processedData) {
//     const ctx = document.getElementById('deliveries-hours-chart').getContext('2d');
//     new Chart(ctx, {
//         type: 'scatter',
//         data: {
//             datasets: [{
//                 label: 'Deliveries vs Hours Worked',
//                 data: processedData.map(data => ({
//                     x: data.hoursWorked,
//                     y: data.deliveriesCompleted
//                 })),
//                 backgroundColor: 'rgba(255, 99, 132, 0.6)'
//             }]
//         },
//         options: {
//             scales: {
//                 x: {
//                     title: { display: true, text: 'Hours Worked' },
//                     beginAtZero: true
//                 },
//                 y: {
//                     title: { display: true, text: 'Deliveries Completed' },
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// // Alston's code
// function plotSalaryDistribution(processedData) {
//     const ctx = document.getElementById('salary-distribution-chart').getContext('2d');
//     const salaries = processedData.map(data => data.weeklySalary);
//     const chart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['<1000', '1000-2000', '2000-3000', '>3000'],
//             datasets: [{
//                 label: 'Number of Drivers',
//                 data: [
//                     salaries.filter(salary => salary < 1000).length,
//                     salaries.filter(salary => salary >= 1000 && salary < 2000).length,
//                     salaries.filter(salary => salary >= 2000 && salary < 3000).length,
//                     salaries.filter(salary => salary > 3000).length,
//                 ],
//                 backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Number of Drivers'
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Weekly Salary Ranges'
//                     }
//                 }
//             }
//         }
//     });
// }

// //Alston's code
// function plotTrafficImpactOnSpeed(processedData) {
//     const ctx = document.getElementById('traffic-speed-chart').getContext('2d');
//     const trafficLevels = ['Low', 'Medium', 'High'];
//     const speedData = trafficLevels.map(level => {
//         return {
//             label: level,
//             data: processedData.filter(data => data.trafficLevel === level).map(data => data.averageSpeed),
//             backgroundColor: trafficLevels.indexOf(level) === 0 ? '#007bff' : (trafficLevels.indexOf(level) === 1 ? '#ffc107' : '#dc3545'),
//         };
//     });

//     const chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: processedData.map(data => `Driver ${data.driverNumber}`),
//             datasets: speedData
//         },
//         options: {
//             scales: {
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Average Speed (mph)'
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: true
//                 }
//             }
//         }
//     });
// }


// Function to plot graphs for a selected driver
function plotGraphsForDriver(driverData, averages, peerAverages) {
    console.log("peer avg: ", peerAverages)
    const plotsSection = document.getElementById('plots');
    plotsSection.innerHTML = ''; // Clear the plots section for new content

    const canvas = document.createElement('canvas');
    canvas.id = 'performance-analysis-chart';
    canvas.width = 600; // Increased width for additional datasets
    canvas.height = 400; // Adjusted for better visualization
    plotsSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Define gradients for the driver and peers datasets
    const driverGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    driverGradient.addColorStop(0, '#007bff'); // Bright blue for driver
    driverGradient.addColorStop(1, '#9400D3'); // Deep purple for driver

    const peerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    peerGradient.addColorStop(0, '#FFA500'); // Orange for peers
    peerGradient.addColorStop(1, '#dc3545'); // Red for peers

    // Initialize the chart with additional datasets for peer comparisons
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Driver ' + driverData.driverNumber, 'Peers'], // Label for clarity
            datasets: [
                {
                    label: 'Average Speed (mph)',
                    data: [driverData.averageSpeed, peerAverages ? peerAverages.averageSpeed : null],
                    backgroundColor: [driverGradient, peerGradient],
                    borderColor: originalBorderColor,
                    borderWidth: originalBorderWidth,
                    borderRadius: 2,
                    yAxisID: 'y',
                },
                {
                    label: 'Fuel Consumption (gallons/100 miles)',
                    data: [driverData.fuelConsumption, peerAverages ? peerAverages.fuelConsumption : null],
                    backgroundColor: [driverGradient, peerGradient],
                    borderColor: originalBorderColor,
                    borderWidth: originalBorderWidth,
                    borderRadius: 2,
                    yAxisID: 'y1',
                },
                {
                    label: 'Customer Satisfaction (1-5 scale)',
                    data: [driverData.customerSatisfaction, peerAverages ? peerAverages.customerSatisfaction : null],
                    backgroundColor: [driverGradient, peerGradient],
                    borderColor: originalBorderColor,
                    borderWidth: originalBorderWidth,
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
                        // color: '#343a40',
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
                        // color: '#343a40',
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
                        // color: '#343a40',
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
            onHover: (event, chartElements) => {
                const chart = event.chart;
                chart.data.datasets.forEach((dataset, i) => {
                    // Reset to original properties for all datasets
                    dataset.borderWidth = originalBorderWidth;
                    dataset.borderColor = originalBorderColor;
                });

                // If hovering over a dataset, modify its properties
                if (chartElements.length) {
                    const { datasetIndex } = chartElements[0];
                    chart.data.datasets[datasetIndex].borderWidth = hoverBorderWidth;
                    chart.data.datasets[datasetIndex].borderColor = hoverBorderColor;
                }

                chart.update({
                    duration: 800, // Adjust the animation duration as needed
                    easing: 'easeOutElastic', // Experiment with different easing options
                    active: true // Set active to true

                });
            },
            // Keep the animation as it was
            animation: {
                duration: 2000, // Slower animation for a dramatic entrance
                easing: 'easeOutElastic', // Creates a stretching effect for the bars
                onProgress: function (animation) {
                    // const progress = animation.currentStep / animation.numSteps;
                    // // Example: dynamically recreate the gradients with adjusted opacity
                    // chart.data.datasets.forEach((dataset, index) => {
                    //     const ctx = chart.ctx; // Get the canvas rendering context
                    //     const canvas = chart.canvas; // Get the canvas element
                    //     const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

                    //     // Assume these are your original gradient stops
                    //     if (index === 0) { // Driver dataset
                    //         gradient.addColorStop(0, `rgba(0, 123, 255, ${progress})`);
                    //         gradient.addColorStop(1, `rgba(102, 16, 242, ${progress})`);
                    //     } else { // Peer dataset
                    //         gradient.addColorStop(0, `rgba(40, 167, 69, ${progress})`);
                    //         gradient.addColorStop(1, `rgba(220, 53, 69, ${progress})`);
                    //     }

                    //     // Apply the dynamically created gradient to the dataset
                    //     dataset.backgroundColor = gradient;
                    // });

                    // chart.update('none'); // Apply the update without triggering additional animations
                },


            },
        }
    });
}




// Step 1: Data Processing and Analysis
fetch('data_v2.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true }).data;

        // Calculate averages for comparison
        const averages = parsedData.reduce((acc, row, index, array) => {
            // Check if it's the last row
            if (index === array.length - 1) {
                // Optionally, you can perform any final calculations or actions here
                return acc;
            }

            acc.averageSpeed += parseFloat(row.AVERAGE_SPEED);
            acc.fuelConsumption += parseFloat(row.FUEL_CONSUMPTION);
            acc.customerSatisfaction += parseInt(row.CUSTOMER_SATISFACTION);




            acc.count++;
            return acc;
        }, { averageSpeed: 0, fuelConsumption: 0, customerSatisfaction: 0, count: 0 });

        // Finalize averages
        averages.averageSpeed /= averages.count;
        averages.fuelConsumption /= averages.count;
        averages.customerSatisfaction /= averages.count;

        const processedData = parsedData.map(row => ({
            driverNumber: parseInt(row.ID, 10),
            hoursWorked: parseInt(row["Hours Worked"], 10),
            deliveriesCompleted: parseInt(row["Deliveries Completed"], 10),
            weeklySalary: parseInt(row["Weekly Salary"], 10),
            routeComplexity: row["Route Complexity"],
            weatherCondition: row["Weather Condition"],
            vehicleType: row["Vehicle Type"],
            trafficLevel: row["Traffic Level"],
            dayOfWeek: row["Day of the Week"],
            customerSatisfaction: parseInt(row.CUSTOMER_SATISFACTION, 10),
            averageSpeed: parseFloat(row.AVERAGE_SPEED),
            milesDriven: parseFloat(row["Miles Driven"]),
            fuelConsumption: parseFloat(row.FUEL_CONSUMPTION)
        }));


        // Populate driver selection dropdown
        const driverSelect = document.getElementById('driver-select');
        processedData.forEach(data => {
            const option = document.createElement('option');
            // console.log(data.driverNumber);
            option.value = data.driverNumber; // Use driver number as value
            option.text = data.driverNumber;
            driverSelect.add(option);
        });

        // Add event listener to driver select dropdown
        driverSelect.addEventListener('change', function () {
            // console.log("in: " + this.value)
            const selectedDriverData = processedData.find(data => data.driverNumber == this.value);
            if (selectedDriverData) {
                // console.log("selectc: " + selectedDriverData.driverNumber)
                const peerAverages = getPeersDataForComparison(selectedDriverData, processedData);
                console.log("in select driver data: ", peerAverages)
                plotGraphsForDriver(selectedDriverData, averages, peerAverages);

                plotDeliveriesVsHours(selectedDriverData);  // Call function with selected driver data
                plotSalaryDistribution(selectedDriverData);  // Similar update needed
                plotTrafficImpactOnSpeed(selectedDriverData);  // Similar update needed
            }
        });


        // Optionally, plot graphs for the first driver on initial load
        if (processedData.length > 0) {

            driverSelect.value = processedData[0].driverNumber; // Set initial selection
            const peerAverages = getPeersDataForComparison(processedData[0], processedData);
            plotGraphsForDriver(processedData[0], averages, peerAverages);
        }
    })
    .catch(error => console.error('Error fetching or parsing data:', error));