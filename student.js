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

    try {

        const snapshot = await getDocs(
            collection(db, "routes", "bus1", "stops")
        );

        if (snapshot.empty) {
            alert("No bus stops found.");
            return;
        }

        snapshot.forEach((stopDoc) => {

            const stop = stopDoc.data();

            console.log(stopDoc.id, stop);

            if (
                typeof stop.latitude !== "number" ||
                typeof stop.longitude !== "number"
            ) {

                alert(
                    "Invalid latitude/longitude in document: " + stopDoc.id
                );

                return;
            }

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

    document.getElementById("status").innerText =
        data.status || "Unknown";

    if (
        typeof data.latitude === "number" &&
        typeof data.longitude === "number"
    ) {

        busMarker.setLatLng([data.latitude, data.longitude]);

        map.setView([data.latitude, data.longitude], 15);

        document.getElementById("location").innerText =
            data.latitude.toFixed(6) + ", " + data.longitude.toFixed(6);

    }

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
