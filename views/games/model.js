function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(stage) {
		this.stage = stage;
		this.canvas = null;
		this.player = new Player();
		this.ball = new Ball(this.player.xpos, this.player.ypos-8, this.player.speed);
		this.brick = new Brick();
	}

	drawBackground(context, colour) {
		context.beginPath();
		context.rect(0, 0, 800, 800);
		context.fillStyle = colour;
		context.fill();
	}

	drawBorder(context, colour) {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = colour;
		context.strokeRect(0, 0, 800, 800);
	}

	update() {
		// Update new locations of moving stage elements
		this.player.update();
		this.ball.update();

		// Checks for ball collisions
	}

	draw() {
		var context = this.canvas.getContext('2d');
		this.drawBackground(context, "black");
		this.drawBorder(context, "red");
		this.brick.draw(context);
		this.ball.draw(context);
		this.player.draw(context);
	}
}

class Ball {
	constructor(xpos, ypos, playerSpeed) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.radius = 5;
		this.xvelocity = 0;
		this.yvelocity = 0;
		this.onPlayer = playerSpeed;
		this.xDirection = 0;
	}

	collide() {
		// Deals with ball collisions
		console.log("collide");
		this.yvelocity = -this.yvelocity;
		this.xvelocity *= 1.01;
		this.yvelocity *= 1.01;
	}

	update() {
		if (this.onPlayer) {
			this.xpos += this.onPlayer*this.xDirection;
		} else {
			this.xpos += this.xvelocity;
			this.ypos += this.yvelocity;
		}
	}

	draw(context) {
		context.beginPath();
		context.arc(this.xpos, this.ypos, this.radius, 0, 2 * Math.PI);
		context.fillStyle = "silver";
		context.fill();
	}
}

class Player {
	constructor() {
		this.xpos = 400;
		this.ypos = 780;
		this.length = 60;
		this.speed = 10;
		this.xDirection = 0;
		this.hasBall = true;
	}

	releaseBall(ball) {
		ball.xvelocity = 0;
		ball.yvelocity = 1;
		ball.collide();
		this.hasBall = false;
		ball.onPlayer = 0;
	}

	fireBullets() {
		// Feature to be added
	}

	action(ball) {
		if (this.hasBall) {
			console.log("released ball");
			this.releaseBall(ball);
		} else {
			console.log("fired bullet");
			this.fireBullets();
		}
	}

	move(action, ball=false) {
		console.log(action);
		if (action == "left") {
			this.xDirection = -1;
			if (this.hasBall) {
				ball.xDirection = -1;
			}
		} else if (action == "right") {
			this.xDirection = 1;
			if (this.hasBall) {
				ball.xDirection = 1;
			}
		} else if (action == "spacebar"){
			if (this.hasBall) {
				console.log("released ball");
				this.releaseBall(ball);
			} else {
				console.log("fired bullet");
				this.fireBullets();
			}
		}
	}

	stop(action, ball=false) {
		if (action == "left" || action == "right") {
			this.xDirection = 0;
			if (this.hasBall) {
				ball.xDirection = 0;
			}
		}
	}

	update() {
		this.xpos += this.speed*this.xDirection;
	}

	draw(context) {
		context.beginPath();
		context.moveTo(this.xpos-(this.length/2), this.ypos);
		context.lineTo(this.xpos+(this.length/2), this.ypos);
		context.lineWidth = 5;
		context.strokeStyle = "white";
		context.stroke();
	}
}

class Brick {
	constructor() {
		this.xpos = 50;
		this.ypos = 50;
		this.width = 50;
		this.height = 20;
		this.colour = "green";
	}

	draw(context) {
		context.beginPath();
		context.rect(this.xpos, this.ypos, this.width, this.height);
		context.fillStyle = this.colour;
		context.fill();
	}
}