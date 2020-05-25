import { detectColision } from "/src/collisionDetection";
import { detectCollision } from "./collisionDetection";

export default class Brick {
	constructor(game, position) {
		this.image = document.getElementById("imgBrick");

		this.game = game;

		this.position = position;
		this.width = 80;
		this.height = 24;

		let markForDeletion = false;
	}

	update() {
		if (detectCollision(this.game.ball, this)) {
			this.game.ball.speed.y = -this.game.ball.speed.y;
			this.markForDeletion = true;
		}
	}

	draw(ctx) {
		ctx.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}
}
