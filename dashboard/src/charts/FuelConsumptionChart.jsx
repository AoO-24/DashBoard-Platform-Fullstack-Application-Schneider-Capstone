import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useThemeProvider } from '../utils/ThemeContext';
import { tailwindConfig } from '../utils/Utils';



function FuelConsumptionChart({ data, width, height, isPeer }) {
    const canvasRef = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        // Define dynamic colors based on whether the data is for peers
        const backgroundColor = isPeer ? tailwindConfig().theme.colors.purple[500] : tailwindConfig().theme.colors.blue[500];
        const borderColor = isPeer ? tailwindConfig().theme.colors.purple[700] : tailwindConfig().theme.colors.blue[700];
        const pointBackgroundColor = isPeer ? tailwindConfig().theme.colors.purple[300] : tailwindConfig().theme.colors.blue[300];
        const pointBorderColor = isPeer ? tailwindConfig().theme.colors.purple[700] : tailwindConfig().theme.colors.blue[700];

        if (canvasRef.current) {
            const newChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        ...data.datasets[0],
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        pointBackgroundColor: pointBackgroundColor,
                        pointBorderColor: pointBorderColor,
                        fill: true,
                    }]
                },
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
                                text: 'Fuel Consumption (MPG)',
                                color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            },
                            min: 6.8,
                            max: 8.0,
                            grid: {
                                color: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.slate[200],
                                borderDash: [3, 3],
                            },
                            ticks: {
                                color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            },
                        }
                    },
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.parsed.y} MPG`;
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
                }
            });

            return () => {
                newChart.destroy();
            };
        }
    }, [currentTheme, darkMode, data, isPeer]);

    return (
        <div className="grow">
            <canvas ref={canvasRef} width={width} height={height}></canvas>
        </div>
    );
}

export default FuelConsumptionChart;
