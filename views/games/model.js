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
		context.moveTo(0, 800);
		context.lineTo(0, 0);
		context.lineTo(800, 0);
		context.lineTo(800, 800);
		context.stroke();
	}

	update() {
		if (!this.ball.onPlayer) {
			var ball_floored_xpos = Math.floor(this.ball.xpos);
			var ball_floored_ypos = Math.floor(this.ball.ypos);

			// Check ball collisions with players/walls/bricks
			if (ball_floored_ypos + this.ball.radius >= this.player.ypos - (this.player.height/2)
				&& this.player.xpos - (this.player.length/2) <= ball_floored_xpos
				&& ball_floored_xpos <= this.player.xpos + (this.player.length/2)) {
				this.ball.bounce("player");
			} else if (ball_floored_ypos - this.ball.radius <= 1) {
				this.ball.bounce("top wall");
			} else if (ball_floored_xpos - this.ball.radius <= 1) {
				this.ball.bounce("left wall");
			} else if (ball_floored_xpos + this.ball.radius >= this.canvas.width-1) {
				this.ball.bounce("right wall");
			} else if (ball_floored_ypos - this.ball.radius == this.brick.ypos + this.brick.height
				&& this.brick.xpos <= ball_floored_xpos && ball_floored_xpos <= this.brick.xpos + this.brick.width) {
				this.ball.bounce("bottom of brick");
			} else if (ball_floored_ypos + this.ball.radius == this.brick.ypos
				&& this.brick.xpos <= ball_floored_xpos && ball_floored_xpos <= this.brick.xpos + this.brick.width) {
				this.ball.bounce("top of brick");
			} else if (ball_floored_xpos + this.ball.radius == this.brick.xpos
				&& this.brick.ypos <= ball_floored_ypos && ball_floored_ypos <= this.brick.ypos + this.brick.height) {
				this.ball.bounce("left of brick");
			} else if (ball_floored_xpos - this.ball.radius == this.brick.xpos + this.brick.width
				&& this.brick.ypos <= ball_floored_ypos && ball_floored_ypos <= this.brick.ypos + this.brick.height) {
				this.ball.bounce("right of brick");
			}
		}

		// Check Player can't move off the board
		if (this.player.xpos + (this.player.speed * this.player.xDirection) < this.ball.radius ||
			this.player.xpos + (this.player.speed * this.player.xDirection) > this.canvas.width-this.ball.radius) {
			this.player.stop("left", this.ball);
		} else {
			this.player.update();
		}
		
		// Update new locations of moving stage elements
		this.ball.update();
	}

	draw() {
		var context = this.canvas.getContext('2d');
		this.drawBackground(context, "black");
		this.drawBorder(context, "red");
		this.player.draw(context);
		this.ball.draw(context);
		this.brick.draw(context);
	}
}

class Ball {
	constructor(xpos, ypos, playerSpeed) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.radius = 4;
		this.xvelocity = 0;
		this.yvelocity = 0;
		this.onPlayer = playerSpeed;
		this.xDirection = 0;
		this.numOfBounces = 0;
		this.speedCap = 3;
	}

	bounce(item=null) {
		console.log("bounce");
		// Deals with ball bounces
		if (this.onPlayer) {
			this.onPlayer = 0;
			this.yvelocity *= -1;
		} else {
			console.log(item);
			// Bounce off Player or Top Wall or top/bottom of brick
			if (item == "player" || item == "top wall" || item == "top of brick" || item == "bottom of brick") {
				this.yvelocity *= -1;
			}

			// Bounce off Left Wall or Right Wall or left/right of brick
			if (item == "left wall" || item == "right wall" || item == "left of brick" || item == "right of brick") {
				this.xvelocity *= -1;
			}
		}

		// Increase ball speed
		// if (++this.numOfBounces % 10 == 0) {
		// 	var xvel = this.xvelocity * 1.10;
		// 	var yvel = this.yvelocity * 1.10;
		// 	this.xvelocity = (Math.abs(xvel) > this.speedCap) ? (xvel > 0 ? this.speedCap : -1*this.speedCap) : xvel;
		// 	this.yvelocity = (Math.abs(yvel) > this.speedCap) ? (yvel > 0 ? this.speedCap : -1*this.speedCap) : yvel;
		// }
	}

	update() {
		if (this.onPlayer) {
			this.xpos += this.onPlayer * this.xDirection;
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
		this.height = 6;
		this.length = 60;
		this.speed = 10;
		this.xDirection = 0;
		this.hasBall = true;
	}

	releaseBall(ball) {
		ball.xvelocity = ball.speedCap;
		ball.yvelocity = ball.speedCap;
		ball.bounce();
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
		} else if (action == "spacebar") {
			if (this.hasBall) {
				console.log("released ball");
				this.releaseBall(ball);
				this.hasBall = false;
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
		this.xpos += this.speed * this.xDirection;
	}

	draw(context) {
		context.beginPath();
		context.moveTo(this.xpos-(this.length/2), this.ypos);
		context.lineTo(this.xpos+(this.length/2), this.ypos);
		context.lineWidth = this.height;
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