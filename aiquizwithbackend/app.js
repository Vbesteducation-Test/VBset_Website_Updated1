// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlKHYnMTKd0Ve52Jhqlp1zyjzigLsuRaI",
    authDomain: "gemini-quiz-61a3f.firebaseapp.com",
    databaseURL: "https://gemini-quiz-61a3f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gemini-quiz-61a3f",
    storageBucket: "gemini-quiz-61a3f.appspot.com",
    messagingSenderId: "327131411339",
    appId: "1:327131411339:web:fbb796df5cd3bfa39b758e",
    measurementId: "G-J3J8ZC9B8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Global variables
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let timerInterval;
let totalQuizTime;
let timeLeft;
let questionTimes = [];
let quizStartTime;
let currentUser = null;

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        localStorage.setItem("userId", user.uid);
        console.log("✅ User is signed in:", user.uid);
    } else {
        console.log("❌ No user is signed in");
        if (!window.location.href.includes('register.html')) {
            window.location.href = 'register.html';
        }
    }
});


// Quiz form submission handler
document.getElementById("quizForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const startButton = document.getElementById("startQuizBtn");

    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please register before taking the quiz.");
        window.location.href = "register.html";
        return;
    }

    const formData = {
        examination: document.getElementById("examination").value,
        classLevel: document.getElementById("classLevel").value,
        subject: document.getElementById("subject").value,
        chapter: document.getElementById("chapter").value,
        topic: document.getElementById("topic").value,
        difficulty: document.getElementById("difficulty").value,
        numQuestions: document.getElementById("numQuestions").value
    };

    if (Object.values(formData).some(value => !value)) {
        alert("Please fill in all fields before starting the quiz.");
        return;
    }

    try {
        startButton.innerText = "Loading...";
        startButton.disabled = true;

        const response = await fetch("http://localhost:3000/generate-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.questions) {
            startQuiz(data.questions, formData.difficulty);
        } else {
            alert("Failed to load quiz. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("An error occurred while loading the quiz.");
    } finally {
        startButton.innerText = "Start Quiz";
        startButton.disabled = false;
    }
});


