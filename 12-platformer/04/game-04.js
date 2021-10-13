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

  // Object to hold the collider functionality
  this.collider = new Game.World.Collider();

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

  // Collision Map Data
  /* This uses binary values to represent the collision walls of the above map. Their
  binary representation can be used to describe which sides of the tile have boundaries.
  0000 = LBRT:
       0             1              0            0              1
     0   0         0   0          0   1        1   1          1   1
       0             0              0            0              1
    No walls     Wall on Top   Wall on Rt   Wall on L & R   Four walls
    Bin = 0000   Bin = 0001    Bin = 0010   Bin = 1010      Bin = 1111
    Dec = 0      Dec = 1       Dec = 2      Dec = 10        Dec = 15
    
  These collision values correspond to collision functions in the Collider class.
  0 is nothing and everything else is run through a switch statement and routed to the
  appropriate collision functions.*/
  this.collisionMap = [
    0,  4,  4,  4,  0,  0,  4,  4,  4,  4,  4,  0,
    2,  0,  0,  0, 12,  6,  0,  0,  0,  0,  0,  8,
    2,  0,  0,  0,  0,  0,  0,  9,  5,  5,  1,  0,
    0,  7,  0,  0,  0,  0,  0, 14,  0,  0,  8,  0,
    2,  0,  0,  1,  0,  1,  0,  0,  0, 13,  4,  0,
    2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  8,
    2,  0,  0, 13,  1,  7,  0,  0, 11,  0,  9,  0,
    0,  3,  0,  0, 10,  0,  0,  0,  8,  1,  0,  0,
    0,  0,  1,  1,  0,  1,  1,  1,  0,  0,  0,  0,
  ];

  // Height and Width now depend of the map size
  this.height = this.tileSize * this.rows;
  this.width = this.tileSize * this.columns;
};

