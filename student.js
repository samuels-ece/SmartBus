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

const busIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

const busMarker = L.marker(
    [13.0827, 80.2707],
    { icon: busIcon }
).addTo(map);

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
            console.log("No bus stops found.");
            return;
        }

        snapshot.forEach((stopDoc) => {

            const stop = stopDoc.data();

            console.log(stop);

            const lat = Number(stop.latitude);
            const lng = Number(stop.longitude);

            if (isNaN(lat) || isNaN(lng)) {
                console.log("Invalid coordinates:", stopDoc.id);
                return;
            }

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup("🚏 " + (stop.name || stopDoc.id));

        });

    } catch (error) {

        console.error("Firestore Error:", error);

    }

}

loadStops();

// ==========================
// Live Bus Location
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

        busMarker.setLatLng([
            data.latitude,
            data.longitude
        ]);

        map.setView([
            data.latitude,
            data.longitude
        ], 15);

        document.getElementById("location").innerText =
            data.latitude.toFixed(6) +
            ", " +
            data.longitude.toFixed(6);

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
