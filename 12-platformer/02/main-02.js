/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
Changes since the last part: The event handlers have moved out of the component
controller and display files. Any functionality that might need two or more components
to communicate should be in the main file. The resize function, for example, shouldn't
be in Display, because it needs information from Game to size the on-screen canvas.
As a general rule, anything that causes two components to communicate should be
in the main file because we want to reduce internal references between components
as much as possible. They should communicate via public methods that take primitives.
*/

window.addEventListener("load", function() {
  // Get the Canvas HTML Element
  const canvasElement = document.getElementById("canvas");

  // The keyDownUp Event Handler has moved into here from controller.js
  const keyDownUp = function(event) {
    controller.keyDownUp(event.type, event.code);
  };

  // The resize Event Handler has moved into here from display.js
  // We need to reference this with game.js & display.js data so better to handle in main
  const resize = function() {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render();
  };

  // Setup the FUNCTIONS
  const render = function() {
    display.fill(game.world.backgroundColour);
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width,  game.world.player.height,game.world.player.colour);
    display.render();
  };

  const update = function() {
    // Move Player or Jump
    if (controller.left.active) {
      game.world.player.moveLeft();
    }
    
    if (controller.right.active) {
      game.world.player.moveRight();
    }
    
    if (controller.up.active) {
      game.world.player.jump();
      controller.up.active = false;
    }
    
    game.update();
  };

  // Load the OBJECTS
  const controller = new Controller();  // The controller handles user input
  const display = new Display(canvasElement);  // The display handles the canvas and window resizing
  const game = new Game();  // The game holds all of the game logic
  const engine = new Engine(1000/30, render, update);  // The engine combines the above to play the game and refresh the screen at 30 frames per second

  // INITIALISE the canvas buffer
  /* NOTE: This is very important. The buffer canvas must be pixel for pixel the same
  size as the world dimensions to properly scale the graphics. All the game knows
  are player location and world dimensions. We have to tell the display to match them.
  */
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  // INITIALISE the event listeners and start the game
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

  resize();
  engine.start();
});
