let editIndex = null;

document.getElementById('addCarButton').addEventListener('click', function() {
    document.getElementById('carFormModal').style.display = 'block';
    clearForm();
});

document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('carFormModal').style.display = 'none';
    editIndex = null; // Visszaállítja az editIndex értékét
    clearForm(); // Törli a form mezőit
});

document.getElementById('saveButton').addEventListener('click', function() {
    const licensePlate = document.getElementById('licensePlate').value;
    const carType = document.getElementById('carType').value;
    const owner = document.getElementById('owner').value;
    const note = document.getElementById('note').value;
    const status = document.getElementById('status').value;

    const carTable = document.getElementById('carTable').getElementsByTagName('tbody')[0];

    if (editIndex === null) {
        const newRow = carTable.insertRow();

        newRow.insertCell(0).textContent = licensePlate;
        newRow.insertCell(1).textContent = carType;
        newRow.insertCell(2).textContent = owner;
        newRow.insertCell(3).textContent = note;
        newRow.insertCell(4).innerHTML = `<span class="status ${status}">${getStatusText(status)}</span>`;
        newRow.insertCell(5).innerHTML = '<div class="action-buttons"><button class="editButton">Szerkesztés</button><button class="deleteButton">Törlés</button></div>';

        const editButton = newRow.getElementsByClassName('editButton')[0];
        const deleteButton = newRow.getElementsByClassName('deleteButton')[0];
        
        editButton.addEventListener('click', function() {
            editCar(newRow);
        });

        deleteButton.addEventListener('click', function() {
            if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
                deleteCar(newRow);
            }
        });
    } else {
        const row = carTable.rows[editIndex];
        row.cells[0].textContent = licensePlate;
        row.cells[1].textContent = carType;
        row.cells[2].textContent = owner;
        row.cells[3].textContent = note;
        row.cells[4].innerHTML = `<span class="status ${status}">${getStatusText(status)}</span>`;
        editIndex = null;
    }

    document.getElementById('carFormModal').style.display = 'none';
    saveData();
    clearForm();
});

document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = document.getElementById('carTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(filter)) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? '' : 'none';
    }
});

function editCar(row) {
    editIndex = row.rowIndex - 1;
    document.getElementById('licensePlate').value = row.cells[0].textContent;
    document.getElementById('carType').value = row.cells[1].textContent;
    document.getElementById('owner').value = row.cells[2].textContent;
    document.getElementById('note').value = row.cells[3].textContent;
    document.getElementById('status').value = getStatusValue(row.cells[4].textContent);
    document.getElementById('carFormModal').style.display = 'block';
}

function deleteCar(row) {
    row.remove();
    saveData();
}

function getStatusText(status) {
    switch(status) {
        case 'in-office': return 'Irodában van';
        case 'completed': return 'Kész';
        case 'faulty': return 'Hibás';
        case 'with-courier': return 'Futárnál van';
        case 'at-dropoff': return 'Leadós helyen van';
    }
}

function getStatusValue(statusText) {
    switch(statusText) {
        case 'Irodában van': return 'in-office';
        case 'Kész': return 'completed';
        case 'Hibás': return 'faulty';
        case 'Futárnál van': return 'with-courier';
        case 'Leadós helyen van': return 'at-dropoff';
    }
}

function clearForm() {
    document.getElementById('licensePlate').value = '';
    document.getElementById('carType').value = '';
    document.getElementById('owner').value = '';
    document.getElementById('note').value = '';
    document.getElementById('status').value = 'in-office';
}

function saveData() {
    const carTable = document.getElementById('carTable').getElementsByTagName('tbody')[0];
    const cars = [];

    for (let i = 0; i < carTable.rows.length; i++) {
        const row = carTable.rows[i];
        const car = {
            licensePlate: row.cells[0].textContent,
            carType: row.cells[1].textContent,
            owner: row.cells[2].textContent,
            note: row.cells[3].textContent,
            status: getStatusValue(row.cells[4].textContent)
        };
        cars.push(car);
    }

    localStorage.setItem('carData', JSON.stringify(cars));
}

function loadData() {
    const carData = localStorage.getItem('carData');
    if (carData) {
        const cars = JSON.parse(carData);
        const carTable = document.getElementById('carTable').getElementsByTagName('tbody')[0];
        cars.forEach(car => {
            const newRow = carTable.insertRow();
            newRow.insertCell(0).textContent = car.licensePlate;
            newRow.insertCell(1).textContent = car.carType;
            newRow.insertCell(2).textContent = car.owner;
            newRow.insertCell(3).textContent = car.note;
            newRow.insertCell(4).innerHTML = `<span class="status ${car.status}">${getStatusText(car.status)}</span>`;
            newRow.insertCell(5).innerHTML = '<div class="action-buttons"><button class="editButton">Szerkesztés</button><button class="deleteButton">Törlés</button></div>';

            const editButton = newRow.getElementsByClassName('editButton')[0];
            const deleteButton = newRow.getElementsByClassName('deleteButton')[0];

            editButton.addEventListener('click', function() {
                editCar(newRow);
            });

            deleteButton.addEventListener('click', function() {
                if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
                    deleteCar(newRow);
                }
            });
        });
    }
}

window.onload = loadData;
