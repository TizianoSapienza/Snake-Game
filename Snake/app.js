let canvas,ctx;
let score = 0;
let scoreElement;
let bestScore = localStorage.getItem('bestScore') || 0;
let bestScoreElement;

window.onload = () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  document.addEventListener('keydown',keyDown);
  scoreElement = document.getElementById('score');
  bestScoreElement = document.getElementById('best-score');
  //Game Speed
  const x = 10;
  setInterval(draw, 1000/x);
};

//Grid Size
const gridSize = (tileSize = 21);
let nextX = (nextY = 0);

//Snake Info
const defaultTailSize = 3;
let tailSize = defaultTailSize;
let snakeTrail = [];
let snakeY = 10;
let snakeX = (snakeY = 10);
let foodX = (foodY = 15);

function draw() {
  //Snake movement
  snakeX += nextX;
  snakeY += nextY;

  if(snakeX < 0) {
    snakeX = gridSize - 1;
  }

  if(snakeX > gridSize - 1) {
    snakeX = 0;
  }

  if (snakeY < 0) {
    snakeY = gridSize - 1;
  }

  if(snakeY > gridSize - 1) {
    snakeY = 0;
  }

  
  //Snake eats food
  if(snakeX == foodX && snakeY == foodY) {
    tailSize++;
    do {
      foodX = Math.floor(Math.random() * gridSize);
      foodY = Math.floor(Math.random() * gridSize);
    } while (snakeTrail.some(segment => segment.x === foodX && segment.y === foodY));
    score++;
    if (score > bestScore) { // Update best score if current score is higher
      bestScore = score;
      localStorage.setItem('bestScore', bestScore); // Save best score to local storage
      updateBestScore();
    }
    updateScore();
  }

  ctx.fillStyle = '#1c1d24';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Draw grid lines
  ctx.strokeStyle = '#71717173';
  for(let i = 0; i < gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }

  //Snake gradient color
  const grd = ctx.createLinearGradient(0, 0, canvas.height, canvas.width);
  grd.addColorStop(0, '#4E65FF');
  grd.addColorStop(0.2, '#5D7CFF');
  grd.addColorStop(0.4, '#6C93FF');
  grd.addColorStop(0.6, '#7BAAFF'); 
  grd.addColorStop(0.8, '#87D1FF'); 
  grd.addColorStop(1, '#92EFFD'); 
  ctx.fillStyle = grd;

  //Draw snake
  for(let i = 0; i < snakeTrail.length; i++) {
    ctx.fillRect(snakeTrail[i].x * tileSize, snakeTrail[i].y * tileSize, tileSize, tileSize);

    //Snake collision
    if(snakeX == snakeTrail[i].x && snakeY == snakeTrail[i].y) {
      tailSize = defaultTailSize; 
      score = 0;//Restart
      updateScore();
      updateBestScore();
    }
  }

  //Apple color
  ctx.fillStyle = '#d1d1d1';
  ctx.fillRect(foodX * tileSize, foodY * tileSize, tileSize, tileSize);

  //Snake trail
  snakeTrail.push({x: snakeX, y: snakeY});
  while(snakeTrail.length > tailSize) {
    snakeTrail.shift();
  }
}

//Keys input
function keyDown(e) {
  switch(e.keyCode) {
    case 37: //Left arrow
      if (nextX !== 1 || snakeTrail.length === 0) {
        nextX = -1;
        nextY = 0;
      }
      break;
    case 38: //Up arrow
      if (nextY !== 1 || snakeTrail.length === 0) {
        nextX = 0;
        nextY = -1;
      }
      break;
    case 39: //Right arrow
      if (nextX !== -1 || snakeTrail.length === 0) {
        nextX = 1;
        nextY = 0;
      }
      break;
    case 40: //Down arrow
      if (nextY !== -1 || snakeTrail.length === 0) {
        nextX = 0;
        nextY = 1;
      }
      break;
  }
}

function updateScore() {
  scoreElement.textContent = 'Current Score: ' + score; // Update the score in the HTML
}

function updateBestScore() {
  bestScoreElement.textContent = 'Best Score: ' + bestScore;
}