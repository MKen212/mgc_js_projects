"use strict";
// 09 - Pairs JS

// Global Variables
const images = [  // Image names used for card faces
  "git",
  "github",
  "grunt",
  "node",
  "sass",
];
let guesses = [];    // Placeholder for guesses
let correct = 0;     // Counter of correct guesses
let curSeconds = 0;  // Current Timer - Seconds
let curTenths = 0;   // Current Timer - Tenths of a second
let Interval;        // Placeholder for Interval function


// Get HTML Elements
const restartBtn = document.getElementById("restart");
const seconds = document.getElementById("seconds");
const tenths = document.getElementById("tenths");
const message = document.getElementById("message");
const container = document.getElementById("container");

// Clone & duplicate images array into cards array
const clone = images.slice(0);
const cards = images.concat(clone);
// console.log(cards);

// Add Event Listener to restart button
restartBtn.addEventListener("click", restart);

// Function to Start the game
function start() {
  shuffle(cards);
  // console.log(cards);
  
  // Create each card as a <div> element
  cards.forEach((card)=> {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.dataset.item = card;
    container.appendChild(cardElement);
  
    // Add "click" event to each card
    cardElement.addEventListener("click", (event) => {
      // Check if card is already flipped or correct
      if (!event.target.classList.contains("flipped") && !event.target.classList.contains("correct")) {
        const item = event.target.dataset.item;
        event.target.className = "card flipped";
        event.target.style.background = `url("./images/${item}.jpg") left center/contain no-repeat var(--white)`;
        guesses.push(item);
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
      }
  
      // Check if another card has already been guessed
      if (guesses.length > 1) {
        // Check for a match between the two guessed cards
        if (guesses[0] === guesses[1]) {
          changeClass("correct");
          correct ++;
          win();
          guesses = [];
        } else {
          changeClass("reverse");
          guesses = [];
        }
      }
    });
  });
}

// Function to restart the game
function restart() {
  // Stop the timer
  clearInterval(Interval);
  // Reset the timer display
  curTenths = 0;
  curSeconds = 0;
  tenths.textContent = `00`;
  seconds.textContent = `00`;
  // Clear the guesses and correct
  guesses = [];
  correct = 0;
  // Clear any message
  message.textContent = "";
  // Clear all the existing cards
  const cardElements = document.querySelectorAll(".card");
  cardElements.forEach((cardElement) => {
    container.removeChild(cardElement);
  });
  // Re-Shuffle the Cards
  shuffle(cards);
  // Restart the game
  start();
}

// Function to change the class from "flipped"
function changeClass(newClass) {
  const flippedElements = document.querySelectorAll(".flipped");
  setTimeout(() => {
    flippedElements.forEach((flippedElement) => {
      flippedElement.classList.add(newClass);
      flippedElement.classList.remove("flipped");
      // Clear the background image
      if (newClass === "reverse") {
        flippedElement.style.background = "";
      }
    });
  },500);
}

// Function to check if round is completed
function win () {
  if (correct === images.length) {
    clearInterval(Interval);
    message.textContent = `Congratulations!! Your time was: ${curSeconds}:${curTenths}`;
  }
}

// Function to start the timer
function startTimer() {
  curTenths ++;

  // Click over tenths to seconds
  if (curTenths > 99) {
    curSeconds ++;
    curTenths = 0;
  }
  
  if (curTenths < 9) {
    tenths.textContent = `0${curTenths}`;
  } else {
    tenths.textContent = curTenths;
  }

  if (curSeconds < 9) {
    seconds.textContent = `0${curSeconds}`;
  } else {
    seconds.textContent = curSeconds;
  }
}

// Function to shuffle the cards
function shuffle(o) {
  for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

// Start the game
start();
