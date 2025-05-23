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

var index = 0;

// Attach event listener in main.js or a separate file
document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);

var index = 0;
const PAGE_SIZE = 5;
let allEvents = [];

// Function to load events from Firestore
async function loadEvents(startIndex) {
    const eventList = document.getElementById("event-list");
    const today = new Date();
    eventList.innerHTML = ""; // Clear existing events

    const querySnapshot = await getDocs(collection(db, "planned_events"));
    // Collect and filter events
    let events = [];
    querySnapshot.forEach((docSnap) => {
        const event = docSnap.data();
        event.id = docSnap.id; // Save the document ID for later use
        const eventDate = new Date(event.date);
        if (eventDate >= today) {
            events.push(event);
        }
    });

    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    allEvents = events;

    // Get the events for the current page
    const pageEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

    // Render events
    pageEvents.forEach(event => {
        let eventImage;
        if(event.category === "music") {
            eventImage = "/event_images/music.jpg";
        } else if(event.category === "technology") {
            eventImage = "/event_images/technology.jpg";
        } else if(event.category === "sports") {  
            eventImage = "/event_images/sports.jpg";
        } else if(event.category === "literature") {
            eventImage = "/event_images/literature.jpg";
        } else if(event.category === "art") {
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
                    <button class="rsvp-button" onclick="addRSVPEvent('${event.id}')">RSVP</button>
                </div>
                <div class="right-diagonal">
                    <img src="${eventImage}" alt="Event Image" class="event-image">
                </div>
            </div>
        `;
        eventList.appendChild(card);
    });
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.id = "back-page-btn";
    backBtn.addEventListener("click", function() {
        index = Math.max(0, index - PAGE_SIZE);
        loadEvents(index);
    });

    eventList.appendChild(backBtn);
}

// Initial load of events
loadEvents(0);

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
export async function addEvent(event) {
    try {
        const docRef = await addDoc(collection(db, "planned_events"), event);
        console.log("Document written with ID: ", docRef.id);
        loadEvents(); // Reload events after adding a new one
        await createEventChat(docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);

document.getElementById("next-page-btn").addEventListener("click", nextEvents);

async function nextEvents()
{
    index += PAGE_SIZE;
    loadEvents(index);
}

document.addEventListener("DOMContentLoaded", () => {
    const usernameElem = document.getElementById("username");
    const username = localStorage.getItem("username");
    if (usernameElem && username) {
        usernameElem.textContent = "Hi " + username + "!";
    }
});

await loadRSVPEvents(0);

async function addRSVPEvent(eventId) {
    const userId = localStorage.getItem("id");
    const joinedEventsRef = collection(db, "user_account_information", userId, "user_events_joined");
    const event = allEvents.find(e => e.id === eventId);
    if (!event) {
        console.error("Event not found for RSVP:", eventId);
        return;
    }
    try {
        // Check if RSVP already exists
        const querySnapshot = await getDocs(joinedEventsRef);
        const alreadyJoined = querySnapshot.docs.some(docSnap => docSnap.data().eventId === eventId);
        if (alreadyJoined) {
            console.log("You have already RSVP'd to this event.");
            return;
        }
        const docRef = await addDoc(joinedEventsRef, {
            eventId: event.id,
            eventName: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            eventTime: event.time,
            eventDescription: event.description,
            eventCategory: event.category,
        });
        console.log("RSVP added with ID: ", docRef.id);
        await loadRSVPEvents(0);
    }
    catch (e) {
        console.log("Error adding RSVP", e);
    }
}

// Make addRSVPEvent available globally for inline onclick
window.addRSVPEvent = addRSVPEvent;

let allRSVPEvents = [];

async function loadRSVPEvents(startIndex) {
    const rsvpList = document.getElementById("rsvp-event-list");
    const today = new Date();
    rsvpList.innerHTML = ""; // Clear existing events

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

        // Get the events for the current page
        const pageEvents = rsvpEvents.slice(startIndex, startIndex + PAGE_SIZE);

        // Render events
        pageEvents.forEach(event => {
            let eventImage;
            if(event.eventCategory === "music") {
                eventImage = "/event_images/music.jpg";
            } else if(event.eventCategory === "technology") {
                eventImage = "/event_images/technology.jpg";
            } else if(event.eventCategory === "sports") {  
                eventImage = "/event_images/sports.jpg";
            } else if(event.eventCategory === "literature") {
                eventImage = "/event_images/literature.jpg";
            } else if(event.eventCategory === "art") {
                eventImage = "/event_images/art.jpg";
            }

            const card = document.createElement("div");
            card.className = "event-card";
            card.innerHTML = `
                <div class="event-card-inner">
                    <div class="left-content">
                        <div class="event-title">${event.eventName}</div>
                        <div class="event-meta  ">📅 ${event.eventDate}</div>
                        <div class="event-meta">🕰️ ${event.eventTime}</div>
                        <div class="event-meta">📍 ${event.eventLocation}</div>
                        <div class="event-description">${event.eventDescription}</div>
                        <button class="rsvp-button" onclick="deleteRSVPEvent('${event.id}')">Cancel RSVP</button>
                    </div>
                    <div class="right-diagonal">
                        <img src="${eventImage}" alt="Event Image" class="event-image">
                    </div>
                </div>
            `;
            rsvpList.appendChild(card);
        }
        );
        const backBtn = document.createElement("button");
        backBtn.textContent = "Back";
        backBtn.id = "back-page-btn";
        backBtn.addEventListener("click", function() {
            index = Math.max(0, index - PAGE_SIZE);
            loadRSVPEvents(index);
        });
        rsvpList.appendChild(backBtn);
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.id = "next-page-btn";
        nextBtn.addEventListener("click", function() {
            index += PAGE_SIZE;
            loadRSVPEvents(index);
        });
        rsvpList.appendChild(nextBtn);
    }
    ).catch((error) => {
        console.error("Error loading RSVP events:", error);
    });
}

function deleteRSVPEvent(eventId) {
    const userId = localStorage.getItem("id");
    const joinedEventsRef = collection(db, "user_account_information", userId, "user_events_joined");
    const eventDocRef = doc(joinedEventsRef, eventId);
    deleteDoc(eventDocRef).then(() => {
        console.log("RSVP Event deleted");
        loadRSVPEvents(0); // Reload events after deleting
    }).catch((error) => {
        console.error("Error deleting RSVP event: ", error);
    });
}

window.deleteRSVPEvent = deleteRSVPEvent;

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    window.location.href = "index.html";
});

document.getElementById("chat-button").addEventListener("click", function() {
    window.location.href = "chat.html";
});

async function createEventChat(eventId) {
    const chatReference = collection(db, "chat_messages_collection");
    // Try to find the event in allEvents, fallback to eventId if not found
    const event = allEvents.find(e => e.id === eventId);
    await addDoc(chatReference, {
        eventId: eventId,
        eventName: event ? event.title : "Untitled Event",
    });
    console.log("Chat created for event ID: ", eventId);
}