const BG_COLOR = "#231f20";
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOR = "#e66916";

const socket = io("http://localhost:3000");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initalScreen");
const newGameButton = document.getElementById("newGameButton");
const joinGameButton = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameButton.addEventListener("event", newGame);
joinGameButton.addEventListener("event", joinGame);
function newGame() {
  socket.emit("newGame");
  init();
}
function joinGame() {
  const code = gameCodeDisplay.value;
  socket.emit("joinGame", code);
  init();
}

let canvas, ctx, playerNumber;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block"
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.height = canvas.height = 600;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
}
function keydown(e) {
  console.log(e.key);
  console.log("hello");
  socket.emit("keydown", e.key);
}
// move init to new or join game button clicks
// init();

function paintGame(state) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOR;
  //convert gamespace food.x to pixel space to draw rec on canvas. Size is how many pixels = one square in game space
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.player, size, SNAKE_COLOR);
}

function paintPlayer(playerState, size, color) {
  const snake = playerState.snake;

  ctx.fillStyle = color;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}
function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  // console.log('parsed' + gameState)
  requestAnimationFrame(() => paintGame(gameState));
  paintGame(gameState);
}
function handleGameOver() {
  console.log("Handle game over");
}
function handleGameCode() {
  gameCodeDisplay.innerText = gameCode;
  console.log("Handle game over");
}
