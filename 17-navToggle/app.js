"use strict";
// 17 - Nav Toggle JS

// Get HTML Elements
const menuToggleEl = document.getElementById("menuToggle");
const activeElements = document.querySelectorAll(".active-element");

// Add Click Event Listener to Toggle
menuToggleEl.addEventListener("click", () => {
  activeElements.forEach((element) => {
    element.classList.toggle("active");
  });
});
