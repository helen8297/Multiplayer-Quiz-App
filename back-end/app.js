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

function handlePlayers() {
  numberOfPlayers++;
  console.log("num of players" + numberOfPlayers);
}

async function getQuestion(category) {
  const response = await axios(
    `https://opentdb.com/api.php?amount=10&category=${category}`
  );
  return response.data.results;
}

quiz.on("connection", (socket) => {
  handlePlayers();
  console.log(socket.id);
  quiz.emit("playerConnected", {
    success: true,
    payload: "You have joined the quiz",
  });
  //listen for the event datafromplayer from the front end
  if (numberOfPlayers === 1) {
    socket.on("setCategory", async (category) => {
      const questions = await getQuestion(category.categoryID);
      currentQuestions = questions;
      quiz.emit("chosenQuestions", { currentQuestions });
    });
  }
  if (numberOfPlayers > 1) {
    quiz.emit("chosenQuestions", { currentQuestions });
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