Game.World.prototype = {
  constructor: Game.World,

  // Generic Method to handle collisions
  collideObject: function(object) {
    // Check Left/Right borders - UPDATED to use the new Object methods
    if (object.getLeft() < 0) {
      object.setLeft(0);
      object.velocityX = 0;
    } else if (object.getRight() > this.width) {
      object.setRight(this.width);
      object.velocityX = 0;
    }

    // Check Top/Bottom borders - UPDATED to use the new Object methods
    if (object.getTop() < 0) {
      object.setTop(0);
      object.velocityY = 0;
    } else if (object.getBottom() > this.height) {
      object.setBottom(this.height);
      object.velocityY = 0;
      object.jumping = false;
    }

    // Check individual tile collisions
    /* The side values refer to the tile grid row and column positions that the object
    is occupying on each of its sides. The collisionValue refers to the value of the
    tile in the collisionMap for the specified row and column occupied by the object. */
    let left = 0;
    let top = 0;
    let right = 0;
    let bottom = 0;
    let collisionValue = 0;

    /* First check the top left corner of the object. We get the row and column that it
    occupies and then we get the value from the collision map at that row and column.
    Then we hand the information to the collider's collide function. */
    top = Math.floor(object.getTop() / this.tileSize);
    left = Math.floor(object.getLeft() / this.tileSize);
    collisionValue = this.collisionMap[top * this.columns + left];
    this.collider.collide(collisionValue, object, left * this.tileSize, top * this.tileSize, this.tileSize);

    /* Next check the top right corner of the object. We must redefine top since the last
    because the object may have moved since the last collision check. NOTE that the top
    corners are checked first because if the object is moved down while checking the top
    it will be moved back up when checking the bottom, and it is better to look like it
    is standing on the ground than being pushed down through the ground by the ceiling. */
    top = Math.floor(object.getTop() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    collisionValue = this.collisionMap[top * this.columns + right];
    this.collider.collide(collisionValue, object, right * this.tileSize, top * this.tileSize, this.tileSize);

    /* Next check the bottom left corner. */
    bottom = Math.floor(object.getBottom() / this.tileSize);
    left = Math.floor(object.getLeft() / this.tileSize);
    collisionValue = this.collisionMap[bottom * this.columns + left];
    this.collider.collide(collisionValue, object, left * this.tileSize, bottom * this.tileSize, this.tileSize);

    /* Finally check the bottom right corner. */
    bottom = Math.floor(object.getBottom() / this.tileSize);
    right = Math.floor(object.getRight() / this.tileSize);
    collisionValue = this.collisionMap[bottom * this.columns + right];
    this.collider.collide(collisionValue, object, right * this.tileSize, bottom * this.tileSize, this.tileSize);
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


// Collider Class
Game.World.Collider = function() {
  /* This is the function routing method. Basically, you know what the tile looks like
  from its collisionValue. You know which object you want to collide with, and you know
  the x and y position of the tile as well as its dimensions. This function just decides
  which collision functions to use based on the value and allows you to tweak the
  other values to fit the specific tile shape. */
  this.collide = function(collisionValue, object, tileX, tileY, tileSize) {
    // Call the relevant method(s) for collisionValue, with no call for value = 0
    /* NOTE All 15 tile types can be described with only 4 collision methods. These
    methods are mixed and matched for each unique tile. */
    switch (collisionValue) {  // 0000 = LBRT
      case 1:  // 0001 = ---T
        this.collidePlatformTop(object, tileY);
        break;
      case 2:  // 0010 = --R-
        this.collidePlatformRight(object, tileX + tileSize);
        break;
      case 3:  // 0011 = --RT
        if (this.collidePlatformTop(object, tileY)) {
          // If there's a collision we don't need to check for anything else
          return;
        }
        this.collidePlatformRight(object, tileX + tileSize);
        break;
      case 4:  // 0100 = -B--
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 5:  // 0101 = -B-T
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 6:  // 0110 = -BR-
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 7:  // 0111 = -BRT
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 8:  // 1000 = L---
        this.collidePlatformLeft(object, tileX);
        break;
      case 9:  // 1001 = L--T
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 10:  // 1010 = L-R-
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 11:  // 1011 = L-RT
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 12:  // 1100 = LB--
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 13:  // 1101 = LB-T
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 14: // 1110 = LBR-
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 15:  // 1111 = LBRT
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
    }
  };
};

Game.World.Collider.prototype = {
  constructor: Game.World.Collider,

  // Method to resolve a collision between an object and the y location of the tile's bottom
  collidePlatformBottom: function(object, tileBottom) {
    if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
      /* If the top of the object is above the bottom of the tile and on the previous
      frame the top of the object was below the bottom of the tile, we have entered into
      this tile - there is a collision. */
      object.setTop(tileBottom);  // Move the top of the object to the bottom of the tile
      object.velocityY = 0;  // Stop object from moving up/down
      return true;  // Return true as there was a collision
    }
    return false;  // Return false as there was not a collision
  },

  // Method to resolve a collision between an object and the x location of the tile's left side
  collidePlatformLeft: function(object, tileLeft) {
    if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
      object.setRight(tileLeft - 0.01);  // Without this the tile is still colliding
      object.velocityX = 0;
      return true;
    }
    return false;
  },

  // Method to resolve a collision between an object and the x location of the tile's right side
  collidePlatformRight: function(object, tileRight) {
    if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
      object.setLeft(tileRight);
      object.velocityX = 0;
      return true;
    }
    return false;
  },

  // Method to resolve a collision between an object and the y location of the tile's top
  collidePlatformTop: function(object, tileTop) {
    if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
      object.setBottom(tileTop - 0.01);  // Without this the tile is still colliding
      object.velocityY = 0;
      object.jumping = false;
      return true;
    }
    return false;
  }
};


// Object Class
/* This is just a basic rectangle with a number of prototype methods that help calculate the position of the rectangle. It is inherited and extended by other objects */
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
    this.yOld = this.y;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
};

// Assign the Object prototype methods to the Player
Object.assign(Game.World.Player.prototype, Game.World.Object.prototype);
Game.World.Player.prototype.constructor = Game.World.Player;
