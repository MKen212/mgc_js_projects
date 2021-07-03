"use strict";
// 03 - Calculator JS

// Initialise variables
let resultDisplayed = false;  // Flag to keep track of what is displayed

// Get HTML Elements
const display = document.getElementById("display");
const operators = document.querySelectorAll(".operators div");
const numbers = document.querySelectorAll(".numbers div");
const clear = document.getElementById("clear");
const equals = document.getElementById("equals");

// Add Click Event Listeners to each Operator
operators.forEach((operator) => {
  operator.addEventListener("click", (event) => {
    // Get the current display and last character
    const currentDisplay = display.innerHTML;
    const lastChar = currentDisplay[currentDisplay.length - 1];

    if(lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
      // If last character is an operator then replace with current pressed
      const newDisplay = currentDisplay.substring(0, currentDisplay.length - 1) + event.target.innerHTML;
      display.innerHTML = newDisplay;
    } else if (currentDisplay.length == 0) {
      // If first key pressed is operator do nothing
      // NOTE This will not fire with a pre-filled 0
      console.log("Enter a Number First!");
    } else {
      // Add the operator pressed to the input
      display.innerHTML += event.target.innerHTML;
    }
  });
});

// Add Click Event Listeners to each Number
numbers.forEach((number) => {
  if (number.innerHTML === "C") {
    // Skip adding a click event to the Clear button
    return;
  }
  number.addEventListener("click", (event) => {
    // Get the current display and last character
    const currentDisplay = display.innerHTML;
    const lastChar = currentDisplay[currentDisplay.length - 1];

    if (resultDisplayed === false) {
      // Result not yet displayed so just add numbers to display
      if (currentDisplay === "0" && event.target.innerHTML !== ".") {
        // Replace the starting zero if just clicking a number
        display.innerHTML = event.target.innerHTML;
      } else {
        display.innerHTML += event.target.innerHTML;
      }
    } else if (resultDisplayed === true && (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷")) {
      // Result currently displayed but operator was pressed previously
      resultDisplayed = false;
      display.innerHTML += event.target.innerHTML;
    } else {
      // Result currently displayed and number pressed so start new calculation
      resultDisplayed = false;
      if (event.target.innerHTML === ".") {
        display.innerHTML = "0" + event.target.innerHTML;
      } else {
        display.innerHTML = event.target.innerHTML;
      }
    }
  });
});

// Add Click Event Listener to Clear button
clear.addEventListener("click", () => {
  display.innerHTML = "0";
});

// Add Click Event Listener to Equals button
equals.addEventListener("click", () => {
  // Get the current display
  const currentDisplay = display.innerHTML;
  
  // Extract the numbers into an array
  const curNumbers = currentDisplay.split(/\+|-|×|÷/g);
  // console.log(curNumbers);

  // Remove the numbers & decimal point and extract the operators into an array
  const curOperators = currentDisplay.replace(/[0-9]|\./g,"").split("");
  // console.log(curOperators);

  // Do the calculation by replacing the two numbers around each operator with their result following DMAS, and then removing the operator
  // Division
  let divideIndex = curOperators.indexOf("÷");
  while (divideIndex != -1) {
    curNumbers.splice(divideIndex, 2, curNumbers[divideIndex] / curNumbers[divideIndex + 1]);
    curOperators.splice(divideIndex, 1);
    // console.log(curNumbers, curOperators);
    divideIndex = curOperators.indexOf("÷");
  }
  
  // Multiplication
  let multiplyIndex = curOperators.indexOf("×");
  while (multiplyIndex != -1) {
    curNumbers.splice(multiplyIndex, 2, curNumbers[multiplyIndex] * curNumbers[multiplyIndex + 1]);
    curOperators.splice(multiplyIndex, 1);
    // console.log(curNumbers, curOperators);
    multiplyIndex = curOperators.indexOf("×");
  }

  // Addition
  let addIndex = curOperators.indexOf("+");
  while (addIndex != -1) {
    curNumbers.splice(addIndex, 2, parseFloat(curNumbers[addIndex]) + parseFloat(curNumbers[addIndex + 1]));  // NOTE parseFloat required to avoid string concatenation
    curOperators.splice(addIndex, 1);
    // console.log(curNumbers, curOperators);
    addIndex = curOperators.indexOf("+");
  }
  
  //Subtraction
  let subtractIndex = curOperators.indexOf("-");
  while (subtractIndex != -1) {
    curNumbers.splice(subtractIndex, 2, curNumbers[subtractIndex] - curNumbers[subtractIndex + 1]);
    curOperators.splice(subtractIndex, 1);
    // console.log(curNumbers, curOperators);
    subtractIndex = curOperators.indexOf("-");
  }

  // Output the result & update the result flag
  display.innerHTML = curNumbers[0];
  resultDisplayed = true;
});
