"use strict";

/*
Copyright (c) Frank Poth 2018
To keep this example from looking too boring, the game logic gradually changes
some color values which then get drawn to the display canvas during the loop.
*/

const Game = function() {
  this.colour = "rgb(0, 0, 0)";  // Set colour to be black initially
  this.colours = [0, 0, 0];  // Array of initial three colour settings
  this.shifts = [1, 1, 1];  // Array of next three colour settings

  // Update Method to update the colours to the next settings
  this.update = function() {
    for (let index = 0; index < 3; index++) {
      let colour = this.colours[index];
      let shift = this.shifts[index];

      // Reset shift if colour will be outside 0-255 range
      // If negative make +1 to +3; if positive make -1 to -3
      if (colour + shift > 255 || colour + shift < 0) {
        shift = (shift < 0) ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * -2) -1;
      }

      // Update colour setting with shift value
      colour += shift;
      this.colours[index] = colour;
      this.shifts[index] = shift;
    }

    // Update overall colour
    this.colour = `rgb(${this.colours[0]}, ${this.colours[1]}, ${this.colours[2]})`;

    // Log colours
    // console.log(this.colour);
    // console.log(this.shifts);
  };
};

Game.prototype = {
  constructor: Game
};
