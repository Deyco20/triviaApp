/*
 * main.js
 * Este es el archivo "cerebro" (controlador).
 */

// --- Importamos las funciones que necesitamos ---
// ¡CAMBIO IMPORTANTE! Renombramos 'displayQuestion' a 'displayQuestionFromUI'
// para evitar confusiones y errores.
import { loadCategories, fetchQuestions } from './api.js';
import { 
  showView, 
  displayQuestion as displayQuestionFromUI, 
  startTimer, 
  showResults, 
  displayHistory 
} from './ui.js';

// Espera a que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Referencias a los Elementos del DOM ---
  const setupForm = document.getElementById('setup-form');
  const categorySelect = document.getElementById('category-select');
  const difficultySelect = document.getElementById('difficulty-select');
  const typeSelect = document.getElementById('type-select');
  const amountInput = document.getElementById('amount-input');
  const timerEl = document.getElementById('timer');
  const resultsViewElements = {
    scoreEl: document.getElementById('score'),
    timeTakenEl: document.getElementById('time-taken'),
    historyListEl: document.getElementById('history-list')
  };
  const returnBtn = document.getElementById('return-btn');

  // --- Variables de Estado del Juego ---
  let currentQuestions = [];      
  let currentQuestionIndex = 0; 
  let score = 0;                  
  let timerInterval;
  let gameStartTime;

  // --- Estado Inicial ---
  loadCategories(categorySelect); 
  showView('setup');
  
  // --- Listener del Formulario ---
  setupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
    const amount = amountInput.value;
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
    
    try {
      const questions = await fetchQuestions(apiUrl); 
      if (questions.length === 0) {
        alert("No questions found for these filters. Please try other options.");
        return;
      }
      startQuiz(questions);
      showView('quiz');
    } catch (error) {
      console.error("Error al buscar las preguntas:", error);
      alert("Could not load questions. Please try again.");
    }
  });

  // --- Listener Botón "Jugar de Nuevo" ---
  returnBtn.addEventListener('click', () => {
    showView('setup');
  });

  // --- Lógica Principal del Juego ---
  
  function startQuiz(questions) {
    currentQuestions = questions;
    currentQuestionIndex = 0;
    score = 0;
    gameStartTime = new Date();
    
    // Llamamos a nuestra nueva función "wrapper"
    showNextQuestion();
  }

  function handleAnswerClick(event, selectedAnswer, correctAnswer) {
    clearInterval(timerInterval); // Detener el timer

    const allButtons = document.querySelectorAll('.answer-btn');
    allButtons.forEach(button => {
      button.disabled = true;
    });

    if (selectedAnswer === correctAnswer) {
      score++;
      if (event) event.target.classList.add('correct');
    } else {
      if (event) event.target.classList.add('incorrect');
      allButtons.forEach(button => {
        if (button.innerHTML === correctAnswer) {
          button.classList.add('correct');
        }
      });
    }

    // Avanzar
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
      setTimeout(() => {
        // Llamamos a nuestra nueva función "wrapper"
        showNextQuestion();
      }, 1000);
    } else {
      // Se acabó el juego
      const gameEndTime = new Date();
      const totalTime = Math.floor((gameEndTime - gameStartTime) / 1000); 

      setTimeout(() => {
        showResults(resultsViewElements, score, currentQuestions.length, totalTime);
        saveAndDisplayHistory(totalTime);
      }, 1000); 
    }
  }
  
  function handleTimeUp() {
    clearInterval(timerInterval);
    // Asegurarnos de que existe la pregunta antes de acceder a 'correct_answer'
    if (currentQuestions[currentQuestionIndex]) {
      const correctAnswer = currentQuestions[currentQuestionIndex].correct_answer;
      handleAnswerClick(null, null, correctAnswer);
    }
  }
  
  /**
   * =======================================================
   * NUEVA FUNCIÓN "WRAPPER" (AQUÍ ESTÁ LA SOLUCIÓN)
   * =======================================================
   * Esta función se encarga de llamar a la UI para mostrar
   * la pregunta Y de iniciar el timer.
   */
  function showNextQuestion() {
    // 1. Obtener la pregunta actual
    const question = currentQuestions[currentQuestionIndex];

    // 2. Llamar a la función de UI importada (la renombramos a displayQuestionFromUI)
    displayQuestionFromUI(question, handleAnswerClick);

    // 3. Limpiar el timer viejo y empezar uno nuevo
    clearInterval(timerInterval);
    timerInterval = startTimer(timerEl, handleTimeUp);
  }
  
  // --- Lógica de Historial (se queda aquí) ---
  function saveAndDisplayHistory(totalTime) {
    const resultData = {
      date: new Date().toLocaleString(),
      score: `${score} / ${currentQuestions.length}`,
      time: `${totalTime} seconds`
    };

    // Guardar
    const history = JSON.parse(localStorage.getItem('triviaHistory')) || [];
    history.unshift(resultData);
    localStorage.setItem('triviaHistory', JSON.stringify(history));
    
    // Mostrar
    displayHistory(resultsViewElements.historyListEl);
  }
  
  // Mostrar historial la primera vez que se carga la app
  // (Asegurándonos de que el elemento exista)
  if (resultsViewElements.historyListEl) {
    displayHistory(resultsViewElements.historyListEl);
  }

});