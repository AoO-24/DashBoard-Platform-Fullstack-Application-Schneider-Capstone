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

function C_BarChartTruckDriverSalary({ data, width, height }) {
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';
    const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

    useEffect(() => {
        const ctx = canvas.current;

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'My Average Salary',
                        data: data.datasets[0].data,
                        backgroundColor: darkMode ? tailwindConfig().theme.colors.green[400] : tailwindConfig().theme.colors.green[500],
                        hoverBackgroundColor: darkMode ? tailwindConfig().theme.colors.green[300] : tailwindConfig().theme.colors.green[600],
                        yAxisID: 'y-salary',
                        categoryPercentage: 0.8,
                        barPercentage: 0.8,
                        borderRadius: 4,
                        borderSkipped: false,
                        order: 2,

                    }, {
                        label: 'My Average Work Hours',
                        data: data.datasets[1].data,
                        type: 'line',
                        borderColor: darkMode ? tailwindConfig().theme.colors.blue[400] : tailwindConfig().theme.colors.blue[500],
                        backgroundColor: darkMode ? tailwindConfig().theme.colors.blue[400] : tailwindConfig().theme.colors.blue[500],
                        fill: false,
                        yAxisID: 'y-hours',
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: darkMode ? tailwindConfig().theme.colors.blue[400] : tailwindConfig().theme.colors.blue[500],
                        pointBorderColor: darkMode ? tailwindConfig().theme.colors.slate[800] : tailwindConfig().theme.colors.white,
                        pointBorderWidth: 2,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: darkMode ? tailwindConfig().theme.colors.blue[300] : tailwindConfig().theme.colors.blue[600],
                        order: 1,
                    },
                    {
                        label: 'Peer Average Salary',
                        data: data.datasets[2].data,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
                        yAxisID: 'y-salary',
                        categoryPercentage: 0.8,
                        barPercentage: 0.8,
                        borderRadius: 4,
                        borderSkipped: false,
                        order: 2,
                    }, {
                        label: 'Peer Average Work Hours',
                        data: data.datasets[3].data,
                        type: 'line',
                        borderColor: 'rgba(54, 162, 235, 0.8)',
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        fill: false,
                        yAxisID: 'y-hours',
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: 'rgba(54, 162, 235, 0.8)',
                        pointBorderColor: darkMode ? tailwindConfig().theme.colors.slate[800] : tailwindConfig().theme.colors.white,
                        pointBorderWidth: 2,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
                        order: 1,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                        },
                        title: {
                            display: true,
                            text: 'Salary',
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            padding: {
                                top: 10,
                                bottom: 10,
                            },
                        },
                    },
                    'y-hours': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 50,
                        max: 80,
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
                        title: {
                            display: true,
                            text: 'Work Hours',
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            padding: {
                                top: 10,
                                bottom: 10,
                            },
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
                        title: {
                            display: true,
                            text: 'Month',
                            color: darkMode ? textColor.dark : textColor.light,
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            padding: {
                                top: 10,
                                bottom: 10,
                            },
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
                            },
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
                    title: {
                        display: true,
                        text: 'Truck Driver Salary vs Work Hours',
                        color: darkMode ? textColor.dark : textColor.light,
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                        padding: {
                            top: 10,
                            bottom: 10,
                        },
                    },
                },
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                },
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

export default C_BarChartTruckDriverSalary;