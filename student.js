alert("NEW student.js loaded");

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

// ==========================
// Create Map
// ==========================

const map = L.map("map").setView([13.0827, 80.2707], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// ==========================
// Bus Marker
// ==========================

const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

busMarker.bindPopup("🚌 SmartBus");

// ==========================
// Load Bus Stops
// ==========================

async function loadStops() {

    alert("Step 1");

    try {

        alert("Step 2");

        const stopsRef = collection(db, "routes", "bus1", "stops");

        alert("Step 3");

        const snapshot = await getDocs(stopsRef);

        alert("Step 4");

        alert("Documents Found: " + snapshot.size);

        snapshot.forEach((stopDoc) => {

            const stop = stopDoc.data();

            alert("Stop: " + stop.name);

            L.marker([stop.latitude, stop.longitude])
                .addTo(map)
                .bindPopup("🚏 " + stop.name);

        });

    } catch (error) {

        alert("ERROR");
        alert(error.message);
        console.error(error);

    }

}

loadStops();

// ==========================
// Live Bus Updates
// ==========================

onSnapshot(doc(db, "bus", "live"), (docSnap) => {

    if (!docSnap.exists()) {
        document.getElementById("status").innerText = "Bus Offline";
        return;
    }

    const data = docSnap.data();

    if (data.latitude != null && data.longitude != null) {

        busMarker.setLatLng([data.latitude, data.longitude]);

        map.setView([data.latitude, data.longitude], 15);

        document.getElementById("location").innerText =
            data.latitude.toFixed(6) + ", " + data.longitude.toFixed(6);
    }

    document.getElementById("status").innerText =
        data.status || "Unknown";

});

// ==========================
// Logout
// ==========================

document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message);
        });

});
