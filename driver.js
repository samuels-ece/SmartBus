import { db, auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const startTrip = document.getElementById("startTrip");

startTrip.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.watchPosition(

        async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById("tripStatus").innerText = "Running";
            document.getElementById("driverLocation").innerText =
                latitude.toFixed(6) + ", " + longitude.toFixed(6);

            try {
                await updateDoc(doc(db, "bus", "live"), {
                    latitude: latitude,
                    longitude: longitude,
                    status: "Running"
                });
            } catch (error) {
                alert("Failed to update Firestore.");
                console.log(error);
            }

        },

        (error) => {
            alert("Error " + error.code + ": " + error.message);
        },

        {
            enableHighAccuracy: true,
            maximumAge: 0
        }

    );

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message);
        });

});
