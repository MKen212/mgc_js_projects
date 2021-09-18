"use strict";
// 16B - General Quiz JS

// Constructor Function for Quiz
function Quiz(questions) {
  this.score = 0;
  this.questions = questions;
  this.currentQuestionIndex = 0;
}

// Quiz Method to return current question
Quiz.prototype.getCurrentQuestion = function() {
  return this.questions[this.currentQuestionIndex];
};

// Quiz Method to process a guess
Quiz.prototype.guess = function(answer) {
  if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
    // Correct - Increment Score
    this.score++;
  }
  // Next question
  this.currentQuestionIndex++;
};

// Quiz Method to check if end of questions reached
Quiz.prototype.hasEnded = function() {
  return this.currentQuestionIndex >= this.questions.length;
};


// Constructor Function for Question
function Question(text, choices, answer) {
  this.text = text;
  this.choices = choices;
  this.answer = answer;
}

// Question Method to check if answer matches choice
Question.prototype.isCorrectAnswer = function(choice) {
  return this.answer === choice;
};


// Quiz UI Object
const QuizUI = {
  // Method to check if quiz has ended & display score or next question
  displayNext: function() {
    if (quiz.hasEnded()) {
      this.displayScore();
    } else {
      this.displayQuestion();
      this.displayChoices();
      this.displayProgress();
    }
  },

  // Method to display a question
  displayQuestion: function() {
    this.populateIDwithHTML("question", quiz.getCurrentQuestion().text);
  },

  // Method to display multiple choice answers for questions
  displayChoices: function() {
    const choices = quiz.getCurrentQuestion().choices;

    for (let i = 0; i < choices.length; i++) {
      this.populateIDwithHTML(`choice${i}`, choices[i]);
      this.guessHandler(`guess${i}`, choices[i]);
    }
  },

  // Method to display progress through quiz
  displayProgress: function() {
    const currentQuestionNumber = quiz.currentQuestionIndex + 1;
    this.populateIDwithHTML("progress", `Question ${currentQuestionNumber} of ${quiz.questions.length}`);
  },

  // Method to display the final score
  displayScore: function() {
    const gameOverHTML = `
      <h2>Game Over</h2>
      <h3>Your score is: ${quiz.score} out of ${quiz.questions.length}</h3>
      <br />
      <button class="btn--default" id="restart">Start Again</button>
    `;
    this.populateIDwithHTML("score", gameOverHTML);

    // Hide quiz & display score
    document.getElementById("quiz").style.display = "none";
    document.getElementById("score").style.display = "block";

    // Add Event Listener to Restart Button
    const restartBtn = document.getElementById("restart");
    restartBtn.onclick = function() {
      quiz.score = 0;
      quiz.currentQuestionIndex = 0;
      // Hide score & display quiz
      document.getElementById("quiz").style.display = "block";
      document.getElementById("score").style.display = "none";
      QuizUI.displayNext();
    };
  },

  // Method to get HTML element by ID & populate with text
  populateIDwithHTML: function(id, text) {
    const element = document.getElementById(id);
    element.innerHTML = text;
  },

  // Method to update the guess buttons with the relevant "click" handler
  guessHandler: function(id, guess) {
    const button = document.getElementById(id);
    button.onclick = function() {
      quiz.guess(guess);
      QuizUI.displayNext();
    };
  }
};

// Create Questions
const questions = [
  new Question("Who was the first President of the USA?", ["George Washington", "Thomas Jefferson", "Thomas Edison", "I don't know"], "George Washington"),
  new Question("What is the answer to the Ultimate Question of Life, the Universe and Everything?", ["Pi", "42", "What?", "I don't know"], "42"),
  new Question("Do you love to code?", ["No", "Yes", "Hell Yeah", "I don't know"], "Hell Yeah"),
  new Question("What is the best programming language?", ["C#", "Php", "Python", "JavaScript"], "JavaScript"),
  new Question("Which country is coldest in Winter?", ["Malaysia", "Indonesia", "Switzerland", "UK"], "Switzerland")
];

// Create Quiz
const quiz = new Quiz(questions);


// Display Quiz
QuizUI.displayNext();
