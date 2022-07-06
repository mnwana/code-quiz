// initialize starting values for question array, quiz timer and main
var bodyEl = document.querySelector("body");
var mainEl = document.createElement("main");
var timerEl;
var answerListEl;
var answerFlagEl;
var quizInterval;
var highScores;
var questions;
var questionNum;
var quizTimer;
var timeOut;

// load question text
// TODO: will look to change this to read from file or something
var loadQuestion = function (questionArr) {
  var question = {
    questionText: questionArr[0],
    answers: shuffleArray(questionArr[1]),
  };
  questions.push(question);
};

var answersHandler = function (event) {
  // if click is not on a button, exit function
  if (event.target.className != "answer-option") {
    return false;
  }
  var isCorrect = event.target.getAttribute("data-is-correct");
  // if isCorrect, display "Correct!"
  if (isCorrect == "1") {
    answerFlagEl.textContent = "Correct!";
  }
  // if !isCorrect, deduct 10 seconds from timer & display "Wrong!"
  else if (isCorrect == "0") {
    answerFlagEl.textContent = "Wrong!";
    quizTimer -= 5;
  }
  // if more questions remain & time >0
  if (quizTimer > 0 && questions[questionNum]) {
    // clear existing list
    answerListEl.replaceChildren();
    // call next question
    displayQuestion();
  } else {
    endQuiz();
  }

  // else get high score input
};

var displayHighScoresPage = function () {
  var questionTextEl = document.querySelector("#question-text");
  questionTextEl.textContent = "Game Over!";
  answerListEl.replaceChildren();
  quizTimer = Math.max(quizTimer, 0);
  answerFlagEl.textContent = "";
  var subHeaderEl = document.createElement("p");
  subHeaderEl.textContent = "Your final score is: " + quizTimer;
  subHeaderEl.id = "sub-header";
  var introContentEl = document.querySelector("#intro-content");
  introContentEl.append(subHeaderEl);
  //   create input box
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

  hsFormEl.append(inputEl);
  hsFormEl.append(submitEl);
  mainEl.append(hsFormEl);
  bodyEl.append(mainEl);
  submitEl.addEventListener("click", readNickname);
  // for each value in array add row item
  // create button to go back to quiz start page
  // create button to clear high scores
};

var readNickname = function (event) {
  event.preventDefault();
  // get new nickname
  var nickname = document.querySelector("#hs-input").value;
  if (nickname.length < 1) {
    window.alert("You must enter a nickname:");
    return false;
  } else {
    completeHighScorePage(nickname);
  }
};

var completeHighScorePage = function (nickname) {
  var savedScores = localStorage.getItem("high-scores");
  if (!savedScores) {
    highScores = [];
  } else {
    highScores = JSON.parse(savedScores);
  }
  if (typeof nickname === "string" || nickname instanceof String) {
    highScores.push({ nickname: nickname, score: quizTimer });
  }
  // remove instructions element
  if (document.querySelector("#instructions")) {
    document.querySelector("#instructions").remove();
  }
  // remove start quiz element
  if (document.querySelector("#start-quiz")) {
    document.querySelector("#start-quiz").remove();
  }
  // remove subheader
  if (document.querySelector("#sub-header")) {
    document.querySelector("#sub-header").remove();
  }
  // save to local storage
  localStorage.setItem("high-scores", JSON.stringify(highScores));
  var questionTextEl = document.querySelector("#question-text");
  questionTextEl.textContent = "High Scores";
  //   remove score form
  var formEl = document.querySelector("#score-form");
  var highScoreBox = document.querySelector("#high-score-box");
  var headerEl = document.querySelector("header");
  if (formEl) {
    formEl.remove();
  }
  if (highScoreBox) {
    highScoreBox.remove();
  }
  if (headerEl) {
    headerEl.remove();
  }
  if (answerListEl) {
    answerListEl.remove();
  }
  if (answerFlagEl) {
    answerFlagEl.remove();
  }
  //   Display high scores
  var highScoreBox = document.createElement("div");
  highScoreBox.id = "high-score-box";
  var highScoreList = document.createElement("ul");
  highScoreList.id = "high-scores";
  //   iterate over values in highScores to add top 3 to list
  for (var i = 0; i < highScores.length && i < 5; i++) {
    currentScore = highScores[i];
    var scoreEl = document.createElement("li");
    scoreEl.className = "score-list-item";
    scoreEl.textContent =
      i + 1 + ". " + currentScore.nickname + ": " + currentScore.score;
    highScoreList.append(scoreEl);
  }
  //   add buttons for clear high score and go back to home page
  var clearScoresEl = document.createElement("button");
  var goBackEl = document.createElement("button");

  clearScoresEl.className = "btn";
  clearScoresEl.id = "clear-scores";
  clearScoresEl.textContent = "Clear Scores";
  goBackEl.className = "btn";
  goBackEl.id = "restart";
  goBackEl.textContent = "Go Back";
  highScoreBox.append(highScoreList);
  highScoreBox.append(goBackEl);
  highScoreBox.append(clearScoresEl);
  mainEl.append(highScoreBox);
  clearScoresEl.addEventListener("click", clearScoresHandler);
  goBackEl.addEventListener("click", goBackHandler);
};

