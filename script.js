const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const API_KEY = '8fdfe0c3bc0a5461d6e489eb88c0b84c';

const API_KEY_FORECAST = 'c53ab538be1645c0b212b515c5c23d61';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0' +hoursIn12HrFormat: hoursIn12HrFormat) + ':' + (minutes < 10? '0' +minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month]

}, 1000);


getForecastWeatherData()
function getForecastWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${API_KEY_FORECAST}&days=7`).then(res => res.json()).then(data => {

            showForecastWeatherData(data);

        })
    })
}

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {

            showWeatherData(data);

        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure } = data.main;

    timezone.innerHTML = `<div class="time-zone" id="time-zone">${data.name}</div>`
    countryEl.innerHTML = `<div id="country" class="country">${data.sys.country}</div>`

    currentTempEl.innerHTML = `
        <div class="today" id="current-temp">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(data.dt * 1000).format('ddd')}</div>
                <div class="temp">Max - ${data.main.temp_max}&#176; C</div>
                <div class="temp">Min - ${data.main.temp_min}&#176; C</div>
            </div>
        </div>
    `


    currentWeatherItemsEl.innerHTML = `
     <div class="weather-item">
                    <div>Temperature</div>
                    <div>${data.main.feels_like}&#176; C</div>
                </div> 
                <div class="weather-item">
                    <div>Humidity</div>
                    <div>${humidity}%</div>
                </div>
                <div class="weather-item">
                    <div>Pressure</div>
                    <div>${pressure}mb</div>
                </div>
                <div class="weather-item">
                    <div>Wind Speed</div>
                    <div>${data.wind.speed}km/hr</div>
                </div>
                <div class="weather-item">
                    <div>Sunrise</div>
                    <div>${window.moment(data.sys.sunrise * 1000).format('HH:mm a')} </div>
                </div>
                <div class="weather-item">
                    <div>Sunset</div>
                    <div>${window.moment(data.sys.sunset * 1000).format('HH:mm a')}</div>
                </div>
                  ` ;
}

function showForecastWeatherData(data) {
    let otherDayForecast = ''
    data.data.forEach((day, idx) => {
        if (idx === 0) {

        } else {
            otherDayForecast += `
                            <div class="weather-forecast-item">
                            <div class="day">${window.moment(day.datetime).format('ddd')}</div>
                            <img src='https://cdn.weatherbit.io/static/img/icons/${day.weather.icon}.png' height=100 alt="weather icon" class="w-icon">
                            <div class="temp">Max -${day.max_temp}&#176; C</div>
                            <div class="temp">Min - ${day.min_temp}&#176; C</div>
                        </div>
                        `
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', () => {
    const location = searchInput.value;
    if (location) {
        getWeatherDataByLocation(location);
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value;
        if (location) {
            getWeatherDataByLocation(location);
        }
    }
});

function getWeatherDataByLocation(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                console.log(data)
                showWeatherData(data);
                getForecastDataByLocation(location); 
            } else {
                alert('Location not found');
            }
        })
        .catch(err => console.error(err));
}


function getForecastDataByLocation(location) {
    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&key=${API_KEY_FORECAST}&days=7`)
        .then(res => res.json())
        .then(data => {
            if (data) {
                showForecastWeatherData(data);
            } else {
                alert('Forecast not found');
            }
        })
        .catch(err => console.error(err));
}