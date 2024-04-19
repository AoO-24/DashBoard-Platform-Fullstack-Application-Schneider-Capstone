import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig } from '../utils/Utils';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

function FuelConsumptionChart({ data, width, height }) {
    const [chart, setChart] = useState(null);
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';

    useEffect(() => {
        const ctx = canvas.current;
        const newChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Month',
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Fuel Consumption (Liters per 100 km)',
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                        grid: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.slate[200],
                            borderDash: [3, 3],
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 2,
                    },
                    point: {
                        radius: 5,
                        borderWidth: 2,
                        hoverRadius: 7,
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${context.parsed.y} L/100 km`;
                            }
                        },
                        backgroundColor: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.white,
                        titleColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        bodyColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        borderColor: darkMode ? tailwindConfig().theme.colors.slate[600] : tailwindConfig().theme.colors.slate[300],
                        borderWidth: 1,
                    },
                    legend: {
                        display: false,
                    },
                    filler: {
                        propagate: false,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500
                }
            }
        });

        setChart(newChart);

        return () => newChart.destroy();
    }, [currentTheme, darkMode, data]);

    return (
        <div className="grow">
            <canvas ref={canvas} width={width} height={height}></canvas>
        </div>
    );
}

export default FuelConsumptionChart;