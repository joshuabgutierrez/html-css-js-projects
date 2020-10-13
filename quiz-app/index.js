// Selectors
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".restart-quizz");
const headerQuestion = document.querySelector("header.question");
const optionsSection = document.querySelector("section.options");
const submitButton = document.querySelector(".btn-submit");
const startingSection = document.querySelector(".starting-section");
const questionComponent = document.querySelector(".question-component");
const resultsContainer = document.querySelector("section.results");
const correctSpan = document.getElementById("correct");
const incorrectSpan = document.getElementById("incorrect");
const scoreSpan = document.getElementById("score");

// Global variables
let quizQuestions = [];
let questionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let finalScore = 0;

// Get questions from API
async function getQuestions() {
  const URL = "https://opentdb.com/api.php?amount=10&category=9";
  const response = await fetch(URL);
  const questions = await response.json();
  return updateQuestions(questions.results);
}

// Push questions to local object
function updateQuestions(questions) {
  questions.forEach((question) => {
    const questionObject = {
      question: question.question,
      correctAnswer: question.correct_answer,
      incorrectAnswers: question.incorrect_answers
    };
    quizQuestions.push(questionObject);
  });

  startingSection.style.display = "none";
  questionComponent.style.display = "block";

  return displayQuestion();
}

// Displays each question
function displayQuestion() {
  const currentQuestion = quizQuestions[questionIndex];
  headerQuestion.textContent = decodeHTML(currentQuestion.question);
  const options = [
    currentQuestion.correctAnswer,
    ...currentQuestion.incorrectAnswers
  ];
  const test = options.sort().map((option) => {
    const optionColumnHTML = `<div class="option-column">
    <input type="radio" name="option" value="${option}" />
    <label>${option}</label>
  </div>`;

    return optionColumnHTML;
  });
  optionsSection.innerHTML = test.join("");

  updateScore(currentQuestion.correctAnswer);
}

function decodeHTML(html) {
  const text = document.createElement("textarea");
  text.innerHTML = html;
  return text.value;
}

function updateScore(correctAnswer) {
  const currentOptions = Array.from(
    document.querySelectorAll('input[name="option"]')
  );
  let selectedAnswer = "selected";
  currentOptions.forEach((currentOption) => {
    currentOption.addEventListener("click", (e) => {
      if (e.target.value !== selectedAnswer) {
        selectedAnswer = e.target.value;
      }
      // Score based on selected answer
      if (selectedAnswer === correctAnswer) {
        finalScore += 10;
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });
  });
}

function displayNextQuestion() {
  // Let the user know they are in the final question
  if (questionIndex === quizQuestions.length - 2) {
    submitButton.textContent = "Finish";
  }

  // Display Results
  if (questionIndex === quizQuestions.length - 1) {
    return displayResults();
  }
  // Increment index and display next question
  questionIndex++;
  displayQuestion();
}

function displayResults() {
  questionComponent.style.display = "none";
  correctSpan.textContent = correctAnswers;
  incorrectSpan.textContent = incorrectAnswers;
  scoreSpan.textContent = finalScore;
  resultsContainer.style.display = "block";
}

startButton.addEventListener("click", getQuestions);
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  displayNextQuestion();
});
restartButton.addEventListener("click", (e) => {
  resultsContainer.style.display = "none";
  quizQuestions = [];
  questionIndex = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  finalScore = 0;
  getQuestions();
});
