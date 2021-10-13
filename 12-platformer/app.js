"use strict";
// 12 - Platformer Main JS

// Array of JavaScript MVC files required for each part
const parts = {
  "01": ["./01/controller-01.js", "./01/display-01.js", "./01/engine-01.js", "./01/game-01.js", "./01/main-01.js"],
  "02": ["./02/controller-02.js", "./02/display-02.js", "./01/engine-01.js", "./02/game-02.js", "./02/main-02.js"],
  "03": ["./02/controller-02.js", "./03/display-03.js", "./01/engine-01.js", "./03/game-03.js", "./03/main-03.js"],
  "04": ["./02/controller-02.js", "./04/display-04.js", "./01/engine-01.js", "./04/game-04.js", "./03/main-03.js"],
  "05": ["./02/controller-02.js", "./05/display-05.js", "./01/engine-01.js", "./05/game-05.js", "./05/main-05.js"],
  "06": ["./02/controller-02.js", "./05/display-05.js", "./06/engine-06.js", "./06/game-06.js", "./06/main-06.js"],
  // "07": ["./02/controller-02.js", "./05/display-05.js", "./06/engine-06.js", "./07/game-07.js", "./07/main-07.js"],
  "07": ["./07/controller-07.js", "./07/display-07.js", "./07/engine-07.js", "./07/game-07.js", "./07/main-07.js"],
};

// Get the part number from the url entered
let part = String(window.location).split("?")[1];

// Set default part if not within allowed selected
switch (part) {
  case "01":
  case "02":
  case "03":
  case "04":
  case "05":
  // case "06":
  // case "07":
    break;
  default:
    part = "05";
}

// Load relevant JavaScript files into <script> elements for selected part
for (let index = 0; index < parts[part].length; index++) {
  const script = document.createElement("script");
  script.setAttribute("src", parts[part][index]);
  document.body.appendChild(script);
}

// Add "click" event listener to menu to open/close menu list
const menu = document.getElementById("menu");
const menuList = document.getElementById("menu-list");
menu.addEventListener("click", () => {
  menuList.style.display = (menuList.style.display === "none") ? "grid" : "none";
});
menuList.style.display = "none";
