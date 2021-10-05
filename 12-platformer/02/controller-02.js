"use strict";

/*
Copyright (c) Frank Poth 2018
This Controller class contains an updated keyDownUp function (excluding the ArrowDown key)
and no longer alerts the user to a button press. The keyDownUp event handler has been
moved to the Main class.
*/

const Controller = function() {
  this.left = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up = new Controller.ButtonInput();

  // KeyDownUp Method to track key press
  this.keyDownUp = function(type, code) {
    const down = (type === "keydown") ? true : false;

    // Check Key Pressed and update button
    switch (code) {
      case "ArrowLeft":
        this.left.getInput(down);
        break;
      case "ArrowRight":
        this.right.getInput(down);
        break;
      case "ArrowUp":
        this.up.getInput(down);
    }
  };
};

Controller.prototype = {
  constructor: Controller
};

// ButtonInput Class for tracking button states
Controller.ButtonInput = function() {
  this.active = false;
  this.down = false;
};

Controller.ButtonInput.prototype = {
  constructor : Controller.ButtonInput,

  getInput: function(down) {
    if (this.down != down) this.active = down;
    this.down = down;
  }
};
