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

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  paused = false;
  pauseBtn.textContent = "Pause";
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = true;
  clearDrops();
  removeEndMessage();
  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
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
  if (score >= 20) {
    message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
  } else {
    message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
  }
  showEndMessage(message, score >= 20);
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
  drop.style.animationDuration = "4s";

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  drop.addEventListener("click", () => {
    if (!gameRunning) return;
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
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";
  clearDrops();
  removeEndMessage();
}
