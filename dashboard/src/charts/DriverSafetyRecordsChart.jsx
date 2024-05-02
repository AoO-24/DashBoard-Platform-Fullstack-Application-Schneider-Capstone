import React, { useRef, useEffect } from 'react';
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

function DriverSafetyRecordsChart({ data, width, height, isPeer }) {
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    // Adjusting colors for peer data
    const accidentColor = isPeer ? tailwindConfig().theme.colors.orange : tailwindConfig().theme.colors.red;
    const violationColor = isPeer ? tailwindConfig().theme.colors.gray : tailwindConfig().theme.colors.yellow;

    useEffect(() => {
        const ctx = canvas.current;

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Jan', 'Feb', 'Mar',
                    'Apr', 'May', 'Jun',
                ],
                datasets: [{
                    label: 'Number of Accidents',
                    data: data.datasets[0].data,
                    backgroundColor: darkMode ? accidentColor[400] : accidentColor[500],
                    hoverBackgroundColor: darkMode ? accidentColor[300] : accidentColor[600],
                    yAxisID: 'y-accidents',
                    order: 2,
                    barPercentage: 0.6,
                    borderRadius: 4,
                }, {
                    label: 'Number of Traffic Violations',
                    data: data.datasets[1].data,
                    type: 'line',
                    borderColor: darkMode ? violationColor[400] : violationColor[500],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: false,
                    yAxisID: 'y-violations',
                    order: 1,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: darkMode ? violationColor[400] : violationColor[500],
                    pointBorderColor: darkMode ? tailwindConfig().theme.colors.slate[800] : tailwindConfig().theme.colors.white,
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                scales: {
                    'y-accidents': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            display: true,
                            color: darkMode ? gridColor.dark : gridColor.light,
                            drawBorder: false,
                            borderDash: [4, 4],
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0,
                        },
                    },
                    'y-violations': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 2,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0,
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
                            color: '#4b5563',
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

export default DriverSafetyRecordsChart;
