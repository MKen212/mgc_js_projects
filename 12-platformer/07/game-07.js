"use strict";

/*
Copyright (c) Frank Poth 2018
This Game class contains all of the game logic within various classes, sub-classes and the
subsequent properties and methods

Changes since 06:
1. Updated the Game.Animator constructor to include "mode" as a parameter
2. Updated the Game.Frame constructor to include default values for offsetX and offsetY
3. Moved the collideObject() method out of Game.Door and created it in in Game.Object as
   collideObjectCentre() so that it can be used for any collision detection with an
   object's centre
4. Created Game.Object.collideObject for generic collision detection with an object's edges
5. Added the Game.Carrot{} and Game.Grass{} classes
6. Added frames for the Carrot & Grass animation images to TileSet.frames[]
7. Added carrots[], carrotCount * grass[] properties to the World{} class and updated the
   World.setup() method to draw these to the canvas
8. Updated the World.update() method to handle carrot collisions and to update the carrot and
   grass animations
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


// Animator Class
Game.Animator = function(frameSet, delay, mode = "loop") {
  this.count = 0;  // Used to count the number of frames within a loop
  this.delay = (delay >= 1) ? delay : 1;  // Min number of frames to show each image
  this.frameSet = frameSet;  // FrameSet currently in use
  this.frameIndex = 0;  // Current Index within the FrameSet
  this.frameValue = frameSet[0];  // Current Value within the FrameSet
  this.mode = mode;  // Current animation mode
};

Game.Animator.prototype = {
  constructor: Game.Animator,

  // Animate method to control what animation is processed based on the current mode
  animate: function() {
    switch (this.mode) {
      case "loop":
        // Run the loop to show each frame of the frameSet
        this.loop();
        break;
      case "pause":
        // Do nothing other than show the current frame!
        break;
    }
  },

  // ChangeFrameSet method to change the current frameSet in use
  changeFrameSet: function(frameSet, mode, delay = 10, frameIndex = 0) {
    if (this.frameSet === frameSet) {
      // No change required if already using the new frameSet
      return;
    }

    this.count = 0;
    this.delay = delay;
    this.frameSet = frameSet;
    this.frameIndex = frameIndex;
    this.frameValue = frameSet[frameIndex];
    this.mode = mode;
  },

  // Loop method used to loop through the frameSet
  loop: function() {
    this.count++;

    while (this.count > this.delay) {
      this.count -= this.delay;
      // Get next frameIndex or cycle back to 0 if passed the end of the array
      this.frameIndex = (this.frameIndex < this.frameSet.length - 1) ? this.frameIndex + 1 : 0;
      // Get new frameSet value
      this.frameValue = this.frameSet[this.frameIndex];
    }
  }
};


// Collider Class
Game.Collider = function() {
  /* This is the function routing method. Basically, you know what the tile looks like
  from its collisionValue. You know which object you want to collide with, and you know
  the x and y position of the tile as well as its dimensions. This function just decides
  which collision functions to use based on the value and allows you to tweak the
  other values to fit the specific tile shape. */
  /* This has been updated in 06 to perform the y checks first */
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
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformRight(object, tileX + tileSize);
        break;
      case 7:  // 0111 = -BRT
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        this.collidePlatformRight(object, tileX + tileSize);
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
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
      case 15:  // 1111 = LBRT
        if (this.collidePlatformTop(object, tileY)) {
          return;
        }
        if (this.collidePlatformBottom(object, tileY + tileSize)) {
          return;
        }
        if (this.collidePlatformRight(object, tileX + tileSize)) {
          return;
        }
        this.collidePlatformLeft(object, tileX);
        break;
    }
  };
};

Game.Collider.prototype = {
  constructor: Game.Collider,

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


// Frame Class
/* The Frame class just defines a rectangle region in a tile sheet to cut out.
It has an x and y offset used for drawing the cut out sprite image to the screen,
which allows sprites to be positioned anywhere in the tile sheet image rather than
being forced to adhere to a grid like tile graphics. This is more natural because
sprites often fluctuate in size and won't always fit in a 16x16 grid. */
Game.Frame = function(x, y, width, height, offsetX = 0, offsetY = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
};

Game.Frame.prototype = {
  constructor: Game.Frame
};


// Object Class
/* This is just a basic rectangle with a number of prototype methods that help calculate the position of the rectangle. It is inherited and extended by other objects */
Game.Object = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
};

