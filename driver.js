import { db, auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const startTrip = document.getElementById("startTrip");
const stopTrip = document.getElementById("stopTrip");

let watchId = null;

// =====================
// START TRIP
// =====================

startTrip.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Your browser does not support Location Services.");
        return;
    }

    startTrip.disabled = true;
    startTrip.innerText = "Starting Trip...";

    watchId = navigator.geolocation.watchPosition(

        async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById("tripStatus").innerText = "🟢 Running";

            document.getElementById("driverLocation").innerText =
                latitude.toFixed(6) + ", " + longitude.toFixed(6);

            try {

                await updateDoc(doc(db, "bus", "live"), {
                    latitude: latitude,
                    longitude: longitude,
                    status: "Running"
                });

                startTrip.innerText = "Trip Running";

            } catch (error) {

                console.log(error);
                alert("Failed to update Firestore.");

            }

        },

        (error) => {

            startTrip.disabled = false;
            startTrip.innerText = "Start Trip";

            switch (error.code) {

                case error.PERMISSION_DENIED:
                    alert("Location permission denied.\n\nPlease allow location access.");
                    break;

                case error.POSITION_UNAVAILABLE:
                    alert("Please turn ON your device Location (GPS).");
                    break;

                case error.TIMEOUT:
                    alert("Unable to get your location.\nPlease try again.");
                    break;

                default:
                    alert("Unknown location error.");
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

});

// =====================
// STOP TRIP
// =====================

stopTrip.addEventListener("click", async () => {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

        watchId = null;

    }

    document.getElementById("tripStatus").innerText = "🔴 Stopped";

    document.getElementById("driverLocation").innerText = "Trip Ended";

    startTrip.disabled = false;
    startTrip.innerText = "Start Trip";

    try {

        await updateDoc(doc(db, "bus", "live"), {
            status: "Stopped"
        });

        alert("Trip Stopped Successfully");

    } catch (error) {

        console.log(error);

    }

});

// =====================
// LOGOUT
// =====================

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

    }

    signOut(auth)
        .then(() => {

            window.location.href = "login.html";

        })
        .catch((error) => {

            alert(error.message);

        });

});
