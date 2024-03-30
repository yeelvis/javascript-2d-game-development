/** @type{HTMLCanvasElement} */

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTypes = ['worm', 'ghost', 'spider'];
    }

    update(deltaTime) {
      this.enemies = this.enemies.filter((obj) => !obj.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy(new Enemy(this));
        this.enemyTimer = 0;
        console.log(this.enemies);
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => enemy.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((enemy) => enemy.draw());
    }

    #addNewEnemy() {
      const randonEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randonEnemy === 'worm') this.enemies.push(new Worm(this));
      if (randonEnemy === 'ghost') this.enemies.push(new Ghost(this));
      if (randonEnemy === 'spider') this.enemies.push(new Spider(this));

      this.enemies.sort((a, b) => a.y - b.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;

      this.markedForDeletion = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;

      this.markedForDeletion = this.x < 0 - this.width;

      if (this.frameTimer > this.frameInterval) {
        this.frameX = (this.frameX + 1) % this.maxFrame;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
    draw() {
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeigth,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeigth = 171;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeigth * 0.5;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.vx = Math.random() * 0.1 + 0.1;
      this.angle = 0;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeigth = 209;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeigth * 0.5;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      this.vx = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.1;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = 0.7;
      super.draw();
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeigth = 175;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeigth * 0.5;
      this.x = Math.random() * (this.game.width - this.width);
      this.y = 0 - this.height;
      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.angle = 0;
      this.maxLength = Math.random() * this.game.height;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += this.vy * deltaTime;
      if (this.y > this.maxLength) this.vy *= -1;
      this.markedForDeletion = this.y < 0 - this.height - 1;
    }

    draw() {
      // ctx.fillRect(this.x + this.width * 0.5, 0, 1, this.y);
      ctx.beginPath();
      ctx.moveTo(this.x + this.width * 0.5, 0);
      ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
      ctx.stroke();
      super.draw();
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }

  animate(0);
});
