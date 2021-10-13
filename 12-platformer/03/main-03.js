/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
Changes since the last part:
1. The render() method has been updated to call the display.drawMap() and
   display.drawPlayer() methods using the game.world.map and game.world.player data.
2. The resize() and engine.start() calls are placed inside a "load" event listener that
   is added to display.tileSheet.image
3. The sprite tile sheet is initialised at the end
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
    display.drawMap(game.world.map, game.world.columns, game.world.tileSize);
    display.drawPlayer(game.world.player, game.world.player.colour1, game.world.player.colour2);
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

  // INITIALISE the event listeners
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);

  // Add a "load" event listener to the TileSheet Image to start the game once the image is fully loaded
  display.tileSheet.image.addEventListener("load", function() {
    resize();
    engine.start();
  }, {once: true});

  // INITIALISE the TileSheet image
  display.tileSheet.image.src = "./rabbit-trap.png";
});
