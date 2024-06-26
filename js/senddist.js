// Function to send distance data

setInterval(sendDistanceData, 3000);

async function sendDistanceData(){

    try {
        if (myMonocle && myMonocle.data_send) {
            if (typeof distanceBox.textContent !== 'undefined' && distanceBox.textContent.trim() !== ''){ // Check if distanceBox.textContent is available in tracker.js
                Data = distanceBox.textContent;
                myMonocle.repl('import display; display.clear()\n');                                      //clears the rainbow test
                myMonocle.repl('import led; led.on(led.GREEN)\n');                                        //Checks if code reach into this line
                myMonocle.repl('import display; display.show(display.Text("' + Data + ' ' +' KM", 320, 300, display.WHITE, justify=display.MIDDLE_CENTER))\n');
                //console.log("Distance to be sent:", distanceBox.textContent);                                             // Debugging statement
                //myMonocle.repl('import display; display.show(display.Text("' + distanceBox.textContent + 'KM"))\x04');    // Print w/o format
            } else {
                //console.log("distanceBox.textContent is undefined or empty.");                                              // Debugging statement
            }
        } else {
            //console.log("myMonocle or myMonocle.data_send is undefined.");                                                  // Debugging statement
        }
    } catch (error) {
        //console.error("Error in sendDistanceData:", error);                                                                 // Debugging statement
    }
}

