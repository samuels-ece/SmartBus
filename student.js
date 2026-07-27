import { db, auth } from "./firebase.js";

import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Create map
const map = L.map("map").setView([13.0827, 80.2707], 15);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Bus marker
const busMarker = L.marker([13.0827, 80.2707]).addTo(map);

// Listen for live updates
onSnapshot(doc(db, "bus", "live"), (docSnap) => {

    if (!docSnap.exists()) return;

    const data = docSnap.data();

    const lat = data.latitude;
    const lng = data.longitude;

    busMarker.setLatLng([lat, lng]);

    map.setView([lat, lng], 16);

    document.getElementById("status").innerText = data.status;

    document.getElementById("location").innerText =
        lat.toFixed(5) + ", " + lng.toFixed(5);

});
import { signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message);
        });

});
