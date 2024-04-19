import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { formatValue } from '../utils/Utils';

function BarChartDelivery({ data, width, height }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    'y-percentage': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Customer Satisfaction (%)',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            color: '#4b5563',
                        },
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                            color: '#4b5563',
                            font: {
                                size: 12,
                            },
                        },
                        grid: {
                            color: '#e5e7eb',
                            borderDash: [3, 3],
                            drawBorder: false,
                            drawTicks: false,
                        },
                    },
                    'y-breakage': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Breakage Rate (%)',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                            color: '#4b5563',
                        },
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                            color: '#4b5563',
                            font: {
                                size: 12,
                            },
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: '#e5e7eb',
                            borderDash: [3, 3],
                            drawBorder: false,
                            drawTicks: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                        },
                        ticks: {
                            color: '#4b5563',
                            font: {
                                size: 12,
                            },
                            padding: 10,
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 12,
                            },
                            color: '#4b5563',
                        },
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${formatValue(tooltipItem.raw, 'percent')}`;
                            },
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                    },
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                    },
                    line: {
                        borderWidth: 3,
                        tension: 0.4,
                        borderCapStyle: 'round',
                        borderJoinStyle: 'round',
                        pointRadius: 0,
                    },
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
            barChart.destroy();
        };
    }, [data]);

    return (
        <div style={{ width: width, height: height }}>
            <canvas ref={canvasRef} width={width} height={height}></canvas>
        </div>
    );
}

export default BarChartDelivery;