Game.Object.prototype = {
  constructor: Game.Object,

  // Generic collideObject method to check collisions with an object's edges
  collideObject: function(object) {
    if (object.getRight() < this.getLeft() || object.getLeft() > this.getRight() ||
        object.getBottom() < this.getTop() || object.getTop() > this.getBottom()) {
      return false;
    } else {
      return true;
    }
  },

  // Generic collideObjectCentre method to check collisions with an object's centre
  collideObjectCentre: function(object) {
    const centreX = object.getCentreX();
    const centreY = object.getCentreY();

    if (centreX < this.getLeft() || centreX > this.getRight() ||
        centreY < this.getTop() || centreY > this.getBottom()) {
      return false;
    } else {
      return true;
    }
  },

  // The following methods are used to get and set the different side positions of the object, plus the centre X & Y of each object
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

  getCentreX: function() {
    return this.x + this.width * 0.5;
  },

  getCentreY: function() {
    return this.y + this.height * 0.5;
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

  setCentreX: function(x) {
    this.x = x - this.width * 0.5;
  },

  setCentreY: function(y) {
    this.y = y - this.height * 0.5;
  }
};


// Moving Object Class
/* This extends the Object Class and has the properties and methods related to a moving
object. This also holds the velocityMax property at one less than tileSize of 16. */
Game.MovingObject = function(x, y, width, height, velocityMax = 15) {
  Game.Object.call(this, x, y, width, height);

  this.jumping = false;
  this.velocityX = 0;
  this.velocityY = 0;
  this.velocityMax = velocityMax;
  this.xOld = x;
  this.yOld = y;
};

Game.MovingObject.prototype = {
  constructor: Game.MovingObject,

  // The following methods are used to get and set the old side positions of the object, plus the old centre X & Y of each object
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

  getOldCentreX: function() {
    return this.xOld + this.width * 0.5;
  },

  getOldCentreY: function() {
    return this.yOld + this.height * 0.5;
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
  },

  setOldCentreX: function(x) {
    this.xOld = x - this.width * 0.5;
  },

  setOldCentreY: function(y) {
    this.yOld = y - this.height * 0.5;
  }
};

// Assign the Object prototype to the MovingObject
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;


// Carrot Class
Game.Carrot = function(x, y) {
  // This extends Game.Object and Game.Animation

  // TODO

};

Game.Carrot.prototype = {
  constructor: Game.Carrot,

  // TODO

};

// Assign the Object AND Animator prototypes to the Carrot
Object.assign(Game.Carrot.prototype, Game.Object.prototype);
Object.assign(Game.Carrot.prototype, Game.Animator.prototype);
Game.Carrot.prototype.constructor = Game.Carrot;


// Assign the Object prototype to the MovingObject
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;


// Grass Class
Game.Grass = function(x, y) {
  // This extends Game.Animation
  /* NOTE: This is not an Object{} as it does not require collision detection. */

  // TODO

};

Game.Grass.prototype = {
  constructor: Game.Grass,

  // TODO

};

// Assign the Animator prototype to the Grass
Object.assign(Game.Grass.prototype, Game.Animator.prototype);
Game.Grass.prototype.constructor = Game.Grass;


// Door Class
Game.Door = function(door) {
  // Establish the Door as an Object
  Game.Object.call(this, door.x, door.y, door.width, door.height);

  // Add additional properties related to the door destination
  this.destinationZone = door.destinationZone;
  this.destinationX = door.destinationX;
  this.destinationY = door.destinationY;
};

Game.Door.prototype = {
  constructor: Game.Door,
};

// Assign the Object prototype to the Door
Object.assign(Game.Door.prototype, Game.Object.prototype);
Game.Door.prototype.constructor = Game.Door;


// Player Class
Game.Player = function(x, y) {
  // Establish the Player as a Moving Object
  Game.MovingObject.call(this, x, y, 7, 12);

  // Animate the Player
  Game.Animator.call(this, Game.Player.prototype.frameSets["idleLeft"], 10);

  // Initial player values for speed and location
  this.jumping = true;
  this.directionX = -1;  // Left/Right direction (-1 / +1)
  this.velocityX = 0;
  this.velocityY = 0;
};

Game.Player.prototype = {
  constructor: Game.Player,

  // The frameSets{} object holds the animation frames to use for each movement
  /* The values in these arrays correspond to the TileSet.Frame objects in the tileSet.
  They are just hardcoded in here now, but when the tileSet information is eventually
  loaded from a json file, these will be allocated dynamically in some sort of loading function. */
  frameSets: {
    "idleLeft": [0],
    "jumpLeft": [1],
    "moveLeft": [2, 3, 4, 5],
    "idleRight": [6],
    "jumpRight": [7],
    "moveRight": [8, 9, 10, 11]
  },

  jump: function() {
    // Updated so the player can only jump if it isn't falling faster than 10px per frame
    if (!this.jumping && this.velocityY < 10) {
      this.jumping = true;
      this.velocityY -= 13;
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
    if (this.velocityY < 0) {
      // Player is moving up / jumping
      if (this.directionX < 0) {
        // Player is jumping whilst facing left
        this.changeFrameSet(this.frameSets["jumpLeft"], "pause");
      } else {
        // Player is jumping whilst facing right
        this.changeFrameSet(this.frameSets["jumpRight"], "pause");
      }
    } else if (this.directionX < 0) {
      // Player is facing left
      if (this.velocityX < -0.1) {
        // Player is moving whilst facing left
        this.changeFrameSet(this.frameSets["moveLeft"], "loop", 5);
      } else {
        // Player is NOT moving whilst facing left
        this.changeFrameSet(this.frameSets["idleLeft"], "pause");
      }
    } else if (this.directionX > 0) {
      // Player is facing right
      if (this.velocityX > 0.1) {
        // Player is moving whilst facing right
        this.changeFrameSet(this.frameSets["moveRight"], "loop", 5);
      } else {
        // Player is NOT moving whilst facing right
        this.changeFrameSet(this.frameSets["idleRight"], "pause");
      }
    }

    this.animate();
  },

  // Method to update the position of the player
  /* This used to be the update method, but now it's a little bit better. It takes
  gravity and friction as parameters so the player class can decide what to do with
  them. */
  updatePosition: function(gravity, friction) {
    this.xOld = this.x;
    this.yOld = this.y;

    this.velocityY += gravity;
    this.velocityX *= friction;

    // Safety checks to ensure velocityX & Y cannot exceed velocityMax
    if (Math.abs(this.velocityX) > this.velocityMax) {
      this.velocityX = this.velocityMax * Math.sign(this.velocityX);
    }
    if (Math.abs(this.velocityY) > this.velocityMax) {
      this.velocityY = this.velocityMax * Math.sign(this.velocityY);
    }

    this.x += this.velocityX;
    this.y += this.velocityY;    
  }
};

// Assign the MovingObject AND Animator prototypes to the Player
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;


// TileSet Class
/* The TileSheet class was taken from the Display class and renamed TileSet.
It does all the same stuff, but it doesn't have an image reference and it also
defines specific regions in the tile set image that correspond to the player's sprite
animation frames. Later, this will all be set in a level loading function in order to
add functionality that adds in another tile sheet graphic with different terrain. */
Game.TileSet = function(columns, tileSize) {
  this.columns = columns;
  this.tileSize = tileSize;

  const frame = Game.Frame;

  // The frames array contains a separate frame for each player image in the tile sheet
  this.frames = [
    new frame(115,  96, 13, 16, 0, -4),  // idle-left image
    new frame( 50,  96, 13, 16, 0, -4),  // jump-left image
    new frame(102,  96, 13, 16, 0, -4),  // walk-left image (1 of 4)
    new frame( 89,  96, 13, 16, 0, -4),  // walk-left image (2 of 4)
    new frame( 76,  96, 13, 16, 0, -4),  // walk-left image (3 of 4)
    new frame( 63,  96, 13, 16, 0, -4),  // walk-left image (4 of 4)
    new frame(  0, 112, 13, 16, 0, -4),  // idle-right image
    new frame( 65, 112, 13, 16, 0, -4),  // jump-right image
    new frame( 13, 112, 13, 16, 0, -4),  // walk-right image (1 of 4)
    new frame( 26, 112, 13, 16, 0, -4),  // walk-right image (2 of 4)
    new frame( 39, 112, 13, 16, 0, -4),  // walk-right image (3 of 4)
    new frame( 52, 112, 13, 16, 0, -4),  // walk-right image (4 of 4)
    // TODO UPDATE
  ];
};

Game.TileSet.prototype = {
  constructor: Game.TileSet
};


// World Class
Game.World = function(friction = 0.85, gravity = 2) {
  this.friction = friction;
  this.gravity = gravity;

  // Object to hold the player, built from it's own class
  this.player = new Game.Player(32, 76);

  // Object to hold the collider functionality
  this.collider = new Game.Collider();

  // Object to hold the tileSet functionality
  this.tileSet = new Game.TileSet(8, 16);

  // Zone Data
  this.zoneID = "00";
  this.doors = [];  // Array of doors for the zone
  this.door = undefined;  // If the player enters a door the game will set this property to that door and the relevant level will be loaded
  this.carrots = [];  // Array of carrots for the zone
  this.carrotCount = 0;  // The number of carrots collected
  this.grass = [];  // Array of grass for the zone


  // World Map Data - now loaded from a JSON file in setup() method below
  this.columns = 12;
  this.rows = 9;
  this.graphicalMap = [];

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
  this.collisionMap = [];

  // Height and Width now depend on the tileSet
  this.height = this.tileSet.tileSize * this.rows;
  this.width = this.tileSet.tileSize * this.columns;
};

Game.World.prototype = {
  constructor: Game.World,

  // Generic Method to handle collisions
  collideObject: function(object) {
    // Check Left/Right/Top/Bottoms borders now removed to allow player to use doors

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

  // Setup Method to load the zone data
  /* This method takes a zone object loaded from a zoneXX.json file. It sets all the
  world values to the values in zone. If the player just passed through a door, it uses
  the this.door variable to change the player's location to wherever that door's
  destination goes. */
  setup: function(zone) {
    // TODO UPDATE

    // Get the new maps and reset the doors
    this.zoneID = zone.id;
    this.doors = new Array();
    this.columns = zone.columns;
    this.rows = zone.rows;
    this.graphicalMap = zone.graphicalMap;
    this.collisionMap = zone.collisionMap;

    // Generate the doors
    for (let index = zone.doors.length - 1; index > -1; --index) {
      let door = zone.doors[index];
      this.doors[index] = new Game.Door(door);
    }

    // Check if player has just come through a door
    /* If the player entered into a door, this.door will reference that door and here
    it will be used to set the player's location to the door's destination. */
    if (this.door) {
      /* If destinationX or Y is equal to -1, that means it won't be used. Since each zone
      spans from 0 to its width and height, any negative number would be invalid. If
      a door's destination is -1, the player will keep his current position for that axis. */
      if (this.door.destinationX !== -1) {
        this.player.setCentreX(this.door.destinationX);
        this.player.setOldCentreX(this.door.destinationX);  // It's important to reset the old position as well
      }

      if (this.door.destinationY !== -1) {
        this.player.setCentreY(this.door.destinationY);
        this.player.setOldCentreY(this.door.destinationY);
      }

      // Reset this.door once player is moved to new location
      this.door = undefined;
    }
  },

  // Generic Method to update the player position & movement, check for collisions and then update the animation based on the player's final condition
  update: function() {
    // TODO UPDATE
    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    // Check for any door collisions
    /* This loops through all the doors in the current zone and checks to see if the
    player is colliding with any. If it does collide with one, this sets the world's
    door property to that door, and it is used to load the next zone. */
    for (let index = this.doors.length - 1; index > -1; --index) {
      let door = this.doors[index];
      if (door.collideObject(this.player)) {
        this.door = door;
      }
    }

    this.player.updateAnimation();
  }
};