// Quiz timer functions
function getTimerDuration(difficulty, numQuestions) {
    const durations = {
        Easy: 30,
        Medium: 45,
        Hard: 60
    };
    return (durations[difficulty] || 45) * numQuestions;
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting quiz automatically.");
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("quizTimer").innerText = `Time Left: ${formatTime(timeLeft)}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Quiz navigation functions
function startQuiz(fetchedQuestions, difficulty) {
    questions = fetchedQuestions;
    currentQuestionIndex = 0;
    questionTimes = new Array(questions.length).fill(0);
    quizStartTime = new Date();
    totalQuizTime = getTimerDuration(difficulty, questions.length);
    timeLeft = totalQuizTime;

    document.getElementById("quizFormContainer").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");

    generateNavigationPanel();
    startTimer();
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex > 0) {
        questionTimes[currentQuestionIndex - 1] += (totalQuizTime - timeLeft);
    }

    const questionDisplay = document.getElementById("questionDisplay");
    const currentQuestion = questions[currentQuestionIndex];

    questionDisplay.innerHTML = `
        <p><strong>Q${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}</p>
        <div class="options-container">
            ${currentQuestion.options.map((option, i) => `
                <label class="option">
                    <input type="radio" name="q${currentQuestionIndex}" value="${option}" 
                        ${selectedAnswers[`q${currentQuestionIndex}`] === option ? 'checked' : ''}>
                    <span class="option-text">${option}</span>
                </label>
            `).join("")}
        </div>
    `;

    highlightActiveQuestion();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    document.getElementById("prevBtn").classList.toggle("hidden", currentQuestionIndex === 0);
    document.getElementById("nextBtn").classList.toggle("hidden", currentQuestionIndex === questions.length - 1);
    document.getElementById("submitQuizBtn").classList.toggle("hidden", currentQuestionIndex !== questions.length - 1);
}

// Answer handling
function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
    const navButtons = document.querySelectorAll(".nav-btn");

    if (selectedOption) {
        selectedAnswers[`q${currentQuestionIndex}`] = selectedOption.value;
        navButtons[currentQuestionIndex].classList.add("attempted");
    } else {
        navButtons[currentQuestionIndex].classList.add("skipped");
    }
}

// Navigation event listeners
document.getElementById("nextBtn").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
});

// Quiz submission and results
async function submitQuiz() {
    if (!currentUser) {
        alert("Please sign in to submit your quiz");
        return;
    }

    saveAnswer();
    clearInterval(timerInterval);

    const quizEndTime = new Date();
    const totalTimeTaken = Math.round((quizEndTime - quizStartTime) / 1000);
    questionTimes[currentQuestionIndex] += (totalQuizTime - timeLeft);
    const results = calculateResults(totalTimeTaken); 
    
    await saveQuizResults(results);
    displayResults(results);
}

function calculateResults(totalTimeTaken) {
    const totalQuestions = questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const questionResults = [];

    questions.forEach((questionObj, index) => {
        const correctAnswer = questionObj.correctAnswer?.toString().trim() || "";
        const userAnswer = selectedAnswers[`q${index}`]?.toString().trim() || "No answer selected";
        const explanation = questionObj.explanation || "No explanation available.";

        const cleanAnswer = (answer) => answer.replace(/^[A-D][).]\\s*/, "").toLowerCase().trim();
        const isCorrect = cleanAnswer(correctAnswer) === cleanAnswer(userAnswer);

        if (!selectedAnswers[`q${index}`]) {
            unansweredCount++;
        } else if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        questionResults.push({
            question: questionObj.question,
            userAnswer,
            correctAnswer,
            isCorrect,
            timeTaken: questionTimes[index],
            explanation
        });
    });

    return {
        correctCount,
        incorrectCount,
        unansweredCount,
        totalQuestions,
        accuracy: ((correctCount / totalQuestions) * 100).toFixed(1),
        totalTimeTaken,
        averageTimePerQuestion: (totalTimeTaken / totalQuestions).toFixed(1),
        questionResults
    };
}


// Update the saveQuizResults function
async function saveQuizResults(results) {
    try {
        const userId = currentUser ? currentUser.uid : localStorage.getItem("userId");
        if (!userId) {
            console.error("❌ No user ID found. Unable to save quiz results.");
            return;
        }

        const quizResultData = {
            userId: userId,
            examination: document.getElementById("examination").value,
            classLevel: document.getElementById("classLevel").value,
            subject: document.getElementById("subject").value,
            chapter: document.getElementById("chapter").value,
            topic: document.getElementById("topic").value,
            difficulty: document.getElementById("difficulty").value,
            score: results.correctCount,
            totalQuestions: results.totalQuestions,
            accuracy: `${results.accuracy}%`,
            timeTaken: `${results.totalTimeTaken} seconds`,
            timestamp: new Date().toISOString(),
            questions: results.questionResults
        };

        const userQuizRef = ref(database, `quiz_results/${userId}`);
        await push(userQuizRef, quizResultData);

        console.log("✅ Quiz results saved successfully!");
    } catch (error) {
        console.error("❌ Error saving quiz results:", error);
        alert("Failed to save quiz results. Please try again.");
    }
}




function displayResults(results) {
    const resultContainer = document.getElementById("resultContainer");
    
    resultContainer.innerHTML = `
        <div class="results-container">
            <div class="results-header">
                <h2>Quiz Results Summary</h2>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-title">Score</div>
                    <div class="stat-value">${results.correctCount}/${results.totalQuestions}</div>
                    <div class="stat-subtitle">Accuracy: ${results.accuracy}%</div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-title">Questions Breakdown</div>
                    <div class="stat-details">
                        <div class="stat-detail correct">✅ Correct: ${results.correctCount}</div>
                        <div class="stat-detail incorrect">❌ Incorrect: ${results.incorrectCount}</div>
                        <div class="stat-detail unanswered">⭕ Unanswered: ${results.unansweredCount}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">⏱</div>
                    <div class="stat-title">Time Analysis</div>
                    <div class="stat-value">${formatTime(results.totalTimeTaken)}</div>
                    <div class="stat-subtitle">Avg: ${results.averageTimePerQuestion}s per question</div>
                </div>
            </div>

            <div class="detailed-review">
                <h3>Detailed Question Review</h3>
                <div class="questions-review">
                    ${results.questionResults.map((result, index) => `
                        <div class="question-card ${result.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="question-header">
                                <span class="question-number">Question ${index + 1}</span>
                                <span class="question-status ${result.isCorrect ? 'correct-badge' : 'incorrect-badge'}">
                                    ${result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                </span>
                            </div>
                            
                            <div class="question-content">
                                <p class="question-text">${result.question}</p>
                                
                                <div class="answer-section">
                                    <div class="answer-row">
                                        <span class="answer-label">Your Answer:</span>
                                        <span class="answer-value ${result.isCorrect ? 'correct-text' : 'incorrect-text'}">
                                            ${result.userAnswer}
                                        </span>
                                    </div>
                                    
                                    <div class="answer-row">
                                        <span class="answer-label">Correct Answer:</span>
                                        <span class="answer-value correct-text">${result.correctAnswer}</span>
                                    </div>
                                </div>
                                
                                <div class="question-footer">
                                    <div class="time-taken">
                                        ⏱ Time: ${formatTime(result.timeTaken)}
                                    </div>
                                    <div class="explanation">
                                        <strong>📖 Explanation:</strong> ${result.explanation}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <button onclick="restartQuiz()" class="restart-btn">🔄 Take Another Quiz</button>
        </div>
    `;

    resultContainer.classList.remove("hidden");
    document.getElementById("quizContainer").classList.add("hidden");
}

// Navigation panel functions
function generateNavigationPanel() {
    const navPanel = document.getElementById("questionNav");
    navPanel.innerHTML = "";
    questions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.innerText = index + 1;
        btn.classList.add("nav-btn");
        btn.addEventListener("click", () => {
            saveAnswer();
            currentQuestionIndex = index;
            showQuestion();
        });
        navPanel.appendChild(btn);
    });
}

function highlightActiveQuestion() {
    document.querySelectorAll(".nav-btn").forEach((btn, index) => {
        btn.classList.toggle("active", index === currentQuestionIndex);
    });
}

function restartQuiz() {
    document.getElementById("quizForm").scrollIntoView({ behavior: "smooth" });

    document.getElementById("quizForm").reset();
    document.getElementById("quizContainer").innerHTML = "";
    document.getElementById("quizResult").style.display = "none";
    document.getElementById("quizSelection").style.display = "block";
    location.reload();
}

document.getElementById("submitQuizBtn").addEventListener("click", submitQuiz);