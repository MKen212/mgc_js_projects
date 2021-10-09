"use strict";

/*
Copyright (c) Frank Poth 2018
This Display class contains the new TileSheet class that is used to load the sprite sheet
PNG into an <image> element and store its dimensions. The original drawRectangle() and
fill() methods are replaced with drawMap() and drawPlayer() methods. The render() method
is moved to the Display.prototype as this is generic for all the elements
*/

const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");  // Pre-render canvas buffer
  this.context = canvas.getContext("2d");  // Live canvas

  this.tileSheet = new Display.TileSheet(16, 8);  // TileSheet Sprite Image

  // DrawMap Method to draw the Map using the specific images from the TileSheet
  this.drawMap = function(map, columns, tileSize) {
    for (let index = map.length - 1; index > -1; --index) {
      const value = map[index];
      let sourceX = (value % this.tileSheet.columns) * this.tileSheet.tileSize;
      let sourceY = Math.floor(value / this.tileSheet.columns) * this.tileSheet.tileSize;
      let destinationX = (index % columns) * tileSize;
      let destinationY = Math.floor(index / columns) * tileSize;

      this.buffer.drawImage(this.tileSheet.image, sourceX, sourceY, this.tileSheet.tileSize, this.tileSheet.tileSize, destinationX, destinationY, tileSize, tileSize);
    }
  };

  // DrawPlayer Method to draw the player as a double-colour square
  this.drawPlayer = function(rectangle, colour1, colour2) {
    this.buffer.fillStyle = colour1;
    this.buffer.fillRect(Math.floor(rectangle.x), Math.floor(rectangle.y), rectangle.width, rectangle.height);
    this.buffer.fillStyle = colour2;
    this.buffer.fillRect(Math.floor(rectangle.x + 2), Math.floor(rectangle.y + 2), rectangle.width - 4, rectangle.height - 4);
  };
  
  // Resize Method to alter the canvas size if the window is re-sized
  this.resize = function(width, height, heightWidthRatio) {
    // Resize canvas keeping the same "world" aspect ratio
    if (height / width > heightWidthRatio) {
      this.context.canvas.height = width * heightWidthRatio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / heightWidthRatio;
    }

    this.context.imageSmoothingEnabled = false;
  };
};

Display.prototype = {
  constructor : Display,

  // Render Method to draw buffer to live canvas
  render: function() {
    this.context.drawImage(this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height);
  },
};


// TileSheet Class
Display.TileSheet = function(tileSize, columns) {
  this.image = new Image();
  this.tileSize = tileSize;
  this.columns = columns;
};

Display.TileSheet.prototype = {};
