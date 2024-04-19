import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

function DriverImprovementChart({ data, width, height }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        display: false,
                    },
                    y: {
                        stacked: true,
                        display: false,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.parsed.x} Points`,
                        },
                    },
                },
                animation: {
                    duration: 500,
                },
                maintainAspectRatio: false,
            },
        });

        return () => barChart.destroy();
    }, [data]);

    return (
        <canvas ref={canvasRef} width={width} height={height}></canvas>
    );
}

export default DriverImprovementChart;
