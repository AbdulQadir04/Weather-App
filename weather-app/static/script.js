const searchBtn=document.getElementById('searchBtn');
const locBtn=document.getElementById('locBtn');
const cityInput=document.getElementById('cityInput');
const weather=document.getElementById('weather');
const errorMsg=document.getElementById('errorMsg');

searchBtn.addEventListener('click',()=>{const city=cityInput.value.trim(); if(city) fetch(`/weather?city=${city}`).then(r=>r.json()).then(displayWeather).catch(()=>showError('Error'));});
cityInput.addEventListener('keypress',e=>{if(e.key==='Enter'){const city=cityInput.value.trim(); if(city) fetch(`/weather?city=${city}`).then(r=>r.json()).then(displayWeather).catch(()=>showError('Error'));}});
locBtn.addEventListener('click',()=>{navigator.geolocation.getCurrentPosition(pos=>{fetch(`/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`).then(r=>r.json()).then(displayWeather).catch(()=>showError('Error'));},()=>showError('Location Error'));});

function displayWeather(data){if(data.error){showError(data.error); return;} errorMsg.classList.add('hidden'); weather.classList.remove('hidden'); document.getElementById('cityName').textContent=`${data.name}, ${data.sys.country}`; document.getElementById('temp').textContent=`${Math.round(data.main.temp)}°C`; document.getElementById('desc').textContent=data.weather[0].description; document.getElementById('humidity').textContent=data.main.humidity; document.getElementById('wind').textContent=data.wind.speed; document.getElementById('icon').src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;}
function showError(msg){weather.classList.add('hidden'); errorMsg.textContent=`❌ ${msg}`; errorMsg.classList.remove('hidden');}