"use strict";
// 22b - Rock Paper Scissors Lizard Spock Game JS

// Set Global Variables
let userScore = 0;
let compScore = 0;
const choices = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];
const results = [{
  match: "Rock:Rock",          outcome: "draw",       message: "matches"           },{
  match: "Rock:Paper",         outcome: "userLoses",  message: "is covered by"     },{
  match: "Rock:Scissors",      outcome: "userWins",   message: "crushes"           },{
  match: "Rock:Lizard",        outcome: "userWins",   message: "crushes"           },{
  match: "Rock:Spock",         outcome: "userLoses",  message: "is vaporised by"   },{
  match: "Paper:Rock",         outcome: "userWins",   message: "covers"            },{
  match: "Paper:Paper",        outcome: "draw",       message: "matches"           },{
  match: "Paper:Scissors",     outcome: "userLoses",  message: "is cut by"         },{
  match: "Paper:Lizard",       outcome: "userLoses",  message: "is eaten by"       },{
  match: "Paper:Spock",        outcome: "userWins",   message: "disproves"         },{
  match: "Scissors:Rock",      outcome: "userLoses",  message: "is crushed by"     },{
  match: "Scissors:Paper",     outcome: "userWins",   message: "cuts"              },{
  match: "Scissors:Scissors",  outcome: "draw",       message: "matches"           },{
  match: "Scissors:Lizard",    outcome: "userWins",   message: "decapitates"       },{
  match: "Scissors:Spock",     outcome: "userLoses",  message: "is smashed by"     },{
  match: "Lizard:Rock",        outcome: "userLoses",  message: "is crushed by"     },{
  match: "Lizard:Paper",       outcome: "userWins",   message: "eats"              },{
  match: "Lizard:Scissors",    outcome: "userLoses",  message: "is decapitated by" },{
  match: "Lizard:Lizard",      outcome: "draw",       message: "matches"           },{
  match: "Lizard:Spock",       outcome: "userWins",   message: "poisons"           },{
  match: "Spock:Rock",         outcome: "userWins",   message: "vaporises"         },{
  match: "Spock:Paper",        outcome: "userLoses",  message: "is disproved by"   },{
  match: "Spock:Scissors",     outcome: "userWins",   message: "smashes"           },{
  match: "Spock:Lizard",       outcome: "userLoses",  message: "is poisoned by"    },{
  match: "Spock:Spock",        outcome: "draw",       message: "matches"
}];

// Get HTML Elements
const userScoreEl = document.getElementById("userScore");
const compScoreEl = document.getElementById("compScore");
const resultEl = document.querySelector(".result");
const choiceEls = document.querySelectorAll(".choice");
const rockEl = document.getElementById("rock");
const paperEl = document.getElementById("paper");
const scissorsEl = document.getElementById("scissors");
const lizardEl = document.getElementById("lizard");
const spockEl = document.getElementById("spock");

// Main Function
function main() {
  // Add Click Event Listeners to choice buttons
  rockEl.addEventListener("click", () => play("Rock"));
  paperEl.addEventListener("click", () => play("Paper"));
  scissorsEl.addEventListener("click", () => play("Scissors"));
  lizardEl.addEventListener("click", () => play("Lizard"));
  spockEl.addEventListener("click", () => play("Spock"));
}

// Computer Choice Function
function getCompChoice() {
  const randomChoice = Math.floor(Math.random() * choices.length);
  return choices[randomChoice];
}

// Play Function
function play(userChoice) {
  // Clear any previous choice highlights
  choiceEls.forEach((choice => {
    choice.className = "choice";
  }));
  
  // Get Computer Choice
  const compChoice = getCompChoice();

  // Get Result
  const result = results.find(result => {
    return result.match === `${userChoice}:${compChoice}`;
  });

  // Show Result
  showResult(result, userChoice, compChoice);
}

// Show Result Function
function showResult(result, userChoice, compChoice) {
  switch (result.outcome) {
    case "userWins":
      // User Wins
      userScore++;
      userScoreEl.textContent = userScore;
      resultEl.innerHTML = `<p>${userChoice}<span class="small-word">user</span> ${result.message} ${compChoice}<span class="small-word">comp</span>. You Win!</p>`;
      document.getElementById(userChoice.toLowerCase()).classList.add("green-glow");
      document.getElementById(compChoice.toLowerCase()).classList.add("red-glow");
      break;
    case "userLoses":
      // User Loses
      compScore++;
      compScoreEl.textContent = compScore;
      resultEl.innerHTML = `<p>${userChoice}<span class="small-word">user</span> ${result.message} ${compChoice}<span class="small-word">comp</span>. You Lose!</p>`;
      document.getElementById(userChoice.toLowerCase()).classList.add("red-glow");
      document.getElementById(compChoice.toLowerCase()).classList.add("green-glow");
      break;
    case "draw":
      // Drawn game
      resultEl.innerHTML = `<p>${userChoice}<span class="small-word">user</span> ${result.message} ${compChoice}<span class="small-word">comp</span>. It's a Draw!</p>`;
      document.getElementById(userChoice.toLowerCase()).classList.add("yellow-glow");
      document.getElementById(compChoice.toLowerCase()).classList.add("yellow-glow");
      break;
    default:
      console.log(`ERROR with result: ${result}`);
  }
}


// Start Game
main();
