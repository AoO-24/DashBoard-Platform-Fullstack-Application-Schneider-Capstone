window.addEventListener('load', function() {
    fetch('maintenance_records.csv')
        .then(response => response.text())
        .then(parseCSV)
        .catch(error => console.error('Error loading the CSV file:', error));
});

function parseCSV(csvData) {
    const rows = csvData.split('\n');
    const tbody = document.querySelector('#maintenanceRecordsTable tbody');
    rows.forEach((row, index) => {
        if (row.trim() === '' || index === 0) return; // skip headers and empty rows
        const cells = row.split(',');
        const tr = tbody.insertRow();
        cells.forEach(cell => {
            const td = tr.insertCell();
            td.textContent = cell.trim();
        });
    });
}

function sortTable(columnIndex) {
    let table = document.getElementById("maintenanceRecordsTable");
    let switching = true, dir = "asc", switchcount = 0;

    while (switching) {
        switching = false;
        let rows = table.rows;

        for (let i = 1; i < rows.length - 1; i++) {
            let shouldSwitch = compareRows(rows[i], rows[i + 1], columnIndex, dir);
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
                break;
            }
        }

        if (!switchcount && dir === "asc") {
            dir = "desc";
            switching = true;
        }
    }
}

function compareRows(xRow, yRow, columnIndex, direction) {
    let x = xRow.cells[columnIndex].textContent.toLowerCase();
    let y = yRow.cells[columnIndex].textContent.toLowerCase();

    if ((direction === "asc" && x > y) || (direction === "desc" && x < y)) {
        return true;
    }
    return false;
}

document.getElementById('searchInput').addEventListener('keyup', function() {
    let filter = this.value.toUpperCase();
    let rows = document.getElementById("maintenanceRecordsTable").rows;

    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // skip header
        let visible = Array.from(row.cells).some(cell => cell.textContent.toUpperCase().includes(filter));
        row.style.display = visible ? "" : "none";
    });
});
