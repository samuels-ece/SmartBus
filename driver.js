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
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupOk = document.getElementById("popupOk");

let watchId = null;

// =======================
// Popup Functions
// =======================

function showPopup(title, message) {

    popupTitle.innerText = title;
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
"📍 Location Required",
"Please enable your device's Location (GPS) and allow permission to start the trip.\n\nAfter enabling Location, try starting the trip again."
);

                    break;

                case error.POSITION_UNAVAILABLE:

                    showPopup(
"📡 GPS Signal Unavailable",
"SmartBus could not detect your current location.\n\nPlease turn ON GPS and try again."
);

                    break;

                case error.TIMEOUT:

                    showPopup(
"⏳ Location Timeout",
"Your location request took too long.\n\nPlease check GPS and try again."
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
