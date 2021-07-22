"use strict";
// 10 - Maze JS

// Global Variables

// Get HTML Elements


const canvas = document.getElementById("mazeCanvas");
const context = canvas.getContext("2d");


async function run() {
  let player = await loadImage("./images/pickle.png");
  player = await changeBrightness(player, 2);
  context.drawImage(player, 10, 10, 200, 200);
}

// run();




// Function to get a random number up to "max"
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Function to Shuffle an array
function shuffle(arr) {
  for (let i = arr.length -1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Function to load an image
function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

// Function to change the brightness of a sprite by a factor
function changeBrightness(sprite, factor) {
  return new Promise((resolve) => {
    // Create a Virtual <canvas> element
    const virtualCanvas = document.createElement("canvas");
    virtualCanvas.width = 500;
    virtualCanvas.height = 500;
    const virtualContext = virtualCanvas.getContext("2d");
    // Draw the sprite onto it
    virtualContext.drawImage(sprite, 0, 0, 500, 500);
    // Get the image data and loop through it to update it by the factor
    let imgData = virtualContext.getImageData(0, 0, 500, 500);
    // console.log(imgData);
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = (imgData.data[i] * factor);
      imgData.data[i + 1] = (imgData.data[i + 1] * factor);
      imgData.data[i + 2] = (imgData.data[i + 2] * factor);
    }
    // console.log(imgData);
    // Replace the virtual image on the canvas
    virtualContext.putImageData(imgData, 0, 0);
    // Create a new image from the canvas & return it
    var spriteReturn = new Image();
    spriteReturn.src = virtualCanvas.toDataURL();
    virtualCanvas.remove();
    resolve(spriteReturn);
  });
}

// Function to display a message
function displayMessage(moves) {
  const movesEl = document.getElementById("moves");
  movesEl.textContent = `You Moved ${moves} Steps.`;
  toggleVisibility("messageContainer");
}

// Function to toggle the visibility of an element
function toggleVisibility(element) {
  const toggleEl = document.getElementById(element);
  console.log(toggleEl.style);

  
  // NOT WORKING...


}

displayMessage(23);