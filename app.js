//get current weather
async function getCurrentWeather(location,units){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&APPID=162044fc23532ea616d78fc559a20b2c`, {mode: 'cors'});
    
        const data = await response.json();
        console.log(data);
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        //extract info from API
        const description = data.weather[0].main;
        const country = data.sys.country;
        const city = data.name;

        const temp = Math.round(data.main.temp);
        const feel = Math.round(data.main.feels_like);
        const weatherIconPic = data.weather[0].icon;

        displayCurrentWeather(description, country, city, temp, feel,weatherIconPic);

        changeUnits(city);
        getDailyForecast(lat,lon,units)
            
    } catch(error){
        //console.log(error);
        throwError()
    }
    
    
}

// get hourly forecast weather 

async function getHourlyForecast(location,units){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${units}&cnt=8&APPID=162044fc23532ea616d78fc559a20b2c`, {mode: 'cors'})
    const data = await response.json()
      
    const dataStamps = data.list;

    resetHourly();
       
    for (let i=0; i < dataStamps.length; i++){
        const singleDataStamp = dataStamps[i];
       
        const unixTimeStamp = singleDataStamp.dt;
        const dayAndTime = getDayAndTime(unixTimeStamp);
        const time = dayAndTime.time;
        //console.log(time);

        const forecastIcon = singleDataStamp.weather[0].icon;
    
        const hourlyTemp = Math.round(singleDataStamp.main.temp);

        displayHourlyWeather(hourlyTemp, forecastIcon, time);

    }
    
}

// get daily weather forecast

async function getDailyForecast(lat,lon, units){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}6&lon=${lon}&units=${units}&exclude=minutely,hourly&&APPID=162044fc23532ea616d78fc559a20b2c`, {mode: 'cors'})
    const data = await response.json();
    
    //get current day and time 
    const timezone = data.timezone;

    const time = new Date().toLocaleString("en-US", {timeZone: `${timezone}`, hour: "numeric"})
    const day = new Date().toLocaleString("en-US", {timeZone: `${timezone}`, weekday: "long"})

    
    displayDate(day,time);

    const dailyDataStamp = data.daily;
    //console.log(dailyDataStamp.length);
    
    resetDaily();

    for (let i=0; i < 5; i++){
        const singleDailyDataStamp = dailyDataStamp[i];

        //get daily forecast

        const unixTimeStamp = singleDailyDataStamp.dt;
        const dayAndTime = getDayAndTime(unixTimeStamp);
        const day = dayAndTime.day;
        
        const dailyForecastIcon = singleDailyDataStamp.weather[0].icon;

        const maxTemp = Math.round(singleDailyDataStamp.temp.max);
        const minTemp = Math.round(singleDailyDataStamp.temp.min);
        
        displayDailyWeather(day, dailyForecastIcon, maxTemp, minTemp);

    }

}

function getDayAndTime(unixTimeStamp){
    
    const unixTimeStampInSeconds = unixTimeStamp * 1000;

    const dateObject = new Date(unixTimeStampInSeconds);

    const day = dateObject.toLocaleString("en-US", {weekday: "long"});
    const time = dateObject.toLocaleString("en-US", {hour: "numeric"});

    return{
        day,
        time
    }
}

//Display Weather Information

function displayCurrentWeather(description, country, city, temp, feel, weatherIconPic){

    //display location
    const displayLocation = document.querySelector(".location")
    displayLocation.textContent = `${city}, ${country}`;

    //display weather icon
    const weatherIcon = document.getElementById("icon");
    weatherIcon.src =`http://openweathermap.org/img/wn/${weatherIconPic}@2x.png`;

    //display currect temperature
    const displayTemp = document.getElementById("temp");
    displayTemp.textContent = temp;

    //display weather description
    const displayDescription = document.querySelector(".description");
    displayDescription.textContent = description;

    // display feels like information
    const displayFeel = document.querySelector(".feel");
    displayFeel.textContent = `Feels like ${feel}°`;
    
}


