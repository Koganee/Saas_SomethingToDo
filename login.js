// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPFToKJ5t2Q9zWMDy-lljSSjoQF8Nxz30",
  authDomain: "somethingtodo-ba6f0.firebaseapp.com",
  projectId: "somethingtodo-ba6f0",
  storageBucket: "somethingtodo-ba6f0.firebasestorage.app",
  messagingSenderId: "613444485238",
  appId: "1:613444485238:web:3406a514adf355aa245f57",
  measurementId: "G-Q8WE2G6C5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

var userExport;

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const querySnapshot = await getDocs(collection(db, "user_account_information"));

    querySnapshot.forEach((doc) => {
        const user = doc.data();

        if (user.email === email && user.password === password) {
            userExport = user;
            localStorage.setItem("username", user.username);
            localStorage.setItem("id", doc.id);
            window.location.href = "dashboard.html";
            return;
        } 
        else {
            alert("Invalid email or password. Please try again.");
        }
    });
});

export { userExport };