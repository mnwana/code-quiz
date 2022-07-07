// initialize starting values for question array, quiz timer and main
var bodyEl = document.querySelector("body");
var mainEl = document.createElement("main");
var mainTitleEl = document.createElement("h1");
mainTitleEl.id = "main-title";
var subHeaderEl = document.createElement("p");
subHeaderEl.id = "sub-header";
var timerEl;
var answerListEl;
var answerFlagEl;
var quizInterval;
var highScores;
var questions;
var questionNum;
var timeLeft;

// load new question object questions array from array
var loadQuestion = function (questionArr) {
  // load question from first position in array, load answer choices after shuffling
  var question = {
    questionText: questionArr[0],
    answers: shuffleArray(questionArr[1]),
  };
  // push new question object to question array
  questions.push(question);
};

// event handler for clicking on quiz answers
var answersHandler = function (event) {
  // if click is not on an answer option button, exit function
  if (event.target.className != "answer-option") {
    return false;
  }
  // read data attribute is-correct from button clicked
  var isCorrect = event.target.getAttribute("data-is-correct");
  // if chosen answer is correct display correct
  if (isCorrect == "1") {
    answerFlagEl.textContent = "Correct!";
  }
  // if chose answer is wrong display wrong and deduct 5 seconds from the timer
  else if (isCorrect == "0") {
    answerFlagEl.textContent = "Wrong!";
    timeLeft -= 5;
  }
  // if more questions remain in array & time left > 0, clear existing questions and display next question
  if (timeLeft > 0 && questions[questionNum]) {
    answerListEl.replaceChildren();
    displayQuestion();
  }
  // if no time or no questions left, call end quiz
  else {
    endQuiz();
  }
};

// update page to display high scoress
var displayHighScoresPage = function () {
  // set main title to read "Game over", clear buttons from last question, and clear text of answer Flag
  mainTitleEl.textContent = "Game Over!";
  answerListEl.replaceChildren();
  answerFlagEl.textContent = "";
  // upate the timer to be 0
  timeLeft = Math.max(timeLeft, 0);
  // set subheader to read final score
  subHeaderEl.textContent = "Your final score is: " + timeLeft;
  var introContentEl = document.querySelector("#intro-content");
  introContentEl.append(subHeaderEl);
  //  create input box & submit button elements for nickname
  var hsFormEl = document.createElement("form");
  var inputEl = document.createElement("input");
  var submitEl = document.createElement("button");
  hsFormEl.id = "score-form";
  inputEl.id = "hs-input";
  inputEl.type = "text";
  inputEl.setAttribute("name", "nickname");
  inputEl.placeholder = "Enter Nickname";
  submitEl.className = "btn";
  submitEl.id = "save-score";
  submitEl.type = "submit";
  submitEl.textContent = "Save Score";
  // append input & button to form
  hsFormEl.append(inputEl);
  hsFormEl.append(submitEl);
  // append form to main, then append main to body
  mainEl.append(hsFormEl);
  bodyEl.append(mainEl);
  // add event listener for submit click to read nickname typed into input form
  submitEl.addEventListener("click", readNickname);
};

// read nickname input on high score page
var readNickname = function (event) {
  // prevent default behavior and read value of input form
  event.preventDefault();
  var nickname = document.querySelector("#hs-input").value;
  // if nickname length is not at least 1 character, send alert that they must enter a nickname and exit function
  if (nickname.length < 1) {
    window.alert("You must enter a nickname:");
    return false;
  }
  // if nickname length is at least one character, call completeHighScore with nickname as param
  else {
    completeHighScorePage(nickname);
  }
};

