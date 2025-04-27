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

// Attach event listener in main.js or a separate file
document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);

// Function to load events from Firestore
async function loadEvents() {
    const querySnapshot = await getDocs(collection(db, "planned_events"));
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear existing events

    querySnapshot.forEach((doc) => {
        var eventImage;
        const event = doc.data();
        if(event.category === "music") {
            eventImage = "/event_images/music.jpg";
        }
        else if(event.category === "technology") {
            eventImage = "/event_images/technology.jpg";
        }
        else if(event.category === "sports") {  
            eventImage = "/event_images/sports.jpg";
        }
        else if(event.category === "literature") {
            eventImage = "/event_images/literature.jpg";
        }
        else if(event.category === "art") {
            eventImage = "/event_images/art.jpg";
        }

        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <div class="event-card-inner">
                <div class="left-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">📅 ${event.date}</div>
                    <div class="event-meta">🕰️ ${event.time}</div>
                    <div class="event-meta">📍 ${event.location}</div>
                    <div class="event-description">${event.description}</div>
                    <button class="rsvp-button">RSVP</button>
                </div>
                <div class="right-diagonal">
                    <img src="${eventImage}" alt="Event Image" class="event-image">
                </div>
            </div>
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
        await deleteDoc(doc(db, "planned_events", eventId));
        console.log("Event deleted");
        loadEvents(); // Reload events after deleting
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

// Initial load of events
loadEvents();

document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);

function openAddEventTab()
{
    if(document.getElementById("event-sidebar")) {
        eventSidebar.style.display = "block";  // Show the sidebar if it already exists
        return;  // Exit the function if sidebar is already open
    }
    // Create the sidebar
    const eventSidebar = document.createElement('div');
    eventSidebar.id = 'event-sidebar';  // Set ID for styling and identification
    eventSidebar.innerHTML = `
        <button id="close-sidebar-btn">Close</button>
        <h2>Add Event</h2>
        <form id="event-form">
            <label for="event-name">Event Name:</label>
            <input type="text" id="event-name" name="event-name" required>
            <label for="event-date">Event Date:</label>
            <input type="date" id="event-date" name="event-date" required>
            <label for="event-time">Event Time:</label>
            <input type="time" id="event-time" name="event-time" required>
            <label for="event-location">Event Location:</label>
            <input type="text" id="event-location" name="event-location" required>
            <label for="event-description">Event Description:</label>
            <textarea id="event-description" name="event-description" required></textarea>
            <label for="event-image">Event Category:</label>
            <select id="event-category" name="event-category">
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="literature">Literature</option>
                <option value="technology">Technology</option>
                <option value="art">Art</option>
            </select>
            <button type="submit">Add Event</button>
        </form>
    `;
    document.body.appendChild(eventSidebar);

    // Display the sidebar
    eventSidebar.style.display = "block";

    // Close sidebar functionality
    document.getElementById("close-sidebar-btn").addEventListener("click", () => {
        eventSidebar.style.display = "none";
        document.body.removeChild(eventSidebar);  // Remove the sidebar from DOM when closed
    });
    // Get the form element
    const form = document.getElementById("event-form");

    // Add event listener for form submit
    if(form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();  // Prevent the form from actually submitting (page reload)
            
            // Get form values
            const eventName = document.getElementById("event-name").value;
            const eventDate = document.getElementById("event-date").value;
            const eventLocation = document.getElementById("event-location").value;
            const eventTime = document.getElementById("event-time").value;
            const eventDescription = document.getElementById("event-description").value;
            const eventCategory = document.getElementById("event-category").value;

            document.body.removeChild(eventSidebar);  // Remove the sidebar from DOM when closed

            const newEvent = {
                title: eventName,
                date: eventDate,
                location: eventLocation,
                time: eventTime,
                description: eventDescription,
                category: eventCategory,
            };
            addEvent(newEvent);
        });
    }
}
// Function to add a new event to Firestore
async function addUser(newUser) {
    console.log("Adding user:", newUser);
    try {
        const docRef = await addDoc(collection(db, "user_account_information"), newUser);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const signUpForm = document.getElementById("signup-form");

signUpForm.addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the form from actually submitting (page reload)
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const newUser = {
        username: username,
        email: email,
        password: password,
    };
    addUser(newUser);
});