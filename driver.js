const startTrip = document.getElementById("startTrip");

startTrip.addEventListener("click", () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                document.getElementById("tripStatus").innerText = "Running";

                document.getElementById("driverLocation").innerText =
                    latitude + ", " + longitude;

            },

            () => {

                alert("Unable to get location.");

            }

        );

    } else {

        alert("Geolocation is not supported.");

    }

});
