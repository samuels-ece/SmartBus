import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("auth.js loaded");

const loginBtn = document.getElementById("loginBtn");

console.log(loginBtn);

loginBtn.addEventListener("click", async () => {

    alert("Login button clicked");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        alert("Firebase Login Success");

        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (!userDoc.exists()) {
            alert("User data not found");
            return;
        }

        alert("Role: " + userDoc.data().role);

    } catch (error) {

        alert(error.message);
        console.log(error);

    }

});
