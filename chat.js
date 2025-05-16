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

async function loadRSVPEvents() {
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
    });
}