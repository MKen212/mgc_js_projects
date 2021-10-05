"use strict";

/*
Copyright (c) Frank Poth 2018
This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display.
*/

const Display = function(canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");  // Pre-render canvas buffer
  this.context = canvas.getContext("2d");  // Live canvas

  // BufferColour Method to fill the buffer canvas with a solid colour
  this.bufferColour = function(colour) {
    this.buffer.fillStyle = colour;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  };

  // Render Method to draw buffer to live canvas
  this.render = function() {
    this.context.drawImage(this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height);
  };

  // Resize Method to re-render display if window is re-sized
  this.resize = function() {
    // Resize canvas
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    this.context.canvas.height = height - 32;
    this.context.canvas.width = width - 32;
    // Rerender canvas
    this.render();
  };

  // HandleResize Method
  this.handleResize = (event) => {
    this.resize(event);
  };
};

Display.prototype = {
  constructor : Display
};
