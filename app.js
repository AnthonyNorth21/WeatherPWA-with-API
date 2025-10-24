// IndexedDB setup
let db;
const dbName = 'WeatherDB';
const dbVersion = 1;
const storeName = 'weatherData';

const request = indexedDB.open(dbName, dbVersion);

request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB opened successfully');
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: 'city' });
    console.log('Object store created');
};

// Weather API (using local CORS proxy)
const API_KEY = 'b17296ce22bf4ce5a172eb009e408d13';
const API_URL = 'http://localhost:8010/proxy/v2.0/current';

// Main function to get weather data
async function getWeather(city) {
    const weatherInfo = document.getElementById('weatherInfo');

    // Offline mode — use cached data
    if (!navigator.onLine) {
        console.log("Gathering Data from the IndexedDB without a Network Connection.");
        try {
            const cachedData = await getCachedWeather(city);
            if (cachedData) {
                displayWeather(cachedData);
            } else {
                console.log("Cannot receive data from API or IndexedDB.");
                weatherInfo.textContent = "Offline and no cached data available.";
            }
        } catch (error) {
            console.error("Error fetching cached data:", error);
            weatherInfo.textContent = "Error retrieving cached data.";
        }
        return;
    }

    // Online mode — fetch from API
    console.log("Gathering Data from the API Online.");
    try {
        const response = await fetch(`${API_URL}?city=${city}&key=${API_KEY}&units=M`);
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const weatherData = data.data[0];
            await cacheWeatherData(weatherData);
            displayWeather(weatherData);
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherInfo.textContent = 'Error fetching weather data. Check the console for details.';
    }
}

// Display weather info
function displayWeather(weatherData) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>${weatherData.city_name}, ${weatherData.state_code}</h2>
        <p>Temperature: ${weatherData.temp}°C</p>
        <p>Feels like temp: ${weatherData.app_temp}°C</p>
        <p>Sunrise: ${weatherData.sunrise} — Sunset: ${weatherData.sunset}</p>
        <p>Weather: ${weatherData.weather.description}</p>
        <p>Wind: ${weatherData.wind_spd} m/s, ${weatherData.wind_cdir_full}</p>
    `;
}

// Cache weather data in IndexedDB
async function cacheWeatherData(weatherData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.put({
            city: weatherData.city_name.toLowerCase(),
            data: weatherData,
            timestamp: Date.now()
        });

        request.onerror = () => reject('Error caching weather data');
        request.onsuccess = () => resolve();
    });
}

// Retrieve cached weather data
async function getCachedWeather(city) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(city.toLowerCase());

        request.onerror = () => reject('Error getting cached weather data');
        request.onsuccess = (event) => {
            const result = event.target.result;
            if (result && (Date.now() - result.timestamp < 30 * 60 * 1000)) {
                resolve(result.data);
            } else {
                resolve(null);
            }
        };
    });
}

// Button event listener
document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('location').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});