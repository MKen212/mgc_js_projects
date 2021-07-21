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

// const rounds = [5, 5, 3, 3, 2];
const rounds = [5, 3, 2];
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
      // height: 70,
      height: (side === "left") ? 100 : 50,
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
  computer: "",    // Computer Paddle Object
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
    this.canvas.height = 800;  // Was 1000

    // Initialise the paddles and ball
    this.player = Paddle.new.call(this, "left");
    this.computer = Paddle.new.call(this, "right");
    this.ball = Ball.new.call(this);

    // Initialise the game settings
    this.computer.speed = 8;
    this.running = this.over = false;
    this.turn = this.computer;
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

  update: function() {      // Function to update all objects (move the player & computer paddles, move the ball, update the scores, etc.)
    if (!this.over) {
      // If the ball goes over the x bound limits add point & restart
      if (this.ball.x <= 0) {  // Computer wins round
        Pong._resetTurn.call(this, this.computer, this.player);
      } else if (this.ball.x >= this.canvas.width) {  // Player wins round
        Pong._resetTurn.call(this, this.player, this.computer);
      }

      // If the ball goes over the y bound limits correct the y direction
      if (this.ball.y <= 0) {
        this.ball.moveY = DIRECTION.DOWN;
      } else if (this.ball.y >= (this.canvas.height - this.ball.height)) {
        this.ball.moveY = DIRECTION.UP;
      }

      // Move player if player.move value was updated by a keyboard event
      if (this.player.move === DIRECTION.UP) {
        this.player.y -= this.player.speed;
      } else if (this.player.move === DIRECTION.DOWN) {
        this.player.y += this.player.speed;
      }

      // If the player collides with the bound limits, update the y coordinates
      if (this.player.y <= 0) {
        this.player.y = 0;
      } else if (this.player.y >= (this.canvas.height - this.player.height)) {
        this.player.y = (this.canvas.height - this.player.height);
      }

      // On start of each turn move the ball to the correct side and randomise the y direction of movement
      if (Pong._turnDelayIsOver.call(this) && this.turn) {
        this.ball.moveX = (this.turn === this.player) ? DIRECTION.LEFT : DIRECTION.RIGHT;
        this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
        this.ball.y = Math.floor(Math.random() * (this.canvas.height - 200)) + 200;
        this.turn = null;
      }

      // Move Ball in intended direction based on moveX and moveY values
      if (this.ball.moveX === DIRECTION.LEFT) {
        this.ball.x -= this.ball.speed;
      } else if (this.ball.moveX === DIRECTION.RIGHT) {
        this.ball.x += this.ball.speed;
      }
      if (this.ball.moveY === DIRECTION.UP) {
        this.ball.y -= (this.ball.speed / 1.5);
      } else if (this.ball.moveY === DIRECTION.DOWN) {
        this.ball.y += (this.ball.speed / 1.5);
      }

      // Move computer paddle (AI) UP and DOWN
      if (this.computer.y > this.ball.y - (this.computer.height / 2)) {
        if (this.ball.moveX === DIRECTION.RIGHT) {
          this.computer.y -= this.computer.speed / 1.5;
        } else {
          this.computer.y -= this.computer.speed / 4;
        }
      }
      if (this.computer.y < this.ball.y - (this.computer.height / 2)) {
        if (this.ball.moveX === DIRECTION.RIGHT) {
          this.computer.y += this.computer.speed / 1.5;
        } else {
          this.computer.y += this.computer.speed / 4;
        }
      }

      // If the computer collides with the bound limits, update the y coordinates
      if (this.computer.y <= 0) {
        this.computer.y = 0;
      } else if (this.computer.y >= (this.canvas.height - this.computer.height)) {
        this.computer.y = (this.canvas.height - this.computer.height);
      }

      // Handle player-ball collision
      if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
        if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
          this.ball.x = (this.player.x + this.ball.width);
          this.ball.moveX = DIRECTION.RIGHT;

          beep1.play();
        }
      }

      // Handle computer-ball collision
      if (this.ball.x - this.ball.width <= this.computer.x && this.ball.x >= this.computer.x - this.computer.width) {
        if (this.ball.y <= this.computer.y + this.computer.height && this.ball.y + this.ball.height >= this.computer.y) {
          this.ball.x = (this.computer.x - this.ball.width);
          this.ball.moveX = DIRECTION.LEFT;

          beep1.play();
        }
      }
    }

    // Handle the end of round transition
    if (this.player.score === rounds[this.round]) { // Player won the round
      // Check to see if there are more rounds to play & display victory screen if not
      if (!rounds[this.round + 1]) {
        this.over = true;
        setTimeout(() => {
          Pong.endGameMenu("Winner!");
        }, 1000);
      } else {
        // Another round so reset all the values and increment round by one
        this.colour = this._generateRoundColour();
        this.player.score = this.computer.score = 0;
        this.player.speed += 0.5;
        this.computer.speed += 1;
        this.ball.speed += 1;
        this.round += 1;

        beep3.play();
      }
    } else if (this.computer.score === rounds[this.round]) {  // Computer won the round
      this.over = true;
      setTimeout(() => {
        Pong.endGameMenu("Game Over!");
      }, 1000);
    }
  },

  loop: function() {  // Function to loop through the update and draw functions to keep the game moving until it is over
    Pong.update();
    Pong.draw();

    // If the game is not over, draw the next frame
    if (!Pong.over) requestAnimationFrame(Pong.loop);
  },

  listen: function() {  // Function to add "keydown" and "keyup" event listeners
    document.addEventListener("keydown", (key) => {
      console.log(key.code);
      // Handle the "Press any key to begin" function and start the game
      if (Pong.running === false) {
        Pong.running = true;
        window.requestAnimationFrame(Pong.loop);
      }

      // Handle up arrow and w key events
      if (key.code === "ArrowUp" || key.code === "KeyW") {
        Pong.player.move = DIRECTION.UP;
      }

      // Handle down arrow and s key events
      if (key.code === "ArrowDown" || key.code === "KeyS") {
        Pong.player.move = DIRECTION.DOWN;
      }
    });

    // Stop the player from moving when there are no keys being pressed
    document.addEventListener("keyup", (key) => {
      Pong.player.move = DIRECTION.IDLE;
    });
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
      this.computer.x,
      this.computer.y,
      this.computer.width,
      this.computer.height
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
      this.computer.score.toString(),
      (this.canvas.width / 2) + 300,
      200
    );

    // Change the font size for the centre round text
    this.context.font = "30px Courier New";

    // Draw the current round (centre)
    this.context.fillText(
      `Round: ${Pong.round + 1}`,
      (this.canvas.width / 2),
      35
    );

    // Change the font size for the centre target score
    this.context.font = "40px Courier New";

    // Draw the target score (centre)
    this.context.fillText(
      `Target: ${(rounds[Pong.round]) ? rounds[Pong.round] : rounds[Pong.round - 1]}`,
      (this.canvas.width / 2),
      100
    );
  },

  _resetTurn: function(victor, loser) {  // Function to reset the ball location, the player turns and to set a delay before the next round begins
    this.ball = Ball.new.call(this, this.ball.speed);
    this.turn = loser;
    this.timer = (new Date()).getTime();

    victor.score++;
    beep2.play();
  },

  _turnDelayIsOver: function() {  // Function to wait for a delay to have passed for each turn
    return ((new Date()).getTime() - this.timer >= 1000);
  },

  _generateRoundColour: function() {  // Function to select a random background colour for each level/round
    const newColour = colours[Math.floor(Math.random() * colours.length)];
    if (newColour === this.colour) return Pong._generateRoundColour();
    return newColour;
  }
};

let Pong = Object.assign({}, Game);
Pong.initialise();
// console.log(Pong);
