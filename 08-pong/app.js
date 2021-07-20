/* globals beep1 beep2 beep3 */
"use strict";
// 08 - Pong JS

// Global Variables
const DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

const rounds = [5, 5, 3, 3, 2];
const colours = ["#1abc9c", "#2ecc71", "#3498db", "#e74c3c", "#9b59b6"];

// The Ball Object (The cube that bounces back and forth)
const Ball = {
  canvas: "",  // Holder for <canvas> element

  new: function(incrementedSpeed) {  // Function to return a new ball
    return {
      width: 18,
      height: 18,
      x: (this.canvas.width / 2) - 9,
      y: (this.canvas.height / 2) - 9,
      moveX: DIRECTION.IDLE,
      moveY: DIRECTION.IDLE,
      speed: incrementedSpeed || 9
    };
  }
};

// The Paddle Object (The two lines that move up and down)
const Paddle = {
  canvas: "",  // Holder for <canvas> element

  new: function(side) {  // Function to return new paddle
    return {
      width: 18,
      height: 70,
      x: (side === "left") ? 150 : this.canvas.width - 150,
      y: (this.canvas.height / 2) - 35,
      score: 0,
      move: DIRECTION.IDLE,
      speed: 10,
      wins: 0
    };
  }
};

// The Game Object (Used to initialise and play the game)
const Game = {
  canvas: "",      // Holder for <canvas> element
  context: "",     // Holder for context object of canvas
  player: "",      // Player Paddle Object
  paddle: "",      // Computer Paddle Object
  ball: "",        // Ball Object
  running: false,  // True/False flag if game is running
  over: false,     // True/False flag if game is over
  turn: "",        // Which player is taking the current turn
  timer: 0,        // Current game timer
  round: 0,        // Current game round      
  colour: "",      // Current game colour

  initialise: function() {  // Function to initialise the game
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");

    // Initialise the canvas sizes
    this.canvas.width = 1400;
    this.canvas.height = 800;

    // Initialise the paddles and ball
    this.player = Paddle.new.call(this, "left");
    this.paddle = Paddle.new.call(this, "right");
    this.ball = Ball.new.call(this);

    // Initialise the game settings
    this.paddle.speed = 8;
    this.running = this.over = false;
    this.turn = this.paddle;
    this.timer = this.round = 0;
    this.colour = "#2c3e50";

    // Start the game
    Pong.menu();
    Pong.listen();
  },

  endGameMenu: function(text) {  // Function to end the game
    // Change the canvas font size and colour
    Pong.context.font = "50px Courier New";
    Pong.context.fillStyle = this.colour;

    // Draw the rectangle behind the "Game Over" / "Winner" text
    Pong.context.fillRect(
      (Pong.canvas.width / 2) - 350,
      (Pong.canvas.height / 2) - 48,
      700,
      100
    );

    // Change the canvas colour
    Pong.context.fillStyle = "#ffffff";

    // Draw the end game menu text ("Game Over" and "Winner")
    Pong.context.fillText(
      text,
      (Pong.canvas.width / 2),
      (Pong.canvas.height / 2) + 15
    );

    // Reinitialise the game
    setTimeout(() => {
      Pong = Object.assign({}, Game);
      Pong.initialise();
    }, 3000);
  },

  menu: function() {  // Function to draw screen and start the game
    // Draw all the pong objects in their current state
    Pong.draw();

    // Change the canvas font size and colour
    this.context.font = "50px Courier New";
    this.context.fillStyle = this.colour;

    // Draw the rectangle behind the "Press any key to begin" text
    this.context.fillRect(
      (this.canvas.width / 2) - 350,
      (this.canvas.height / 2) - 48,
      700,
      100
    );

    // Change the canvas colour
    this.context.fillStyle = "#ffffff";

    // Draw the "Press any key to begin" text
    this.context.fillText(
      `Press any key to begin`,
      (this.canvas.width / 2),
      (this.canvas.height / 2) + 15
    );


  },

  loop: function() {
    // Loop Function
  },

  listen: function() {
    // Listen Function
  },

  draw: function() {  // Function to draw all the objects to the canvas
    // Clear the canvas
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Set the fill style to black
    this.context.fillStyle = this.colour;

    // Draw the background
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Set the fill style to white for the paddles and the ball
    this.context.fillStyle = "#ffffff";

    // Draw the player paddle
    this.context.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // Draw the computer paddle
    this.context.fillRect(
      this.paddle.x,
      this.paddle.y,
      this.paddle.width,
      this.paddle.height
    );

    // Draw the ball
    if (Pong._turnDelayIsOver.call(this)) {
      this.context.fillRect(
        this.ball.x,
        this.ball.y,
        this.ball.width,
        this.ball.height
      );
    }

    // Draw the net in the middle
    this.context.beginPath();
    this.context.setLineDash([7, 15]);
    this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
    this.context.lineTo((this.canvas.width / 2), 140);
    this.context.lineWidth = 10;
    this.context.strokeStyle = "#ffffff";
    this.context.stroke();

    // Set the default canvas font and align it to the centre
    this.context.font = "100px Courier New";
    this.context.textAlign = "center";

    // Draw the player's score (left)
    this.context.fillText(
      this.player.score.toString(),
      (this.canvas.width / 2) - 300,
      200
    );

    // Draw the computer's score (right)
    this.context.fillText(
      this.paddle.score.toString(),
      (this.canvas.width / 2) + 300,
      200
    );

    // Change the font size for the centre round text
    this.context.font = "30px Courier New";

    // Draw the current round (centre)
    this.context.fillText(
      `Round ${Pong.round + 1}`,
      (this.canvas.width / 2),
      35
    );

    // Change the font size for the centre total score
    this.context.font = "40px Courier New";

    // Draw the total rounds (centre)
    this.context.fillText(
      (rounds[Pong.round]) ? rounds[Pong.round] : rounds[Pong.round - 1],
      (this.canvas.width / 2),
      100
    );
  },

  _turnDelayIsOver: function() {  // Function to wait for a delay to have passed for each turn
    return ((new Date()).getTime() - this.timer >= 1000);
  },



};

let Pong = Object.assign({}, Game);
Pong.initialise();
console.log(Pong);
