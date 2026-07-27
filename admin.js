import { db, auth } from "./firebase.js";

import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Create map
const map = L.map("map").setView([13.0827, 80.2707], 15);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Bus Marker
const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

busMarker.bindPopup("🚌 SmartBus");

// Listen for live bus updates
onSnapshot(doc(db, "bus", "live"), (docSnap) => {

    if (!docSnap.exists()) return;

    const data = docSnap.data();

    const lat = data.latitude;
    const lng = data.longitude;

    document.getElementById("status").innerText = data.status;
    document.getElementById("latitude").innerText = lat.toFixed(6);
    document.getElementById("longitude").innerText = lng.toFixed(6);

    busMarker.setLatLng([lat, lng]);

    map.setView([lat, lng], 16);

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth)
    .then(() => {
        window.location.href = "login.html";
    })
    .catch((error) => {
        alert(error.message);
    });

});
