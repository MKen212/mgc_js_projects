/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
This Main class contains the following changes since 03:
1. An AssetsManager class has been added to store all the graphics and sounds
2. The render() method has updated calls to drawMap() and drawObject() now that a player
   image is being drawn
3. The resize() method now stretches the display canvas to the full viewport capacity
*/

window.addEventListener("load", function() {
  // AssetsManager Class
  /* The assets manager will be responsible for loading and storing graphics for
  the game. */
  const AssetsManager = function() {
    this.tileSetImage = undefined;
  };

  AssetsManager.prototype = {
    constructor: AssetsManager,

    // Method to load the TileSet PNG Image
    loadTileSetImage: function(url, callback) {
      this.tileSetImage = new Image();

      // Add "load" event listener to run a callback "once" after the image is loaded
      this.tileSetImage.addEventListener("load", function () {
        callback();
      }, {once: true});

      // Load the image
      this.tileSetImage.src = url;
    }
  };

  // Get the Canvas HTML Element
  const canvasElement = document.getElementById("canvas");

  // The keyDownUp Event Handler
  const keyDownUp = function(event) {
    controller.keyDownUp(event.type, event.code);
  };

  // The resize Event Handler
  const resize = function() {
    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    display.render();
  };

  // The render() method to draw the map and the player object
  const render = function() {
    display.drawMap(assetsManager.tileSetImage, game.world.tileSet.columns, game.world.map, game.world.columns, game.world.tileSet.tileSize);

    // Get the current frame for the animated player image
    let frame = game.world.tileSet.frames[game.world.player.frameValue];
    // Update the destination position using the offsets added to the centre of the tile
    let destinationX = game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offsetX;
    let destinationY = game.world.player.y + frame.offsetY;
    display.drawObject(assetsManager.tileSetImage, frame.x, frame.y, destinationX, destinationY, frame.width, frame.height);

    display.render();
  };

  // The update() method to move the player and update the game
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
  const assetsManager = new AssetsManager();  // The Assets Manager deals with loading  images & sounds
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
  display.buffer.imageSmoothingEnabled = false;

  // INITIALISE the event listeners
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
  window.addEventListener("resize", resize);
  
  // Load the TileSet Image and Start the Game via the callback once the image is loaded
  assetsManager.loadTileSetImage("./rabbit-trap.png", () => {
    resize();
    engine.start();
  });

});
