// initialize starting values for question array, quiz timer and main/header
var questions = [];
var questionNum = 0;
var quizTimer = 60;
var answersEl = document.querySelector("#answers");
var startQuizEl = document.querySelector("#start-quiz");
var timerEl = document.querySelector("#timer");

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
    answers: {
      answer1: { answerText: correctChoice, isCorrect: true },
      answer2: { answerText: choice2, isCorrect: false },
      answer3: { answerText: choice3, isCorrect: false },
      answer4: { answerText: choice4, isCorrect: false },
    },
  };
  questions.push(question);
};

var answersHandler = function (event) {
  console.dir(event);
};

var startQuizHandler = function (event) {
  window.alert("Quiz is starting");
// cycle through questions
    // start timer countdown
    displayQuiz(questions[questionNum]);
};

var displayQuiz = function(questionNum){
    // display question

    // when option clicked

        // if !isCorrect, deduct 10 seconds from timer & display "Wrong!"
        // if isCorrect, display "Correct!"
    questionNum++;
    // if there is another question, display next question 
    // else get high score input
}
// sort questions in random order 
var sortQuestions = function (){

}
// load 2 questions to test with & shuffle
loadQuestion("What is my name", "Marielle", "Mariellen", "Marie", "Mary");
loadQuestion("What is his name", "William", "Willy", "Will", "Walt");
sortQuestions();
// initialize timer
timerEl.textContent = "Time: " + quizTimer;
startQuizEl.addEventListener("click", startQuizHandler);
answers.addEventListener("click",displayQuiz)