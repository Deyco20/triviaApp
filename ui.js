/*
 * ui.js
 * Este archivo se encarga de toda la manipulación del DOM
 * (mostrar/ocultar vistas, crear elementos, etc.)
 */

// Necesitamos las referencias a las vistas para que esta función opere
const setupView = document.getElementById('setup-view');
const quizView = document.getElementById('quiz-view');
const resultsView = document.getElementById('results-view');

// 'export' hace que esta función esté disponible
export function showView(viewId) {
  setupView.style.display = 'none';
  quizView.style.display = 'none';
  resultsView.style.display = 'none';

  if (viewId === 'setup') setupView.style.display = 'block';
  else if (viewId === 'quiz') quizView.style.display = 'block';
  else if (viewId === 'results') resultsView.style.display = 'block';
}

export function displayQuestion(question, onAnswerClick) {
  const questionTextEl = document.getElementById('question-text');
  const answersContainerEl = document.getElementById('answers-container');

  questionTextEl.innerHTML = question.question;
  answersContainerEl.innerHTML = '';

  const answers = [...question.incorrect_answers, question.correct_answer];
  const shuffledAnswers = shuffleArray(answers);
  
  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.classList.add('answer-btn');
    button.innerHTML = answer; 
    
    // En lugar de definir la lógica aquí, llamamos a la función
    // que nos pasaron como 'onAnswerClick'
    button.addEventListener('click', (event) => {
      onAnswerClick(event, answer, question.correct_answer);
    });
    
    answersContainerEl.appendChild(button);
  });
}

export function startTimer(timerEl, onTimeUp) {
  let timeLeft = 15;
  timerEl.textContent = timeLeft;

  // Devolvemos el "interval" para que el archivo main.js pueda limpiarlo
  return setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      onTimeUp(); // Llamamos a la función que nos pasaron cuando el tiempo se acaba
    }
  }, 1000);
}

export function showResults(viewElements, score, questionCount, totalTime) {
  // Mostramos los datos en los elementos que nos pasaron
  viewElements.scoreEl.textContent = `${score} / ${questionCount}`;
  // CAMBIO AQUÍ: "segundos" -> "seconds"
  viewElements.timeTakenEl.textContent = `${totalTime} seconds`; 
  showView('results'); // Usamos la función de este mismo archivo
}

export function displayHistory(historyListEl) {
  const history = JSON.parse(localStorage.getItem('triviaHistory')) || [];
  historyListEl.innerHTML = '';
  
  history.forEach(result => {
    const li = document.createElement('li');
    // CAMBIO AQUÍ: "Fecha", "Puntaje", "Tiempo" -> "Date", "Score", "Time"
    li.textContent = `Date: ${result.date} - Score: ${result.score} - Time: ${result.time}`;
    historyListEl.appendChild(li);
  });
}

// Esta es una función "ayudante" (helper)
// No la exportamos porque solo la usa displayQuestion()
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}