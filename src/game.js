import Paddle from "/src/paddle";
import InputHandler from "/src/input";
import Ball from "/src/ball";
import Brick from "/src/brick";
import {
	buildLevel,
	level1,
	level2,
	level3,
	level4,
	level5,
	level6,
	level7
} from "/src/levels";

const GAME_STATE = {
	PAUSED: 0,
	RUNNING: 1,
	MENU: 2,
	GAMEOVER: 3,
	NEWLEVEL: 4
};

export default class Game {
	constructor(gameWidth, gameHeight) {
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.gameState = GAME_STATE.MENU;
		this.paddle = new Paddle(this);
		this.ball = new Ball(this);
		this.gameObjects = [];
		this.bricks = [];
		this.lives = 3;
		this.levels = [level1, level2, level3, level4, level5, level6, level7];
		this.currentLevel = 0;
		new InputHandler(this.paddle, this);
	}

	start() {
		if (
			this.gameState !== GAME_STATE.MENU &&
			this.gameState !== GAME_STATE.NEWLEVEL
		)
			return;

		this.bricks = buildLevel(this, this.levels[this.currentLevel]);

		this.gameObjects = [this.ball, this.paddle];

		this.ball.reset();

		this.gameState = GAME_STATE.RUNNING;
	}

	update(deltaTime) {
		if (this.lives === 0) {
			this.gameState = GAME_STATE.GAMEOVER;
		}

		if (
			this.gameState === GAME_STATE.PAUSED ||
			this.gameState === GAME_STATE.MENU ||
			this.gameState === GAME_STATE.GAMEOVER
		) {
			return;
		}

		if (this.bricks.length === 0) {
			this.currentLevel++;
			this.gameState = GAME_STATE.NEWLEVEL;
			this.start();
		}

		[...this.gameObjects, ...this.bricks].forEach(object =>
			object.update(deltaTime)
		);

		this.bricks = this.bricks.filter(brick => !brick.markForDeletion);
	}

	draw(ctx) {
		[...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

		if (this.gameState == GAME_STATE.MENU) {
			ctx.rect(0, 0, this.gameWidth, this.gameHeight);
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.fill();
			ctx.font = "30px Ariel";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText(
				"Use the arrow keys to move the paddle and destroy the bricks",
				this.gameWidth / 2,
				this.gameHeight / 2
			);
			ctx.fillText(
				"Press SPACEBAR to begin!",
				this.gameWidth / 2,
				this.gameHeight / 3
			);
			ctx.font = "70px Ariel";
			ctx.fillText("Bricks", this.gameWidth / 2, this.gameHeight / 6);
		}

		if (this.gameState == GAME_STATE.PAUSED) {
			ctx.rect(0, 0, this.gameWidth, this.gameHeight);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fill();
			ctx.font = "70px Ariel";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
		}

		if (this.gameState == GAME_STATE.GAMEOVER) {
			ctx.rect(0, 0, this.gameWidth, this.gameHeight);
			ctx.fillStyle = "rgba(0,0,0,1)";
			ctx.fill();
			ctx.font = "70px Ariel";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.fillText("GAMEOVER", this.gameWidth / 2, this.gameHeight / 2);
		}
	}

	togglePause() {
		if (this.gameState == GAME_STATE.PAUSED) {
			this.gameState = GAME_STATE.RUNNING;
		} else {
			this.gameState = GAME_STATE.PAUSED;
		}
	}
}
