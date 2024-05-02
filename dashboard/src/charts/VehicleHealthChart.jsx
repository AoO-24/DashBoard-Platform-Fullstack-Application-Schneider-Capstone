import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import {
    Chart, BarController, BarElement, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend
} from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig, formatValue } from '../utils/Utils';

// Register necessary chart components
Chart.register(
    BarController, BarElement, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend
);

function VehicleHealthChart({ data, width, height, isPeer }) {
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    // Adjusting colors for peer data
    const maintenanceColor = isPeer ? tailwindConfig().theme.colors.emerald : tailwindConfig().theme.colors.blue;
    const repairsColor = isPeer ? tailwindConfig().theme.colors.amber : tailwindConfig().theme.colors.red;

    useEffect(() => {
        const ctx = canvas.current;

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Number of Maintenance Events',
                    data: data.datasets[0].data,
                    backgroundColor: darkMode ? maintenanceColor[400] : maintenanceColor[500],
                    hoverBackgroundColor: darkMode ? maintenanceColor[300] : maintenanceColor[600],
                    yAxisID: 'y',
                    order: 2,
                    barPercentage: 0.6,
                    borderRadius: 4,
                }, {
                    label: 'Number of Repairs',
                    data: data.datasets[1].data,
                    type: 'line',
                    borderColor: darkMode ? repairsColor[400] : repairsColor[500],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: false,
                    yAxisID: 'y',
                    order: 1,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: darkMode ? repairsColor[400] : repairsColor[500],
                    pointBorderColor: darkMode ? tailwindConfig().theme.colors.slate[800] : tailwindConfig().theme.colors.white,
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                scales: {
                    y: {
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
                            beginAtZero: true,
                            stepSize: 1,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
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

export default VehicleHealthChart;