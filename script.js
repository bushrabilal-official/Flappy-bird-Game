const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');

// Load assets
const birdImg = new Image();
birdImg.src = 'assets/bird.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'assets/pipe-top.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'assets/pipe-bottom.png';

const jumpSound = new Audio('assets/jump.mp3');

// Game variables
 let bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 20,
  gravity: 0.5,  // Slower fall
  lift: -8,     // Softer jump
  velocity: 0
};


let pipes = [];
let score = 0;
let gameOver = false;

function createPipe() {
  const gap = 120;
  const minHeight = 50;
  const topHeight = Math.floor(Math.random() * (canvas.height - gap - minHeight * 2)) + minHeight;
  return {
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap
  };
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
  pipes.push(createPipe());
}

function draw() {
  if (gameOver) {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 110, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Click 'Restart' to Play Again", 80, canvas.height / 2 + 40);
    restartBtn.style.display = "block";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Bird
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Pipes
  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];

    ctx.drawImage(pipeTopImg, p.x, 0, 50, p.top);
    ctx.drawImage(pipeBottomImg, p.x, p.bottom, 50, canvas.height - p.bottom);

    p.x -= 2;

    // Collision detection
    if (
      bird.x + bird.width > p.x &&
      bird.x < p.x + 50 &&
      (bird.y < p.top || bird.y + bird.height > p.bottom)
    ) {
      gameOver = true;
    }

    // Remove old pipes
    if (p.x + 50 < 0) {
      pipes.splice(i, 1);
      score++;
      i--;
    }
  }

  // Add pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    pipes.push(createPipe());
  }

  // Ground and ceiling
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(draw);
}

// Space key control
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !gameOver) {
    bird.velocity = bird.lift;
    jumpSound.play();
  }
});

// Restart function for button
function restartGame() {
  resetGame();
  draw();
}

// Start the game
resetGame();
draw();
