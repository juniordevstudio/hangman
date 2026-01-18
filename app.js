
const WORD_SETS = [
  { category: "Animals", words: ["tiger", "giraffe", "elephant", "panda", "dolphin", "kangaroo", "penguin"] },
  { category: "Fruits",  words: ["mango", "banana", "orange", "papaya", "strawberry", "pineapple"] },
  { category: "Space",  words: ["planet", "rocket", "astronaut", "galaxy", "comet", "satellite"] },
  { category: "Sports", words: ["cricket", "soccer", "tennis", "hockey", "badminton", "basketball"] }
];

const MAX_WRONG = 6;

const elLives = document.getElementById("lives");
const elDrawing = document.getElementById("drawing");
const elCategory = document.getElementById("category");
const elWord = document.getElementById("word");
const elWrong = document.getElementById("wrong");
const elKeys = document.getElementById("keys");
const elStatus = document.getElementById("status");
const btnNew = document.getElementById("newGame");
const btnHint = document.getElementById("hintBtn");

let answer = "";
let category = "";
let guessed = new Set();
let wrong = new Set();
let gameOver = false;

const DRAWINGS = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

function pickWord() {
  const set = WORD_SETS[Math.floor(Math.random() * WORD_SETS.length)];
  category = set.category;
  answer = set.words[Math.floor(Math.random() * set.words.length)].toLowerCase();
}

function renderWord() {
  elWord.innerHTML = "";
  for (const ch of answer) {
    const slot = document.createElement("div");
    slot.className = "slot";
    if (ch === " ") {
      slot.textContent = " ";
      slot.style.border = "none";
      slot.style.background = "transparent";
      slot.style.width = "14px";
    } else if (guessed.has(ch)) {
      slot.textContent = ch.toUpperCase();
      slot.classList.add("revealed");
    } else {
      slot.textContent = "";
    }
    elWord.appendChild(slot);
  }
}

function renderKeys() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  elKeys.innerHTML = "";
  for (const L of letters) {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = L;
    const l = L.toLowerCase();

    if (guessed.has(l) || wrong.has(l) || gameOver) btn.disabled = true;
    if (guessed.has(l)) btn.classList.add("good");
    if (wrong.has(l)) btn.classList.add("bad");

    btn.addEventListener("click", () => guessLetter(l));
    elKeys.appendChild(btn);
  }
}

function renderStatus() {
  const wrongCount = wrong.size;
  const livesLeft = MAX_WRONG - wrongCount;

  elLives.textContent = String(livesLeft);
  elDrawing.textContent = DRAWINGS[wrongCount];

  elCategory.textContent = category;

  elWrong.textContent = wrongCount === 0 ? "—" : [...wrong].map(x => x.toUpperCase()).join(" ");

  const won = isWin();
  const lost = wrongCount >= MAX_WRONG;

  elStatus.className = "status";
  if (won) {
    elStatus.textContent = "You won! 🎉 Nice guessing!";
    elStatus.classList.add("win");
    gameOver = true;
  } else if (lost) {
    elStatus.textContent = `Game over 😭 The word was: ${answer.toUpperCase()}`;
    elStatus.classList.add("lose");
    gameOver = true;
  } else {
    elStatus.textContent = "Keep going 😄";
  }
}

function isWin() {
  for (const ch of answer) {
    if (ch !== " " && !guessed.has(ch)) return false;
  }
  return true;
}

function guessLetter(l) {
  if (gameOver) return;
  if (!/^[a-z]$/.test(l)) return;
  if (guessed.has(l) || wrong.has(l)) return;

  if (answer.includes(l)) guessed.add(l);
  else wrong.add(l);

  render();
}

function giveHint() {
  if (gameOver) return;

  // Reveal one random unrevealed letter (not spaces)
  const hidden = [...new Set(answer.split(""))]
    .filter(ch => ch !== " " && !guessed.has(ch));

  if (hidden.length === 0) return;

  const pick = hidden[Math.floor(Math.random() * hidden.length)];
  guessed.add(pick);
  render();
}

function newGame() {
  pickWord();
  guessed = new Set();
  wrong = new Set();
  gameOver = false;
  render();
}

function render() {
  renderWord();
  renderStatus();
  renderKeys();
}

btnNew.addEventListener("click", newGame);
btnHint.addEventListener("click", giveHint);

// Let kids type on keyboard too
window.addEventListener("keydown", (e) => {
  const l = e.key.toLowerCase();
  guessLetter(l);
});

newGame();
