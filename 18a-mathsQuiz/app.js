/* global $ */
"use strict";
// 18a - Maths Quiz JS

// Global Variables
let questions = [];  // Array of Questions
let questionCounter = 0;  // Tracks question number
let selections = [];  // Array containing user answers

// Get HTML Elements
const quiz = $("#quiz");  // Quiz <div>

// Function to get the questions from a JSON file
async function getQuestions() {
  const response = await fetch("./questions.json");
  const json = await response.json();
  return json;
}

// Function to create and return a <div> containing the question and answer selection
function createQuestionElement(index) {
  const qElement = $("<div>", {
    id: "question"
  });

  // Question Header
  const header = $(`<h2>Question ${index + 1}:</h2>`);
  qElement.append(header);

  // Question Body
  const question = $(`<p>${questions[index].question}</p>`);
  qElement.append(question);

  // Multi-choice Answers
  const radioButtons = createRadios(index);
  qElement.append(radioButtons);

  return qElement;
}

// Function to create a list of answer choices
function createRadios(index) {
  const radioList = $("<ul>");
  for (let i = 0; i < questions[index].choices.length; i++) {
    const item = $("<li>");
    const input = `<input type="radio" name="answer" value="${i}" />${questions[index].choices[i]}`;
    item.append(input);
    radioList.append(item);
  }
  return radioList;
}

// Function to display a question
function displayQuestion() {
  quiz.fadeOut(function() {
    // Remove existing question
    $("#question").remove();

    if (questionCounter < questions.length) {
      // Get Next Question and Display
      const nextQuestion = createQuestionElement(questionCounter);
      quiz.append(nextQuestion).fadeIn();
      
      // Set checkbox to "checked" if question previously answered
      if (!(isNaN(selections[questionCounter]))) {
        $(`input[value=${selections[questionCounter]}]`).prop("checked", true);
      }

      // Control display of "Prev" button
      if (questionCounter === 1) {
        $("#prev").show();
      } else if (questionCounter === 0) {
        $("#prev").hide();
        $("#next").show();
      }
    } else {
      // No more questions - Display score
      const scoreElem = displayScore();
      quiz.append(scoreElem).fadeIn();
      $("#prev").hide();
      $("#next").hide();
      $("#start").show();
    }
  });
}

// Function to read the user selection and push the values into an array
function choose() {
  selections[questionCounter] = +$(`input[name="answer"]:checked`).val();
  // Uses jQuery to find the input element clicked and push the "value" into [selections]
}

// Function to compute and return the score
function displayScore() {
  const scoreElem = $("<p>", {
    id: "question"
  });

  // Loop through answers and check against questions.correctAnswer
  let numCorrect = 0;
  for (let i = 0; i < selections.length; i++) {
    if(selections[i] === questions[i].correctAnswer) {
      numCorrect++;
    }
  }

  scoreElem.append(`You got ${numCorrect} questions out of ${questions.length} correct!!`);
  return scoreElem;
}


// Startup function to initiate quiz on Window Load
window.onload = async () => {
  // Load questions
  questions = await getQuestions();

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
    $(event.currentTarget).addClass("active");
  });

  $(".button").on("mouseleave", (event) => {
    $(event.currentTarget).removeClass("active");
  });
};
