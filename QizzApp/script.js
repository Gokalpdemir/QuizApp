const questionText = document.querySelector(".question-text");
const nextBtn = document.querySelector(".next-btn");
const choose = document.querySelector(".choose");
const answerText = document.querySelector(".answer-text");
const answers = document.querySelector(".answers");
const progressCount = document.querySelector(".progress-count");
const progressBar2 = document.querySelector(".progressBar2");
const allQuestionsTrue = document.querySelector(".allQuestionsTrue");
const btn = document.querySelector(".btn");
const refreshDiv = document.querySelector(".refreshDiv");
const refresQuiz = document.querySelector(".refresQuiz");
const refreshDivTitle = document.querySelector(".refreshDiv-title");

let questionIndex = 0;
let correctAnswers = 0;
let questions = [];
let clickbtn = 0;
const choice = ["A", "B", "C", "D"];
let time = 10;
let timer;

async function getQuestions() {
  const response = await fetch("question.json");
  questions = await response.json();

  shuffleQuestions();
}
const shuffleQuestions = () => {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  updateQuestion();
};

function controls(item) {
  const isCorrect = JSON.parse(item.getAttribute("data-correct"));
  if (isCorrect == true) {
    correctAnswers++;
    item.classList.add("true");
  } else {
    item.classList.add("false");

    const correctAnswerDiv = Array.from(item.parentElement.children).find(
      (child) => JSON.parse(child.getAttribute("data-correct"))
    );

    if (correctAnswerDiv) {
      correctAnswerDiv.classList.add("true");
    }
  }
}

function clickAnswer(answersAll) {
  answersAll.forEach((item) => {
    item.addEventListener("click", () => {
      controls(item);

      answersAll.forEach((items) => (items.style.pointerEvents = "none"));
    });
  });
}
function updateQuestion() {
    timer = setInterval(() => {
      time--;
      if (time == 0) {
        time = 10;
        clearInterval(timer);
        nextFunction();
      }
    }, 1000);
  answers.innerHTML = "";
  questionText.textContent = `Soru ${questionIndex + 1}: ${
    questions[questionIndex].question
  }`;
  questions[questionIndex].answers.forEach((answer, i) => {
    let answerTemplate = `<div data-correct=${answer.correct} class="answer" >
     <div class="choose">${choice[i]})</div>
       <div class="answer-text">
         ${answer.text}
       </div>
     </div>`;
    answers.innerHTML += answerTemplate;
  });

  const answersAll = document.querySelectorAll(".answer");
  clickAnswer(answersAll);
}

function nextFunction() {
  time = 10;
  clearInterval(timer);
  clickbtn++;
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    updateQuestion(questionIndex);
    progressBar2.style.width = `${
      (100 / questions.length) * (questionIndex + 1)
    }%`;
    progressCount.textContent = `${questionIndex + 1} / ${questions.length}`;
    
  }
  if (clickbtn == questions.length - 1) {
    nextBtn.textContent = "Sınavı Tamamla";
  } else if (clickbtn == questions.length) {
    clearInterval(timer);
    nextBtn.disabled = true;

    if (correctAnswers == questions.length) {
      allQuestionsTrue.style.display = "flex";
    } else {
      refreshDivTitle.textContent = `${correctAnswers} Soruyu Doğru Bildiniz`;
      refreshDiv.style.display = "flex";
    }
  }
}
nextBtn.addEventListener("click", nextFunction);

function resetQuiz() {
  window.location.reload();
}

btn.addEventListener("click", resetQuiz);
refresQuiz.addEventListener("click", () => {
  window.location.reload();
});

getQuestions();
