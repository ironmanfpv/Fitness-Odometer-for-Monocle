// Function to send distance data

setInterval(sendDistanceData, 3000);

async function sendDistanceData(){

    try {
        if (myMonocle && myMonocle.data_send) {
            
            if (typeof distanceBox.textContent !== 'undefined' && distanceBox.textContent.trim() !== ''){ // Check if distanceBox.textContent is available in tracker.js
                Data = distanceBox.textContent
                myMonocle.repl('import display; display.clear()\n');                                      //clears the rainbow test
                myMonocle.repl('import led; led.on(led.GREEN)\n');                                        //Checks if code reach into this line
                //myMonocle.repl('import display; display.show(display.Text("' + Data + ' ' +' KM", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER))\n');

                myMonocle.repl('import display; t1 = display.Text("Total Distance Covered", 0, 100, display.WHITE, justify=display.TOP_LEFT) , t2 = display.Text("' + Data + ' ' +' KM", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER), display.show(t1, t2)');
                
                //myMonocle.repl(`
                  //            import display;
                    //          t1 = display.Text("Total Distance Covered", 20, 100, display.WHITE, justify=display.TOP_LEFT);
                      //        t2 = display.Text("' = + Data + 'KM", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER);
                        //      display.show(t1, t2);
                          //`);



                // myMonocle.repl('display.show(\n');
                //myMonocle.repl('display.Text("Total Distance Covered", 220, 100, display.WHITE, justify=display.TOP_LEFT),\n');
                //myMonocle.repl('display.Text("' = + Data + 'KM", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER)\n');
                //myMonocle.repl(')\n');
                
                
                //myMonocle.repl('import display; display.show(display.Text("' = + Data + 'KM", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER))\n');
               
                //myMonocle.repl('import utime; time.sleep(1.0)\n');
                //console.log("Distance to be sent:", distanceBox.textContent);                                             // Debugging statement
                //myMonocle.repl('import display; display.show(display.Text("' + distanceBox.textContent + 'KM"))\x04');    // Print w/o format
            } else {
                console.log("distanceBox.textContent is undefined or empty.");                                              // Debugging statement
            }
        } else {
            console.log("myMonocle or myMonocle.data_send is undefined.");                                                  // Debugging statement
        }
    } catch (error) {
        console.error("Error in sendDistanceData:", error);                                                                 // Debugging statement
    }
}

