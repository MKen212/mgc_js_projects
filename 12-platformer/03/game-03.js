"use strict";

/*
Copyright (c) Frank Poth 2018
The Game class has been updated to move the World object into its own class, and the Player
class to be a sub-class inside of Game.World in order to compartmentalise the objects more
accurately. The Player class will never be used outside of the World class, and the
World class will never be used outside of the Game class, therefore the classes will
be nested: Game -> Game.World -> Game.World.Player
*/

const Game = function() {
  // Object to hold the virtual world, built from it's own class
  this.world = new Game.World();

  // Game Method to update the game by calling the World Update() method
  this.update = function() {
    this.world.update();
  };
};

Game.prototype = {
  constructor: Game
};


// World Class
Game.World = function(friction = 0.9, gravity = 3) {
  this.friction = friction;
  this.gravity = gravity;

  // Object to hold the player, built from it's own class inside Game.World
  this.player = new Game.World.Player();

  // World Map Data - In future this will be loaded from a JSON file
  this.columns = 12;
  this.rows = 9;
  this.tileSize = 16;
  this.map = [
    48, 17, 17, 17, 49, 48, 18, 19, 16, 17, 35, 36,
    10, 39, 39, 39, 16, 18, 39, 31, 31, 31, 39,  7,
    10, 31, 39, 31, 31, 31, 39, 12,  5,  5, 28,  1,
    35,  6, 39, 39, 31, 39, 39, 19, 39, 39,  8,  9,
    2 , 31, 31, 47, 39, 47, 39, 31, 31,  4, 36, 25,
    10, 39, 39, 31, 39, 39, 39, 31, 31, 31, 39, 37,
    10, 39, 31,  4, 14,  6, 39, 39,  3, 39,  0, 42,
    49,  2, 31, 31, 11, 39, 39, 31, 11,  0, 42,  9,
    8 , 40, 27, 13, 37, 27, 13,  3, 22, 34,  9, 24,
  ];

  // Height and Width now depend of the map size
  this.height = this.tileSize * this.rows;
  this.width = this.tileSize * this.columns;
};

Game.World.prototype = {
  constructor: Game.World,

  // Generic Method to handle collisions
  collideObject: function(object) {
    // Check Left/Right borders
    if (object.x < 0) {
      object.x = 0;
      object.velocityX = 0;
    } else if (object.x + object.width > this.width) {
      object.x = this.width - object.width;
      object.velocityX = 0;
    }

    // Check Top/Bottom borders
    if (object.y < 0) {
      object.y = 0;
      object.velocityY = 0;
    } else if (object.y + object.height > this.height) {
      object.jumping = false;
      object.y = this.height - object.height;
      object.velocityY = 0;
    }
  },

  // Generic Method to update the player position & movement & check for collision
  update: function() {
    this.player.velocityY += this.gravity;
    this.player.update();

    this.player.velocityX *= this.friction;
    this.player.velocityY *= this.friction;

    this.collideObject(this.player);
  }
};


// Player Class
Game.World.Player = function() {
  // Initial player values for colour, size, speed and location
  this.colour1 = "#404040";
  this.colour2 = "#f0f0f0";
  this.height = 12;
  this.width = 12;
  this.jumping = true;
  this.velocityX = 0;
  this.velocityY = 0;
  this.x = 100;
  this.y = 50;  
};

Game.World.Player.prototype = {
  constructor: Game.World.Player,

  jump: function() {
    if (!this.jumping) {
      // Change to random colour (#hex) on each new jump
      this.colour = `#${Math.floor(Math.random() * 16777216).toString(16)}`;
      /* NOTE that toString(16) will not add a leading zero to a hex value, so the
      following code adds it */
      if (this.colour.length != 7) {
        this.colour = this.colour.slice(0, 1) + "0" + this.colour.slice(1, 6);
      }
      this.jumping = true;
      this.velocityY -= 20;
    }
  },

  moveLeft: function() {
    this.velocityX -= 0.5;
  },

  moveRight: function() {
    this.velocityX += 0.5;
  },

  update: function() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
};
