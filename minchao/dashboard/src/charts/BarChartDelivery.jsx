import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

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
                        },
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                        },
                    },
                    'y-efficiency': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Fuel Efficiency (L/100 km)',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
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
                        },
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${formatValue(tooltipItem.raw)}`;
                            },
                        },
                    },
                },
                elements: {
                    bar: {
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false,
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