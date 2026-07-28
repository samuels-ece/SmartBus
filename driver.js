import { db, auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Buttons
const startTrip = document.getElementById("startTrip");
const stopTrip = document.getElementById("stopTrip");

// Popup
const popup = document.getElementById("locationPopup");
const popupMessage = document.getElementById("popupMessage");
const popupOk = document.getElementById("popupOk");

let watchId = null;

// =======================
// Popup Functions
// =======================

function showPopup(message) {
    popupMessage.innerText = message;
    popup.style.display = "flex";
}

popupOk.addEventListener("click", () => {
    popup.style.display = "none";
});

// =======================
// Start Trip
// =======================

startTrip.addEventListener("click", () => {

    if (!navigator.geolocation) {
        showPopup("Your browser does not support Location Services.");
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
                    latitude,
                    longitude,
                    status: "Running"
                });

                startTrip.innerText = "🚌 Trip Running";

            } catch (error) {

                console.log(error);

                showPopup("Unable to update the live bus location.");

                startTrip.disabled = false;
                startTrip.innerText = "▶ Start Trip";

            }

        },

        (error) => {

            startTrip.disabled = false;
            startTrip.innerText = "▶ Start Trip";

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    showPopup(
                        "📍 Location Required\n\nPlease turn on your phone's Location (GPS) and allow location permission to start the trip."
                    );

                    break;

                case error.POSITION_UNAVAILABLE:

                    showPopup(
                        "📍 Unable to detect your location.\n\nPlease turn ON your device's GPS and try again."
                    );

                    break;

                case error.TIMEOUT:

                    showPopup(
                        "📍 Location request timed out.\n\nPlease try again."
                    );

                    break;

                default:

                    showPopup(
                        "Unable to get your location.\n\nPlease check your GPS and internet connection."
                    );

            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

});

// =======================
// Stop Trip
// =======================

stopTrip.addEventListener("click", async () => {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

        watchId = null;

    }

    document.getElementById("tripStatus").innerText = "🔴 Stopped";
    document.getElementById("driverLocation").innerText = "Trip Ended";

    startTrip.disabled = false;
    startTrip.innerText = "▶ Start Trip";

    try {

        await updateDoc(doc(db, "bus", "live"), {
            status: "Stopped"
        });

        showPopup("✅ Trip stopped successfully.");

    } catch (error) {

        console.log(error);

    }

});

// =======================
// Logout
// =======================

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

    }

    signOut(auth)
        .then(() => {

            window.location.href = "login.html";

        })
        .catch((error) => {

            showPopup(error.message);

        });

});
