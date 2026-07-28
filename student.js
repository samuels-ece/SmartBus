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
alert("NEW student.js loaded");
// ==========================
// Before Map
// ==========================

alert("Before Map");

const map = L.map("map").setView([13.0827, 80.2707], 13);

alert("After Map");

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

alert("Tile Layer Loaded");

// ==========================
// Bus Marker
// ==========================

alert("Before Marker");

const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

alert("After Marker");

busMarker.bindPopup("🚌 SmartBus");

// ==========================
// Load Stops
// ==========================

async function loadStops() {

    alert("Inside loadStops()");

    try {

        alert("Creating Collection");

        const stopsRef = collection(db, "routes", "bus1", "stops");

        alert("Reading Firestore");

        const snapshot = await getDocs(stopsRef);

        alert("Documents Found: " + snapshot.size);

        snapshot.forEach((stopDoc) => {

            const stop = stopDoc.data();

            alert("Stop: " + stop.name);

            L.marker([stop.latitude, stop.longitude])
                .addTo(map)
                .bindPopup("🚏 " + stop.name);

        });

    } catch (error) {

        alert("Firestore Error");

        alert(error.message);

        console.log(error);

    }

}

alert("Before loadStops()");

loadStops();

alert("After loadStops()");

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
