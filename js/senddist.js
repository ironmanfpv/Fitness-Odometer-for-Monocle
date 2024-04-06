// Function to send distance data

async function sendDistanceData() {
    if (myMonocle && myMonocle.data_send) {
        // Check if distanceBox.textContent is available in tracker.js
        if (typeof distanceBox.textContent !== 'undefined') {
            console.log("Distance to be sent:", distanceBox.textContent); // Debugging statement
            myMonocle.repl(distanceBox.textContent);
        } else {
            console.log("distanceBox.textContent is undefined or empty."); // Debugging statement
        }
    } else {
        console.log("myMonocle or myMonocle.data_send is undefined."); // Debugging statement
    }
}

