class SpacecraftSensorSimulator {
    constructor() {
        this.mineralTypes = ['Iron', 'Copper', 'Gold', 'Silver', 'Platinum', 'Uranium', 'Lithium', 'Cobalt'];
        this.sensorTypes = ['thermal', 'radiation', 'proximity'];
    }

    // Generate random temperature between -100°C and 150°C
    getThermalReading() {
        return {
            type: 'thermal',
            value: Math.floor(Math.random() * 250) - 100,
            unit: '°C'
        };
    }

    // Generate random radiation level between 0 and 1000 mSv
    getRadiationReading() {
        return {
            type: 'radiation',
            value: Math.floor(Math.random() * 1000),
            unit: 'mSv'
        };
    }

    // Generate random proximity reading between 0 and 1000 meters
    getProximityReading() {
        return {
            type: 'proximity',
            value: Math.floor(Math.random() * 1000),
            unit: 'm'
        };
    }

    // Get all sensor readings
    getAllSensorReadings() {
        return {
            thermal: this.getThermalReading(),
            radiation: this.getRadiationReading(),
            proximity: this.getProximityReading()
        };
    }

    // Generate random mineral findings
    generateMineralFindings(count = 3) {
        const findings = [];
        for (let i = 0; i < count; i++) {
            const mineral = this.mineralTypes[Math.floor(Math.random() * this.mineralTypes.length)];
            const quantity = Math.floor(Math.random() * 100) + 1;
            findings.push({
                type: mineral,
                quantity: quantity,
                unit: 'kg'
            });
        }
        return findings;
    }
}

module.exports = SpacecraftSensorSimulator; 