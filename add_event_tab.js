
export function openAddEventTab()
{
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
            <label for="event-location">Event Location:</label>
            <input type="text" id="event-location" name="event-location" required>
            <label for="event-description">Event Description:</label>
            <textarea id="event-description" name="event-description" required></textarea>
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

    
}

// Attach event listener in main.js or a separate file
document.getElementById("add-event-btn").addEventListener("click", openAddEventTab);


import { addEvent } from './main.js';

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
        const eventDescription = document.getElementById("event-description").value;

        const newEvent = {
            title: eventName,
            date: eventDate,
            location: eventLocation,
            description: eventDescription,
        };
        addEvent(newEvent);
    });
}