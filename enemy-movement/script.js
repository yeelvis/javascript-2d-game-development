/** @type{HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);
const numberOfEnemies = 10;

const enemiesArray = [];

let gameFrame = 0;

const enemySpriteSelection = [
  {
    imageSrc: './enemies/enemy1.png',
    spriteWidth: 293,
    spriteHeight: 155,
  },
  {
    imageSrc: './enemies/enemy2.png',
    spriteWidth: 266,
    spriteHeight: 188,
  },
  {
    imageSrc: './enemies/enemy3.png',
    spriteWidth: 218,
    spriteHeight: 177,
  },
  {
    imageSrc: './enemies/enemy4.png',
    spriteWidth: 213,
    spriteHeight: 213,
  },
];

class Enemy {
  constructor(imageSrc, spriteWidth, spriteHeight) {
    this.image = new Image();
    this.image.src = imageSrc;

    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteWidth / 2.5;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
    this.newX = Math.random() * (canvas.width - this.width);
    this.newY = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.interval = Math.floor(Math.random() * 200 + 50);
  }
  update() {
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;
    this.x -= dx / 70;
    this.y -= dy / 70;
    // this.x = 0;
    // this.y = 0;

    if (this.x + this.width < 0) this.x = canvas.width;

    //animate sprites
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// select enemy type
enemyType = enemySpriteSelection[3];

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(
    new Enemy(enemyType.imageSrc, enemyType.spriteWidth, enemyType.spriteHeight)
  );
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
