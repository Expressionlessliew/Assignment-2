const questionsContainer = document.querySelector(".questions-container");
const submitButton = document.querySelector(".submit-btn");
const restartButton = document.querySelector(".restart-btn");
const scoreElement = document.querySelector(".score");
const nameInputElement = document.getElementById("name-input");

let score = 0;
let isQuizFinished = false;



// Function to load the questions
function loadQuestions() {
  const questionRef = firebase.database().ref("questions");
  questionRef.once("value", (snapshot) => {
    const questions = snapshot.val();
    const orderedList = document.createElement("ol"); // Create <ol> element
    questionsContainer.appendChild(orderedList); // Append <ol> to questionsContainer
    for (const questionKey in questions) {
      if (questions.hasOwnProperty(questionKey)) {
        const question = questions[questionKey];

        // Create <li> element for each question
        const listItem = document.createElement("li");
        listItem.classList.add("question");
        listItem.innerHTML = `
          <span class="question-name">${question.name}</span>
          <input type="text" class="answer-input" data-question-key="${questionKey}" />
        `;
        orderedList.appendChild(listItem); // Append <li> to <ol>
      }
    }
  });
}
// Function to calculate the score
function calculateScore() {
  const answerInputs = document.querySelectorAll(".answer-input");
  answerInputs.forEach((input) => {
    const questionKey = input.getAttribute("data-question-key");
    const userAnswer = input.value.trim().toLowerCase();
    const questionRef = firebase.database().ref("questions").child(questionKey);
    questionRef.once("value", (snapshot) => {
      const question = snapshot.val();
      if (question && userAnswer === question.answer) {
        score++;
      }
      scoreElement.textContent = score;
      input.value = ""; // Clear the input value
    });
  });
}

// Function to show the restart button
function showRestartButton() {
  restartButton.style.display = "block";
}

// Function to restart the quiz
function restartQuiz() {
  score = 0;
  scoreElement.textContent = score;
  isQuizFinished = false;
  submitButton.disabled = false;
  restartButton.style.display = "none";
  const answerInputs = document.querySelectorAll(".answer-input");
  answerInputs.forEach((input) => {
    input.value = ""; // Clear the input value
  });
}

// Event listener for the submit button
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!isQuizFinished) {
    calculateScore();
    isQuizFinished = true;
    showRestartButton();
    submitButton.disabled = true; // Disable the submit button after submission
  }
});

// Event listener for the restart button
restartButton.addEventListener("click", restartQuiz);

// Load the questions on page load
loadQuestions();
