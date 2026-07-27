import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (!userDoc.exists()) {
            alert("User data not found.");
            return;
        }

        const role = userDoc.data().role;

        if (role === "student") {
            window.location.href = "student.html";
        }
        else if (role === "driver") {
            window.location.href = "driver.html";
        }
        else if (role === "admin") {
            window.location.href = "admin.html";
        }
        else {
            alert("Invalid role.");
        }

    } catch (error) {
        alert(error.message);
    }

});
