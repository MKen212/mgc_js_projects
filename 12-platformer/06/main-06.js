/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
This Main class contains the following changes since 05:
1. The AssetsManager class has been updated to load JSON files with the different
   zones/levels, as well as the images through a renamed & more generic method
2. The update() method now checks for a game.world.door on every frame. If a door is
   selected, the game engine stops and the door's zone is loaded
3. When the game is first initialised the game.world is loaded using it's default
   values as defined in the constructor.
*/

window.addEventListener("load", function() {
  // CONSTANTS
  /* Each zone has a url that looks like: zoneXX.json, where XX is the current zone
  identifier. When loading zones, we use the following constants together with the
  game.world's zone to identify the file required. */
  const ZONE_PREFIX = "06/zone";
  const ZONE_SUFFIX = ".json";

  // AssetsManager Class
  /* The assets manager will be responsible for loading and storing graphics for
  the game, as well as the game zone JSON data. */
  const AssetsManager = function() {
    this.tileSetImage = undefined;
  };

  AssetsManager.prototype = {
    constructor: AssetsManager,

    // Method to load the JSON Zone file
    requestJSON: function(url, callback) {
      const request = new XMLHttpRequest();

      // Add "load" event listener to run the callback using the parsed data "once" after the JSON file is loaded
      request.addEventListener("load", function() {
        callback(JSON.parse(this.responseText));
      }, {once: true});

      // Load the data
      request.open("GET", url);
      request.send();
    },

    // Method to load an Image (Renamed & made more generic)
    requestImage: function(url, callback) {
      const image = new Image();

      // Add "load" event listener to run a callback using the image "once" after the image is loaded
      image.addEventListener("load", function () {
        callback(image);
      }, {once: true});

      // Load the image
      image.src = url;
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
    display.drawMap(assetsManager.tileSetImage, game.world.tileSet.columns, game.world.graphicalMap, game.world.columns, game.world.tileSet.tileSize);

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

    /* Check to see if a door has been selected by the player. If the player collides
    with a door, he selects it. The engine is then stopped and the assetsManager loads
    the door's level. */
    if (game.world.door) {
      engine.stop();

      // Get new zone data, setup new world & restart game
      assetsManager.requestJSON(ZONE_PREFIX + game.world.door.destinationZone + ZONE_SUFFIX, (zoneData) => {
        game.world.setup(zoneData);
        engine.start();
      });
    }
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
  
  // INITIALISE the zone data and tileSet image using callbacks and once both are loaded start the game
  assetsManager.requestJSON(ZONE_PREFIX + game.world.zoneID + ZONE_SUFFIX, (zoneData) => {
    game.world.setup(zoneData);

    assetsManager.requestImage("./rabbit-trap.png", (image) => {
      assetsManager.tileSetImage = image;

      resize();
      engine.start();
    });
  });
});
