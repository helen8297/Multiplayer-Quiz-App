import React from "react";
import css from "./Question.module.css";
import cn from "classnames";

function Question({
  category,
  question,
  options,
  onSelect,
  playerChoice,
  showAnswer,
  answer,
}) {
  return (
    <div>
      <h2>{category}</h2>
      <h2>{question}</h2>
      {options.sort().map((option) => {
        const ourChoice = playerChoice === option;
        const correctAnswer = answer === option;
        return (
          <button
            className={cn({
              [css.selected]: ourChoice && !showAnswer,
              [css.incorrect]: ourChoice && showAnswer && !correctAnswer,
              [css.correct]: showAnswer && correctAnswer && !ourChoice,
              [css.playerCorrect]: showAnswer && correctAnswer && ourChoice,
            })}
            onClick={() => {
              onSelect(option);
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

Question.defaultProps = {
  category: "Entertainment: Video Games",
  type: "boolean",
  difficulty: "easy",
  question:
    "&quot;Undertale&quot; is an RPG created by Toby Fox and released in 2015.",
  options: ["True", "False"],
  onSelect: (x) => console.log(x),
};

export default Question;
