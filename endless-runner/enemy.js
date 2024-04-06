class Enemy {
  constructor(game) {
    this.game = game;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    if (this.frameTimer >= this.frameInterval) {
      this.frameX = (this.frameX + 1) % this.maxFrame;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    //delete object if outside of boundary
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
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
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.game = game;

    this.width = 60;
    this.height = 44;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 6;
    this.image = document.getElementById('enemy_fly');
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.game = game;
    this.image = document.getElementById('enemy_plant');

    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 2;
  }
}
export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.game = game;
    this.image = document.getElementById('enemy_spider_big');

    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.maxFrame = 6;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }

    if (this.y < -this.height) {
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width * 0.5, 0);
    context.lineTo(this.x + this.width * 0.5, this.y + 50);
    context.stroke();

    // context.fillColor = 'black';
    // context.fillRect(
    //   this.x + this.width * 0.5,
    //   0,
    //   2,
    //   this.y + this.height * 0.5
    // );
  }
}
