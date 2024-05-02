import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import {
    Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend, LineController, LineElement, PointElement
} from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig, formatValue } from '../utils/Utils';

// Register necessary chart components
Chart.register(
    BarController, BarElement, LineController, LineElement,
    LinearScale, CategoryScale, Tooltip, Legend, PointElement
);

function BarChartTruckDriverSalary({ data, width, height, isPeer }) {
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    const salaryColor = isPeer ? tailwindConfig().theme.colors.purple : tailwindConfig().theme.colors.green;
    const hoursColor = isPeer ? tailwindConfig().theme.colors.teal : tailwindConfig().theme.colors.blue;

    useEffect(() => {
        const ctx = canvas.current;

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Salary',
                    data: data.datasets[0].data,
                    backgroundColor: darkMode ? salaryColor[400] : salaryColor[500],
                    hoverBackgroundColor: darkMode ? salaryColor[300] : salaryColor[600],
                    yAxisID: 'y-salary',
                    order: 2,
                    barPercentage: 0.6,
                    borderRadius: 4,
                }, {
                    label: 'Monthly Work Hours',
                    data: data.datasets[1].data,
                    type: 'line',
                    borderColor: darkMode ? hoursColor[400] : hoursColor[500],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: false,
                    yAxisID: 'y-hours',
                    order: 1,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: darkMode ? hoursColor[400] : hoursColor[500],
                    pointBorderColor: darkMode ? tailwindConfig().theme.colors.slate[800] : tailwindConfig().theme.colors.white,
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                scales: {
                    'y-salary': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 3000,
                        max: 6000,
                        ticks: {
                            callback: (value) => formatValue(value),
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 12,
                            },
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            color: darkMode ? gridColor.dark : gridColor.light,
                            drawBorder: false,
                            borderDash: [4, 4],
                        }
                    },
                    'y-hours': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 80,
                        max: 180,
                        ticks: {
                            callback: (value) => `${value} hrs`,
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 12,
                            },
                            padding: 10,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        type: 'category', // Changed from 'time' to 'category'
                        ticks: {
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 12,
                            },
                            padding: 10,
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
                                    label += (context.parsed.y);
                                }
                                return label;
                            }
                        },
                        bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
                        backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
                        borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
                        borderWidth: 1,
                        titleColor: darkMode ? textColor.dark : textColor.light,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                        },
                        bodyFont: {
                            size: 12,
                        },
                        padding: 10,
                        displayColors: false,
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 12,
                            },
                            padding: 20,
                            usePointStyle: true,
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500,
                    easing: 'easeInOutQuart',
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    },
                },
            },
        });

        return () => {
            newChart.destroy();
        };
    }, [currentTheme, darkMode, data]);

    return (
        <div className="px-5 py-3">
            <canvas ref={canvas} width={width} height={height}></canvas>
        </div>
    );
}

export default BarChartTruckDriverSalary;
