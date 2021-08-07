"use strict";
// 11 - Tip Calculator JS

// Global Variables
let billTotal = 0;  // Bill Amount
let tipPercent = 0;  // Tip Percent

// Get HTML Elements
const tipFormEl = document.getElementById("tipForm");
const billTotalEl = document.getElementById("billTotal");
const tipSliderEl = document.getElementById("tipSlider");
const tipPercentEl = document.getElementById("tipPercent");
const resultsEl = document.getElementById("results");
const tipAmountEl = document.getElementById("tipAmount");
const billWithTipEl = document.getElementById("billWithTip");


// Add change event listener to activate when bill amount changed
billTotalEl.addEventListener("change", (event) => {
  billTotal = +event.target.value;
  if (tipSliderEl.hasAttribute("disabled")) {
    tipSliderEl.removeAttribute("disabled");
  }
});

// Add input event listener to check for tip slide movement
tipSliderEl.addEventListener("input", (event) => {
  // console.log(event.target.value);
  tipPercent = +event.target.value;
  tipPercentEl.textContent = `${tipPercent}%`;
});

// Add change event listener to form to update the result
tipFormEl.addEventListener("change", () => {
  const tipAmount = billTotal * (tipPercent / 100);
  const billWithTip = billTotal + tipAmount;

  tipAmountEl.value = tipAmount.toFixed(2);
  billWithTipEl.value = billWithTip.toFixed(2);
  
  resultsEl.style.display = "block";
});
