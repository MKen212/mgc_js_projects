"use strict";
// 22a - Rock Paper Scissors Game JS

// Set Global Variables
let userScore = 0;
let compScore = 0;
const choices = [{
  "name": "Rock",
  "winMsg": "crushes",
  "loseMsg": "is covered by"
}, {
  "name": "Paper",
  "winMsg": "covers",
  "loseMsg": "is cut by"
}, {
  "name": "Scissors",
  "winMsg": "cut",
  "loseMsg": "are crushed by"
}];

// Get HTML Elements
const userScoreEl = document.getElementById("userScore");
const compScoreEl = document.getElementById("compScore");
const resultEl = document.querySelector(".result");
const rockEl = document.getElementById("rock");
const paperEl = document.getElementById("paper");
const scissorsEl = document.getElementById("scissors");

// Main Function
function main() {
  // Add Click Event Listeners to choice buttons
  rockEl.addEventListener("click", () => play("Rock"));
  
  paperEl.addEventListener("click", () => play("Paper"));
  
  scissorsEl.addEventListener("click", () => play("Scissors"));
}

// Computer Choice Function
function getCompChoice() {
  const randomChoice = Math.floor(Math.random() * choices.length);
  return choices[randomChoice];
}

// Play Function
function play(userChoiceName) {
  const userChoice = choices.find(choice => {
    return choice.name === userChoiceName;
  });
  const compChoice = getCompChoice();
  // console.log(userChoice, compChoice);

  // Compare choices
  switch (`${userChoice.name}>${compChoice.name}`) {
    // User Wins
    case "Rock>Scissors":
    case "Paper>Rock":
    case "Scissors>Paper":
      showResult("userWins", userChoice, compChoice);
      break;
    // User Loses
    case "Scissors>Rock":
    case "Rock>Paper":
    case "Paper>Scissors":
      showResult("userLoses", userChoice, compChoice);
      break;
    // Both Equal
    case "Rock>Rock":
    case "Paper>Paper":
    case "Scissors>Scissors":
      showResult("draw", userChoice, compChoice);
      break;
    default:
      console.log(`ERROR with choice: ${userChoice.name}>${compChoice.name}`);
  }
}

// Show Result Function
function showResult(result, userChoice, compChoice) {
  let outcomeMsg = "";
  let resultMsg = "";
  let resultClass = "";

  switch (result) {
    case "userWins":
      // User Wins
      userScore++;
      outcomeMsg = userChoice.winMsg;
      resultMsg = "You Win!";
      resultClass = "green-glow";
      break;
    case "userLoses":
      // User Loses
      compScore++;
      outcomeMsg = userChoice.loseMsg;
      resultMsg = "You Lose!";
      resultClass = "red-glow";
      break;
    case "draw":
      // Drawn game
      outcomeMsg = "matches";
      resultMsg = "It's a Draw!";
      resultClass = "yellow-glow";
      break;
    default:
      console.log(`ERROR with result: ${result}`);
  }
  
  // Show Results
  userScoreEl.textContent = userScore;
  compScoreEl.textContent = compScore;
  resultEl.innerHTML = `<p>${userChoice.name}<span class="small-word">user</span> ${outcomeMsg} ${compChoice.name}<span class="small-word">comp</span>. ${resultMsg}</p>`;

  // Flash colour of chosen button to reflect result
  const chosenEl = document.getElementById(userChoice.name.toLowerCase());
  chosenEl.classList.add(resultClass);
  setTimeout(() => chosenEl.classList.remove(resultClass), 300);
}


// Start Game
main();
