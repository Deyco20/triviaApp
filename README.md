# Trivia App Project

A dynamic, responsive trivia quiz application built with vanilla JavaScript, HTML, and CSS as part of a web development project.


## 🚀 Features

* **Dynamic Setup:** Users can customize their quiz by:
    * Category (loaded dynamically from the API)
    * Difficulty (Easy, Medium, Hard)
    * Question Type (Multiple Choice, True/False)
    * Number of Questions
* **15-Second Timer:** Each question has a 15-second countdown timer. If the time runs out, the question is marked as incorrect.
* **Instant Feedback:** Users receive immediate visual feedback (green for correct, red for incorrect) after each answer.
* **Persistent History:** Game results (score, time taken) are saved to `localStorage` and displayed in a history list.
* **Modular Code:** The JavaScript code is structured into modules (`api.js`, `ui.js`, `main.js`) for readability and maintainability.
* **Responsive Design:** The layout is mobile-first and adapts to all screen sizes, from phones to desktops.

---

## How it Works

1.  **Setup:** On the "Set up your Trivia" screen, choose your desired category, difficulty, type, and number of questions.
2.  **Start:** Click the **"Start"** button to begin.
3.  **Play:** Read the question and click on the answer you believe is correct within the 15-second time limit.
4.  **Results:** After the last question, you will see the "Results" screen, which displays your final score and the total time taken.
5.  **History:** Your game is automatically saved to the "Game History" list.
6.  **Play Again:** Click **"Play Again"** to return to the setup screen.

---

## 💻 Technologies Used

* **HTML5**
* **CSS3** (Flexbox, Grid, Media Queries)
* **JavaScript (ES6+)**
    * Modules (`import`/`export`)
    * Async/Await (`fetch`)
    * DOM Manipulation
    * `localStorage` API
* **[OpenTDB API](https://opentdb.com/)** for all trivia questions and categories.