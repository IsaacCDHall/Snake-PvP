const { GRID_SIZE } = require("./constants");

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVel,
};
function initGame() {
  const state = createGameState();
  randomFood(state);
  return state;
}
function createGameState() {
  return (gameState = {
    player: {
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 },
      ],
    },
    food: {
      x: 4,
      y: 3,
    },
    gridsize: GRID_SIZE,
  });
}

function gameLoop(state) {
  if (!state) {
    return;
  }
  const playerOne = state.player;

  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  // If player one is outside constraints of map
  if (
    playerOne.pos.x < 0 ||
    playerOne.pos.x >= GRID_SIZE ||
    playerOne.pos.y < 0 ||
    playerOne.pos.y >= GRID_SIZE
  ) {
    return 2;
  }
  // conditional for checking if player One is eating food
  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    for (let cell of playerOne.snake) {
      //   conditional to check if player 1 snake collides into own tail
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        return 2;
      }
    }
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }
  return false;
}
function randomFood(state) {
  food = {
    // generates number between 1 and grid size, floors it for whole integer round down
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
  // verify that food tile isnt on top of existing snake
  for (let cell of state.player.snake) {
    if (cell.x === food.x && cell.y === food.y) {
      // recursively call this until we place food somewhere
      return randomFood(state);
    }
  }
  state.food = food;
}

function getUpdatedVel(key) {
  switch (key) {
    case "ArrowLeft": {
      return { x: -1, y: 0 };
    }
    case "ArrowRight": {
      return { x: 1, y: 0 };
    }
    case "ArrowUp": {
      return { x: 0, y: -1 };
    }
    case "ArrowDown": {
      return { x: 0, y: 1 };
    }
    default: {
      console.log(key);
    }
  }
}
