const express = require("express");

const PORT = 5000;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const axios = require("axios").default;

const cors = require("cors");
app.use(cors());
//defining a namespace to link to front end
const quiz = io.of("/quiz");

//listening for the front end connections to localhost:5000/quiz
//socket is an object so you could get out the id etc (maybe!!)
//the emit sends the message to all sockets in the quizspace
//playerconnected is an event that will happen when we code it on the front end

let numberOfPlayers = 0;

let currentQuestions = [];
let users = [];
let connections = [null, null];

function handleConnection(socket, playerIndex) {
  numberOfPlayers++;
}

function addUsername({ username }) {
  const newUser = { username: username, playerId: numberOfPlayers };
  users.push(newUser);
  console.log("users:", users);
}

async function getQuestion(category) {
  const response = await axios(
    `https://opentdb.com/api.php?amount=10&category=${category}`
  );
  return response.data.results;
}

quiz.on("connection", (socket) => {
  let playerIndex = -1;

  for (let i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
    }
  }

  quiz.emit("playerConnected", {
    success: true,
    payload: { message: "You have joined the quiz", id: playerIndex },
  });

  if (playerIndex == -1) {
    return;
  }

  connections[playerIndex] = socket.id;

  console.log(connections);

  socket.on("setUsername", (username) => {
    addUsername(username);
  });

  if (numberOfPlayers === 1) {
    socket.on("setCategory", async (category) => {
      console.log("Client is setting the category");
      const questions = await getQuestion(category.categoryID);
      currentQuestions = questions;
      quiz.emit("chosenQuestions", { currentQuestions });
    });
  }
  if (numberOfPlayers > 1) {
    quiz.emit("chosenQuestions", { currentQuestions });
  }

  socket.on("disconnect", function () {
    console.log(`Player ${playerIndex} Disconnected`);
    connections[playerIndex] = null;
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
