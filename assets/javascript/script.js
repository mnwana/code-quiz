// initialize starting values for question array, quiz timer and main/header
var questions = [];
var questionNum = 0;
var quizTimer = 30;
var quizInterval;
var answersEl = document.querySelector("#answers");
var startQuizEl = document.querySelector("#start-quiz");
var timerEl = document.querySelector("#timer");
var questionTextEl = document.querySelector("#question-text");
var answerListEl = document.querySelector("#answer-list");
var answerFlagEl = document.querySelector("#answer-flag h2");
var highScores = [];
var instructionsEL = document.querySelector("#instructions");

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
    displayHighScores();
  }

  // else get high score input
};

var displayHighScores = function () {
  questionTextEl.textContent = "Game Over!";
  answerListEl.replaceChildren();
  quizTimer = Math.max(quizTimer, 0);
  answerFlagEl.textContent = "";
  instructionsEL.textContent = "Your final score is: " + quizTimer;
  // get initials for new score value & update local storage array
  //   create input box
  answersEl.innerHTML =
    '  <input id="hs-input" type="text" name="nickname" placeholder="Enter Nickname" />';
  var highScoreEl = document.querySelector("#hs-input");
  highScoreEl.addEventListener("submit", addNewScore);
  addNewScore();
  // for each value in array add row item
  // create button to go back to quiz start page
  // create button to clear high scores
};

var addNewScore = function () {
  // load local storage
  highScores = JSON.parse(localStorage.getItem("high-scores"));
  // get new nickname
  var nickname = document.querySelector("#hs-input").value;
  // add to high score array resort values
  // use 2 arrays to insert & sort where new value > next value
  // save to local storage
};

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
  // remove start quiz element
  startQuizEl.remove();
  // remove instructions text
  instructionsEL.textContent = "";
  //   instructionsEL.remove();
  // call displayQuestion to load first question
  displayQuestion();
};

var displayQuestion = function () {
  var currentQuestion = questions[questionNum];
  // display question
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
  questionNum++;
};
// sort questions in random order
var sortQuestions = function () {};

var updateTimer = function () {
  timerEl.textContent = "Time: " + quizTimer;
  quizTimer--;
};

timerEl.textContent = "Time: " + quizTimer;
startQuizEl.addEventListener("click", startQuizHandler);
answers.addEventListener("click", answersHandler);
