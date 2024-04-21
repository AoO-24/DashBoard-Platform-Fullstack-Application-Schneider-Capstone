import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import {
    Chart, BarController, BarElement, LineController, LineElement,
    LinearScale, CategoryScale, TimeScale, Tooltip, Legend, PointElement
} from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig, formatValue } from '../utils/Utils';

// Register necessary chart components
Chart.register(
    BarController, BarElement, LineController, LineElement,
    LinearScale, CategoryScale, TimeScale, Tooltip, Legend, PointElement
);

function BarChart({ data, width, height, label }) {
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    useEffect(() => {
        const ctx = canvas.current.getContext('2d');
        const newChart = new Chart(ctx, {
            type: 'bar', // We set a default type but it can be overridden per dataset
            data: data,
            options: {
                scales: {
                    'y-salary': {
                        type: 'linear',
                        display: true,
                        position: 'left',
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

        return () => newChart.destroy();
    }, [data, currentTheme]);  // Ensure the chart re-renders when data or theme changes

    return (
        <div className="px-5 py-3">
            <h3>{label}</h3>
            <canvas ref={canvas} width={width} height={height}></canvas>
        </div>
    );
}

export default BarChart;
