// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { openAddEventTab } from './add_event_tab.js';
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

// Function to load events from Firestore
async function loadEvents() {
    const querySnapshot = await getDocs(collection(db, "planned_events"));
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear existing events

    querySnapshot.forEach((doc) => {
        const event = doc.data();
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
        <div class="event-title">${event.title}</div>
        <div class="event-meta">📅 ${event.date}</div>
        <div class="event-meta">📍 ${event.location}</div>
        <div class="event-description">${event.description}</div>
        <button class="btn" onclick="deleteEvent('${doc.id}')">Delete</button>
        `;
        eventList.appendChild(card);
    });
}
  
// Function to add a new event to Firestore
export async function addEvent(event) {
    try {
        const docRef = await addDoc(collection(db, "planned_events"), event);
        console.log("Document written with ID: ", docRef.id);
        loadEvents(); // Reload events after adding a new one
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Function to delete an event from Firestore
async function deleteEvent(eventId) {
    try {
        await deleteDoc(doc(db, "events", eventId));
        console.log("Event deleted");
        loadEvents(); // Reload events after deleting
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

// Initial load of events
loadEvents();

const eventList = document.getElementById("event-list");

events.forEach(event => {
const card = document.createElement("div");
card.className = "event-card";
card.innerHTML = `
    <div class="event-title">${event.title}</div>
    <div class="event-meta">📅 ${event.date}</div>
    <div class="event-meta">📍 ${event.location}</div>
    <div class="event-description">${event.description}</div>
    <button class="btn">RSVP</button>
`;
eventList.appendChild(card);
});

document.addEventListener("DOMContentLoaded", () => {
    // Now you can safely attach event listeners
    document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);
});