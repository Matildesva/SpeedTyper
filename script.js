const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and patience.",
    "SpeedTyper helps improve your typing skills.",
    "Consistency is the key to improving your typing speed.",
    "Practice makes progress."
];

let timer, startTime;
let quoteText =  document.getElementById("quote");
let inputBox = document.getElementById("inputBox");
let timerDisplay = document.getElementById("timer");
let wpmDisplay = document.getElementById("wpm");
let accuracyDisplay = document.getElementById("accuracy");
let restartButton = document.getElementById("restart");

let wpmData = [], timeData = [];
let wpmChart;

function startGame() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
    inputBox.value = "";
    inputBox.disabled = false;
    inputBox.focus();
    startTime = null;
    clearInterval(timer);

    timerDisplay.textContent =  "Time: 0s";
    wpmDisplay.textContent = "WPM: 0";
    accuracyDisplay.textContent = "Accuracy: 100%";

    wpmData = [];
    timeData = [];
    if (wpmChart) wpmChart.destroy();
    initializeChart();
}

function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    const seconds = Math.floor(elapsed);
    timerDisplay.textContent = `Time: ${seconds}s`;

    const wpm = calculateWPM(elapsed);
    updateChart(seconds, wpm);

    if (seconds >= 60) endGame(); // optional limit
}

function calculateWPM(time) {
    const typedWords = inputBox.value.trim().split(/\s+/).filter(Boolean).length;
    const wpm = time > 0 ? Math.round((typedWords / time) * 60) : 0;
    wpmDisplay.textContent = `WPM: ${wpm}`;
    return wpm;
}

function calculateAccuracy() {
    const typed = inputBox.value;
    const target = quoteText.textContent;
    let correct = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === target[i]) correct++;
    }

    const accuracy = (correct / target.length) * 100;
    accuracyDisplay.textContent = `Accuracy: ${Math.round(accuracy)}%`;
}

function checkCompletion() {
    if (inputBox.value.trim() === quoteText.textContent.trim()) {
        endGame(true);
    }
}

function endGame(success = false) {
    clearInterval(timer);
    inputBox.disabled = true;
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    const finalWPM = calculateWPM(finalTime);
    calculateAccuracy();
    timerDisplay.textContent += " ✅";
    if (success) {
        setTimeout(() => {
            alert(`✅ Well done!\nWPM: ${finalWPM}\nAccuracy: ${accuracyDisplay.textContent.split(": ")[1]}`);
            startGame();
        }, 200);
    }
}

function initializeChart() {
    const ctx = document.getElementById('wpmChart').getContext('2d');
    wpmChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: [{
                label: 'WPM Over Time',
                data: wpmData,
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Typing Speed (WPM)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Words Per Minute'
                    }
                }
            }
        }
    });
}

function updateChart(time, wpm) {
    timeData.push(time);
    wpmData.push(wpm);
    wpmChart.data.labels = timeData;
    wpmChart.data.datasets[0].data = wpmData;
    wpmChart.update();
}

inputBox.addEventListener("input", () => {
    startTimer();
    calculateAccuracy();
    checkCompletion();
});

inputBox.addEventListener( "keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // disables line breaks
    }

});



restartButton.addEventListener("click", () => {
    const confirmRestart = confirm("Restart the test?");
    if (confirmRestart) startGame();
});

window.onload = startGame;