// take input from readNickname and update high score list, then display high score list
var completeHighScorePage = function (nickname) {
  // read local storage for high-scores. if it doesn't exist, set value to empty array. if it does exist, parse JSON
  var savedScores = localStorage.getItem("high-scores");
  if (!savedScores) {
    highScores = [];
  } else {
    highScores = JSON.parse(savedScores);
  }
  // if nickname param is a string, push to high scores array and sve to local storage
  if (typeof nickname === "string" || nickname instanceof String) {
    highScores.push({ nickname: nickname, score: timeLeft });
  }
  localStorage.setItem("high-scores", JSON.stringify(highScores));
  // remove elements from previous page if they exist - instructions, start quiz button, subheader, score nickname form, header, high-score-box, and quiz question components
  if (document.querySelector("#instructions")) {
    document.querySelector("#instructions").remove();
  }
  if (document.querySelector("#start-quiz")) {
    document.querySelector("#start-quiz").remove();
  }
  if (document.querySelector("#sub-header")) {
    document.querySelector("#sub-header").remove();
  }
  if (document.querySelector("#score-form")) {
    document.querySelector("#score-form").remove();
  }
  if (document.querySelector("#high-score-box")) {
    document.querySelector("#high-score-box").remove();
  }
  if (document.querySelector("header")) {
    document.querySelector("header").remove();
  }
  if (answerListEl) {
    answerListEl.remove();
  }
  if (answerFlagEl) {
    answerFlagEl.remove();
  }
  //   add high scores elements to page
  mainTitleEl.textContent = "High Scores";
  // create ul within div to hold high score lis
  var highScoreBox = document.createElement("div");
  highScoreBox.id = "high-score-box";
  var highScoreList = document.createElement("ul");
  highScoreList.id = "high-scores";
  //   iterate over values in highScores to add top 5 to high-scores ul
  for (var i = 0; i < highScores.length && i < 5; i++) {
    currentScore = highScores[i];
    var scoreEl = document.createElement("li");
    scoreEl.className = "score-list-item";
    scoreEl.textContent =
      i + 1 + ". " + currentScore.nickname + ": " + currentScore.score;
    highScoreList.append(scoreEl);
  }
  //   create button elements for clear high score and go back to home page
  var clearScoresEl = document.createElement("button");
  var goBackEl = document.createElement("button");
  clearScoresEl.className = "btn";
  clearScoresEl.id = "clear-scores";
  clearScoresEl.textContent = "Clear Scores";
  goBackEl.className = "btn";
  goBackEl.id = "restart";
  goBackEl.textContent = "Go Back";
  // append button elements & list div to high score div
  highScoreBox.append(highScoreList);
  highScoreBox.append(goBackEl);
  highScoreBox.append(clearScoresEl);
  // append high score div to main
  mainEl.append(highScoreBox);
  // add event listeners for new buttons
  clearScoresEl.addEventListener("click", clearScoresHandler);
  goBackEl.addEventListener("click", goBackHandler);
};

// clear high scores list in global vars and local storage
var clearScoresHandler = function () {
  // confirm they want to clear score list on click
  var clearScoresConfirm = confirm(
    "Are you sure you'd like to clear all high scores?"
  );
  // clear local storage and global scores array
  if (clearScoresConfirm) {
    highScores = [];
    localStorage.setItem("high-scores", highScores);
    completeHighScorePage();
  }
};

// initialize starting page on click
var goBackHandler = function () {
  mainEl.replaceChildren();
  initializePage();
};

// end quiz by clearing interval and displaying high scores page
var endQuiz = function () {
  clearInterval(quizInterval);
  displayHighScoresPage();
};

// start quiz uppon start quiz button click
var startQuizHandler = function () {
  // start quiz timer
  quizInterval = setInterval(updateTimeLeft, 1000);
  // remove instructions text & start quiz button
  document.querySelector("#instructions").remove();
  document.querySelector("#start-quiz").remove();
  // create ul within div to hold answers to the question
  var answersEl = document.createElement("div");
  answerListEl = document.createElement("ul");
  answersEl.id = "answers";
  answerListEl.id = "answer-list";
  // append ul to div, and div to main
  answersEl.append(answerListEl);
  mainEl.append(answersEl);
  // create correctness div containing h2 and add to main
  answerFlagEl = document.createElement("div");
  answerFlagEl.id = "answer-flag";
  var answerFlagTextEl = document.createElement("h2");
  answerFlagEl.append(answerFlagTextEl);
  mainEl.append(answerFlagEl);
  // add event listener to the answers box
  answersEl.addEventListener("click", answersHandler);
  // call display question to show first question
  displayQuestion();
};

// display question for quiz function
var displayQuestion = function () {
  // load question attributes of next question in questions array
  var currentQuestion = questions[questionNum];
  // display question
  mainTitleEl.textContent = currentQuestion.questionText;
  // for each answer choice, create button within li, set value to answer text, and set data-is-correct to correctFlag value then append to answers ul
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    currentAnswer = currentQuestion.answers[i][1];
    var answerEl = document.createElement("li");
    var btnEl = document.createElement("button");
    btnEl.className = "answer-option";
    btnEl.textContent = i + 1 + ". " + currentAnswer;
    btnEl.setAttribute("data-is-correct", currentQuestion.answers[i][0]);
    answerEl.append(btnEl);
    answerListEl.append(answerEl);
  }
  // increment next question position
  questionNum++;
};

// update time left textContent and decrease count
var updateTimeLeft = function () {
  timerEl.textContent = "Time: " + timeLeft;
  timeLeft--;
  // if time left <1 end quiz
  if (timeLeft <= 0) {
    endQuiz();
  }
};

