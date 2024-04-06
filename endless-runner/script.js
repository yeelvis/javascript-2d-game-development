import Player from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from './enemy.js';
import { UI } from './UI.js';

window.addEventListener('load', function (e) {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.enemies = [];
      this.particles = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.score = 0;
      this.fontColor = 'black';

      this.debug = true;

      this.player = new Player(this);
      this.inputHandler = new InputHandler(this);
      this.background = new Background(this);
      this.ui = new UI(this);
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.background.update();
      this.player.update(this.inputHandler.keys, deltaTime);
      // handleEnemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });

      //handle particles update
      this.particles.forEach((particle) => {
        particle.update(deltaTime);
        if (particle.markedForDeletion) {
          this.particles.splice(this.particles.indexOf(particle), 1);
        }
      });
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.particles.forEach((particle) => particle.draw(context));

      this.ui.draw(context);
    }
    addEnemy() {
      if (this.speed > 0) {
        Math.random() < 0.5
          ? this.enemies.push(new GroundEnemy(this))
          : this.enemies.push(new ClimbingEnemy(this));
      }

      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});
