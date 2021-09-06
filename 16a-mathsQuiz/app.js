/* global $ */
"use strict";
// 16a - Maths Quiz JS

// Function to get the questions from a JSON file
async function getQuestions() {
  const response = await fetch("./questions.json");
  const json = await response.json();
  return json;
}

// Function to create and return a <div> containing the question and answer selection
function createQuestionElement(index) {
  // TODO
}

// Function to create a list of answer choices
function  createRadios(index) {
  // TODO
}

// Function to read the user selection and push the values into an array
function choose() {
  // TODO
}

// Function to display a question
function displayQuestion() {
  // TODO
}

// Function to compute and return the score
function displayScore() {
  // TODO
}


// Startup function to initiate quiz on Window Load
window.onload = async () => {
  // Load questions
  const questions = await getQuestions();

  // Global Variables
  let questionCounter = 0;  // Tracks question number
  let selections = [];  // Array containing user choices

  // Get HTML Elements
  const quiz = $("#quiz");  // Quiz <div>

  // Display first question
  displayQuestion();

  // Add "click" event handler for "Next" button
  $("#next").on("click", (event) => {
    event.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(":animated")) {
      return false;
    }

    // Save User's guess
    choose();

    if (isNaN(selections[questionCounter])) {
      // If no user guess, progress is stopped
      alert("Please make a selection!");
    } else {
      // Display next question
      questionCounter++;
      displayQuestion();
    }
  });

  // Add "click" event handler for "Prev" button
  $("#prev").on("click", (event) => {
    event.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(":animated")) {
      return false;
    }

    // Save User's guess
    choose();

    // Display previous question
    questionCounter--;
    displayQuestion();
  });

  // Add "click" event handler to "Start Over" button
  $("#start").on("click", (event) => {
    event.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(":animated")) {
      return false;
    }

    // Reset questions & selections
    questionCounter = 0;
    selections = [];

    // Display first question
    displayQuestion();

    // Hide "Start Over" button
    $("#start").hide();
  });

  // Animate buttons on hover
  $(".button").on("mouseenter", (event) => {
    console.log(event);

    // TO HERE - NOT WORKING!



    $(this).addClass("active");
  });

  $(".button").on("mouseleave", () => {
    $(this).removeClass("active");
  });
};
