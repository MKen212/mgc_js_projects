"use strict";

/*
Copyright (c) Frank Poth 2018
This Game class contains the following changes since 04:
1. Added the Game.World.TileSet & Game.World.TileSet.Frame classes.
2. Added the Game.World.Object.Animator class.
3. Moved Game.World.Player class to Game.World.Object.Player.
4. Updated the Player class to include frame sets for its animations and to update
   its position and animation separately.
5. Removed tileSize from the world class and only use tileSize from the tileSet class.
6. Changed the Game.World.prototype.update() method to better handle player animation
   updates.
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
Game.World = function(friction = 0.8, gravity = 2) {
  this.friction = friction;
  this.gravity = gravity;

  // Object to hold the player, built from it's own class inside Game.World.Object
  this.player = new Game.World.Object.Player(100, 100);

  // Object to hold the collider functionality
  this.collider = new Game.World.Collider();

  // Object to hold the tileSet functionality
  this.tileSet = new Game.World.TileSet(8, 16);

  // World Map Data - In future this will be loaded from a JSON file
  this.columns = 12;
  this.rows = 9;
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

  // Height and Width now depend of the map size and the tileSize in the tileSet
  this.height = this.tileSet.tileSize * this.rows;
  this.width = this.tileSet.tileSize * this.columns;
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
    top = Math.floor(object.getTop() / this.tileSet.tileSize);
    left = Math.floor(object.getLeft() / this.tileSet.tileSize);
    collisionValue = this.collisionMap[top * this.columns + left];
    this.collider.collide(collisionValue, object, left * this.tileSet.tileSize, top * this.tileSet.tileSize, this.tileSet.tileSize);

    /* Next check the top right corner of the object. We must redefine top since the last
    because the object may have moved since the last collision check. NOTE that the top
    corners are checked first because if the object is moved down while checking the top
    it will be moved back up when checking the bottom, and it is better to look like it
    is standing on the ground than being pushed down through the ground by the ceiling. */
    top = Math.floor(object.getTop() / this.tileSet.tileSize);
    right = Math.floor(object.getRight() / this.tileSet.tileSize);
    collisionValue = this.collisionMap[top * this.columns + right];
    this.collider.collide(collisionValue, object, right * this.tileSet.tileSize, top * this.tileSet.tileSize, this.tileSet.tileSize);

    /* Next check the bottom left corner. */
    bottom = Math.floor(object.getBottom() / this.tileSet.tileSize);
    left = Math.floor(object.getLeft() / this.tileSet.tileSize);
    collisionValue = this.collisionMap[bottom * this.columns + left];
    this.collider.collide(collisionValue, object, left * this.tileSet.tileSize, bottom * this.tileSet.tileSize, this.tileSet.tileSize);

    /* Finally check the bottom right corner. */
    bottom = Math.floor(object.getBottom() / this.tileSet.tileSize);
    right = Math.floor(object.getRight() / this.tileSet.tileSize);
    collisionValue = this.collisionMap[bottom * this.columns + right];
    this.collider.collide(collisionValue, object, right * this.tileSet.tileSize, bottom * this.tileSet.tileSize, this.tileSet.tileSize);
  },

  // Generic Method to update the player position & movement, check for collision and then update the animation based on the player's final condition
  update: function() {
    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    this.player.updateAnimation();
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


// Animator Class
Game.World.Object.Animator = function(frameSet, delay) {
  
  // TO HERE
  
  // TODO

};

Game.World.Object.Animator.prototype = {
  constructor: Game.World.Object.Animator,

  animate: function() {
    // TODO
  },

  changeFrameSet: function(frameSet, mode, delay = 10, frameIndex = 0) {
    // TODO
  },

  loop: function() {
    // TODO
  }
};


// Player Class
Game.World.Object.Player = function(x, y) {
  // Establish the Player as an Object
  Game.World.Object.call(this, x, y, 7, 14);

  // Animate the Player
  Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frameSets["idleLeft"], 10);

  // Initial player values for speed and location
  this.jumping = true;
  this.directionX = -1;  // Left/Right direction (-1 / +1)
  this.velocityX = 0;
  this.velocityY = 0;
};

Game.World.Object.Player.prototype = {
  constructor: Game.World.Object.Player,

  // The frameSets{} object holds the animation frames to use for each movement
  /* The values in these arrays correspond to the TileSet.Frame objects in the tileSet.
  They are just hardcoded in here now, but when the tileSet information is eventually
  loaded from a json file, these will be allocated dynamically in some sort of loading function. */
  frameSets: {
    // TODO
  },

  jump: function() {
    if (!this.jumping) {
      this.jumping = true;
      this.velocityY -= 20;
    }
  },

  moveLeft: function() {
    this.directionX = -1;
    this.velocityX -= 0.55;
  },

  moveRight: function() {
    this.directionX = 1;
    this.velocityX += 0.55;
  },

  // Method to update the animation of the player
  /* Because animation is entirely dependent on the player's movement, there is now a
  separate update method just for animation that is called after collision between the
  player and the world. This gives the most accurate animations for what the player is
  doing movement-wise on the screen. */
  updateAnimation: function() {
    // TODO
  },

  // Method to update the position of the player
  /* This used to be the update method, but now it's a little bit better. It takes
  gravity and friction as parameters so the player class can decide what to do with
  them. */
  updatePosition: function(gravity, friction) {
    this.xOld = this.x;
    this.yOld = this.y;

    this.velocityY += gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    this.velocityX *= friction;
    this.velocityY *= friction;
  }
};

// Assign the Object AND Animator prototype methods to the Player
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;


// TileSet Class
/* The TileSheet class was taken from the Display class and renamed TileSet.
It does all the same stuff, but it doesn't have an image reference and it also
defines specific regions in the tile set image that correspond to the player's sprite
animation frames. Later, this will all be set in a level loading function in order to
add functionality that adds in another tile sheet graphic with different terrain. */
Game.World.TileSet = function(columns, tileSize) {
  // TODO
};

Game.World.TileSet.prototype = {
  constructor: Game.World.TileSet
};


// Frame Class
/* The Frame class just defines a rectangle region in a tilesheet to cut out.
It has an x and y offset used for drawing the cut out sprite image to the screen,
which allows sprites to be positioned anywhere in the tile sheet image rather than
being forced to adhere to a grid like tile graphics. This is more natural because
sprites often fluctuate in size and won't always fit in a 16x16 grid. */
Game.World.TileSet.Frame = function(x, y, width, height, offsetX, offsetY) {
  // TODO
};

Game.World.TileSet.Frame.prototype = {
  constructor: Game.World.TileSet.Frame
};
