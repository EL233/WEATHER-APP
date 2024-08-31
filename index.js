const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = "9bf9a136f191ce25ba549421d4be658a";

weatherForm.addEventListener("submit",async event =>{

    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError("failed to fetch weather data");
        }
    }
    else{
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    //获取地理坐标
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    const geoResponse = await fetch(geoUrl);

    //console.log(geoResponse);

    if (!geoResponse.ok) {
        throw new Error("Failed to fetch city coordinates.");
    }

    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
        throw new Error("City not found.");

}

    const { lat, lon } = geoData[0];

// 使用地理坐标获取天气数据
const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const weatherResponse = await fetch(weatherUrl);

if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data.");
}

return await weatherResponse.json();
}


function displayWeatherInfo(data){
    //console.log(data);

    const {name:city,
           main:{temp,humidity},
           weather:[{description,id}]} = data;

    card.textContent ="";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity:${humidity}`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmoji.classList.add('weatherEmoji');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

}

function getWeatherEmoji(weatherId){

    switch(true){
        case(weatherId >= 200 && weatherId <300):
            return "⛈️";
        case(weatherId >= 300 && weatherId <400):
            return "🌧️";
        case(weatherId >= 500 && weatherId <600):
            return "🌧️";
        case(weatherId >= 600 && weatherId <700):
            return "❄️";
        case(weatherId >= 700 && weatherId <800):
            return "💨";
        case(weatherId === 800):
            return "☀️";
        case(weatherId >= 801 && weatherId <810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}