const API_KEY = "29464c45f4afb99c42263fbf021d3813" ;    // weather API
let searchForm = document.querySelector(".searchForm"); // get search form

// Section 1
const cityNameTag = document.querySelector(".city-name");
const weatherTag = document.querySelector(".weather");
const dateTag = document.querySelector(".daytime .day");
const timeTag = document.querySelector(".daytime .time");
const section1ImgTag = document.querySelector(".weather-img");
const descriptionTag = document.querySelector(".description");
const mainTag = document.querySelector(".mainT");
const mainImgTag = document.querySelector(".main-img");

// function for get location when user form submit
searchForm.addEventListener("submit",handleFormSubmit)
function handleFormSubmit(e){
    e.preventDefault();
    const search = document.querySelector(".searchInput");
    const cityName = search.value.toLowerCase().trim();  
    console.log(cityName)
    const currentAPI = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric&appid="+API_KEY;
    fetchWeatherData(currentAPI);
    const weeklyAPI = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units=metric&appid="+API_KEY;
    fetchWeatherData(weeklyAPI,"list");
    search.value = "";
}

// async function for fetch data from the api
async function fetchWeatherData(URL,list){
    try{
        const response = await fetch(URL);
        const data = await response.json();
        // list parameter for weekly weather data list
        if(data.message === "city not found"){
            console.log(data.message);
            dataNotFound();
            return true;
        }
        if(list){
            const weatherArray = data.list;
            // create a empmty set for store unique dates
            const uniqueDatesSet = new Set();
        
        // Filter out duplicate dates and populate the Set
            const uniqueWeatherArray = weatherArray.filter(weather => {
                const date = new Date(weather.dt_txt).toISOString().split('T')[0]; //toisostring ddmmyyyhhmmss it split [ddmmyyy, hhmmss] 
                if (!uniqueDatesSet.has(date)) {
                  uniqueDatesSet.add(date);
                  return true;
                }
                return false;
              });
              setWeeklyData(uniqueWeatherArray)
             console.log(uniqueWeatherArray)
             return true;
             
        }
        // daily weather data
        // console.log(data)
        setTodayWeatherData(data);
    }catch(error){
        console.log("Error fetching data",error)
    }
}

// for set weather data to equal html tags
function setTodayWeatherData(data){
    // section 1
    cityNameTag.textContent = data.name ;
    weatherTag.textContent = Math.floor(data.main.temp)
    let datetime = formattedDate(data.dt);
    dateTag.textContent = datetime[0];
    timeTag.textContent = datetime[1];
    // image 
    let img = data.weather[0].icon;
    let imgUrl = "https://openweathermap.org/img/wn/"+img+"@2x.png";
    section1ImgTag.src  = imgUrl;
    mainImgTag.src = imgUrl;
    descriptionTag.textContent = data.weather[0].description;
    mainTag.textContent = data.weather[0].main;

    // section 2 todays
    document.querySelector(".humidity-content").textContent = data.main.humidity+" %";
    document.querySelector(".windSpeed-content").textContent = data.wind.speed+" km/h";
    document.querySelector(".tempareture-content").textContent = data.main.feels_like;
    document.querySelector(".airquality").textContent = data.wind.deg;
    document.querySelector(".sunrise").textContent = formattedDate(data.sys.sunrise)[1];
    document.querySelector(".sunset").textContent = formattedDate(data.sys.sunset)[1];
    document.querySelector(".uv").textContent =  5;
}

function setWeeklyData(data){
    // Get all the .week-box elements
    const weekBoxes = document.querySelectorAll('.week-box');
    
    // Iterate through each .week-box element and update its content
    weekBoxes.forEach((weekBox, index) => {
        const dayName = weekBox.querySelector('p:first-child');
        const weatherIcon = weekBox.querySelector('img');
        const temperature = weekBox.querySelector('p:last-child span');

        dayName.textContent = weeklyDate(data[index + 1].dt);
    
        // // Update weather icon 
        let img = data[index + 1].weather[0].icon;
        const imgUrl = "https://openweathermap.org/img/wn/"+img+"@2x.png";
         weatherIcon.src = imgUrl;
    
        // // Update temperature from the weatherData array
        const roundedTemp = Math.floor(data[index + 1].main.temp);
        temperature.textContent = roundedTemp;
    });
}

function formattedDate(data){
    const unixTimestamp = data; 
    const timestampMilliseconds = unixTimestamp * 1000;
    // Create a new Date object using the timestamp in milliseconds
    const date = new Date(timestampMilliseconds);
    // Options for formatting the date and time
    const options = {
        year: 'numeric',
        month: 'short',
        weekday:'long',
        day:'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',

  };
  // Convert the Date object to a formatted date string
    const formatDate = date.toLocaleString('en-US', options);

    // Find the last comma's index
    const lastCommaIndex = formatDate.lastIndexOf(',');

    // Split the string using the last comma's index
    const dateArray = [
    formatDate.slice(0, lastCommaIndex).trim(),
    formatDate.slice(lastCommaIndex + 1).trim()
    ];
        return dateArray;
}

// return only day three letter
function weeklyDate(data){
    const unixTimestamp = data; 
    const timestampMilliseconds = unixTimestamp * 1000;
    // Create a new Date object using the timestamp in milliseconds
    const date = new Date(timestampMilliseconds);
    // Options for formatting the date and time
    const options = {
        weekday:'short',
  };
  // Convert the Date object to a formatted date string
    const formatDate = date.toLocaleString('en-US', options);

        return formatDate;
}

// data not found

const dataNotFound = ()=>{
    cityNameTag.textContent = "no city found" ;
    weatherTag.textContent = 0;
    dateTag.textContent = "no data";
    timeTag.textContent = "no data";
    descriptionTag.textContent = "no data";
    mainTag.textContent = "no data";

     // section 2 todays
     document.querySelector(".humidity-content").textContent = 0+" %";
     document.querySelector(".windSpeed-content").textContent = 0+" km/h";
     document.querySelector(".tempareture-content").textContent = 0;
     document.querySelector(".uv").textContent = 0;
     document.querySelector(".airquality").textContent = 0;
     document.querySelector(".sunrise").textContent = "no data";
     document.querySelector(".sunset").textContent = "no data";
}