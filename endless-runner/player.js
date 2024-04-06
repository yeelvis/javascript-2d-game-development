import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Standing,
  Rolling,
} from './playerState.js';

export default class Player {
  constructor(game) {
    this.game = game;

    // sprite properties
    this.width = 100;
    this.height = 91.3;
    this.image = document.getElementById('player');

    // state
    this.x = 0;
    this.y = this.groundCoord();
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 1;

    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Standing(this.game),
      new Rolling(this.game),
    ];
  }

  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    // horizaontal movements
    this.x += this.speed;
    if (input.includes('ArrowRight')) {
      this.speed = this.maxSpeed;
    } else if (input.includes('ArrowLeft')) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
    }

    // horizontal boundaries
    if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }

    // vertical movements
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }

    //sprite animation
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameInterval) {
      this.frameX = (this.frameX + 1) % this.maxFrame;
      this.frameTimer = 0;
    }
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
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
    return this.y >= this.groundCoord();
  }

  groundCoord() {
    return this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.score++;
      }
    });
  }
}
