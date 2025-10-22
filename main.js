// Espera a que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Referencias a los Elementos del DOM ---
  // Vistas
  const setupView = document.getElementById('setup-view');
  const quizView = document.getElementById('quiz-view');
  const resultsView = document.getElementById('results-view');

  // Elementos del formulario
  const setupForm = document.getElementById('setup-form');
  const categorySelect = document.getElementById('category-select');
  const difficultySelect = document.getElementById('difficulty-select');
  const typeSelect = document.getElementById('type-select');
  const amountInput = document.getElementById('amount-input');

  // Elementos de la vista del juego
  const questionTextEl = document.getElementById('question-text');
  const answersContainerEl = document.getElementById('answers-container');
  const timerEl = document.getElementById('timer'); // ¡Ahora sí usaremos este!

  // Variables de Estado del Juego
  let currentQuestions = [];      
  let currentQuestionIndex = 0; 
  let score = 0;                  
  let timerInterval; // NUEVO: Variable para guardar nuestro 'setInterval'

  // --- Estado Inicial ---
  loadCategories();
  showView('setup');
  
  /**
   * ===============================================
   * Listener del Formulario (Sin cambios)
   * ===============================================
   */
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
        alert("No se encontraron preguntas con esos filtros. Intenta con otros.");
        return;
      }
      startQuiz(questions);
      showView('quiz');
    } catch (error) {
      console.error("Error al buscar las preguntas:", error);
      alert("No se pudieron cargar las preguntas. Inténtalo de nuevo.");
    }
  });


  /**
   * ===============================================
   * Cargar Categorías (Sin cambios)
   * ===============================================
   */
  async function loadCategories() {
    const apiUrl = 'https://opentdb.com/api_category.php';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      data.trivia_categories.forEach(category => {
        const optionElement = document.createElement('option');
        optionElement.value = category.id;
        optionElement.textContent = category.name;
        categorySelect.appendChild(optionElement); 
      });
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  }

  /**
   * ===============================================
   * Buscar Preguntas (Sin cambios)
   * ===============================================
   */
  async function fetchQuestions(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('La respuesta de la red no fue exitosa');
    const data = await response.json();
    if (data.response_code !== 0) {
      if (data.response_code === 1) { 
        return [];
      }
      throw new Error('La API no pudo devolver las preguntas.');
    }
    return data.results;
  }

  /**
   * ===============================================
   * FUNCIÓN PARA CAMBIAR DE VISTA (Sin cambios)
   * ===============================================
   */
  function showView(viewId) {
    setupView.style.display = 'none';
    quizView.style.display = 'none';
    resultsView.style.display = 'none';
    if (viewId === 'setup') setupView.style.display = 'block';
    else if (viewId === 'quiz') quizView.style.display = 'block';
    else if (viewId === 'results') resultsView.style.display = 'block';
  }


  /**
   * ===============================================
   * Iniciar el Juego (Sin cambios)
   * ===============================================
   */
  function startQuiz(questions) {
    console.log("¡Juego iniciado! Preguntas recibidas:");
    console.log(questions);
    
    currentQuestions = questions;
    currentQuestionIndex = 0;
    score = 0;
    
    displayQuestion();
  }

  /**
   * ===============================================
   * Mostrar una Pregunta (MODIFICADO)
   * ===============================================
   */
  function displayQuestion() {
    // 1. Obtener la pregunta actual
    const question = currentQuestions[currentQuestionIndex];

    // 2. Poner el texto de la pregunta
    questionTextEl.innerHTML = question.question;

    // 3. Limpiar respuestas anteriores
    answersContainerEl.innerHTML = '';

    // 4. Crear y barajar respuestas
    const answers = [...question.incorrect_answers, question.correct_answer];
    const shuffledAnswers = shuffleArray(answers);
    
    // 5. Crear botones
    shuffledAnswers.forEach(answer => {
      const button = document.createElement('button');
      button.classList.add('answer-btn');
      button.innerHTML = answer; 
      button.addEventListener('click', () => {
        handleAnswerClick(answer, question.correct_answer);
      });
      answersContainerEl.appendChild(button);
    });
    
    // 6. NUEVO: Iniciar el timer para esta pregunta
    startTimer(question.correct_answer);
  }

  /**
   * ===============================================
   * NUEVO: Función para el Timer
   * ===============================================
   */
  function startTimer(correctAnswer) {
    let timeLeft = 15; // Empezamos en 15 segundos
    timerEl.textContent = timeLeft; // Mostramos 15 inmediatamente

    // Limpiamos cualquier timer anterior que pudiera estar corriendo
    clearInterval(timerInterval);

    // Creamos un nuevo intervalo que se ejecutará cada 1000ms (1 segundo)
    timerInterval = setInterval(() => {
      timeLeft--; // Restamos 1 segundo
      timerEl.textContent = timeLeft; // Actualizamos el número en pantalla

      // Si el tiempo llega a 0
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Detenemos este timer
        console.log("¡Se acabó el tiempo!");
        
        // Llamamos a handleAnswerClick, pasando 'null' como respuesta del usuario
        // para que cuente como incorrecta.
        handleAnswerClick(null, correctAnswer); 
      }
    }, 1000);
  }


  /**
   * ===============================================
   * Manejar Clic en Respuesta (MODIFICADO)
   * ===============================================
   */
  function handleAnswerClick(selectedAnswer, correctAnswer) {
    
    // 1. NUEVO: ¡Detener el timer!
    //    El usuario ya respondió, no queremos que siga contando.
    clearInterval(timerInterval);

    // 2. Comprobar si la respuesta es correcta
    if (selectedAnswer === correctAnswer) {
      score++;
      console.log(`¡Correcto! Puntaje: ${score}`);
    } else {
      console.log(`Incorrecto. La respuesta era: ${correctAnswer}`);
    }

    // 3. Avanzar a la siguiente pregunta
    currentQuestionIndex++;

    // 4. Comprobar si se acabó el juego
    if (currentQuestionIndex < currentQuestions.length) {
      // Si hay más preguntas, muestra la siguiente
      // (Le damos un pequeño respiro de 1 segundo para que el usuario vea el feedback)
      // (Aún no hemos añadido el feedback, pero prepararemos el tiempo)
      setTimeout(() => {
        displayQuestion();
      }, 1000); // 1 segundo de espera
      
    } else {
      // Si no hay más preguntas...
      console.log("¡Juego terminado!");
      // (Aquí llamaremos a showResults() en el siguiente paso)
    }
  }


  /**
   * ===============================================
   * Función para barajar un array (Sin cambios)
   * ===============================================
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

});