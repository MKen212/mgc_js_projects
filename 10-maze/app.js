/* globals $ */
"use strict";
// 10 - Maze JS

// Global Variables
let player;  // Player Object
let playerImg;  // Player Image
let endImg;  // End Image
let maze;  // Maze Object
let draw;  // Drawing Object
let cellSize;  // Cell Size of maze
let difficulty;  // Difficulty level of game

// Get canvas HTML Element & context
const canvas = document.getElementById("mazeCanvas");
const context = canvas.getContext("2d");


// Constructor Function for the Maze object
function Maze(Width, Height) {
  const width = Width;  // Maze Width
  const height = Height;  // Maze Height
  const directions = ["n", "s", "e", "w"];  // Array of possible directions
  const modifyDirection = {  // Object to define modification of coords by direction
    n: {x: 0, y: -1, o: "s"},
    s: {x: 0, y: 1, o: "n"},
    e: {x: 1, y: 0, o: "w"},
    w: {x: -1, y: 0, o: "e"}
  };
  let mazeMap = [];  // Array for Maze Map
  let startCoord;  // Starting coordinate
  let endCoord;  // Ending coordinate

  this.map = function() {  // Method to return Maze Map
    return mazeMap;
  };

  this.startCoord = function() {  // Method to return Starting coordinate
    return startCoord;
  };

  this.endCoord = function() {  // Method to return Ending coordinate
    return endCoord;
  };

  function genMap() {  // Function to generate an empty maze map with all directions blocked
    mazeMap = new Array(height);
    for (let y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        mazeMap[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null
        };
      }
    }
  }

  function defineStartEnd() {  // Function to define the Start and End Point of the maze
    switch (rand(4)) {
      case 0:
        startCoord = {x: 0, y: 0};  // Top Left
        endCoord = {x: width - 1, y: height - 1};  // Bottom Right
        break;
      case 1:
        startCoord = {x: 0, y: height - 1};  // Bottom Left
        endCoord = {x: width - 1, y: 0};  // Top Right
        break;
      case 2:
        startCoord = {x: width - 1, y: 0};  // Top Right
        endCoord = {x: 0, y: height - 1};  // Bottom Left
        break;
      case 3:
        startCoord = {x: width - 1, y: height - 1};  // Bottom Right
        endCoord = {x: 0, y: 0};  // Top Left
        break;
    }
  }

  function defineMaze() {  // Function to construct the maze within the map
    let isComplete = false;  // Flag to track if maze complete
    let move = false;  // Flag to track move
    let cellsVisited = 1;  // Number of cells visited
    let numLoops = 0;  // Number of times looped over cell
    let maxLoops = 0;  // Maximum number of loops
    let pos = {x: 0, y: 0};  // Current position
    let numCells = width * height;  // Total number of cells in maze

    // Continue looping until maze complete
    while (!isComplete) {
      move = false;
      mazeMap[pos.x][pos.y].visited = true;  // Set current pos as "visited"

      // Randomly shuffle the directions to move
      if (numLoops >= maxLoops) {
        shuffle(directions);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;

      // Loop through the directions to draw a path
      for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const nextX = pos.x + modifyDirection[direction].x;
        const nextY = pos.y + modifyDirection[direction].y;

        // Ensure next positions are within the maze borders
        if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
          // Check if the tile is already visited
          if (!mazeMap[nextX][nextY].visited) {
            // Carve through the walls from this tile to the next on both sides
            mazeMap[pos.x][pos.y][direction] = true;
            mazeMap[nextX][nextY][modifyDirection[direction].o] = true;

            // Set Current Cell as Next Cells Prior Visited
            mazeMap[nextX][nextY].priorPos = pos;

            // Move current position to new position & Update Cells Visited
            pos = {x: nextX, y: nextY};
            cellsVisited++;

            // Recursively call this method on the next tile
            move = true;
            break;
          }
        }
      }

      // If it failed to find a direction move back to the prior cell and restart
      if (!move) {
        pos = mazeMap[pos.x][pos.y].priorPos;
      }

      // Check if completed
      if (cellsVisited === numCells) {
        isComplete = true;
      }
    }
  }

  genMap();  // Generate Blank Maze
  defineStartEnd();  // Define Random Start and End Positions
  defineMaze();  // Define Random Maze
}

