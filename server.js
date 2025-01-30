// Install required packages: express, body-parser 
// Don't forget to actually install these!
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for spacecraft state
let spacecraftState = {
    power: 'OFF',
    speed: 0,
    fuel: 100,
    batteryPercentage: 100,
    activeSensors: ['thermal', 'radiation', 'proximity'],
    foundMinerals: ['iron', 'copper']
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get current status of the spacecraft
app.get('/status', (req, res) => {
    res.json(spacecraftState);
});

// Route 2: POST power state
app.post('/power', (req, res) => {
    const newPowerState = req.body.power;
    if (newPowerState === 'ON' || newPowerState === 'OFF') {
        spacecraftState.power = newPowerState;
        res.json({ message: 'Power state updated', status: spacecraftState });
    } else {
        res.status(400).json({ error: 'Invalid power state. Use ON or OFF' });
    }
});

// Add new action route
app.post('/action', (req, res) => {
    const { action, sensor } = req.body;

    switch (action) {
        case 'toggleSensor':
            if (!sensor) {
                return res.status(400).json({ error: 'Sensor name is required' });
            }
            const sensorIndex = spacecraftState.activeSensors.indexOf(sensor);
            if (sensorIndex === -1) {
                spacecraftState.activeSensors.push(sensor);
            } else {
                spacecraftState.activeSensors.splice(sensorIndex, 1);
            }
            break;

        case 'move':
            if (spacecraftState.power === 'OFF') {
                return res.status(400).json({ error: 'Cannot move while powered off' });
            }
            spacecraftState.speed = 100;
            spacecraftState.fuel -= 10;
            break;

        case 'sleep':
            spacecraftState.power = 'OFF';
            spacecraftState.speed = 0;
            spacecraftState.batteryPercentage = Math.min(100, spacecraftState.batteryPercentage + 10);
            break;

        default:
            return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ message: 'Action completed', status: spacecraftState });
});

// Route for updating speed
app.post('/speed', (req, res) => {
    const newSpeed = parseInt(req.body.speed);
    
    if (isNaN(newSpeed) || newSpeed < 0) {
        return res.status(400).json({ error: 'Invalid speed value' });
    }

    if (spacecraftState.power === 'OFF') {
        return res.status(400).json({ error: 'Cannot change speed while powered off' });
    }

    if (spacecraftState.fuel < 20) {
        return res.status(400).json({ error: 'Not enough fuel' });
    }

    spacecraftState.speed = newSpeed;
    spacecraftState.fuel -= 20;

    res.json({ message: 'Speed updated', status: spacecraftState });
});

// Route for refueling
app.post('/refuel', (req, res) => {
    const amount = parseInt(req.body.amount);
    
    if (isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'Invalid fuel amount' });
    }

    if (amount + spacecraftState.fuel > 100) {
        return res.status(400).json({ error: 'Cannot exceed maximum fuel capacity of 100' });
    }

    spacecraftState.fuel += amount;
    
    res.json({ message: 'Refueling successful', status: spacecraftState });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Spacecraft backend is running on http://localhost:${PORT}`);
});
