"use strict";

/*
Copyright (c) Frank Poth 2018
The Game class has been updated to handle the collision detection and response for the
tile map. The collisionMap array and the collider object have been added to handle
collisions. The Game.World.Object "super" class has also been added to handle the
positioning of any Game object. All other game objects can extend this and inherit its
methods.
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


// Collider Class - 
Game.World.Collider = function() {

  // TO HERE

};



// Object Class - This is just a basic rectangle with a number of prototype methods that help calculate the position of the rectangle. It is inherited and extended by other objects
Game.World.Object = function(x, y, width, height) {
  this.x = x;
  this.xOld = x;
  this.y = y;
  this.yOld = y;
  this.height = height;
  this.width = width;
};

Game.World.Object.prototype = {
  constructor: Game.World.Object,

  // The following methods are used to get and set the different side positions of the object
  getBottom: function() {
    return this.y + this.height;
  },

  getLeft: function() {
    return this.x;
  },

  getRight: function() {
    return this.x + this.width;
  },

  getTop: function() {
    return this.y;
  },

  getOldBottom: function() {
    return this.yOld + this.height;
  },

  getOldLeft: function() {
    return this.xOld;
  },

  getOldRight: function() {
    return this.xOld + this.width;
  },

  getOldTop: function() {
    return this.yOld;
  },

  setBottom: function(y) {
    this.y = y - this.height;
  },

  setLeft: function(x) {
    this.x = x;
  },

  setRight: function(x) {
    this.x = x - this.width;
  },

  setTop: function(y) {
    this.y = y;
  },

  setOldBottom: function(y) {
    this.yOld = y - this.height;
  },

  setOldLeft: function(x) {
    this.xOld = x;
  },

  setOldRight: function(x) {
    this.xOld = x - this.width;
  },

  setOldTop: function(y) {
    this.yOld = y;
  }
};


// Player Class
Game.World.Player = function() {
  // Establish the Player as an Object
  Game.World.Object.call(this, 100, 100, 12, 12);

  // Initial player values for colour, size, speed and location
  this.colour1 = "#404040";
  this.colour2 = "#f0f0f0";
  this.jumping = true;
  this.velocityX = 0;
  this.velocityY = 0;
};

Game.World.Player.prototype = {
  jump: function() {
    if (!this.jumping) {
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
    this.xOld = this.x;
    this.yOld - this.y;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
};

// Assign the Object prototype methods to the Player
Object.assign(Game.World.Player.prototype, Game.World.Object.prototype);
Game.World.Player.prototype.constructor = Game.World.Player;
