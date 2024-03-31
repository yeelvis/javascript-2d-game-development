/** @type{HTMLCanvasElement} */

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1300;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener('keydown', (e) => {
        if (
          (e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowRight' ||
            e.key === 'ArrowLeft') &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }

        if (e.key === 'Enter' && gameOver) restartGame();
      });

      window.addEventListener('keyup', (e) => {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowLeft'
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 8;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.frameTimer = 0;
      this.fps = 20;
      this.frameInterval = 1000 / this.fps;
    }

    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8;
      this.maxFrameY = 0;
    }

    update(input, deltaTime, enemies) {
      //collision detection

      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + this.width / 2) {
          gameOver = true;
        }
      });

      if (this.frameTimer > this.frameInterval) {
        this.frameX = (this.frameX + 1) % this.maxFrame;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else {
        this.speed = 0;
      }

      if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
        this.vy = -32;
      }

      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width;
      }

      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }

      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
    }

    draw(canvasCtx) {
      canvasCtx.strokeStyle = 'white';
      canvasCtx.strokeRect(this.x, this.y, this.width, this.height);
      canvasCtx.beginPath();
      canvasCtx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      canvasCtx.stroke();
      canvasCtx.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 5;
    }

    draw(canvasCtx) {
      canvasCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
      canvasCtx.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }

    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }

    restart() {
      this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemyImage');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 4;
      this.markedForDeletion = false;
    }

    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        this.frameX = (this.frameX + 1) % this.maxFrame;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      this.x -= this.speed;
      this.markedForDeletion = this.x < 0 - this.width;
      if (this.markedForDeletion) {
        score++;
      }
    }

    draw(canvasCtx) {
      canvasCtx.beginPath();
      canvasCtx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      canvasCtx.stroke();
      canvasCtx.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      enemy.draw(ctx);
    });
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
  }
  function displayStatusText(context) {
    context.textAlign = 'left';
    context.font = '40px Helvetica';
    context.fillStyle = 'black';
    context.fillText('Score: ' + score, 20, 50);
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 22, 52);

    if (gameOver) {
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('GAME OVER', canvas.width / 2, 200);
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.fillText('GAME OVER', canvas.width / 2 + 2, 202);
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('Press Enter to restart', canvas.width / 2, 250);
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.fillText('Press Enter to restart', canvas.width / 2 + 2, 252);
    }
  }

  function restartGame() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = Math.random() * 2000 + 1500;
  //   let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    background.draw(ctx);
    player.update(input, deltaTime, enemies);
    player.draw(ctx);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});
