document.getElementById("startTrip").addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        (position) => {
            alert("Latitude: " + position.coords.latitude);
            alert("Longitude: " + position.coords.longitude);
        },

        (error) => {
            alert("Error Code: " + error.code);
            alert("Message: " + error.message);
        }

    );

});
