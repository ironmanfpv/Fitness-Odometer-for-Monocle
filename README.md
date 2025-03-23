# Fitness Odometer for Monocle

Jogging is a good cardiovascular exercise that many engage in. </br>
What is the route taken ? How far have you walked or jog ? </br> 
This repo explores how to have the metrics on demand and visually.</br>

Initially started as an idea, this repository is a completed proof of concept for HTML & Monocle. 🔥

<img src="https://github.com/ironmanfpv/Fitness-Odometer-for-Monocle/blob/main/images/Odometer-Monocle%20concept.jpg" height="300" width="600">
<img src="https://github.com/ironmanfpv/Fitness-Odometer-for-Monocle/blob/main/images/1.%20app%20start%20state.jpg" height="300" width="600">

## To run the web app

- Access https://ironmanfpv.github.io/Fitness-Odometer-for-Monocle/index.html in browser.
- The web app can be used independently on the iPhone, with and without Monocle.
- If you fail to load the app, check the [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API#browser_compatibility).
- Slide the button on the bottom left of the page to initiate Odometer.
- The app requires your permission to mark your geolocation and start mapping the route you take.
- At the end of the use, slide the button to the left to stop Odometer. Close the browser tab.
- No geolocation is collected or sent to any server.

## To connect web app to Monocle

- By connecting web app to Monocle, visual Odometer is available.
- Works with iPhone and Bluefy; a BLE enabled browser.
- Hit the Connect! button and select Monocle from the list of BLE device that appears in the list.
- Hit the Transmission button and the distance information will be displayed on your Monocle. 

## Development

- The app relies on Mozilla Web Geolocation API.
- Latitude and longitude are the only information available through the API.
- Currently a proof of concept for Geolocation, it successfully integrates with Monocle.

---

If you are interested in my other projects, please search google: Github ironmanfpv. 

Email me @ akitaishi@gmail.com 👋

Linkedin: www.linkedin.com/in/jason-n-b515a89a  🌍
