const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and patience.",
    "SpeedTyper helps improve your typing skills."
];

let timer, startTime;
let quoteText = document.getElementById("quote");
let inputBox = document.getElementById("inputBox");
let timerDisplay = document.getElementById("timer");
let wpmDisplay = document.getElementById("wpm");
let accuracyDisplay = document.getElementById("accuracy");
let restartButton = document.getElementById("restart");

function startGame() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
    inputBox.value = "";
    inputBox.focus();
    inputBox.disabled = false;
    startTime = null;
    clearInterval(timer);
    timerDisplay.textContent = "Time: 0s";
    wpmDisplay.textContent = "WPM: 0";
    accuracyDisplay.textContent = "Accuracy: 100%";
}

function startTimer() {
    if (!startTime) {
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    let elapsedTime = (new Date().getTime() - startTime) / 1000;
    timerDisplay.textContent = `Time: ${Math.floor(elapsedTime)}s`;
    calculateWPM(elapsedTime);
}

function calculateWPM(time) {
    let wordsTyped = inputBox.value.trim().split(/\s+/).length;
    let wpm = time > 0 ? Math.round((wordsTyped / time) * 60) : 0;
    wpmDisplay.textContent = `WPM: ${wpm}`;
}

function calculateAccuracy() {
    let typedText = inputBox.value.trim();
    let correctText = quoteText.textContent.trim();
    let correctChars = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === correctText[i]) {
            correctChars++;
        }
    }

    let accuracy = (correctChars / correctText.length) * 100;
    accuracyDisplay.textContent = `Accuracy: ${Math.round(accuracy)}%`;
}

function checkCompletion() {
    let typedText = inputBox.value.trim();
    let correctText = quoteText.textContent.trim();

    if (typedText === correctText) {
        clearInterval(timer);
        inputBox.disabled = true;
        timerDisplay.textContent += " ✅"; // Indicate that the timer has stopped
    }
}

inputBox.addEventListener("input", () => {
    startTimer();
    calculateAccuracy();
    checkCompletion();
});

inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        checkCompletion();
    }
});

restartButton.addEventListener("click", startGame);

window.onload = startGame;