var clearScoresHandler = function (event) {
  var clearScoresConfirm = confirm(
    "Are you sure you'd like to clear all high scores?"
  );
  if (clearScoresConfirm) {
    highScores = [];
    localStorage.setItem("high-scores", highScores);
    completeHighScorePage();
  }
};

var goBackHandler = function () {
  mainEl.replaceChildren();
  initializePage();
};

var endQuiz = function () {
  clearInterval(quizInterval);
  displayHighScoresPage();
};

var startQuizHandler = function (event) {
  // start timer countdown
  quizInterval = setInterval(updateTimer, 1000);
  // remove instructions text
  document.querySelector("#instructions").remove();
  // remove start quiz element
  document.querySelector("#start-quiz").remove();
  // add answers containers to main
  var answersEl = document.createElement("div");
  answerListEl = document.createElement("ul");
  answersEl.id = "answers";
  answerListEl.id = "answer-list";
  answersEl.append(answerListEl);
  mainEl.append(answersEl);
  // add correctness container to main
  answerFlagEl = document.createElement("div");
  answerFlagEl.id = "answer-flag";
  var answerFlagTextEl = document.createElement("h2");
  answerFlagEl.append(answerFlagTextEl);
  mainEl.append(answerFlagEl);
  displayQuestion();
};

var displayQuestion = function () {
  // load question attributes
  var currentQuestion = questions[questionNum];
  // display question
  var questionTextEl = document.querySelector("#question-text");
  questionTextEl.textContent = currentQuestion.questionText;
  // set answer options
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    currentAnswer = currentQuestion.answers[i][1];
    var answerEl = document.createElement("li");
    var btnEl = document.createElement("button");
    btnEl.className = "answer-option";
    btnEl.textContent = i + 1 + ". " + currentAnswer;
    btnEl.setAttribute("data-is-correct", currentQuestion.answers[i][0]);
    // if first value (and correct answer) set isCorrect=true
    answerEl.append(btnEl);
    answerListEl.append(answerEl);
  }
  answers.addEventListener("click", answersHandler);
  questionNum++;
};
var updateTimer = function () {
  timerEl.textContent = "Time: " + quizTimer;
  quizTimer--;
  if (quizTimer <= 0) {
    endQuiz();
  }
};

var initializePage = function () {
  // reset questions array and question num
  questions = [];
  questionNum = 0;
  // load 5 questions into quiz
  loadQuestion([
    "What is my name? 2",
    [
      [1, "Marielle"],
      [0, "Mariellen"],
      [0, "Marie"],
      [0, "Mary"],
    ],
  ]);
  loadQuestion([
    "What is his name? 2",
    [
      [1, "William"],
      [0, "Willy"],
      [0, "Will"],
      [0, "Walt"],
    ],
  ]);
  loadQuestion([
    "What is my name? 1",
    [
      [1, "Marielle"],
      [0, "Mariellen"],
      [0, "Marie"],
      [0, "Mary"],
    ],
  ]);
  loadQuestion([
    "What is his name? 1",
    [
      [1, "William"],
      [0, "Willy"],
      [0, "Will"],
      [0, "Walt"],
    ],
  ]);
  loadQuestion([
    "What is they're name? 1",
    [
      [1, "Molly"],
      [0, "Monica"],
      [0, "Milly"],
      [0, "Mook"],
    ],
  ]);

  // shuffle question order
  questions = shuffleArray(questions);
  // initialize timer based on number of questions with 10 seconds per question
  quizTimer = 5 + 10 * questions.length;
  // initialize header
  var headerEl = document.createElement("header");
  var viewHighScoresEl = document.createElement("h1");
  viewHighScoresEl.id = "view-high-scores";
  viewHighScoresEl.textContent = "View High Scores";
  timerEl = document.createElement("h1");
  timerEl.textContent = "Time: " + quizTimer;
  timerEl.id = "timer";
  viewHighScoresEl.addEventListener("click", completeHighScorePage);

  headerEl.append(viewHighScoresEl);
  headerEl.append(timerEl);
  // add header to page
  bodyEl.append(headerEl);
  // initialize instructions
  var introEl = document.createElement("div");
  introEl.id = "intro-content";
  var introTitle = document.createElement("h1");
  introTitle.id = "question-text";
  introTitle.textContent = "Coding Quiz";
  var introInstructions = document.createElement("p");
  introInstructions.id = "instructions";
  introInstructions.textContent =
    "Try to answer as many questions in the time provided. You will see if your output is correct after making a choice. Any incorrect answer will result in a deduction of 10 seconds from the timer and your final score. ";
  var startQuizEl = document.createElement("button");
  startQuizEl.id = "start-quiz";
  startQuizEl.textContent = "Start Quiz";
  startQuizEl.addEventListener("click", startQuizHandler);
  introEl.append(introTitle);
  introEl.append(introInstructions);
  introEl.append(startQuizEl);
  mainEl.append(introEl);
  bodyEl.append(mainEl);
};

var shuffleArray = function (unshuffledArr) {
  return unshuffledArr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

initializePage();