// Constructor Function to draw the maze on the canvas
function DrawMaze(Maze, CellSize, EndSprite = null) {
  const map = Maze.map();  // Map to be drawn
  let cellSize = CellSize;  // Cell Size based on canvas
  context.lineWidth = cellSize / 40;
  
  // Set drawEnd method to be used depending on whether sprite image supplied
  const drawEnd = (EndSprite != null) ? drawEndSprite : drawEndFlag;

  this.redrawMaze = function(size) {  // Method to redraw maze
    cellSize = size;
    context.lineWidth = cellSize / 50;
    drawMap();
    drawEnd();
  };
  
  function drawMap() {  // Function to draw the whole maze map
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }

  function drawCell(xCoord, yCoord, cell) {  // Function to draw an individual cell
    const x = xCoord * cellSize;
    const y = yCoord * cellSize;

    if (cell.n === false) {
      // Draw Line across top
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + cellSize, y);
      context.stroke();
    }
    if (cell.s === false) {
      // Draw Line across bottom
      context.beginPath();
      context.moveTo(x, y + cellSize);
      context.lineTo(x + cellSize, y + cellSize);
      context.stroke();
    }
    if (cell.e === false) {
      // Draw Line to right
      context.beginPath();
      context.moveTo(x + cellSize, y);
      context.lineTo(x + cellSize, y + cellSize);
      context.stroke();
    }
    if (cell.w === false) {
      // Draw Line to left
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + cellSize);
      context.stroke();
    }
  }

  function drawEndSprite() {  // Function to draw the end sprite, if supplied
    const offsetLeft = cellSize / 50;
    const offsetRight = cellSize / 25;
    const coord = Maze.endCoord();
    context.drawImage (
      EndSprite,
      2,
      2,
      EndSprite.width,
      EndSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function drawEndFlag() {  // Function to draw an end flag if no sprite supplied
    const coord = Maze.endCoord();
    const gridSize = 4;
    const fraction = cellSize / gridSize - 2;
    let colourSwap = true;

    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 === 0) {
        colourSwap = !colourSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        context.beginPath();
        context.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colourSwap) {
          context.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          context.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        context.fill();
        colourSwap = !colourSwap;
      }
    }
  }

  function clear() {  // Function to clear the canvas
    const canvasSize = cellSize * map.length;
    context.clearRect(0, 0, canvasSize, canvasSize);
  }

  clear();  // Clear Canvas
  drawMap();  // Draw the Map
  drawEnd();  // Draw the Goal
}

