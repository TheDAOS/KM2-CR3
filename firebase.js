import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDAsW_ccaskn6lUm9ALilkCD3Q1e4BtuJM",
    authDomain: "estimate-55f55.firebaseapp.com",
    projectId: "estimate-55f55",
    storageBucket: "estimate-55f55.firebasestorage.app",
    messagingSenderId: "308316216877",
    appId: "1:308316216877:web:00a763e97f8cee119de2a4",
    measurementId: "G-590LLNW1QY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);


window.accountManagement = {
    async register(event) {
        event.preventDefault();
        const username = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;

        try {
            // Create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

            // Add user data to Firestore
            const userRef = collection(db, "users");
            await addDoc(userRef, {
                username: username,
                email: email,
                uid: user.uid,
            });

            // console.log("User data added to Firestore");
            alert("User registered successfully");
            window.location.href = "login.html";
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        }
    },
    async login(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password)

            alert("User logged in successfully");
            window.location.href = "index.html";
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        }
    },
    async logout() {
        try {
            await signOut(auth)

            // Sign-out successful.
            console.log("User logged out successfully");
            // window.location.href = "login.html";
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        }
    },
    checkUserLoggedIn() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                // console.log(uid);
                // console.log("User is logged in", uid);
            } else {
                // console.log("User is logged out");
                window.location.href = 'login.html';
            }
        });
    },
}


window.indexload = function () {
    accountManagement.checkUserLoggedIn();
    ShowDataInNav();
}

function ShowDataInNav() {
    const userRef = collection(db, "users");
    getDocs(userRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().uid === auth.currentUser.uid) {
                const username = doc.data().username;
                document.getElementById('dropdown-button').innerText = username;
                return;
            }
        });
    });
}