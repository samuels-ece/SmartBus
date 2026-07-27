import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    signInWithEmailAndPassword(auth, email, password)

    .then(() => {

        if(role === "student"){
            window.location.href = "student.html";
        }

        else if(role === "driver"){
            window.location.href = "driver.html";
        }

        else{
            window.location.href = "admin.html";
        }

    })

    .catch((error)=>{
        alert(error.message);
    });

});
