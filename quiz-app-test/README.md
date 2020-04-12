# Quiz

## Plan

- [x] show a question
- [x] 2 types of question: Multiple Choice / Boolean
- [x] Allow the options to be seen
- [x] Allow a user to chose an option
- [x] Shuffle the options so that correct isn't predictable
- [x] Do a round of 10 questions.

- [x] Make an array of correct answer
- [x] Make an array of chosen answers, added to when button is clicked.
- [x] Functionality to change your answer
- [] Timer for each round
- [x] submit answer button that compares answers to correct answers, adds to 'scores' accordingly

  - lock in answers - done
  - display correct answers - done
  - display player scores - done

- [ ] Choose category
- [ ] Choose number of questions
- [ ] Scoreboard / Leaderboard

* [ ] real-time fastest finger first quiz

##SocketPlan
[x] 2 players in the same quiz in different rooms
[x] they see the same questions
[x] both answer the questions
[] be able to give usernames in at the start
 @ component on the front end with an input and button
 @ conditional rendering to make that show up first
 - send the username to the back end, save them in an object, ready for their scores to be saved
 - Show usernames in the quiz app "Currently playing:"
 - send all users from backend to front end
[] after both submitted, scores are compared

//install websockets on front end
//make back end folder
//install express
//install cors
