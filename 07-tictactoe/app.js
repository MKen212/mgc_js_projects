"use strict";
// 07 - TicTacToe JS

// Get the HTML Element
const statusDisplay = document.getElementById("statusDisplay");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.querySelector(".restart");

// Global Variables
let gameActive = true;    // Used to pause/end the game
let currentPlayer = "X";  // Current Player Token
let gameState = ["", "", "", "", "", "", "", "", ""];  // Game State Array

// Array of possible winning conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function Expressions to return messages
const winMessage = () => {
  return `Player '${currentPlayer}' has won!`;
};

const drawMessage = () => {
  return `Game has ended in a draw!`;
};

const currentTurn = () => {
  return `It is ${currentPlayer}'s turn...`;
};

// Add Event Listeners to the Cells
cells.forEach((cell) => {
  cell.addEventListener("click", cellClick);
});

// Add Event listener to restart button
restartBtn.addEventListener("click", restartGame);

// Set the initial message
statusDisplay.textContent = currentTurn();

// Function to update cell clicked with current player
function cellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
}

// Function to handle player change
function playerChange() {
  currentPlayer = (currentPlayer === "X") ? "O": "X";
  statusDisplay.textContent = currentTurn();
}

// Function to validate if game has been won
function resultValidation() {
  let roundWon = false;
  // Loop through winning conditions to check
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      // No winning condition
      continue;
    }
    if (a === b && b === c) {
      // Winning condition & all same player
      roundWon = true;
      break;
    }
  }

  // Check if round is won
  if (roundWon) {
    statusDisplay.textContent = winMessage();
    gameActive = false;
    return;
  }

  // Check if round is a draw (all squares filled)
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.textContent = drawMessage();
    gameActive = false;
    return;
  }

  // Game still active so change player
  playerChange();
}

// Function to check if cell was already clicked
function cellClick(event) {
  // Get cellIndex of clicked cell
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.dataset.cellindex);
  // console.log(clickedCellIndex);
  // Check if Cell has already been clicked and game is not active
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  // OK to continue - Update clicked cell
  cellPlayed(clickedCell, clickedCellIndex);
  // Validate Result
  resultValidation();
}

// Function to handle the re-stert
function restartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.textContent = currentTurn();
  // Reset board
  cells.forEach((cell) => {
    cell.textContent = "";
  });
}
