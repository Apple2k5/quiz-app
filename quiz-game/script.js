// Select DOM elements
const sectionSelector = document.getElementById('section-selector');
const difficultySelector = document.getElementById('difficulty-selector');
const quizContainer = document.querySelector('.quiz-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');

// Quiz data
const quizData = {
    "Math": {
        "Easy": [
            { question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
            { question: "What is 10 * 10?", options: ["100", "50", "200"], answer: "100" }
        ],
        "Medium": [
            { question: "What is 15 + 25?", options: ["30", "40", "50"], answer: "40" },
            { question: "What is 7 * 8?", options: ["56", "64", "72"], answer: "56" }
        ],
        "Hard": [
            { question: "What is √144?", options: ["10", "12", "14"], answer: "12" },
            { question: "What is 2^5?", options: ["16", "32", "64"], answer: "32" }
        ]
    },
    "Science": {
        "Easy": [
            { question: "What is H2O?", options: ["Water", "Hydrogen", "Oxygen"], answer: "Water" },
            { question: "What is the unit of force?", options: ["Joule", "Newton", "Watt"], answer: "Newton" }
        ],
        "Medium": [
            { question: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Fe"], answer: "Au" },
            { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s"], answer: "300,000 km/s" }
        ],
        "Hard": [
            { question: "What is Einstein's famous equation?", options: ["E=mc^2", "F=ma", "PV=nRT"], answer: "E=mc^2" },
            { question: "What is the smallest particle of an element?", options: ["Atom", "Molecule", "Cell"], answer: "Atom" }
        ]
    }
};

let currentSection = null;
let currentDifficulty = null;
let currentQuestionIndex = 0;
let score = 0;

// Event listeners for section selection
document.querySelectorAll('.section-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentSection = button.dataset.section;
        sectionSelector.classList.add('hidden');
        difficultySelector.classList.remove('hidden');
    });
});

// Event listeners for difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentDifficulty = button.dataset.difficulty;
        difficultySelector.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        startQuiz();
    });
});

// Function to start the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
}

// Function to display a question
function displayQuestion() {
    const sectionQuestions = quizData[currentSection]?.[currentDifficulty];
    if (!sectionQuestions) {
        console.error("Invalid section or difficulty:", currentSection, currentDifficulty);
        return;
    }

    const currentQuestion = sectionQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    questionElement.classList.remove('show');
    void questionElement.offsetWidth; // Trigger reflow
    questionElement.classList.add('show');

    optionsElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option === currentQuestion.answer));
        optionsElement.appendChild(button);
    });

    updateProgress(currentQuestionIndex + 1, sectionQuestions.length);
}

// Function to check the answer
function checkAnswer(isCorrect) {
    if (isCorrect) {
        celebrate();
        document.getElementById('correct-sound').play();
        score++;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        document.getElementById('wrong-sound').play();
    }
    nextBtn.disabled = false;
}

// Function to proceed to the next question
function nextQuestion() {
    currentQuestionIndex++;
    const sectionQuestions = quizData[currentSection]?.[currentDifficulty];
    if (currentQuestionIndex < sectionQuestions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Function to update the progress bar
function updateProgress(current, total) {
    if (!total || total === 0) {
        console.error("Invalid total questions:", total);
        return;
    }

    const progress = (current / total) * 100;
    progressBar.style.width = `${progress}%`;

    if (current === total) {
        progressBar.classList.add('full');
    } else {
        progressBar.classList.remove('full');
    }
}

// Function to celebrate correct answers
function celebrate() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

// Function to end the quiz
function endQuiz() {
    questionElement.textContent = "Quiz Completed!";
    optionsElement.innerHTML = '';
    nextBtn.style.display = 'none';
    progressBar.style.width = '100%';
    progressBar.classList.add('full');
}

// Add event listener to the Next Question button
nextBtn.addEventListener('click', nextQuestion);