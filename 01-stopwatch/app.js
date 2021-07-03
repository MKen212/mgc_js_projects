"use strict";
// 01 - StopWatch JS

// Initialise variables
let seconds = 0;
let tenths = 0;
let Interval;

// Get Time Elements
const spanTenths = document.getElementById("tenths");
const spanSeconds = document.getElementById("seconds");

// Get Button Elements
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnReset = document.getElementById("btn-reset");

// Add Event Listeners to Buttons
btnStart.addEventListener("click", () => {
  clearInterval(Interval);
  Interval = setInterval(runTimer, 10);
});

btnStop.addEventListener("click", () => {
  clearInterval(Interval);
});

btnReset.addEventListener("click", () => {
  clearInterval(Interval);
  tenths = 0;
  seconds = 0;
  displayTimer();
});

// Run Timer Function
function runTimer() {
  tenths++;  

  if (tenths > 99) {
    // Increment seconds & re-start tens
    seconds++;
    tenths = 0;
  }

  // Display Timer
  displayTimer();
}

// Function to display the current timer
function displayTimer() {
  // Tens
  if (tenths <= 9) {
    spanTenths.innerHTML = "0" + tenths;
  } else {
    spanTenths.innerHTML = tenths;
  }

  // Seconds
  if (seconds <= 9) {
    spanSeconds.innerHTML = "0" + seconds;
  } else {
    spanSeconds.innerHTML = seconds;
  }
}
