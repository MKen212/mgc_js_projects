"use strict";
// 14 - Palindrome Checker JS

// Global Variables

// Get HTML Elements
const phraseEl = document.getElementById("phrase");
const resultsEl = document.getElementById("results");

// Setup click event listener on "Check" button
const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", checkPhrase);

// Setup keypress event listener on "Phrase" input
phraseEl.addEventListener("keypress", checkKey);


// Function to check if the "Enter" key was pressed
function checkKey(event) {
  if (event.key === "Enter") {
    checkPhrase();
  }
}

// Function to check the phrase passed with the click event
function checkPhrase() {
  const phrase = phraseEl.value;
  // Exit if no phrase entered
  if (phrase === "") {
    return;
  }

  // Check if phrase is Palindrome
  const isPalindrome = checkPalindrome(phrase);

  // Display results, clear phrase and reset focus
  displayResults(phrase, isPalindrome);
  phraseEl.value = "";
  phraseEl.focus();
}

// Function to check if phrase is a Palindrome
function checkPalindrome(phrase) {
  // First remove special characters and spaces and make lowercase
  const cleanPhrase = phrase.replace(/[^A-Z0-9]/ig, "").toLowerCase();
  // Then split it into an array, reverse it and join it back into a string
  const reversePhrase = cleanPhrase.split("").reverse().join("");
  // console.log(phrase, cleanPhrase, reversePhrase);

  // Finally return true/false if the two phrases match
  if (reversePhrase === cleanPhrase) {
    return true;
  } else {
    return false;
  } 
}

// Function to Prepend the latest phrase into the results card
function displayResults(phrase, isPalindrome) {
  const itemEl = document.createElement("p");
  const answer = (isPalindrome) ? "IS" : "IS NOT";
  const d = new Date();
  const timeStamp = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear() + "@" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  
  itemEl.className = (isPalindrome) ? "text-success" : "text-danger";
  itemEl.innerHTML = `${timeStamp}> <span class="fst-italic">"${phrase}"</span> ${answer} a Palindrome.`;
  
  resultsEl.prepend(itemEl);
}
