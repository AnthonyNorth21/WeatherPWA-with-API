# Weather PWA

The Weather App is a **Progressive Web Application (PWA)** that provides real-time weather information using an external weather API. It supports both **online** and **offline** modes through the use of **IndexedDB** for caching weather data and a **service worker** for offline access to essential assets.

---

## Features

* **Real-time weather data:** Fetches current weather details such as temperature, wind speed, and weather description.
* **Offline functionality:** Uses IndexedDB and Service Worker caching to operate without an internet connection.
* **PWA support:** Can be installed on desktops and mobile devices.
* **Responsive design:** Adjusts layout for both desktop and mobile screens.
* **Data caching:** Stores recently fetched weather data for reuse within a 30-minute window.

---

## Project Structure

```
/ (root directory)
├── index.html          # Main HTML file and app interface
├── style.css           # Application styling
├── app.js              # Core JavaScript logic for API, caching, and display
├── manifest.json       # PWA manifest configuration
├── service-worker.js   # Handles offline caching and network requests
├── icon-192x192.png    # App icon for devices
├── icon-512x512.png    # High-resolution app icon
```

---

## Technologies Used

* **HTML5** – Structure and layout
* **CSS3** – Styling and responsive design
* **JavaScript (ES6+)** – Core logic and API handling
* **IndexedDB** – Client-side database for cached weather data
* **Service Worker API** – For caching assets and enabling offline mode
* **Web App Manifest** – Defines app metadata and icons for installation

---

## Setup Instructions

1. **Clone or download the repository.**

   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Start a local development server.**
   You can use any static server, such as:

   ```bash
   npx serve .
   ```

   or use the Live Server extension in VS Code.

3. **Set up a local CORS proxy** for the API call:
   The app uses:

   ```
   http://localhost:8010/proxy/v2.0/current
   ```

   You can use a simple Node.js proxy or a tool like [cors-anywhere](https://github.com/Rob--W/cors-anywhere).

4. **Open the app** in your browser:

   ```
   http://localhost:3000
   ```

   or the port your server specifies.

---

## How It Works

1. **Online mode:**

   * The app fetches data from the Weather API.
   * Data is displayed and cached locally using IndexedDB.

2. **Offline mode:**

   * If the user loses network connection, the app retrieves cached data from IndexedDB.
   * The Service Worker serves stored files to keep the interface functional.

3. **Service Worker and Manifest:**

   * Together, they make the app installable as a PWA.
   * Cached assets ensure the app loads even when offline.

---

## Notes

* Replace the API key in `app.js` with your own if needed:

  ```javascript
  const API_KEY = 'your-api-key-here';
  ```
* Cached weather data expires after **30 minutes** to ensure accuracy.
* The PWA will automatically update when a new service worker version is activated.

---

## License

This project is released for educational purposes and can be freely modified or extended.
