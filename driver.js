import { db } from "./firebase.js";

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
                latitude + ", " + longitude;

            try {
                await updateDoc(doc(db, "bus", "live"), {
                    latitude: latitude,
                    longitude: longitude,
                    status: "Running"
                });
            } catch (error) {
                console.log(error);
                alert("Failed to update Firestore.");
            }

        },

        (error) => {
            alert("Unable to get location.");
            console.log(error);
        },

        {
            enableHighAccuracy: true
        }

    );

});