var initializePage = function () {
  // reset questions array and question num
  questions = [];
  questionNum = 0;
  // load questions in question array
  generateQuestionsArray();
  // shuffle question order
  questions = shuffleArray(questions);
  // initialize timer based on number of questions with 10 seconds per question
  timeLeft = 10 * questions.length;
  // create header element that includes time left counter and link to high score page elements
  var headerEl = document.createElement("header");
  var viewHighScoresEl = document.createElement("h1");
  viewHighScoresEl.id = "view-high-scores";
  viewHighScoresEl.textContent = "View High Scores";
  timerEl = document.createElement("h1");
  timerEl.textContent = "Time: " + timeLeft;
  timerEl.id = "timer";
  viewHighScoresEl.addEventListener("click", completeHighScorePage);
  // append new elements to header
  headerEl.append(viewHighScoresEl);
  headerEl.append(timerEl);
  // add header to page
  bodyEl.append(headerEl);
  // initialize instructions and start quiz elements
  var introEl = document.createElement("div");
  introEl.id = "intro-content";
  mainTitleEl.textContent = "Coding Quiz";
  var introInstructionsEl = document.createElement("p");
  introInstructionsEl.id = "instructions";
  introInstructionsEl.textContent =
    "Try to answer as many questions in the time provided. You will see if your output is correct after making a choice. Any incorrect answer will result in a deduction of 10 seconds from the timer and your final score. ";
  var startQuizEl = document.createElement("button");
  startQuizEl.id = "start-quiz";
  startQuizEl.textContent = "Start Quiz";
  startQuizEl.addEventListener("click", startQuizHandler);
  // append instructions, start quiz and title to main
  introEl.append(mainTitleEl);
  introEl.append(introInstructionsEl);
  introEl.append(startQuizEl);
  // append intro elements to main
  mainEl.append(introEl);
  // append main to body
  bodyEl.append(mainEl);
};

// load 10 questions into questions array with question at pos 0 and array of answers and which is correct. can take any number of answers
// -- content from https://www.w3schools.com/js/js_quiz.asp
var generateQuestionsArray = function () {
  // [[question text],[[corecctFlag,question1],[correctFlag,question2]...[correctFlag,quetion-n]]]
  loadQuestion([
    "Inside which HTML element do we put the JavaScript?",
    [
      [0, "<js>"],
      [0, "<scripting"],
      [0, "<javascript>"],
      [1, "<script>"],
    ],
  ]);

  loadQuestion([
    'What is the correct JavaScript syntax to change the content of the HTML element below?<br><br>"<p id="demo">This is a demonstration.</p>',
    [
      [0, '#demo.innerHTML = "Hello World!";'],
      [0, 'document.getElement("p").innerHTML = "Hello World!";'],
      [0, 'document.getElementByName("p").innerHTML = "Hello World!";'],
      [1, 'document.getElementById("demo").innerHTML = "Hello World!";'],
    ],
  ]);

  loadQuestion([
    "Where is the correct place to insert a JavaScript?",
    [
      [0, "Both the <head> section and the <body> section are correct"],
      [1, "The <body> section"],
      [0, "The <head section>"],
    ],
  ]);

  loadQuestion([
    'What is the correct syntax for referring to an external script called "xxx.js"?',
    [
      [1, '<script src="xxx.js">'],
      [0, '<script name="xxx.js">'],
      [0, '<script href="xxx.js">'],
    ],
  ]);

  loadQuestion([
    "The external JavaScript file must contain the <script> tag.",
    [
      [0, "True"],
      [1, "False"],
    ],
  ]);

  loadQuestion([
    'How do you write "Hello World" in an alert box?',
    [
      [0, 'alertBox("Hello World");'],
      [0, 'msgBox("Hello World");'],
      [1, 'alert("Hello World");'],
      [0, 'msg("Hello World");'],
    ],
  ]);

  loadQuestion([
    "How do you create a function in JavaScript?",
    [
      [0, "function myFunction()"],
      [0, "function:myFunction()"],
      [1, "function = myFunction()"],
    ],
  ]);

  loadQuestion([
    'How do you call a function named "myFunction"?',
    [
      [0, "call myFunction()"],
      [1, "myFunction()"],
      [0, "call function myFunction()"],
    ],
  ]);

  loadQuestion([
    "How to write an IF statement in JavaScript?",
    [
      [1, "if(i==5)"],
      [0, "if i = 5"],
      [0, "if i = 5 then"],
      [0, "if i ==5 then"],
    ],
  ]);

  loadQuestion([
    'How to write an IF statement for executing some code if "i" is NOT equal to 5?',
    [
      [0, "if i <> 5"],
      [0, "if i =!5 then"],
      [0, "if( i <> 5)"],
      [1, "if (i! = 5)"],
    ],
  ]);
};

// take array as input and return it shuffled randomly
var shuffleArray = function (unshuffledArr) {
  return unshuffledArr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// initialize start page
initializePage();
