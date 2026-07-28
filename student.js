import { db, auth } from "./firebase.js";

import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ==========================
// Loading Popup
// ==========================

const loadingPopup = document.getElementById("loadingPopup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");

function showLoading(title, message) {
    popupTitle.innerText = title;
    popupMessage.innerText = message;
    loadingPopup.style.display = "flex";
}

function hideLoading() {
    loadingPopup.style.display = "none";
}

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
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const busMarker = L.marker(
    [13.0827, 80.2707],
    {
        icon: busIcon
    }
).addTo(map);

busMarker.bindPopup("🚌 SmartBus");

// ==========================
// Student Marker
// ==========================

const studentIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let studentMarker = null;

let studentLat = null;
let studentLng = null;

// ==========================
// Get Student Location
// ==========================

// ==========================
// Get Student Location
// ==========================

if (navigator.geolocation) {

    showLoading(
        "📍 Getting Your Location",
        "Please wait while we detect your current location..."
    );

    navigator.geolocation.watchPosition(

        (position) => {

            studentLat = position.coords.latitude;
            studentLng = position.coords.longitude;

            if (studentMarker == null) {

                studentMarker = L.marker(
                    [studentLat, studentLng],
                    {
                        icon: studentIcon
                    }
                ).addTo(map);

                studentMarker.bindPopup("📍 You");

            } else {

                studentMarker.setLatLng([
                    studentLat,
                    studentLng
                ]);

            }

            popupTitle.innerText = "✅ Location Ready";

            popupMessage.innerText =
                "Your location has been detected successfully.\nLoading live bus...";

            setTimeout(() => {

                hideLoading();

            }, 1500);

        },

        (error) => {

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    popupTitle.innerText = "📍 Location Permission";

                    popupMessage.innerText =
                        "Please allow location permission.\nWe'll automatically continue once you enable it.";

                    break;

                case error.POSITION_UNAVAILABLE:

                    popupTitle.innerText = "📡 Waiting for GPS";

                    popupMessage.innerText =
                        "Turn on GPS.\nWe'll automatically detect your location when it's available.";

                    break;

                case error.TIMEOUT:

                    popupTitle.innerText = "⏳ Waiting for Location";

                    popupMessage.innerText =
                        "Still trying to detect your location...";

                    break;

                default:

                    popupTitle.innerText = "📍 Waiting for Location";

                    popupMessage.innerText =
                        "Please enable Location.\nWe'll continue automatically.";

            }

        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }

    );

} else {

    popupTitle.innerText = "❌ Not Supported";

    popupMessage.innerText =
        "Your browser doesn't support Geolocation.";

}

// ==========================
// Live Bus Updates
// ==========================

onSnapshot(doc(db, "bus", "live"), (docSnap) => {

    if (!docSnap.exists()) {

        document.getElementById("status").innerText = "Bus Offline";
        document.getElementById("location").innerText = "--";
        document.getElementById("distance").innerText = "--";
        document.getElementById("eta").innerText = "--";

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

        document.getElementById("distance").innerText =
            "Calculating...";

        document.getElementById("eta").innerText =
            "Calculating...";

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
