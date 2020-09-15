const io = require("socket.io")();
const { createGameState, gameLoop, getUpdatedVel } = require("./game");
const { FRAME_RATE } = require("./constants");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  const state = createGameState();
  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);
  client.on("joinGame", handleJoinGame);


  function handleNewGame(){
    let roomName = makeId(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName)
    console.log("new");

    state[roomName] = initGame();

    client.join(roomName);
    // placeholder for client player number
    client.number = 1;
    client.emit('init', 1)
  }

  function handleJoinGame(){
    const room = io.sockets.adapter.rooms[gameCode];
    let allUsers;
    if (room){
        allUsers = room.sockets;
    }
    let numClients = 0;
    if (allUsers){
        numClients = Object.keys(allUsers).length
    }
    if(numClients === 0){
        client.emit('unknownGame');
        return;
    }else if (numClients > 1){
        client.emit('tooManyPlayers');
        return;
    }
    clientRooms[client.id] = gameCode;
    client.join(gameCode);
    // player number is now number 2
    client.number = 2;
    client.emit('init', 2);
    
    startGameInterval(gameCode);
  }
  //   defining handleKeydown here because we want access to client. could also use bind
  function handleKeydown(key) {
    try {
      console.log(key);
      key = key.toString();
      //  key = parseInt(key);
    } catch (e) {
      console.log("ERROR");
      console.error(e);
      return;
    }
    const vel = getUpdatedVel(key);
    if (vel) {
      state.player.vel = vel;
    }
  }
//   startGameInterval(client, state);
  // client.emit('init', {data: 'hello, world'})
});
function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    //   establishing winner or loser for pvp. 1 means player 1 means, 2 is player 2, while 0 is continue. Without multiplayer, this would be a boolean value
    const winner = gameLoop(state[roomName]);
    if (!winner) {

      client.emit("gameState", JSON.stringify(state));
    } else {
      client.emit("gameOver");
      // console.log('game over')
      clearInterval(intervalId);
    }
    // 1000 ms
  }, 1000 / FRAME_RATE);
}
io.listen(3000);


need to emit game state in startGame Interval next. needs global state and roomName parameter 