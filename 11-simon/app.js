"use strict";
// 11 - Simon JS

// Global Variables
let powerOn = false;  // If power button turned on or not
let intervalID;  // setInterval() ID
let strict = false;  // If Strict Button turned on or off
let mistake = false;  // If player has made mistake in sequence or not
let win = false;  // If player has won game or not
let curTurn = 1;  // Current turn
let maxTurns = 3;  // Starting number of max turns per game
let computerOrder = [];  // Order of how the computer will flash the lights
let playerOrder = [];  // Order of how the player has flashed the lights
let computerFlash = 0;  // Number of flashes computer has made
let playerCount = 0;  // Number of correct guesses player has made
let computerTurn = false;  // If computer turn or not
let playerTurn = false; // If player turn or not

// Get Audio Elements
const audio1 = document.getElementById("clip1");
const audio2 = document.getElementById("clip2");
const audio3 = document.getElementById("clip3");
const audio4 = document.getElementById("clip4");

// Get HTML Elements
const topLeft = document.getElementById("topLeft");
const topRight = document.getElementById("topRight");
const bottomLeft = document.getElementById("bottomLeft");
const bottomRight = document.getElementById("bottomRight");
const powerBtn = document.getElementById("powerBtn");
const startBtn = document.getElementById("startBtn");
const strictBtn = document.getElementById("strictBtn");
const turnCounter = document.getElementById("turnCounter");


// Add "click" Event Listeners to control buttons
powerBtn.addEventListener("click", () => {
  if (powerBtn.checked === true) {
    // Power button turned on
    powerOn = true;
    turnCounter.textContent = "-";
  } else {
    // Power button turned on
    powerOn = false;
    turnCounter.textContent = "";
    clearColour();
    clearInterval(intervalID);
  }
});

strictBtn.addEventListener("click", () => {
  if (strictBtn.checked === true) {
    // Strict button turned on
    strict = true;
  } else {
    // Strict button turned off
    strict = false;
  }
});

startBtn.addEventListener("click", () => {
  if (powerOn || win) {
    // Start new game if on and/or if last game won
    play();
  }
});

// Add "click" events to game buttons
topLeft.addEventListener("click", () => {
  if (powerOn && playerTurn) {
    press(1);
    playerOrder.push(1);
    check();
    if (!win) {
      setTimeout(() => {
        clearColour();
      }, 300);
    }
  }
});

topRight.addEventListener("click", () => {
  if (powerOn && playerTurn) {
    press(2);
    playerOrder.push(2);
    check();
    if (!win) {
      setTimeout(() => {
        clearColour();
      }, 300);
    }
  }
});

bottomLeft.addEventListener("click", () => {
  if (powerOn && playerTurn) {
    press(3);
    playerOrder.push(3);
    check();
    if (!win) {
      setTimeout(() => {
        clearColour();
      }, 300);
    }
  }
});

bottomRight.addEventListener("click", () => {
  if (powerOn && playerTurn) {
    press(4);
    playerOrder.push(4);
    check();
    if (!win) {
      setTimeout(() => {
        clearColour();
      }, 300);
    }
  }
});

// Function to start a new game
function play() {
  clearColour();
  win = false;
  mistake = false;
  computerOrder = [];
  playerOrder = [];
  curTurn = 1;
  computerFlash = 0;
  playerCount = 0;
  turnCounter.textContent = playerCount;
  // Load random sequence into Computer Order
  for (let i = 1; i <= maxTurns; i++) {
    computerOrder[i] = Math.floor(Math.random() * 4) + 1;
  }
  computerTurn = true;
  playerTurn = false;
  intervalID = setInterval(gameTurn, 800);
}

// Function to play a turn of the game
function gameTurn() {
  if (computerFlash === curTurn) {
    // Players Turn
    clearInterval(intervalID);
    computerTurn = false;
    clearColour();
    playerTurn = true;
  }
  if (computerTurn) {
    // Computers Turn
    clearColour();
    setTimeout(() => {
      computerFlash++;
      press(computerOrder[computerFlash]);
    }, 200);
  } 
}

// Function to check if player is correct or has won
function check() {
  // Check for win
  if (playerOrder.length === maxTurns && !mistake) {
    winGame();
  }

  // Check for mistake
  if (playerOrder[playerOrder.length - 1] !== computerOrder[playerOrder.length]) {
    mistake = true;
  }

  // Handle mistake
  if (mistake) {
    flashColour();
    turnCounter.textContent = "NO!";
    setTimeout(() => {
      turnCounter.textContent = playerCount;
      clearColour();

      // Check if strict is on
      if (strict) {
        play();
      } else {
        playerOrder = [];
        computerFlash = 0;
        computerTurn = true;
        playerTurn = false;
        mistake = false;
        intervalID = setInterval(gameTurn, 800);
      }
    }, 800);
  }

  // Proceed to next turn
  if (playerOrder.length === curTurn && !mistake && !win) {
    playerCount++;
    turnCounter.textContent = playerCount;
    curTurn++;
    playerOrder = [];
    computerFlash = 0;
    computerTurn = true;
    playerTurn = false;
    intervalID = setInterval(gameTurn, 800);
  }
}

// Function to win the game
function winGame() {
  win = true;
  playerTurn = false;
  setTimeout(() => {
    turnCounter.textContent = "WIN!";
    flashColour();
  }, 800);
}


// Function to press game buttons
function press(btn) {
  // Highlight relevant button & play sound
  switch (btn) {
    case 1: {
      audio1.play();
      topLeft.style.backgroundColor = "lightgreen";
      break;
    }
    case 2: {
      audio2.play();
      topRight.style.backgroundColor = "tomato";
      break;
    }
    case 3: {
      audio3.play();
      bottomLeft.style.backgroundColor = "yellow";
      break;
    }
    case 4: {
      audio4.play();
      bottomRight.style.backgroundColor = "lightskyblue";
      break;
    }
  }
}

// Function to reset all the game button colours back to their original settings
function clearColour () {
  topLeft.style.backgroundColor = "darkgreen";
  topRight.style.backgroundColor = "darkred";
  bottomLeft.style.backgroundColor = "goldenRod";
  bottomRight.style.backgroundColor = "darkblue";
}

// Function to flash the game buttons to their "flash " settings
function flashColour() {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "tomato";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "lightskyblue";
}
