import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import {
    Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend, LineController, LineElement,
    CategoryScale, PointElement
} from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig, formatValue } from '../utils/Utils';

// Register necessary chart components
Chart.register(
    BarController, BarElement, LineController, LineElement,
    LinearScale, TimeScale, Tooltip, Legend, CategoryScale, PointElement
);


function BarChartTruckDriverSalary({
    data,
    width,
    height
}) {
    const canvas = useRef(null);
    const summaryRef = useRef(null); // Referencing the summary element
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    useEffect(() => {
        const ctx = canvas.current;

        const newChart = new Chart(ctx, {
            type: 'bar', // Default type for the chart
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Average Salary',
                    data: data.datasets[0].data,
                    backgroundColor: tailwindConfig().theme.colors.green[400],
                    yAxisID: 'y-salary',
                    order: 2 // Lower order draws it behind the line chart
                }, {
                    label: 'Average Work Hours',
                    data: data.datasets[1].data,
                    type: 'line', // Specify type directly in the dataset
                    borderColor: tailwindConfig().theme.colors.blue[500],
                    backgroundColor: 'rgba(0, 0, 0, 0)', // Make line chart area transparent
                    fill: false,
                    yAxisID: 'y-hours',
                    order: 1 // Higher order draws it in front
                }]
            },
            options: {
                scales: {
                    'y-salary': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            callback: (value) => formatValue(value) + '$',
                        },
                        grid: {
                            display: true,
                            color: darkMode ? gridColor.dark : gridColor.light,
                        }
                    },
                    'y-hours': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        // Manually setting the scale range
                        min: 50, // Minimum value for the work hours scale
                        max: 80, // Maximum value for the work hours scale
                        ticks: {
                            // Include 'hrs' in the tick labels for clarity
                            callback: (value) => `${value} hrs`,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        type: 'time',
                        time: {
                            parser: 'MM-DD-YYYY',
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM YY',
                            },
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: darkMode ? textColor.dark : textColor.light,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatValue(context.parsed.y);
                                }
                                return label;
                            }
                        },
                        bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
                        backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
                        borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
                        borderWidth: 1
                    },
                    legend: {
                        display: false,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500,
                },
            },
        });



        return () => {
            newChart.destroy();
        };
    }, [currentTheme, darkMode, data]);

    return (
        <React.Fragment>
            <div className="px-5 py-3">
                <div ref={summaryRef}></div> {/* Summary element */}
                <canvas ref={canvas} width={width} height={height}></canvas>
            </div>
        </React.Fragment>
    );
}

export default BarChartTruckDriverSalary;
