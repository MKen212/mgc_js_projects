"use strict";

/*
Copyright (c) Frank Poth 2018
This Display class contains new methods to draw a rectangle to the buffer and fill the
the whole canvas. The resize function has been updated to resize based on parameters and
the resize event handler is moved to the Main class as it now has input from multiple
other classes.
*/

const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");  // Pre-render canvas buffer
  this.context = canvas.getContext("2d");  // Live canvas

  // DrawRectangle Method to draw a rectangle of specific size to the buffer canvas
  this.drawRectangle = function(x, y, width, height, colour) {
    this.buffer.fillStyle = colour;
    this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height);
  };

  // Fill Method to fill the buffer canvas (background) with a solid colour
  this.fill = function(colour) {
    this.buffer.fillStyle = colour;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  };

  // Render Method to draw buffer to live canvas
  this.render = function() {
    this.context.drawImage(this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height);
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
  constructor : Display
};
