"use strict";

/*
Copyright (c) Frank Poth 2018
The Controller class is being used to handle user input. It contains the keyDownUp method
that checks to see if the ArrowLeft, ArrowRight or ArrowUp keys are pressed on the
keyboard and then sets their "active" and "down" properties respectively. The event
handler for this can be found in the Main class.
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
