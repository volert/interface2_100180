const API_BASE_URL = 'http://localhost:3000';

// Fetch the current status of the spacecraft
async function fetchStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const status = await response.json();
        
        // Update power status
        if (status.power === "OFF") {
            document.getElementById('power').classList.remove('on');
            document.getElementById('power').classList.add('off');
        } else {
            document.getElementById('power').classList.remove('off');
            document.getElementById('power').classList.add('on');
        }
        
        // Update all status displays
        document.getElementById('power').getElementsByTagName("span")[0].textContent = `${status.power}`;
        document.getElementById('speed').textContent = `Speed: ${status.speed}`;
        document.getElementById('fuel').textContent = `Fuel: ${status.fuel}`;
        document.getElementById('battery').textContent = `Battery: ${status.batteryPercentage}%`;
        document.getElementById('sensors').textContent = `Active Sensors: ${status.activeSensors.join(', ')}`;
        document.getElementById('minerals').textContent = `Found Minerals: ${status.foundMinerals.join(', ')}`;
    } catch (error) {
        console.error('Error fetching status:', error);
    }
}

// Update the speed of the spacecraft
async function updateSpeed() {
    try {
        const speedInput = document.getElementById('speedInput');
        const newSpeed = parseInt(speedInput.value);

        if (isNaN(newSpeed) || newSpeed < 0) {
            console.error('Please enter a valid speed');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/speed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ speed: newSpeed })
        });

        if (response.ok) {
            fetchStatus(); // Refresh the display
            speedInput.value = ''; // Clear input
        } else {
            const error = await response.json();
            console.error('Failed to update speed:', error.error);
        }
    } catch (error) {
        console.error('Error updating speed:', error);
    }
}

// Refuel the spacecraft to desired amount
async function refuel() {
    try {
        const fuelInput = document.getElementById('fuelInput');
        const amount = parseInt(fuelInput.value);

        if (isNaN(amount) || amount < 0) {
            console.error('Please enter a valid fuel amount');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/refuel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount })
        });

        if (response.ok) {
            fetchStatus(); // Refresh the display
            fuelInput.value = ''; // Clear input
        } else {
            const error = await response.json();
            console.error('Failed to refuel:', error.error);
        }
    } catch (error) {
        console.error('Error refueling:', error);
    }
}

// Set the power state of the spacecraft
async function setPower() {
    try {
        const currentPower = document.getElementById('power').getElementsByTagName("span")[0].textContent;
        const newPower = currentPower === 'OFF' ? 'ON' : 'OFF';
        
        const response = await fetch(`${API_BASE_URL}/power`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ power: newPower })
        });
        
        if (response.ok) {
            fetchStatus(); // Refresh the display
        } else {
            console.error('Failed to update power state');
        }
    } catch (error) {
        console.error('Error setting power:', error);
    }
}

// Toggle a sensor on/off
async function toggleSensor(sensorName) {
    try {
        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'toggleSensor',
                sensor: sensorName
            })
        });
        
        if (response.ok) {
            fetchStatus(); // Refresh the display
        } else {
            console.error('Failed to toggle sensor');
        }
    } catch (error) {
        console.error('Error toggling sensor:', error);
    }
}

// Move the spacecraft
async function moveSpacecraft() {
    try {
        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'move'
            })
        });
        
        if (response.ok) {
            fetchStatus(); // Refresh the display
        } else {
            const error = await response.json();
            console.error('Failed to move:', error.error);
        }
    } catch (error) {
        console.error('Error moving spacecraft:', error);
    }
}

// Put spacecraft in sleep mode
async function sleepMode() {
    try {
        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'sleep'
            })
        });
        
        if (response.ok) {
            fetchStatus(); // Refresh the display
        } else {
            console.error('Failed to enter sleep mode');
        }
    } catch (error) {
        console.error('Error entering sleep mode:', error);
    }
}

// Send custom action to the spacecraft
async function sendCustomAction() {
    try {
        const action = document.getElementById('actionSelect').value;
        const actionInfo = document.getElementById('actionInfo').value;

        if (!action) {
            console.error('Please select an action');
            return;
        }

        const payload = {
            action: action
        };

        // Add additional info if provided
        if (actionInfo) {
            if (action === 'toggleSensor') {
                payload.sensor = actionInfo;
            } else {
                payload.info = actionInfo;
            }
        }

        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            fetchStatus(); // Refresh the display
            // Clear the form
            document.getElementById('actionSelect').value = '';
            document.getElementById('actionInfo').value = '';
        } else {
            const error = await response.json();
            console.error('Failed to perform action:', error.error);
        }
    } catch (error) {
        console.error('Error sending custom action:', error);
    }
}

// Fetch initial status on page load
fetchStatus();