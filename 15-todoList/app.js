"use strict";
// 15 - ToDo List JS

// tasker Object App
const tasker = {
  // Function to initialise the app
  init: function() {
    this.cacheDom();
    this.bindEvents();
    this.evalTaskList();
  },

  // Function to get HTML Elements
  cacheDom: function() {
    this.taskInput = document.getElementById("taskInput");
    this.addBtn = document.getElementById("addTaskBtn");
    this.taskList = document.getElementById("taskList");
    this.taskListChildren = this.taskList.children;
    this.errorMessage = document.getElementById("errorMessage");
  },

  // Function to add event listeners to add button and task input
  bindEvents: function() {
    this.addBtn.onclick = this.addTask.bind(this);
    this.taskInput.onkeypress = this.enterKey.bind(this);
  },

  // Function to loop over task list and add event listeners
  evalTaskList: function() {
    for (let i = 0; i < this.taskListChildren.length; i++) {
      // Add click event listener to task checkbox
      const chkBox = this.taskListChildren[i].getElementsByTagName("input")[0];
      chkBox.onclick = this.completeTask.bind(this, this.taskListChildren[i], chkBox);
      // Add click event listener to task delete button
      const delBtn = this.taskListChildren[i].getElementsByTagName("button")[0];
      delBtn.onclick = this.delTask.bind(this, i);
    }
  },

  // Function to create a new task <li> element and add it to the task list
  render: function() {
    const taskLi = document.createElement("li");
    taskLi.className = "task";
    // Add Checkbox as <input> element
    const taskChkBox = document.createElement("input");
    taskChkBox.className = "task-chkbox";
    taskChkBox.type = "checkbox";
    // Add Task Text
    const taskVal = document.createTextNode(this.taskInput.value);
    // Add Delete <Button>
    const taskBtn = document.createElement("button");
    taskBtn.className = "task-btn";
    // Add Trash Icon
    const taskTrash = document.createElement("i");
    taskTrash.className = "fa fa-trash";
    // Insert Trash Icon into Button
    taskBtn.appendChild(taskTrash);

    // Append elements to <li> task
    taskLi.appendChild(taskChkBox);
    taskLi.appendChild(taskVal);
    taskLi.appendChild(taskBtn);

    // Add task to <ul> task list
    this.taskList.appendChild(taskLi);
  },

  // Function to mark a task as completed
  completeTask: function(element, chkBox) {
    if (chkBox.checked) {
      element.className = "task completed";
    } else {
      this.uncompleteTask(element);
    }
  },

  // Function to make a task as not completed
  uncompleteTask: function(element) {
    element.className = "task";
  },
  
  // Function to trigger the addTask() function if "Enter" key is pressed
  enterKey: function(event) {
    if (event.key === "Enter") {
      this.addTask();
    }
  },


  // Function to add a task to the task list
  addTask: function() {
    const value = this.taskInput.value;
    this.errorMessage.style.display = "none";

    // Check if input value is empty
    if (value === "") {
      this.error();
    } else {
      // Create new task, refresh task list and clear input
      this.render();
      this.evalTaskList();
      this.taskInput.value = "";
      this.taskInput.focus();
    }
  },

  // Function to delete a task from the task list
  delTask: function(i) {
    this.taskList.children[i].remove();
    this.evalTaskList();
  },

  // Function to show the error message when no data input
  error: function() {
    this.errorMessage.style.display = "block";
  }
};

tasker.init();
