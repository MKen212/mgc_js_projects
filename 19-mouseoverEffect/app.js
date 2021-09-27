"use strict";
// 19 - Mouseover Effect JS

// Setup Canvas
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let tX = window.innerWidth;
let tY = window.innerHeight;
canvas.width = tX;
canvas.height = tY;
// context.strokeWidth = 5;

// Setup Mouse Coordinates & Gravity
const grav = 0.99;
let mouseX = 0;
let mouseY = 0;

// Function to generate random colours
function randomColour() {
  return (
    "rgba(" +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.ceil(Math.random() * 10) / 10 +
    ")"
  );
}


// Add "mousemove" Event Listener
addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Constructor Function for a Ball
function Ball() {
  this.colour = randomColour();
  this.radius = Math.random() * 20 + 14;
  this.startRadius = this.radius;
  this.x = Math.random() * (tX - this.radius * 2) + this.radius;
  this.y = Math.random() * (tY - this.radius);
  this.dY = Math.random() * 2;  // y incremental movement
  this.dX = Math.round((Math.random() - 0.5) * 10);  // x incremental movement
  this.vel = Math.random() / 5;
  // Function to draw ball
  this.draw = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.colour;
    context.fill();
  };
}

// Setup a set of random balls
let balls = [];
for (let i = 0; i < 50; i++) {
  balls.push(new Ball());
}

// Function to animate the balls
function animate() {
  // Check if window was re-sized
  if (tX != window.innerWidth || tY != (window.innerHeight)) {
    tX = window.innerWidth;
    tY = window.innerHeight;
    canvas.width = tX;
    canvas.height = tY;
  }
  
  requestAnimationFrame(animate);

  // Clear Window
  context.clearRect(0, 0, tX, tY);

  // Draw each ball and then move
  balls.forEach((ball) => {
    ball.draw();
    ball.y += ball.dY;
    ball.x += ball.dX;
    // Update Y movement
    if (ball.y + ball.radius >= tY) {
      // Reverse Y direction to move ball up
      ball.dY = -ball.dY * grav;
    } else {
      // Move height based on vel
      ball.dY += ball.vel;
    }
    // Update X movement
    if (ball.x + ball.radius > tX || ball.x - ball.radius < 0) {
      // Reverse X direction to move ball left/right
      ball.dX = -ball.dX;
    }
    // Increase ball size if mouse nearby otherwise decrease to start size
    if (mouseX > ball.x - 20 && mouseX < ball.x + 20 &&
        mouseY > ball.y - 50 && mouseY < ball.y + 50 &&
        ball.radius < 70) {
      ball.radius += 5;
    } else if (ball.radius > ball.startRadius) {
      ball.radius += -5;
    }
  });
}


// Start Animation
animate();

// Function to cut an old Ball & paste a new Ball every 1/2 second
setInterval(function() {
  balls.push(new Ball());
  balls.splice(0, 1);
}, 400);
