"use strict";
// 05 - Colour Game JS

// Initialise working variables
let numSquares = 6;
let colours = [];
let pickedColour;

// Get HTML Elements
const heading = document.getElementById("heading");
const colourDisplay = document.getElementById("colour-display");
const resetBtn = document.getElementById("reset");
const message = document.getElementById("message");
const modeButtons = document.querySelectorAll(".mode");
const squares = document.querySelectorAll(".square");


// Setup the reset event listener
resetBtn.addEventListener("click", () => {
  startUp();
});

// Setup the squares event listeners
squares.forEach((square) => {
  // Add click event listener for when square is clicked
  square.addEventListener("click", (event) => {
    const clickedColour = event.target.style.backgroundColor;
    // console.log(clickedColour);
    // Check if colour picked is correct
    if (clickedColour === pickedColour) {
      message.textContent = "Correct";
      resetBtn.textContent = "Play Again";
      changeColours(pickedColour);
    } else {
      event.target.style.backgroundColor = "#232323";
      message.textContent = "Try Again";
    }
  });
});

// Setup the Mode event listeners
modeButtons.forEach((modeButton) => {
  modeButton.addEventListener("click", (event) => {
    // Remove the .selected class from all mode buttons
    for (let i = 0; i < modeButtons.length; i++) {
      modeButtons[i].classList.remove("selected");
    }
    
    // Add the .selected class to the current clicked button
    event.target.classList.add("selected");

    // Update the number of squares to populate based on the mode
    if (event.target.textContent === "Easy") {
      numSquares = 3;
    } else {
      numSquares = 6;
    }

    // Re-Start the game
    startUp();
  });
});


// Function to Startup / Reset the display
function startUp() {
  // Get a set of random colours, pick one, display the chosen code and reset the header
  colours = getColours(numSquares);
  pickedColour = chooseColour();
  heading.style.background = "#2c8e99";
  colourDisplay.textContent = pickedColour;
  resetBtn.textContent = "New Colours";
  message.textContent = "";

  // Set the background for each of the squares to each random colour
  squares.forEach((square, index) => {
    if (colours[index]) {
      square.style.display = "block";
      square.style.backgroundColor = colours[index];
    } else {
      square.style.display = "none";
    }
  });
}

// Function to change colours on success
function changeColours(colour) {
  squares.forEach((square) => {
    square.style.backgroundColor = colour;
    heading.style.backgroundColor = colour;
  });
}

// Function to return a random rgb(r, g, b) colour code
function makeColour() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to get an array of colours
function getColours(num) {
  let arr = [];
  for (let i=0; i < num; i++) {
    arr.push(makeColour());
  }
  return arr;
}

// Function to choose colour from the array
function chooseColour() {
  const chosen = Math.floor(Math.random() * colours.length);
  return colours[chosen];
}

// Start the game
startUp();