// Constructor function for the Player
function Player(Maze, CellSize, OnComplete, PlayerSprite = null) {
  const map = Maze.map();  // Map
  let cellSize = CellSize;  // Cell Size based on canvas
  let halfCellSize = cellSize / 2;
  let moves = 0;  // Players moves
  let player = this;
  let position = {x: Maze.startCoord().x, y: Maze.startCoord().y};  // Player Position
  
  // Set drawPlayer method to be used depending on whether sprite supplied
  const drawPlayer = (PlayerSprite != null) ? drawSprite : drawCircle;

  this.redrawPlayer = function(size) {  // Method to redraw player
    cellSize = size;
    drawPlayer(position);
  };

  this.bindKeyDown = function() {  // Method to add "keydown" event listener
    window.addEventListener("keydown", checkKey, false);

    // Function to handle jQuery Mobile "Swipe" event
    $("#view").swipe({
      // eslint-disable-next-line no-unused-vars
      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
        console.log(direction);
        switch (direction) {
          case "up":
            checkKey({code: "ArrowUp"});
            break;
          case "down":
            checkKey({code: "ArrowDown"});
            break;
          case "left":
            checkKey({code: "ArrowLeft"});
            break;
          case "right":
            checkKey({code: "ArrowRight"});
            break;
        }
      },
      threshold: 0
    });
  };

  this.unbindKeyDown = function() {  // Method to remove "keydown" event listener
    window.removeEventListener("keydown", checkKey, false);

    // Remove jQuery Swipe event
    $("#view").swipe("destroy");
  };

  function checkKey(key) {  // Function to check and action the key press
    const cell = map[position.x][position.y];
    switch (key.code) {
      case "ArrowUp":
      case "KeyW":
        if (cell.n === true) {
          removePlayer(position);
          position = {x: position.x, y: position.y - 1};
          moves++;
          drawPlayer(position);
        }
        break;
      case "ArrowDown":
      case "KeyS":
        if (cell.s === true) {
          removePlayer(position);
          position = {x: position.x, y: position.y + 1};
          moves++;
          drawPlayer(position);
        }
        break;
      case "ArrowLeft":
      case "KeyA":
        if (cell.w === true) {
          removePlayer(position);
          position = {x: position.x - 1, y: position.y};
          moves++;
          drawPlayer(position);
        }
        break;
      case "ArrowRight":
      case "KeyD":
        if (cell.e === true) {
          removePlayer(position);
          position = {x: position.x + 1, y: position.y};
          moves++;
          drawPlayer(position);
        }
        break;
    }
  }

  function drawSprite(coord) {  // Function to draw the player sprite, if supplied
    const offsetLeft = cellSize / 50;
    const offsetRight = cellSize / 25;
    context.drawImage(
      PlayerSprite,
      0,
      0,
      PlayerSprite.width,
      PlayerSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    // Check if end point reached
    if (coord.x === Maze.endCoord().x && coord.y === Maze.endCoord().y) {
      OnComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawCircle(coord) {  // Function to draw a circle if no sprite supplied
    context.beginPath();
    context.fillStyle = "yellow";
    context.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    context.fill();
    // Check if end point reached
    if (coord.x === Maze.endCoord().x && coord.y === Maze.endCoord().y) {
      OnComplete(moves);
      player.unbindKeyDown();
    }
  }

  function removePlayer(coord) {  // Function to remove the player from the canvas
    const offsetLeft = cellSize / 50;
    const offsetRight = cellSize / 25;
    context.clearRect(
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  drawPlayer(Maze.startCoord());  // Draw Player at Start
  this.bindKeyDown();  // Activate the "keydown" event listener
}


// Function to get a random number up to "max"
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Function to Shuffle an array
function shuffle(arr) {
  for (let i = arr.length -1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Function to load an image
function loadImage(path, brightness = null) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = path;
    img.onload = () => {
      if (brightness != null) {
        img = changeBrightness(img, brightness);
      }
      resolve(img);
    };
  });
}

// Function to change the brightness of a sprite by a factor
function changeBrightness(sprite, factor) {
  // Create a Virtual <canvas> element
  const virtualCanvas = document.createElement("canvas");
  virtualCanvas.width = 500;
  virtualCanvas.height = 500;
  const virtualContext = virtualCanvas.getContext("2d");
  // Draw the sprite onto it
  virtualContext.drawImage(sprite, 0, 0, 500, 500);
  // Get the image data and loop through it to update it by the factor
  let imgData = virtualContext.getImageData(0, 0, 500, 500);
  // console.log(imgData);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = (imgData.data[i] * factor);
    imgData.data[i + 1] = (imgData.data[i + 1] * factor);
    imgData.data[i + 2] = (imgData.data[i + 2] * factor);
  }
  // console.log(imgData);
  // Replace the virtual image on the canvas
  virtualContext.putImageData(imgData, 0, 0);
  // Create a new image from the canvas & return it
  var spriteReturn = new Image();
  spriteReturn.src = virtualCanvas.toDataURL();
  virtualCanvas.remove();
  return spriteReturn;
}

// Function to display a message
function displayMessage(moves) {
  const movesEl = document.getElementById("moves");
  movesEl.textContent = `You moved ${moves} steps.`;
  toggleVisibility("messageContainer");
}

// Function to toggle the visibility of an element
function toggleVisibility(element) {
  const toggleEl = document.getElementById(element);
  if (toggleEl.style.visibility === "visible") {
    toggleEl.style.visibility = "hidden";
  } else {
    toggleEl.style.visibility = "visible";
  }
}

// Function to start the game
function startGame() {
  // Clear Player if not undefined
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  // Set Difficulty
  const levelSelected = document.getElementById("levelSelect");
  difficulty = levelSelected.options[levelSelected.selectedIndex].value;
  // Set global values and build maze
  cellSize = canvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, cellSize, endImg);
  player = new Player(maze, cellSize, displayMessage, playerImg);
  // Show maze
  const mazeContainer = document.getElementById("mazeContainer");
  if (mazeContainer.style.opacity < "100") {
    mazeContainer.style.opacity = "100";
  }
}

// Window Load Function to set-up the game
window.onload = async function() {
  // Get & Fix Canvas size
  const viewWidth = $("#view").width();
  const viewHeight = $("#view").height() - 20;
  if (viewHeight < viewWidth) {
    context.canvas.width = viewHeight - viewHeight / 100;
    context.canvas.height = viewHeight - viewHeight / 100;
  } else {
    context.canvas.width = viewWidth - viewWidth / 100;
    context.canvas.height = viewWidth - viewWidth / 100;
  }
  // Load the images
  playerImg = await loadImage("./images/pickle.png");
  endImg = await loadImage("./images/lettuce.png");
  // Start the game
  startGame();
};

// Function in case of Window Resize
window.onresize = function () {
  // Get & Fix Canvas size
  const viewWidth = $("#view").width();
  const viewHeight = $("#view").height() - 20;
  if (viewHeight < viewWidth) {
    context.canvas.width = viewHeight - viewHeight / 100;
    context.canvas.height = viewHeight - viewHeight / 100;
  } else {
    context.canvas.width = viewWidth - viewWidth / 100;
    context.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = canvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};
