const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);
let trapIndex;
let gameOver = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function setTrapIndex() {
  trapIndex = Math.floor(Math.random() * 9);
}

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function handleClick(e) {
  const index = parseInt(e.target.dataset.index);
  if (grid[index] || gameOver || currentPlayer !== "X") return;

  playMove(index);
  if (!gameOver) {
    setTimeout(aiMove, 500); // Petite pause pour l'IA
  }
}

function playMove(index) {
  if (grid[index] !== null) return;

  const cell = board.querySelector(`.cell[data-index="${index}"]`);

  // Vérifie si la case cliquée est le piège
  if (index === trapIndex) {
    document.body.classList.add("trap-active");
    gameOver = true;
    statusText.textContent = `Joueur ${currentPlayer} a perdu !`;
    statusText.classList.add("lost");
    return;
  }

  grid[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  const winner = checkWinner();
  if (winner) {
    statusText.textContent =
      winner === "Egalité" ? "Match nul !" : `Joueur ${winner} a gagné !`;
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `À ${currentPlayer} de jouer`;
  }
}

function aiMove() {
  if (gameOver || currentPlayer !== "O") return;

  // IA stratégique : gagne > bloque > centre > aléatoire
  const move =
    getStrategicMove("O") || getStrategicMove("X") || chooseBestMove();

  if (move !== null) {
    playMove(move);
  }
}

function getStrategicMove(player) {
  for (const [a, b, c] of winningCombinations) {
    const line = [grid[a], grid[b], grid[c]];
    const indices = [a, b, c];
    const playerCount = line.filter((v) => v === player).length;
    const emptyIndex = line.findIndex((v) => v === null);

    if (playerCount === 2 && emptyIndex !== -1) {
      return indices[emptyIndex];
    }
  }
  return null;
}

function chooseBestMove() {
  const center = 4;
  if (grid[center] === null) return center;

  const emptyIndices = grid
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  trapIndex = Math.floor(Math.random() * 9);
  statusText.textContent = "Joueur X commence";
  statusText.classList.remove("lost");
  setTrapIndex();

  document.body.classList.remove("trap-active");

  board.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.classList.remove("trap");
    // remet le trap sur une case aléatoire
    if (index === trapIndex) {
      cell.classList.add("trap");
    }
  });
}

function createBoard() {
  setTrapIndex();
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (i === trapIndex) cell.classList.add("trap");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);
createBoard();
