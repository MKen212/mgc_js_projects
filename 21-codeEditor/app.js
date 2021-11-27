/* global $ Prism */
"use strict";
// 21 - Code Editor JS

// Build the App with a constructor function
const MicroCode = (function() {
  return {
    //Initialise function
    init: function(inputSel, outputSel, languageSel) {
      this.focusInput(inputSel);
      this.listenForInput(inputSel, outputSel);
      this.listenForLanguage(languageSel, outputSel, inputSel);
      this.renderOutput(outputSel, $(inputSel)[0].value);
      this.listenerForScroll(inputSel, outputSel);
    },

    // Function to set the focus for input
    focusInput: function(inputSel) {
      const input = $(inputSel);

      // Focus on input element
      input.focus();

      // Ensure there is no text selected
      input[0].selectionStart = input[0].value.length;
      input[0].selectionEnd = input[0].value.length;
    },

    // Function to process input
    listenForInput: function(inputSel, outputSel) {
      const self = this;

      // Add Input & Keydown Event Listeners
      $(inputSel).on("input keydown", function(key){
        const input = this;
        const selStartPos = input.selectionStart;
        const inputVal = input.value;

        // Replace Tab Key Press with 4 spaces
        if (key.keyCode === 9) {
          input.value = inputVal.substring(0, selStartPos) + "    " + inputVal.substring(selStartPos, input.value.length);
          input.selectionStart = selStartPos + 4;
          input.selectionEnd = selStartPos + 4;
          key.preventDefault();  // Stop from tab moving out of input box
        }

        // Update output
        self.renderOutput(outputSel, this.value);
      });

      // Run syntax highlighting
      Prism.highlightAll();
    },

    // Function to handle programming language change
    listenForLanguage: function(languageSel, outputSel, inputSel) {
      const self = this;

      // Add Change Event Listener
      $(languageSel).on("change", function() {
        // Change the class of <code> to match the chosen language
        $("code", outputSel)
          .removeClass()
          .addClass("language-" + this.value)
          .removeAttr("data-language");
        
        // Change the class of .code-output to match the chosen language
        $(outputSel)
          .removeClass()
          .addClass("code-output language-" + this.value);

        // Clear the .code-input of content
        $(inputSel)
          .val("");
        
        // Clear the <code> and .code-output of content
        $("code", outputSel)
          .html("");
        
        // Set the focus back to the input element
        self.focusInput(inputSel);
      });
    },

    // Function to update the output element
    renderOutput: function(outputSel, value) {
      $("code", outputSel)
        // Replace &, <, > with HTML code for these
        .html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
      
      Prism.highlightAll();
    },

    // Function to handle scrolling
    listenerForScroll: function(inputSel, outputSel) {
      // Add Scroll Event Listener
      $(inputSel).on("scroll", function() {
        // console.log(this.scrollTop);
        // Move .code-output to match .code-input
        $(outputSel)[0].scrollTop = this.scrollTop;
      });
    }
  };
})();

MicroCode.init(".code-input", ".code-output", ".language");
