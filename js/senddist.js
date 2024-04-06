// Function to send distance data

setInterval(sendDistanceData, 3000);

async function sendDistanceData(){

    //myMonocle.repl('import display; display.clear()');

    if (myMonocle && myMonocle.data_send) {
        
        if (typeof distanceBox.textContent !== 'undefined'){ // Check if distanceBox.textContent is available in tracker.js
            myMonocle.repl('import display; display.clear()');
            myMonocle.repl('import utime; time.sleep(0.5)');
            //console.log("Distance to be sent:", distanceBox.textContent);                   // Debugging statement
            myMonocle.repl('import display; display.show(display.Text("' + distanceBox.textContent + '"))\x04');
        } else {
            console.log("distanceBox.textContent is undefined or empty.");                  // Debugging statement
        }
    } else {
        console.log("myMonocle or myMonocle.data_send is undefined.");                      // Debugging statement
    }
}

