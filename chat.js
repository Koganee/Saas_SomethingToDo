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

document.querySelectorAll('.chat-load-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Chat load button clicked!');
    // Add your button logic here
  });
});

const userId = localStorage.getItem('id');
const userName = localStorage.getItem('username');

const chatContainer = document.getElementById('chat-container');


let allRSVPEvents = [];
loadRSVPEvents();

async function loadRSVPEvents() {
    const today = new Date();

    const userId = localStorage.getItem("id");
    if (!userId) {
        console.warn("No user ID found in localStorage. Cannot load RSVP events.");
        return;
    }
    const joinedEventsRef = collection(db, "user_account_information", userId, "user_events_joined");
    getDocs(joinedEventsRef).then((querySnapshot) => {
        let rsvpEvents = [];
        querySnapshot.forEach((docSnap) => {
            const event = docSnap.data();
            event.id = docSnap.id; // Save the document ID for later use
            const eventDate = new Date(event.eventDate);
            if (eventDate >= today) {
                rsvpEvents.push(event);
            }
        });

        rsvpEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        allRSVPEvents = rsvpEvents;
        // Update button text with event names
        chatNameLoad(rsvpEvents.map(e => e.eventName));
    });
}

function chatNameLoad(eventNames) {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = "";
    eventNames.forEach(eventName => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "chat-load-btn";
        btn.style.fontSize = "30px";
        btn.innerText = eventName;
        li.appendChild(btn);
        chatContainer.appendChild(li);
    });
    // Re-attach event listeners to new buttons
    document.querySelectorAll('.chat-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('Chat load button clicked!');
        openSelectedChat(eventName);
      });
    });
}

function openSelectedChat(eventName) {
    const selectedEvent = allRSVPEvents.find(event => event.eventName === eventName);
    if (selectedEvent) {
        const chatId = selectedEvent.id;
    } else {
        console.error("Selected event not found in allRSVPEvents.");
    }
}