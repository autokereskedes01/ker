document.addEventListener('DOMContentLoaded', function() {
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const addVehicleModal = document.getElementById('addVehicleModal');
    const closeBtn = document.querySelector('.closeBtn');
    const addVehicleForm = document.getElementById('addVehicleForm');
    const vehicleList = document.getElementById('vehicleList');
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

    function saveVehicles() {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }

    function renderVehicles() {
        vehicleList.innerHTML = '';
        vehicles.forEach((vehicle, index) => {
            const vehicleDiv = document.createElement('div');
            vehicleDiv.className = 'vehicle';
            vehicleDiv.innerHTML = `
                <div>
                    <h3>${vehicle.licensePlate}</h3>
                    <p>Típus: ${vehicle.type}</p>
                    <p>Tulajdonos: ${vehicle.owner}</p>
                    <p>Megjegyzés: ${vehicle.notes}</p>
                    <p>Dátum: ${vehicle.date}</p>
                </div>
                <div class="status ${vehicle.status}">${vehicle.statusText}</div>
                <button onclick="editVehicle(${index})">Szerkesztés</button>
                <button onclick="deleteVehicle(${index})">Törlés</button>
            `;
            vehicleList.appendChild(vehicleDiv);
        });
    }

    addVehicleBtn.addEventListener('click', () => {
        addVehicleModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        addVehicleModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == addVehicleModal) {
            addVehicleModal.style.display = 'none';
        }
    });

    addVehicleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(addVehicleForm);
        const newVehicle = {
            licensePlate: formData.get('licensePlate'),
            type: formData.get('type'),
            owner: formData.get('owner'),
            notes: formData.get('notes'),
            status: formData.get('status'),
            statusText: addVehicleForm.status.options[addVehicleForm.status.selectedIndex].text,
            date: new Date().toLocaleDateString()
        };
        vehicles.push(newVehicle);
        saveVehicles();
        renderVehicles();
        addVehicleModal.style.display = 'none';
        addVehicleForm.reset();
    });

    window.editVehicle = function(index) {
        const vehicle = vehicles[index];
        addVehicleModal.style.display = 'block';
        addVehicleForm.licensePlate.value = vehicle.licensePlate;
        addVehicleForm.type.value = vehicle.type;
        addVehicleForm.owner.value = vehicle.owner;
        addVehicleForm.notes.value = vehicle.notes;
        addVehicleForm.status.value = vehicle.status;
        addVehicleForm.querySelector('button[type="submit"]').textContent = 'Mentés';
        addVehicleForm.onsubmit = function(event) {
            event.preventDefault();
            vehicle.licensePlate = addVehicleForm.licensePlate.value;
            vehicle.type = addVehicleForm.type.value;
            vehicle.owner = addVehicleForm.owner.value;
            vehicle.notes = addVehicleForm.notes.value;
            vehicle.status = addVehicleForm.status.value;
            vehicle.statusText = addVehicleForm.status.options[addVehicleForm.status.selectedIndex].text;
            saveVehicles();
            renderVehicles();
            addVehicleModal.style.display = 'none';
            addVehicleForm.reset();
            addVehicleForm.querySelector('button[type="submit"]').textContent = 'Hozzáadás';
            addVehicleForm.onsubmit = addVehicleFormSubmit;
        };
    };

    window.deleteVehicle = function(index) {
        vehicles.splice(index, 1);
        saveVehicles();
        renderVehicles();
    };

    renderVehicles();
});

function addVehicleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(addVehicleForm);
    const newVehicle = {
        licensePlate: formData.get('licensePlate'),
        type: formData.get('type'),
        owner: formData.get('owner'),
        notes: formData.get('notes'),
        status: formData.get('status'),
        statusText: addVehicleForm.status.options[addVehicleForm.status.selectedIndex].text,
        date: new Date().toLocaleDateString()
    };
    vehicles.push(newVehicle);
    saveVehicles();
    renderVehicles();
    addVehicleModal.style.display = 'none';
    addVehicleForm.reset();
}

addVehicleForm.onsubmit = addVehicleFormSubmit;
