const searchBtn=document.getElementById("searchBtn");
const locBtn=document.getElementById("locBtn");
const cityInput=document.getElementById("cityInput");
const weather=document.getElementById("weather");
const errorMsg=document.getElementById("errorMsg");
const themeToggle=document.getElementById("themeToggle");

// Load saved theme
if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark-mode"); themeToggle.textContent="☀️";}

// Toggle Theme
themeToggle.addEventListener("click",()=>{
  document.body.classList.toggle("dark-mode");
  const isDark=document.body.classList.contains("dark-mode");
  themeToggle.textContent=isDark?"☀️":"🌙";
  localStorage.setItem("theme",isDark?"dark":"light");
});

// Search City
searchBtn.addEventListener("click",()=>{const city=cityInput.value.trim(); if(city) fetchWeather(city);});
cityInput.addEventListener("keypress",e=>{if(e.key==="Enter"){const city=cityInput.value.trim(); if(city) fetchWeather(city);}});

// Current Location
locBtn.addEventListener("click",()=>{
  if(navigator.geolocation){navigator.geolocation.getCurrentPosition(showPosition,()=>showErrorMsg("Unable to access location!"));} 
  else{alert("Geolocation not supported.");}
});

function showPosition(position){
  const {latitude,longitude}=position.coords;
  fetchWeatherByCoords(latitude,longitude);
}

async function fetchWeather(city){
  try{
    const res=await fetch(`/weather?city=${city}`);
    if(!res.ok) throw new Error("Network error");
    const data=await res.json();
    if(data.cod==="404"){showErrorMsg("City not found!"); return;}
    displayWeather(data);
  } catch(err){console.error(err); showErrorMsg("Error fetching weather!");}
}

async function fetchWeatherByCoords(lat,lon){
  try{
    const res=await fetch(`/weather?lat=${lat}&lon=${lon}`);
    if(!res.ok) throw new Error("Network error");
    const data=await res.json();
    displayWeather(data);
  } catch(err){console.error(err); showErrorMsg("Error fetching location weather!");}
}

function showErrorMsg(msg){weather.classList.add("hidden"); errorMsg.textContent=`❌ ${msg}`; errorMsg.classList.remove("hidden");}

function displayWeather(data){
  errorMsg.classList.add("hidden"); weather.classList.remove("hidden");
  document.getElementById("cityName").textContent=`${data.name}, ${data.sys.country}`;
  document.getElementById("temp").textContent=`${Math.round(data.main.temp)}°C`;
  document.getElementById("desc").textContent=data.weather[0].description;
  document.getElementById("humidity").textContent=data.main.humidity;
  document.getElementById("wind").textContent=data.wind.speed;
  document.getElementById("icon").src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const now=new Date();
  document.getElementById("time").textContent=`Last updated: ${now.toLocaleTimeString()}`;
  setDynamicGradient(data.weather[0].main);
}

function setDynamicGradient(condition){
  let gradient="";
  switch(condition){
    case"Clear":gradient="linear-gradient(-45deg,#FFD166,#F6AE2D,#F4D35E,#F0E68C)";break;
    case"Clouds":gradient="linear-gradient(-45deg,#bdc3c7,#2c3e50,#95a5a6,#7f8c8d)";break;
    case"Rain":case"Drizzle":gradient="linear-gradient(-45deg,#4facfe,#00f2fe,#5b86e5,#36d1dc)";break;
    case"Snow":gradient="linear-gradient(-45deg,#E0EAFC,#CFDEF3,#FFFFFF,#a8edea)";break;
    case"Thunderstorm":gradient="linear-gradient(-45deg,#141E30,#243B55,#3a6186,#89253e)";break;
    default:gradient="linear-gradient(-45deg,#89f7fe,#66a6ff,#a8edea,#fed6e3)";
  }
  document.body.style.background=gradient;
  document.body.style.backgroundSize="400% 400%";
  document.body.style.animation="gradientMove 15s ease infinite";
}
