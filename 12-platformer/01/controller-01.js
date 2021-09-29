"use strict";

/*
Copyright (c) Frank Poth 2018
In this example, the controller only alerts the user whenever they press a key,
but it also defines the ButtonInput class, which is used for tracking button states.
*/

const Controller = function() {
  this.down = new Controller.ButtonInput();
  this.left = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up = new Controller.ButtonInput();

  // KeyDownUp Method to track key press
  this.keyDownUp = function(event) {
    const down = (event.type === "keydown") ? true : false;

    // Check Key Pressed and update button
    switch (event.code) {
      case "ArrowLeft":
        this.left.getInput(down);
        break;
      case "ArrowUp":
        this.up.getInput(down);
        break;
      case "ArrowRight":
        this.right.getInput(down);
        break;
      case "ArrowDown":
        this.down.getInput(down);
    }

    // Display an alert of which key was pressed
    alert(`You pressed the '${event.code}' key!`);

    // Log current keypresses
    // console.log(`DOWN? L:${this.left.down}; R:${this.right.down}; U:${this.up.down}; D:${this.down.down} / ACTIVE? L:${this.left.active}; R:${this.right.active}; U:${this.up.active}; D:${this.down.active}`);

  };

  // HandleKeyDownUp Method
  this.handleKeyDownUp = (event) => {
    this.keyDownUp(event);
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
