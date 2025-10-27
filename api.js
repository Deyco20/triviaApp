/*
 * api.js
 * Este archivo se encarga de toda la comunicación
 * con la API de OpenTDB.
 */

// 'export' hace que esta función esté disponible para otros archivos
export async function loadCategories(categorySelectEl) {
  const apiUrl = 'https://opentdb.com/api_category.php';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    data.trivia_categories.forEach(category => {
      const optionElement = document.createElement('option');
      optionElement.value = category.id;
      optionElement.textContent = category.name;
      categorySelectEl.appendChild(optionElement); 
    });

  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// 'export' hace que esta función esté disponible para otros archivos
export async function fetchQuestions(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  
  const data = await response.json();
  
  if (data.response_code !== 0) {
    if (data.response_code === 1) { 
      return []; // No hay preguntas, devolvemos array vacío
    }
    throw new Error('API could not return questions.');
  }
  
  return data.results; // Devolvemos el array de preguntas
}