class Particle {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
    // this.x = x;
    // this.y = y;
    // this.speedX = 0;
    // this.speedY = 0;
  }

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  //   draw() {}
}

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game);
    this.game = game;
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = 'rgba(0,0,0,0.2)';
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}

export class Splash extends Particle {}

export class Fire extends Particle {}
