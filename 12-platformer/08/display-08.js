"use strict";

/*
Copyright (c) Frank Poth 2018
The Display class is used to handle the output to the screen via the canvas. It has
methods to draw the map and other objects to the buffer canvas and to the render these
onto the main canvas. It also has the method to resize the canvas when the screen is
resized, with the event handler for this being in the Main class
*/

const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");  // Pre-render canvas buffer
  this.context = canvas.getContext("2d");  // Live canvas

  // DrawMap Method to draw the Map using the images passed as parameters
  /* NOTE: Technically the image could also have it's own size, but as these are square
  images going to square tiles you can use the same tileSize value for both */
  this.drawMap = function(image, imageColumns, map, mapColumns, tileSize) {
    for (let index = map.length - 1; index > -1; --index) {
      const value = map[index];
      let sourceX = (value % imageColumns) * tileSize;
      let sourceY = Math.floor(value / imageColumns) * tileSize;
      let destinationX = (index % mapColumns) * tileSize;
      let destinationY = Math.floor(index / mapColumns) * tileSize;

      this.buffer.drawImage(image, sourceX, sourceY, tileSize, tileSize, destinationX, destinationY, tileSize, tileSize);
    }
  };

  // DrawObject Method to draw an Object (the player) using the images passed as parameters
  this.drawObject = function(image, sourceX, sourceY, destinationX, destinationY, width, height) {
    this.buffer.drawImage(image, sourceX, sourceY, width, height, Math.round(destinationX), Math.round(destinationY), width, height);
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
