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
var answerFlagEl = document.querySelector("#answer-flag h2")

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
  if(isCorrect=="1"){
    answerFlagEl.textContent = "Correct!";
  }
    // if !isCorrect, deduct 10 seconds from timer & display "Wrong!"

  else if(isCorrect=="0"){
    answerFlagEl.textContent = "Wrong!";
  }
  // if more questions remain & time >0
  if(quizTimer>0&&questions[questionNum]){
    // clear existing list 
    answerListEl.replaceChildren();;
    // call next question
    displayQuiz();
  }
  else{
    clearInterval(quizInterval);
  }

  // else get high score input
};

var startQuizHandler = function (event) {
  // start timer countdown
  quizInterval = setInterval(updateTimer, 1000);
  // remove start quiz element
  startQuizEl.remove();
  // remove instructions text
  var instructionsEL = document.querySelector("#instructions");
  instructionsEL.remove();
  // call displayQuiz to load first question
  displayQuiz();
};

var displayQuiz = function () {
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
// initialize timer
timerEl.textContent = "Time: " + quizTimer;
startQuizEl.addEventListener("click", startQuizHandler);
answers.addEventListener("click", answersHandler);
// load 2 questions to test with & shuffle
loadQuestion("What is my name??", "Marielle", "Mariellen", "Marie", "Mary");
loadQuestion("What is his name??", "William", "Willy", "Will", "Walt");
loadQuestion("What is my name?", "Marielle", "Mariellen", "Marie", "Mary");
loadQuestion("What is his name?", "William", "Willy", "Will", "Walt");
loadQuestion("What is they're name?", "Molly", "Monica", "Milly", "Mook");
sortQuestions();
