import React, { useState, useEffect } from "react";
import Question from "../Question";
import "./App.css";

import io from "socket.io-client";
//variable we can use to connect to our socket io events happening on the back end
const connection = io("http://localhost:5000/quiz");

const initialState = [
  {
    category: "Entertainment: Video Games",
    type: "boolean",
    difficulty: "easy",
    question:
      "&quot;Undertale&quot; is an RPG created by Toby Fox and released in 2015.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
];

function getCorrectAnswers(questions) {
  return questions.map((question) => question.correct_answer);
}

function App() {
  const [questions, setQuestions] = useState(initialState);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [playing, setPlaying] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //const [correctAnswers, setCorrectAnswers] = useState([]);

  //on mount our predefined connection thing - .on is a socket event
  //linked to the "playerConnected" emit on the backend.
  useEffect(() => {
    connection.on("playerConnected", (data) => {
      console.log(data, "player connected");
    });
    connection.on("chosenQuestions", ({ currentQuestions }) => {
      console.log(currentQuestions, "questions");
      setQuestions(currentQuestions);
      setPlayerChoices(Array(currentQuestions.length).fill(null));
      setPlaying(true);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    connection.emit("setCategory", {
      categoryID: categories[selectedCategoryIndex]?.id,
    });
  }, [selectedCategoryIndex]);

  useEffect(() => {
    async function getCategories() {
      const response = await fetch("https://opentdb.com/api_category.php");
      const jsonResponse = await response.json();
      setCategories(jsonResponse.trivia_categories);
    }
    getCategories();
  }, []);

  function addAnswer(option, i) {
    // this fuction will:
    // set playerChoices to be the previous array
    // plus the option that they have selected
    if (playing) {
      setPlayerChoices([
        ...playerChoices.slice(0, i),
        option,
        ...playerChoices.slice(i + 1),
      ]);
    }
  }

  function handleSubmit() {
    setPlaying(false);
  }

  function calculateScores() {
    return getCorrectAnswers(questions).filter(
      (correct_answer, i) => playerChoices[i] === correct_answer
    ).length;
  }
  return (
    <>
      <select
        onChange={(event) => setSelectedCategoryIndex(event.target.value)}
      >
        {categories.map((category, i) => (
          <option value={i}>{category.name}</option>
        ))}
      </select>
      {isLoading && <p>Loading...</p>}

      {questions.map((question, i) => (
        <Question
          playerChoice={playerChoices[i]}
          showAnswer={!playing}
          answer={question.correct_answer}
          category={question.category}
          question={question.question}
          options={[...question.incorrect_answers, question.correct_answer]}
          onSelect={(option) => addAnswer(option, i)}
        />
      ))}
      <button onClick={handleSubmit}>Submit Answers</button>
      {!playing && calculateScores()}
    </>
  );
}

export default App;

// const [regexedAnswers, setRegexedAnswers] = useState([]);

// useEffect(() => {
//   checkQuestion();
// }, [question, answers]);

// function checkQuestion() {
//   const quotationMarks = /&quot;/g;
//   const apostrophe = /&#039;/g;
//   const otherWeirdThing = /&rsquo;/g;
//   //need to work out how to put acute accents back onto relevant letter. Annoying
//   const acute = /$[a-z]acute;/gi;

//   let revisedQuestion = question
//     .replace(quotationMarks, '"')
//     .replace(apostrophe, "'")
//     .replace(otherWeirdThing, "'");

//   let revisedAnswers = answers.map(item =>
//     item
//       .replace(quotationMarks, '"')
//       .replace(apostrophe, "'")
//       .replace(otherWeirdThing, "'")
//   );
//   setQuestion(revisedQuestion);
//   console.log(revisedAnswers);
//   setRegexedAnswers(revisedAnswers);
// }
