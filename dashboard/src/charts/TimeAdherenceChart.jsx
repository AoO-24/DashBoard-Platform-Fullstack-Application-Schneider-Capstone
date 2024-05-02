import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig } from '../utils/Utils';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TimeAdherenceChart({ data, width, height, isPeer }) {
    const [chart, setChart] = useState(null);
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';

    const driverDepartureDelayColor = tailwindConfig().theme.colors.amber;
    const driverDepartureEarlyColor = tailwindConfig().theme.colors.emerald;
    const driverArrivalDelayColor = tailwindConfig().theme.colors.rose;
    const driverArrivalEarlyColor = tailwindConfig().theme.colors.lime;

    const peerDepartureDelayColor = tailwindConfig().theme.colors.fuchsia;
    const peerDepartureEarlyColor = tailwindConfig().theme.colors.lightBlue;
    const peerArrivalDelayColor = tailwindConfig().theme.colors.purple;
    const peerArrivalEarlyColor = tailwindConfig().theme.colors.teal;
    useEffect(() => {
        const ctx = canvas.current;
        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                // datasets: data.datasets.map((dataset, i) => {
                //     const isDelay = dataset.label.includes('Delay');
                //     const isDeparture = dataset.label.includes('Departure');
                //     let backgroundColor, borderColor, pointBackgroundColor, pointBorderColor;

                //     if (isPeer) {
                //         if (isDeparture && isDelay) {
                //             backgroundColor = peerDepartureDelayColor[400];
                //             borderColor = peerDepartureDelayColor[700];
                //             pointBackgroundColor = peerDepartureDelayColor[300];
                //             pointBorderColor = peerDepartureDelayColor[700];
                //         } else if (isDeparture && !isDelay) {
                //             backgroundColor = peerDepartureEarlyColor[400];
                //             borderColor = peerDepartureEarlyColor[700];
                //             pointBackgroundColor = peerDepartureEarlyColor[300];
                //             pointBorderColor = peerDepartureEarlyColor[700];
                //         } else if (!isDeparture && isDelay) {
                //             backgroundColor = peerArrivalDelayColor[400];
                //             borderColor = peerArrivalDelayColor[700];
                //             pointBackgroundColor = peerArrivalDelayColor[300];
                //             pointBorderColor = peerArrivalDelayColor[700];
                //         } else {
                //             backgroundColor = peerArrivalEarlyColor[400];
                //             borderColor = peerArrivalEarlyColor[700];
                //             pointBackgroundColor = peerArrivalEarlyColor[300];
                //             pointBorderColor = peerArrivalEarlyColor[700];
                //         }
                //     } else {
                //         if (isDeparture && isDelay) {
                //             backgroundColor = driverDepartureDelayColor[400];
                //             borderColor = driverDepartureDelayColor[700];
                //             pointBackgroundColor = driverDepartureDelayColor[300];
                //             pointBorderColor = driverDepartureDelayColor[700];
                //         } else if (isDeparture && !isDelay) {
                //             backgroundColor = driverDepartureEarlyColor[400];
                //             borderColor = driverDepartureEarlyColor[700];
                //             pointBackgroundColor = driverDepartureEarlyColor[300];
                //             pointBorderColor = driverDepartureEarlyColor[700];
                //         } else if (!isDeparture && isDelay) {
                //             backgroundColor = driverArrivalDelayColor[400];
                //             borderColor = driverArrivalDelayColor[700];
                //             pointBackgroundColor = driverArrivalDelayColor[300];
                //             pointBorderColor = driverArrivalDelayColor[700];
                //         } else {
                //             backgroundColor = driverArrivalEarlyColor[400];
                //             borderColor = driverArrivalEarlyColor[700];
                //             pointBackgroundColor = driverArrivalEarlyColor[300];
                //             pointBorderColor = driverArrivalEarlyColor[700];
                //         }
                //     }

                //     return {
                //         ...dataset,
                //         backgroundColor,
                //         borderColor,
                //         pointBackgroundColor,
                //         pointBorderColor,
                //     };
                // }),
                datasets: data.datasets,
            },
            options: {
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                    },
                    y: {
                        stacked: true,
                        min: -15,
                        max: 30,
                        title: {
                            display: true,
                            text: 'Time Difference (hours)',
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                        grid: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.slate[200],
                            borderDash: [3, 3],
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            callback: function (value) {
                                return value >= 0 ? `+${value}` : value;
                            },
                        },
                    }
                },
                plugins: {

                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y || 0;
                                const sign = value >= 0 ? '+' : '';
                                return `${label}: ${sign}${value} hours`;
                            },
                        },
                        backgroundColor: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.white,
                        titleColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        bodyColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        borderColor: darkMode ? tailwindConfig().theme.colors.slate[600] : tailwindConfig().theme.colors.slate[300],
                        borderWidth: 1,
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            usePointStyle: true,
                            padding: 20,
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
                        right: 20,
                        bottom: 20,
                        left: 20,
                    },
                },
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

export default TimeAdherenceChart;