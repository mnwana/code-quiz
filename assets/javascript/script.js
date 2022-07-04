// initialize starting values for question array, quiz timer and main/header
var questions = [];
var questionNum = 0;
var quizTimer = 30;
var quizInterval;
var mainEl = document.createElement("main");
var answersEl = document.createElement("div");
var startQuizEl = document.querySelector("#start-quiz");
var timerEl = document.querySelector("#timer");
// var questionTextEl = document.querySelector("#instructions");
var answerListEl = document.createElement("ul");
var answerFlagEl = document.createElement("div");
var highScores;
var instructionsEL = document.querySelector("#instructions");
var saveScoreEl;
var viewHighScoresEl = document.querySelector("#view-high-scores");
var bodyEl = document.querySelector("body");

// load question text
// TODO: will look to change this to read from file or something
var loadQuestion = function (
  questionText,
  correctChoice,
  choice2,
  choice3,
  choice4
) {
  var question = {
    questionText: questionText,
    answers: [correctChoice, choice2, choice3, choice4],
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
    quizTimer -= 10;
  }
  // if more questions remain & time >0
  if (quizTimer > 0 && questions[questionNum]) {
    // clear existing list
    answerListEl.replaceChildren();
    // call next question
    displayQuestion();
  } else {
    clearInterval(quizInterval);
    displayHighScoresPage();
  }

  // else get high score input
};

var displayHighScoresPage = function () {
  var questionTextEl = document.querySelector("#question-text");
  questionTextEl.textContent = "Game Over!";
  answerListEl.replaceChildren();
  quizTimer = Math.max(quizTimer, 0);
  answerFlagEl.textContent = "";
  var subHeaderEl = document.createElement("p")
  subHeaderEl.textContent = "Your final score is: " + quizTimer;
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
  saveScoreEl = document.querySelector("#save-score");
  saveScoreEl.addEventListener("click", addNewScore);
  // for each value in array add row item
  // create button to go back to quiz start page
  // create button to clear high scores
};

var addNewScore = function (event) {
  event.preventDefault();
  // get new nickname
  var nickname = document.querySelector("#hs-input").value;
  // load local storage & add new score
  savedScores = localStorage.getItem("high-scores");
  if (!savedScores) {
    highScores = [];
  } else {
    highScores = JSON.parse(savedScores);
  }
  highScores.push({ nickname: nickname, score: quizTimer });
  // resort high scores & save back to local storage
  //   highScores = highScores.sort((a, b) => a.score.localeCompare(b.score));
  // save to local storage
  localStorage.setItem("high-scores", JSON.stringify(highScores));
  completeHighScorePage();
};

var completeHighScorePage = function () {
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
  //   Display high scores
  var highScoreBox = document.createElement("div");
  highScoreBox.id = "high-score-box";
  var highScoreList = document.createElement("ul");
  highScoreList.id = "high-scores";
  console.log(highScores);
  //   iterate over values in highScores to add top 3 to list
  for (var i = 0; i < highScores.length && i < 3; i++) {
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

var  goBackHandler = function(){
  mainEl.replaceChildren();
  initializePage();
}

var startQuizHandler = function (event) {
  // initialize timer
  quizTimer = 30;
  // load 2 questions to test with & shuffle
  loadQuestion("What is my name??", "Marielle", "Mariellen", "Marie", "Mary");
  loadQuestion("What is his name??", "William", "Willy", "Will", "Walt");
  loadQuestion("What is my name?", "Marielle", "Mariellen", "Marie", "Mary");
  loadQuestion("What is his name?", "William", "Willy", "Will", "Walt");
  loadQuestion("What is they're name?", "Molly", "Monica", "Milly", "Mook");
  sortQuestions();
  // start timer countdown
  quizInterval = setInterval(updateTimer, 1000);
  // remove instructions text
  document.querySelector("#instructions").remove();
  // remove start quiz element
  document.querySelector("#start-quiz").remove();
  // add answers containers to main 
  answersEl.id = "answers";
  answerListEl.id = "answer-list";
  answersEl.append(answerListEl);
  mainEl.append(answersEl);
  // add correctness container to main
  answerFlagEl.id = "answer-flag";
  var answerFlagTextEl = document.createElement("h2");
  answerFlagEl.append(answerFlagTextEl);
  mainEl.append(answerFlagEl);
  displayQuestion();
};

var displayQuestion = function () {
  var currentQuestion = questions[questionNum];
  // display question
  var questionTextEl = document.querySelector("#question-text");
  questionTextEl.textContent = currentQuestion.questionText;
  // set answer options
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    currentAnswer = currentQuestion.answers[i];
    var answerEl = document.createElement("li");
    var btnEl = document.createElement("button");
    btnEl.className = "answer-option";
    btnEl.textContent = i + 1 + ". " + currentAnswer;
    btnEl.setAttribute("data-is-correct", "0");
    // if first value (and correct answer) set isCorrect=true
    if (i == 0) {
      btnEl.setAttribute("data-is-correct", "1");
    }
    answerEl.append(btnEl);
    answerListEl.append(answerEl);
  }
  answers.addEventListener("click", answersHandler);
  questionNum++;
};
// sort questions in random order
var sortQuestions = function () {};

var updateTimer = function () {
  timerEl.textContent = "Time: " + quizTimer;
  quizTimer--;
};

var initializePage = function () {
  // initialize header
  var headerEl = document.createElement("header");
  var viewHighScoresEl = document.createElement("h1");
  viewHighScoresEl.id = "view-high-scores";
  viewHighScoresEl.textContent = "View High Scores";
  timerEl = document.createElement("h1");
  timerEl.textContent = "Time: " + quizTimer;
  viewHighScoresEl.addEventListener("click", completeHighScorePage);
  timerEl.id = "timer";
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


initializePage();
