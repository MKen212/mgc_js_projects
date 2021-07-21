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
const seconds = document.getElementById("seconds");
const tenths = document.getElementById("tenths");
const message = document.getElementById("message");
const container = document.getElementById("container");

// Clone & duplicate images array into cards array
const clone = images.slice(0);
const cards = images.concat(clone);
// console.log(cards);

// Function to shuffle the cards
function shuffle(o) {
  for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

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
      event.target.classList.add("flipped");
      event.target.style.background = `url("./images/${item}.jpg") left center/contain no-repeat var(--white)`;
      guesses.push(item);
      clearInterval(Interval);
      Interval = setInterval(startTimer, 10);
    }

    // Check if another card has already been guessed
    if (guesses.length > 1) {
      // Check for a match between the two guessed cards
      if (guesses[0] === guesses[1]) {
        check("correct");
        correct ++;
        win();
        guesses = [];
      } else {

// TO HERE

      }
    }

  });
});


// Function to check
function check () {

}

function win () {

}

// Function to start the timer
function startTimer() {
  curTenths ++;


}

