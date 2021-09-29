/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
This is the basic setup or "skeleton" of the program. It has three main parts:
the controller, display, and game logic. It also has an engine which combines the
three logical parts which are otherwise completely separate. One of the most important
aspects of programming is organization. Without an organized foundation, your code
will quickly become unruly and difficult to maintain. Separating code into logical
groups is also a principle of object oriented programming, which lends itself to
comprehensible, maintainable code as well as modularity.

NOTE: Since the scripts are loaded dynamically from the index.html,  the main JavaScript
files are wrapped in a load listener. This ensures that this code will not
execute until the document has finished loading and we have access to all of the classes.
*/

window.addEventListener("load", function() {
  // Get the Canvas HTML Element
  const canvasElement = document.getElementById("canvas");

  // Setup the FUNCTIONS
  const render = function() {
    display.bufferColour(game.colour);
    display.render();
  };

  const update = function() {
    game.update();
  };

  // Load the OBJECTS
  const controller = new Controller();  // The controller handles user input
  const display = new Display(canvasElement);  // The display handles the canvas and window resizing
  const game = new Game();  // The game holds all of the game logic
  const engine = new Engine(1000/30, render, update);  // The engine combines the above to play the game and refresh the screen at 30 frames per second

  // INITIALISE the event listeners and start the game
  window.addEventListener("resize", display.handleResize);
  window.addEventListener("keydown", controller.handleKeyDownUp);
  window.addEventListener("keyup", controller.handleKeyDownUp);

  display.resize();
  engine.start();
});
