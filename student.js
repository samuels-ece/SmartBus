import { db, auth } from "./firebase.js";

import {
  doc,
  onSnapshot,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Create map
const map = L.map("map").setView([13.0827, 80.2707], 13);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Bus marker
const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

// Load all bus stops
async function loadStops() {

    const snapshot = await getDocs(collection(db, "routes", "bus1", "stops"));

    snapshot.forEach((stop) => {

        const data = stop.data();

        L.marker([data.latitude, data.longitude])
            .addTo(map)
            .bindPopup("🚏 " + data.name);

    });

}

loadStops();

// Live bus updates
onSnapshot(doc(db, "bus", "live"), (docSnap) => {

    if (!docSnap.exists()) return;

    const data = docSnap.data();

    busMarker.setLatLng([data.latitude, data.longitude]);

    map.setView([data.latitude, data.longitude], 15);

    document.getElementById("status").innerText = data.status;

    document.getElementById("location").innerText =
        data.latitude.toFixed(5) + ", " + data.longitude.toFixed(5);

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth).then(() => {

        window.location.href = "login.html";

    });

});
