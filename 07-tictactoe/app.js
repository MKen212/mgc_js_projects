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


function cellPlayed() {

}

function playerChanged() {

}

function resultValidation() {

}

// Function to check if cell was already clicked
function cellClick(event) {
  // Get cellIndex of clicked cell
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.dataset.cellindex);
  // console.log(clickedCellIndex);
  





}

function restartGame() {

}
