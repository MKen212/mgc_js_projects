/*global Controller, Display, Game, Engine */
"use strict";

/*
Copyright (c) Frank Poth 2018
This Main file contains all the initialisation data and functions and is the one that
loads and calls all of the other classes.

Changes since 06:
1. Updated the render() function to include the drawing calls for drawing the grass
   and carrots.
2. Created a <p> element and updated the render() function to display the number of
   carrots collected in this.
3. Updated the resize() function to also resize the carrot counter
*/

window.addEventListener("load", function() {
  // CONSTANTS
  /* Each zone has a url that looks like: zoneXX.json, where XX is the current zone
  identifier. When loading zones, we use the following constants together with the
  game.world's zone to identify the file required. */
  const ZONE_PREFIX = "07/zone";
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

    // Update the position and fontSize of the Carrot Counter
    const rectangle = display.context.canvas.getBoundingClientRect();

    p.style.left = `${rectangle.left}px`;
    p.style.top = `${rectangle.top}px`;
    p.style.fontSize = `${game.world.tileSet.tileSize * rectangle.height / game.world.height}px`;
  };

  // The render() function to draw the map, the player and the grass & carrot objects
  const render = function() {
    let frame = undefined;  // Frame placeholder for each game object
    let destinationX = undefined;  // Game object destination X position
    let destinationY = undefined;  // Game object destination Y position

    // Draw the map
    display.drawMap(assetsManager.tileSetImage, game.world.tileSet.columns, game.world.graphicalMap, game.world.columns, game.world.tileSet.tileSize);

    // Draw the carrots
    for (let index = game.world.carrots.length - 1; index > -1; --index) {
      let carrot = game.world.carrots[index];
      // Get the current frame for the animated carrot image
      frame = game.world.tileSet.frames[carrot.frameValue];
      // Update the destination positions using the offsets added to the centre of the tile
      destinationX = carrot.x + Math.floor(carrot.width * 0.5 - frame.width * 0.5) + frame.offsetX;
      destinationY = carrot.y + frame.offsetY;
      display.drawObject(assetsManager.tileSetImage, frame.x, frame.y, destinationX, destinationY, frame.width, frame.height);      
    }

    // Draw the player
    // Get the current frame for the animated player image
    frame = game.world.tileSet.frames[game.world.player.frameValue];
    // Update the destination positions using the offsets added to the centre of the tile
    destinationX = game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offsetX;
    destinationY = game.world.player.y + frame.offsetY;
    display.drawObject(assetsManager.tileSetImage, frame.x, frame.y, destinationX, destinationY, frame.width, frame.height);

    // Draw the grass
    for (let index = game.world.grasses.length - 1; index > -1; --index) {
      let grass = game.world.grasses[index];
      // Get the current frame for the animated grass image
      frame = game.world.tileSet.frames[grass.frameValue];
      // Update the destination positions using the offsets added to the tile
      destinationX = grass.x + frame.offsetX;
      destinationY = grass.y + frame.offsetY;
      display.drawObject(assetsManager.tileSetImage, frame.x, frame.y, destinationX, destinationY, frame.width, frame.height);      
    }

    // Display the Collected Carrot Count
    p.textContent = `Carrots: ${game.world.carrotCount}`;

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
      return;
    }
  };

  // Load the OBJECTS
  const assetsManager = new AssetsManager();  // The Assets Manager deals with loading  images & sounds
  const controller = new Controller();  // The controller handles user input
  const display = new Display(canvasElement);  // The display handles the canvas and window resizing
  const game = new Game();  // The game holds all of the game logic
  const engine = new Engine(1000/30, render, update);  // The engine combines the above to play the game and refresh the screen at 30 frames per second

  // Create the Carrot Count Element
  const p = document.createElement("p");
  p.setAttribute("style", "color: #c07000; font-size: 2.0em; position: fixed;");
  p.textContent = "Carrots: 0";
  document.body.appendChild(p);

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
