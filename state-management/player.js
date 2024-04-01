import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
  FallingLeft,
  FallingRight,
} from './state.js';

export default class Player {
  constructor(gameWidth, gameHeight) {
    // game boundaries
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    // sprite properties
    this.image = document.getElementById('dogImage');
    this.spriteWidth = 200;
    this.spriteHeight = 181.83;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 7;
    this.fps = 30;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;

    // player states
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
      new FallingLeft(this),
      new FallingRight(this),
    ];
    this.currentState = this.states[1];
    this.x = (this.gameWidth - this.spriteWidth) * 0.5;
    this.y = this.gameHeight - this.spriteHeight;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 0.5;
  }

  draw(context, deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      this.frameX = (this.frameX + 1) % this.maxFrame;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth,
      this.spriteHeight
    );
  }
  update(input) {
    this.currentState.handleInput(input);
    this.#setXWithBoundingCondition();
    this.#setYWithBoundingCondition();
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onGround() {
    return this.y >= this.gameHeight - this.spriteHeight;
  }

  #setXWithBoundingCondition() {
    this.x += this.speed;
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.x >= this.gameWidth - this.spriteWidth) {
      this.x = this.gameWidth - this.spriteWidth;
    }
  }

  #setYWithBoundingCondition() {
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
    }

    if (this.y > this.gameHeight - this.spriteHeight) {
      this.y = this.gameHeight - this.spriteHeight;
    }
  }
}
