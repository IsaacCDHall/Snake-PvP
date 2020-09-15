const io = require("socket.io")();
const { createGameState, gameLoop } = require("./game");
const { FRAME_RATE } = require("./constants");

io.on("connection", (client) => {
  const state = createGameState();

  stateGameInterval(client, state);
  // client.emit('init', {data: 'hello, world'})
});
function stateGameInterval(client, state) {
  const intervalId = setInterval(() => {
    //   establishing winner or loser for pvp. 1 means player 1 means, 2 is player 2, while 0 is continue. Without multiplayer, this would be a boolean value
    const winner = gameLoop(state);
    console.log("int");
    if (!winner) {
      client.emit("gameState", JSON.stringify(state));
    } else {
      client.emit("gameOver");
      console.log('game over')
      clearInterval(intervalId);
    }
    // 1000 ms
  }, 1000 / FRAME_RATE);
}
io.listen(3000);
