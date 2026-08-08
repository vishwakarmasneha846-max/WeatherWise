const apiKey = "111bd29a2ad9f56e9792ea3419dc7d4c";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const error = document.getElementById("error");

    if (city === "") {
        error.textContent = "Please enter a city.";
        return;
    }

    error.textContent = "Loading...";

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        // API error
        if (!response.ok) {

            if (response.status === 401) {
                error.textContent =
                    "Your API key is invalid or not activated.";
            }
            else if (response.status === 404) {
                error.textContent =
                    "City not found.";
            }
            else {
                error.textContent =
                    `Weather error: ${data.message}`;
            }

            return;
        }

        // =========================
        // DISPLAY WEATHER
        // =========================

        error.textContent = "";

        document.getElementById("cityName").textContent =
            data.name;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("feelsLike").textContent =
    `${Math.round(data.main.feels_like)}°`;

     document.getElementById("sideFeels").textContent =
    `${Math.round(data.main.feels_like)}°`;

    document.getElementById("highTemp").textContent =
    `${Math.round(data.main.temp_max)}°`;

 document.getElementById("lowTemp").textContent =
    `${Math.round(data.main.temp_min)}°`;

    document.getElementById("sideHumidity").textContent =
    `${data.main.humidity}%`;

    document.getElementById("sideWind").textContent =
    `${data.wind.speed} km/h`;

        document.getElementById("description").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("wind").textContent =
            `${data.wind.speed} km/h`;
            
            // Change background according to weather
            changeBackground(data.weather[0].main);
            getForecast(city);

function changeBackground(weather) {

    const body = document.body;

    switch (weather) {

        case "Clear":

            body.style.background =
                "linear-gradient(135deg, #2193b0, #6dd5ed)";

            break;


        case "Clouds":

            body.style.background =
                "linear-gradient(135deg, #283e51, #485563)";

            break;


        case "Rain":
        case "Drizzle":

            body.style.background =
                "linear-gradient(135deg, #172b3a, #294861)";

            break;


        case "Thunderstorm":

            body.style.background =
                "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";

            break;


        case "Snow":

            body.style.background =
                "linear-gradient(135deg, #83a4d4, #b6fbff)";

            break;


        case "Mist":
        case "Fog":
        case "Haze":

            body.style.background =
                "linear-gradient(135deg, #536976, #292e49)";

            break;


        default:

            body.style.background =
                "linear-gradient(135deg, #141e30, #243b55)";
    }
}

        // Weather icon

        const icon = data.weather[0].icon;

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

    }

    catch (error) {

        console.log(error);

        document.getElementById("error").textContent =
            "Could not connect to weather service.";

    }

    async function getForecast(city) {

    const forecastContainer =
        document.getElementById("forecastContainer");

    try {

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        const response = await fetch(forecastUrl);

        const data = await response.json();

        console.log("5 Day Forecast:", data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        forecastContainer.innerHTML = "";

        // Group forecast data by date
        const days = {};

        data.list.forEach(item => {

            const date = item.dt_txt.split(" ")[0];

            if (!days[date]) {
                days[date] = [];
            }

            days[date].push(item);
        });

        // Get next 5 days
        const dates = Object.keys(days).slice(1, 6);

        dates.forEach(date => {

            const dayForecast = days[date];

            // Use the forecast closest to noon
            const forecast =
                dayForecast.find(item =>
                    item.dt_txt.includes("12:00:00")
                ) || dayForecast[0];

            const weather = forecast.weather[0];

            const temps =
                dayForecast.map(item => item.main.temp);

            const high =
                Math.round(Math.max(...temps));

            const low =
                Math.round(Math.min(...temps));

            const dateObject = new Date(date);

            const dayName =
                dateObject.toLocaleDateString("en-US", {
                    weekday: "short"
                });

            const formattedDate =
                dateObject.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                });

            const card =
                document.createElement("div");

            card.className = "forecast-card";

            card.innerHTML = `
                <div class="forecast-day">
                    ${dayName}
                </div>

                <div class="forecast-date">
                    ${formattedDate}
                </div>

                <img
                    class="forecast-icon"
                    src="https://openweathermap.org/img/wn/${weather.icon}@2x.png"
                    alt="${weather.description}"
                >

                <div class="forecast-temp">
                    ${Math.round(forecast.main.temp)}°C
                </div>

                <div class="forecast-description">
                    ${weather.description}
                </div>

                <div class="forecast-high-low">
                    ↑ ${high}° &nbsp;&nbsp; ↓ ${low}°
                </div>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (error) {

        console.error("Forecast error:", error);

        forecastContainer.innerHTML =
            `<p>Unable to load forecast.</p>`;
    }
}
}