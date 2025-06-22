// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
let timeLeft = 30;
let timerInterval;

const winningMessages = [
  "Amazing! You brought clean water to a whole village!",
  "You did it! Every drop counts.",
  "Incredible! You made a real difference!",
  "You’re a water hero! Lives changed!"
];
const losingMessages = [
  "Try again! Every drop helps.",
  "Keep going! Clean water is worth it.",
  "Almost there! Give it another shot.",
  "Don’t give up! Every drop matters."
];

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const gameContainer = document.getElementById("game-container");
const difficultySelect = document.getElementById("difficulty-select");

let paused = false;
let difficulty = "normal";
let winScore = 20;
let startTime = 30;
let dropInterval = 1000;

const popSound = new Audio('Sound/810763__mokasza__single-bubble-pop-01.mp3');
popSound.volume = 0.5; // Adjust volume as needed

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", setDifficulty);

function setDifficulty() {
  difficulty = difficultySelect.value;
  if (difficulty === "easy") {
    winScore = 10;
    startTime = 40;
    dropInterval = 1300;
    window.dropFallDuration = 4;
  } else if (difficulty === "normal") {
    winScore = 20;
    startTime = 30;
    dropInterval = 1000;
    window.dropFallDuration = 4;
  } else if (difficulty === "hard") {
    winScore = 30;
    startTime = 20;
    dropInterval = 700;
    window.dropFallDuration = 2.2;
  }
  resetGame();
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  paused = false;
  pauseBtn.textContent = "Pause";
  score = 0;
  timeLeft = startTime;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = true;
  clearDrops();
  removeEndMessage();
  // Create new drops at the interval defined by the current difficulty
  dropMaker = setInterval(createDrop, dropInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (paused) return;
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  paused = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";
  removeAllDrops();
  let message;
  if (score >= winScore) {
    message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
  } else {
    message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
  }
  showEndMessage(message, score >= winScore);
}

function showEndMessage(msg, win) {
  removeEndMessage();
  const msgDiv = document.createElement("div");
  msgDiv.className = win ? "end-message win" : "end-message lose";
  msgDiv.textContent = msg;
  gameContainer.appendChild(msgDiv);
}

function removeEndMessage() {
  const oldMsg = document.querySelector(".end-message");
  if (oldMsg) oldMsg.remove();
}

function clearDrops() {
  removeAllDrops();
}

function removeAllDrops() {
  document.querySelectorAll(".water-drop").forEach(drop => drop.remove());
}

function createDrop() {
  if (!gameRunning || paused) return;

  // Decide drop type: 70% good, 20% dirty (score), 10% dirty (time)
  const rand = Math.random();
  let dropType = "good";
  if (rand > 0.9) dropType = "dirty-time";
  else if (rand > 0.7) dropType = "dirty-score";

  const drop = document.createElement("div");
  drop.className = "water-drop";
  if (dropType === "dirty-score") drop.classList.add("dirty-drop");
  if (dropType === "dirty-time") drop.classList.add("dirty-time-drop");

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";
  drop.style.top = "0";
  // Use variable animation duration for hard mode
  const fallDuration = window.dropFallDuration || 4;
  drop.style.animation = `dropFall ${fallDuration}s linear forwards`;

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    popSound.currentTime = 0;
    popSound.play();
    if (dropType === "good") {
      score++;
      scoreDisplay.textContent = score;
    } else if (dropType === "dirty-score") {
      score -= 2;
      if (score < 0) score = 0;
      scoreDisplay.textContent = score;
    } else if (dropType === "dirty-time") {
      timeLeft -= 3;
      if (timeLeft < 0) timeLeft = 0;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }
    drop.remove();
  });
  gameContainer.appendChild(drop);
}

function pauseGame() {
  if (!gameRunning && !paused) return;
  if (!paused) {
    paused = true;
    clearInterval(dropMaker);
    clearInterval(timerInterval);
    pauseBtn.textContent = "Resume";
    startBtn.disabled = true;
  } else {
    paused = false;
    dropMaker = setInterval(createDrop, 1000);
    timerInterval = setInterval(updateTimer, 1000);
    pauseBtn.textContent = "Pause";
    startBtn.disabled = true;
  }
}

function resetGame() {
  gameRunning = false;
  paused = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = startTime;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";
  clearDrops();
  removeEndMessage();
}
console.log("createDrop called");
