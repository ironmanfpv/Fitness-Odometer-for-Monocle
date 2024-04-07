// Function to send distance data

/***

setInterval(sendDistanceData, 3000);

async function sendDistanceData(){

    //myMonocle.repl('import display; display.clear()');

    if (myMonocle && myMonocle.data_send) {
        
        if (typeof distanceBox.textContent !== 'undefined'){ // Check if distanceBox.textContent is available in tracker.js
            myMonocle.repl('import display; display.clear()');
            myMonocle.repl('import device; device.battery_level()');
            myMonocle.repl('import device; import display; display.show(device.battery_level()');
            //myMonocle.repl('import utime; time.sleep(0.5)');
            //console.log("Distance to be sent:", distanceBox.textContent);                   // Debugging statement
            myMonocle.repl('import display; display.show(display.Text("' + distanceBox.textContent + '"))\x04');
        } else {
            console.log("distanceBox.textContent is undefined or empty.");                  // Debugging statement
        }
    } else {
        console.log("myMonocle or myMonocle.data_send is undefined.");                      // Debugging statement
    }
}

***/




// Function to send distance data

//myMonocle.repl('import display; display.clear()\x04');
//setInterval(sendDistanceData, 3000);

async function sendDistanceData(){

    //setInterval(sendDistanceData, 3000);
    //myMonocle.repl('import display; display.clear()');

    try {
        if (myMonocle && myMonocle.data_send) {
            
            if (typeof distanceBox.textContent !== 'undefined' && distanceBox.textContent.trim() !== ''){ // Check if distanceBox.textContent is available in tracker.js
                myMonocle.repl('import display; display.clear()\x04');
                myMonocle.repl('import led; led.on(led.GREEN)\x04');
                //myMonocle.repl('import display; display.Text("Hello", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER)\x04');
                myMonocle.repl('import display; display.show(display.Text("Hello", 320, 200, display.WHITE, justify=display.MIDDLE_CENTER))\x04');
                //myMonocle.repl('import display; line = display.Line(175, 230, 465, 230, display.WHITE)\x04');
                //myMonocle.repl('import display; display.show(text,line)\x04');
                //myMonocle.repl('import device; device.battery_level()');
                //myMonocle.repl('import device; import display; display.show(device.battery_level())');
                //myMonocle.repl('import utime; time.sleep(0.5)');
                console.log("Distance to be sent:", distanceBox.textContent);                   // Debugging statement
                //myMonocle.repl('import display; display.show(display.Text("' + distanceBox.textContent + 'KM"))\x04');
            } else {
                console.log("distanceBox.textContent is undefined or empty.");                  // Debugging statement
            }
        } else {
            console.log("myMonocle or myMonocle.data_send is undefined.");                      // Debugging statement
        }
    } catch (error) {
        console.error("Error in sendDistanceData:", error);
    }
}

