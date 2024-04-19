import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig } from '../utils/Utils';

Chart.register(DoughnutController, ArcElement, Tooltip);

function WorkHoursChart({ data, width, height }) {
    const [chart, setChart] = useState(null);
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';

    useEffect(() => {
        const ctx = canvas.current;
        const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                cutout: '0%',
                layout: {
                    padding: 24,
                },
                plugins: {
                    tooltip: {
                        titleColor: darkMode ? chartColors.tooltipTitleColor.dark : chartColors.tooltipTitleColor.light,
                        bodyColor: darkMode ? chartColors.tooltipBodyColor.dark : chartColors.tooltipBodyColor.light,
                        backgroundColor: darkMode ? chartColors.tooltipBgColor.dark : chartColors.tooltipBgColor.light,
                        borderColor: darkMode ? chartColors.tooltipBorderColor.dark : chartColors.tooltipBorderColor.light,
                        borderWidth: 1,
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
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            font: {
                                size: 12,
                            },
                            padding: 20,
                            usePointStyle: true,
                        },
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest',
                },
                animation: {
                    duration: 500,
                    easing: 'easeInOutQuart',
                },
                maintainAspectRatio: false,
                resizeDelay: 200,
            },
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

export default WorkHoursChart;