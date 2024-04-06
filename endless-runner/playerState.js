import { Dust, Fire } from './particle.js';

const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  STANDING: 4,
  ROLLING: 5,
  DIVING: 6,
  HIT: 7,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super(states.SITTING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 5;
  }

  handleInput(input) {
    if (input.includes('ArrowRight') || input.includes('ArrowLeft')) {
      this.game.player.setState(states.RUNNING, 1);
    }
    if (input.includes('ArrowUp')) {
      this.game.player.setState(states.JUMPING, 1);
    }
    if (input.includes(' ')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Running extends State {
  constructor(game) {
    super(states.RUNNING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 9;
  }

  handleInput(input) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.includes('ArrowDown')) {
      this.game.player.setState(states.SITTING, 0);
    }
    if (input.includes('ArrowUp')) {
      this.game.player.setState(states.JUMPING, 1);
    }
    if (input.includes(' ')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Jumping extends State {
  constructor(game) {
    super(states.JUMPING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 7;
    if (this.game.player.onGround()) {
      this.game.player.vy = -20;
    }
  }

  handleInput(input) {
    if (this.game.player.vy > 0) {
      this.game.player.setState(states.FALLING, 1);
    }
    if (input.includes(' ')) {
      this.game.player.setState(states.ROLLING, 2);
    }
    // if (input.includes('ArrowDown')) {
    //   this.player.setState(states.SITTING);
    // }
  }
}

export class Falling extends State {
  constructor(game) {
    super(states.FALLING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 7;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    }
  }
}

export class Standing extends State {
  constructor(game) {
    super(states.STANDING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 0;
    this.game.player.maxFrame = 7;
  }

  handleInput(input) {
    if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
      this.game.player.setState(states.RUNNING, 1);
    }
    if (input.includes('ArrowUp')) {
      this.game.player.setState(states.JUMPING, 1);
    }
    if (input.includes(' ')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super(states.ROLLING, game);
  }

  enter() {
    // update sprite frame
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 7;
  }

  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes(' ') && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (!input.includes(' ') && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    }

    if (
      input.includes('ArrowUp') &&
      input.includes(' ') &&
      this.game.player.onGround()
    ) {
      this.game.player.vy = -20;
    }
  }
}
