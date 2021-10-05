"use strict";

/*
Copyright (c) Frank Poth 2018
The Game class has been updated to remove the old game logic and then add a new Player class
and a new world object that controls the virtual game world. Players, NPCs, world dimensions, collision maps, and everything to do with the game world are stored in the world object.
*/

const Game = function() {
  // Object for the virtual world
  this.world = {
    backgroundColour: "rgba(40,  48, 56, 0.25)",
    height: 72,
    width: 128,
    friction: 0.9,
    gravity: 3,

    player: new Game.Player(),

    // Method to handle collisions
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

    // Method to update the player position & movement & check for collision
    update: function() {
      this.player.velocityY += this.gravity;
      this.player.update();

      this.player.velocityX *= this.friction;
      this.player.velocityY *= this.friction;

      this.collideObject(this.player);
    }
  };

  // Game Method to update the game by calling the World Update() method
  this.update = function() {
    this.world.update();
  };
};

Game.prototype = {
  constructor: Game
};


// Player Class
Game.Player = function() {
  // Initial player values for colour, size, speed and location
  this.colour = "#ffffff";
  this.height = 16;
  this.width = 16;
  this.jumping = true;
  this.velocityX = 0;
  this.velocityY = 0;
  this.x = 100;
  this.y = 50;  
};

Game.Player.prototype = {
  constructor: Game.Player,

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
