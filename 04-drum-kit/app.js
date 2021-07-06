"use strict";
// 04 - Drum Kit JS

// Get Cymbal Elements
const crashRide = document.getElementById("crash-ride");
const hihatTop = document.getElementById("hihat-top");

// Cymbal Animation Functions
const animateCrashRide = () => {
  crashRide.style.transform = "rotate(0deg) scale(1.5)";
};

const animateHiHatClosed = () => {
  hihatTop.style.top = "171px";
};

// Main Function to Play the Sound
function playSound(event) {
  // Get the KeyCode from the keydown event and find the relevant <div> element
  const keyCode = event.keyCode;
  const keyElement = document.querySelector(`div[data-key="${keyCode}"]`);
  // console.log(keyElement);
  
  if (!keyElement) {
    // If KeyCode not found, return
    return;
  }

  // Add .playing class to selected key
  keyElement.classList.add("playing");

  // Get the relevant <audio> element for KeyCode & Play
  const audioElement = document.querySelector(`audio[data-key="${keyCode}"]`);
  // const audioElement = keyElement.querySelector("audio");  < Could use this if the audio elements are moved under the relevant key <div> rather than in a separate list
  audioElement.currentTime = 0;
  audioElement.play();

  // Run cymbal animation
  switch(keyCode) {
    case 69:
    case 82:
      animateCrashRide();
      break;
    case 75:
      animateHiHatClosed();
      break;
  }
}

// Functions to remove key and cymbal animations
const removeKeyTransition = (event) => {
  if (event.propertyName !== "transform") {
    return;
  }
  event.target.classList.remove("playing");
};

const removeCrashRideTransition = (event) => {
  if (event.propertyName !== "transform") {
    return;
  }
  event.target.style.transform = "rotate(-7.2deg) scale(1.5)";
};

const removeHiHatClosedTransition = (event) => {
  if (event.propertyName !== "top") {
    return;
  }
  event.target.style.top = "166px";
};

// Add Event Listeners to remove key and cymbal animations
const drumKeys = document.querySelectorAll(".key");
drumKeys.forEach((drumKey) => {
  drumKey.addEventListener("transitionend", removeKeyTransition);
});

crashRide.addEventListener("transitionend", removeCrashRideTransition);
hihatTop.addEventListener("transitionend", removeHiHatClosedTransition);

// Add Window Event Listener to Play Sound on Key Press
window.addEventListener("keydown", playSound);
