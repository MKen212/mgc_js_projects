"use strict";
// 02 - Clock JS

showTime();

// Function to get and show the current time
function showTime() {
  // Get the current time
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Set AM/PM
  const period = (hours < 12) ? "AM" : "PM";

  // Update to 12-hour clock
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
  }

  // Prefix leading zeros
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  // Create Time string
  const time = `${hours}:${minutes}:${seconds} ${period}`;

  // Output
  document.getElementById("time").textContent = time;

  // Re-invoke function to Show the time in 1 second
  setTimeout(showTime, 1000);
}
