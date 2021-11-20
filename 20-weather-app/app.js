"use strict";
// 20 - Weather App JS

import APIKey from "./_config.js";

// console.log(APIKey);

window.addEventListener("load", () => {
  // Set Variables
  let latitude;   // Your current latitude
  let longitude;  // Your current longitude

  // Get HTML Elements
  const location = document.getElementById("location");
  const icon = document.getElementById("icon");
  const tempC = document.getElementById("tempC");
  const tempF = document.getElementById("tempF");
  const tempDesc = document.getElementById("tempDesc");
  const degreeSection = document.querySelector(".degree-section");

  // Add Event Listener to Toggle Celsius <> Fahrenheit
  degreeSection.addEventListener("click", () => {
    if (tempF.classList.contains("hidden")) {
      tempC.classList.add("hidden");
      tempF.classList.remove("hidden");
    } else {
      tempC.classList.remove("hidden");
      tempF.classList.add("hidden");
    }
  });
  
  // Find current position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      // console.log(position);
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    
      // Build API Call
      const APICall = `https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${latitude}, ${longitude}&aqi=no`;

      // Alternates
      // const APICall = `https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=London&aqi=no`;
      // const APICall = `https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=Jakarta&aqi=no`;
      // const APICall = `https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=Kuala Lumpur&aqi=no`;
   
      
      // console.log(APICall);
    
      // Get Data
      fetch(APICall).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        // Update display with retrieved data
        location.textContent = `${data.location.name}, ${data.location.country}`;
        icon.setAttribute("src", data.current.condition.icon);
        tempC.innerHTML = `${data.current.temp_c}<span>&degC</span>`;
        tempF.innerHTML = `${data.current.temp_f}<span>&degF</span>`;
        tempDesc.textContent = data.current.condition.text;
      });
    });
  } else {
    // Pass Error Message
    location.textContent = `Location not found`;
    icon.removeAttribute("src");
    tempC.innerHTML = `??<span>&degC</span>`;
    tempF.innerHTML = `??<span>&degF</span>`;
    tempDesc.textContent = `Location services need to be enabled.`;
  }
});
