// Create map centered on Chennai
const map = L.map('map').setView([13.0827, 80.2707], 13);

// Load OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a bus marker
const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

// Popup
busMarker.bindPopup("🚌 SmartBus").openPopup();
