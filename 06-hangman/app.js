"use strict";
// 06 - Hangman JS

// Initialise Global Variables
let chosenWord = "";      // Chosen Word
let hint = "";
let guesses = [];         // Array of Guessed Letter HTML Elements
let counter = 0;          // Guess Counter
let lives = 10;            // Lives

// Available Letters
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
// Could have used following if just want a - z
// for (let code = 97; code < 123; code++) {
//  letters.push(String.fromCharCode(code));
// }

// Categories and Words data - NOTE make sure words are all lower case & no spaces
const data = [
  {
    category: "Football Teams",
    words: ["tottenham", "arsenal", "chelsea", "liverpool", "everton", "fulham", "millwall", "charlton",],
    hints: ["Top London Team", "London Team", "Owned by Russian", "Merseyside Team", "Other Merseyside Team", "The Cottagers", "South London Team", "Other South London Team",],
  },
  {
    category: "Films",
    words: ["alien", "casablanca", "godfather", "gladiator", "jaws", "mulan", "cinderella", "heat",],
    hints: ["Sci-Fi Horror", "Musical", "Crime drama", "Roman", "Big Fish", "Disney", "Disney", "Classic",],
  },
  {
    category: "Cities",
    words: ["london", "paris", "milan", "geneva", "brussels", "jakarta", "tokyo", "beijing", "amsterdam", "prague",],
    hints: ["UK", "France", "Italy", "Swiss", "Belgium", "Indonesia", "Japan", "China", "Holland", "Czech",],
  },
];

// Get HTML Elements
const letterElement = document.getElementById("letters");
const myGuessElement = document.getElementById("myGuess");
const messageElement = document.getElementById("message");
const hintElement = document.getElementById("hint");

// Prepare Canvas for drawing the HangMan
const hangMan = document.getElementById("hangMan");
const context = hangMan.getContext("2d");
context.strokeStyle = "#fff";
context.lineWidth = 2;

// Get Button Elements and add Event Listeners
const hintBtn = document.getElementById("hintBtn");
hintBtn.addEventListener("click", showHint);

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", reset);


// Function to Populate Letters
function loadLetters() {
  const alphabetElement = document.createElement("ul");
  alphabetElement.id = "alphabet";
  // Populate each letter as a new <li> element
  for (let i = 0; i < letters.length; i++) {
    const listElement = document.createElement("li");
    // listElement.id = "letter";
    listElement.innerHTML = letters[i];
    listElement.addEventListener("click", letterClick);
    alphabetElement.appendChild(listElement);
  }
  letterElement.appendChild(alphabetElement);
}

// Function for the letter click event
function letterClick(event) {
  const guess = event.target.textContent;
  event.target.classList.add("selected");
  event.target.removeEventListener("click", letterClick);

  // Check chosen word for guessed letter
  if (chosenWord.indexOf(guess) !== -1) {
    // Guessed Letter Found
    for (let i = 0; i < chosenWord.length; i++) {
      if (chosenWord[i].toLowerCase() === guess) {
        guesses[i].textContent = guess;
        counter += 1;
      }
    }
  } else {
    // Guessed Wrong Letter
    lives -= 1;
    drawHangman[lives]();
  }
  showMessage();
}

// Function to populate the guesses[] array with guess HTML elements based on the chosen word length
function loadGuesses() {
  const myWordElement = document.createElement("ul");
  myWordElement.id = "myWord";

  // Loop through chosen word and show "_" for each letter in a new <li> element
  for (let i = 0; i < chosenWord.length; i++) {
    const listElement = document.createElement("li");
    listElement.classList.add("guess");
    listElement.textContent = "_";
    //Load the elements into the guesses[] array
    guesses.push(listElement);
    myWordElement.appendChild(listElement);
  }
  myGuessElement.appendChild(myWordElement);
}

// Function to start the game
function start() {
  // Choose a random category
  const chosenData = data[Math.floor(Math.random() * data.length)];
  const category = document.getElementById("category");
  category.textContent = chosenData.category;

  // Choose a random word from the chosen category
  const randomIndex = Math.floor(Math.random() * chosenData.words.length);
  chosenWord = chosenData.words[randomIndex];
  hint = chosenData.hints[randomIndex];
  console.log(`${chosenData.category} : ${chosenWord} : ${hint}`);

  // Load the alphabet & Guesses
  loadLetters();
  loadGuesses();

  // Show the current lives
  showMessage();
}

// Function to reset the game and start again
function reset() {
  const alphabetElement = document.getElementById("alphabet");
  const myWordElement = document.getElementById("myWord");
  // Clear the HTML Elements
  letterElement.removeChild(alphabetElement);
  myGuessElement.removeChild(myWordElement);
  messageElement.textContent = "";
  hintElement.textContent = "";

  // Reset Variables
  chosenWord = "";
  hint = "";
  guesses = [];
  counter = 0;
  lives = 10;

  // Clear the canvas
  context.clearRect(0, 0, 150, 150);

  // Re-start
  start();
}

// Function to show a hint for the chosen word
function showHint() {
  hintElement.textContent = `Hint: ${hint}`;
}


// Function to show message about lives, winning or losing
function showMessage() {
  if (counter === chosenWord.length) {
    messageElement.textContent = `You Win!`;
  } else if (lives === 0) {
    messageElement.textContent = `Game Over`;
  } else if (lives === 1) {
    messageElement.textContent = `You have ${lives} life remaining`;
  } else {
    messageElement.textContent = `You have ${lives} lives remaining`;
  }
}

// Hangman Drawing functions
const rightLeg = () => {
  drawLine(80, 90, 120, 120);
};

const leftLeg = () => {
  drawLine(80, 90, 40, 120);
};

const rightArm = () => {
  drawLine(80, 66, 120, 70);
};

const leftArm = () => {
  drawLine(80, 66, 40, 70);
};

const torso = () => {
  drawLine(80, 56, 80, 90);
};

const head = () => {
  context.beginPath();
  context.arc(80, 45, 10, 0, Math.PI * 2, true);
  context.stroke();
};

const frame4 = () => {
  drawLine(80, 5, 80, 35);
};

const frame3 = () => {
  drawLine(0, 5, 90, 5);
};

const frame2 = () => {
  drawLine(10, 0, 10, 150);
};

const frame1 = () => {
  drawLine(0, 150, 150, 150);
};

// Main Array of drawing functions
const drawHangman = [rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1];

// Function to draw a line on the canvas
function drawLine(pathFromX, pathFromY, pathToX, pathToY) {
  context.beginPath();
  context.moveTo(pathFromX, pathFromY);
  context.lineTo(pathToX, pathToY);
  context.stroke();
}


window.onload = start();