function displayHourlyWeather(hourlyTemp, weatherIcon, time){

    const hourlyInfo = document.querySelector(".hourly-info");
    //clear the DOM of any previously displayed data
   

    //create containing div
    const displayForecast = document.createElement("div");
    displayForecast.classList.add("hourly-item");

    //create paragraph with hourly temperature
    const displayForecastTemp = document.createElement("p");
    displayForecastTemp.classList.add("hourly-temp");
    displayForecastTemp.textContent = `${hourlyTemp} °`;
    displayForecast.appendChild(displayForecastTemp);

    //display weather icon
    const displayForecastImage = displayWeatherIcon(weatherIcon);
    displayForecast.appendChild(displayForecastImage);

    //display time
    const displayDateTime = document.createElement("p");
    displayDateTime.classList.add("hourly-time");
    displayDateTime.textContent = `${time}`;
    displayForecast.appendChild(displayDateTime);

        
    hourlyInfo.appendChild(displayForecast);

}

function displayDailyWeather(day,weatherIcon,maxTemp, minTemp){

    const dailyInfo = document.querySelector(".daily-info");
    
    const displayDailyForecast = document.createElement("div");
    displayDailyForecast.classList.add("daily")

    //display day information
    const displayDay = document.createElement("p");
    displayDay.classList.add("day");
    displayDay.textContent = `${day}`;
    displayDailyForecast.appendChild(displayDay);

    //display weather icon
    const displayDailyForecastImage = displayWeatherIcon(weatherIcon);
    displayDailyForecast.appendChild(displayDailyForecastImage);

    //display min and max temperature
    const maxMinTemp = document.createElement("span");
    maxMinTemp.classList.add("maxmin-temp")

    const displayMaxTemp = document.createElement("p");
    displayMaxTemp.classList.add("max-temp")
    displayMaxTemp.textContent = ` ${maxTemp}°`;

    const displayMinTemp = document.createElement("p");
    displayMinTemp.classList.add("min-temp");
    displayMinTemp.textContent = ` ${minTemp}°`;

    maxMinTemp.appendChild(displayMaxTemp);
    maxMinTemp.appendChild(displayMinTemp);

    displayDailyForecast.appendChild(maxMinTemp);
            
    dailyInfo.appendChild(displayDailyForecast);

}

function displayWeatherIcon(iconId){
    
    const displayForecastImage = document.createElement("img");
    displayForecastImage.classList.add("forecast-img");
    displayForecastImage.src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    return displayForecastImage;
    
}


function displayDate(day,time){
    //display time and day
    const displayDay = document.querySelector(".day-time");
    displayDay.textContent = `${day} ${time}`;
}

//Reset DOM
function resetHourly(){
    const hourlyInfo = document.querySelector(".hourly-info");
    hourlyInfo.innerHTML = ""; 
}

function resetDaily(){
    const dailyInfo = document.querySelector(".daily-info");
    dailyInfo.innerHTML = "";
}

function innit(){
    const searchInput = document.querySelector(".search");
    const searchBtn = document.querySelector(".search-btn");


    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();

        resetHourly();
        resetDOM();
        
        const cityName = searchInput.value;
        getCurrentWeather(cityName, "metric");
        getHourlyForecast(cityName, "metric");
        
        searchInput.value = "";
    });

    window.addEventListener('DOMContentLoaded', () => {
        getCurrentWeather("kitchener", "metric");
        getHourlyForecast("kitchener","metric");

    })

}

function changeUnits(location){

    const imperialUnits = document.querySelector(".fahrenheit");
    const metricUnits = document.querySelector(".celcius")

    imperialUnits.addEventListener("click", () => {

        imperialUnits.classList.add("active");
        metricUnits.classList.remove("active");
        const cityName = location; 
    
        getCurrentWeather(cityName, "imperial");
        getHourlyForecast(cityName, "imperial");
    })

    metricUnits.addEventListener("click", () => {

        metricUnits.classList.add("active");
        imperialUnits.classList.remove("active");
        const cityName = location; 
        
        getCurrentWeather(cityName, "metric");
        getHourlyForecast(cityName, "metric");
    })
}

function throwError(){
    const currentWeather = document.querySelector(".wrapper");
    const extendedWeather = document.querySelector(".extended-info");
    
    const container = document.querySelector(".container");
    
    currentWeather.classList.add("hide");
    extendedWeather.classList.add("hide");

    const errorMsg = document.createElement("div");
    errorMsg.classList.add("error");
    errorMsg.textContent = "Oops! No Such Location Found";
    container.appendChild(errorMsg);

}

function resetDOM(){
    const currentWeather = document.querySelector(".wrapper");
    const extendedWeather = document.querySelector(".extended-info");
    const errorMsg = document.querySelector(".error");

    if(errorMsg){
        currentWeather.classList.remove("hide");
        extendedWeather.classList.remove("hide");
        errorMsg.classList.add("hide");
    }
    
}

innit();







