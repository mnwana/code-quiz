// initialize starting values for question array, quiz timer and main/header
var questions = [];
var quizTimer = 60;
var answersEl = document.querySelector("#answers");
var startQuizEl = document.querySelector("#start-quiz")

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

loadQuestion("What is my name", "Marielle", "Mariellen", "Marie", "Mary");
loadQuestion("What is his name", "William", "Willy", "Will", "Walt");

var answersHandler = function(event){
    console.dir(event);
}

answersEl.addEventListener("click", answersHandler);
startQuizEl.addEventListener("click", startQuizHandler);
