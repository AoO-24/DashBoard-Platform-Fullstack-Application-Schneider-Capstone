document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('serviceChart').getContext('2d');
    var serviceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2024-04-10', '2024-02-17', '2024-01-01', '2023-11-15'],
            datasets: [{
                label: 'Cost of Parts',
                data: [120, 800, 950, 135],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Labor Cost',
                data: [200, 300, 350, 100],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Total Service Cost',
                data: [450, 1100, 1300, 400],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
