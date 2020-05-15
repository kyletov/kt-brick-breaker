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
		// Check ball collisions with players/walls/bricks
		if (this.ball.ypos + this.ball.radius == this.player.ypos - this.player.height/2
			&& this.ball.xpos >= this.player.xpos - (this.player.length/2)
			&& this.ball.xpos <= this.player.xpos + (this.player.length/2)) {
			this.ball.bounce("player");
		} else if (this.ball.ypos - this.ball.radius <= 1) {
			this.ball.bounce("top wall");
		} else if (this.ball.xpos - this.ball.radius <= 1) {
			this.ball.bounce("left wall");
		} else if (this.ball.xpos + this.ball.radius >= 799) {
			this.ball.bounce("right wall");
		}

		// else if () {
		// 	this.ball.bounce("bottom brick");
		// } else if () {
		// 	this.ball.bounce("top brick");
		// } else if () {
		// 	this.ball.bounce("left brick");
		// } else if () {
		// 	this.ball.bounce("right brick");
		// } 

		// Update new locations of moving stage elements
		this.player.update();
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
		this.speedCap = 8;
	}

	bounce(item=null) {
		// Deals with ball collisions
		console.log("collide");
		if (this.onPlayer) {
			this.onPlayer = 0;
			this.yvelocity *= -1;
		} else {
			// Bounce off Player or Top Wall
			if (item == "player" || item == "top wall") {
				this.yvelocity *= -1;
			}

			// Bounce off Left Wall or Right Wall
			if (item == "left wall" || item == "right wall") {
				this.xvelocity *= -1;
			}
		}

		console.log("in bounce");

		if (++this.numOfBounces % 10 == 0) {
			// Setting cap ball speed
			var xvel = this.xvelocity * 1.10;
			var yvel = this.yvelocity * 1.10;
			this.xvelocity = (xvel > this.speedCap || xvel < -1*this.speedCap) ? (xvel > 0 ? this.speedCap : -1*this.speedCap) : xvel;
			this.yvelocity = (yvel > this.speedCap || yvel < -1*this.speedCap) ? (yvel > 0 ? this.speedCap : -1*this.speedCap) : yvel;
		}
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
		ball.xvelocity = 1;
		ball.yvelocity = 1;
		ball.bounce();
		this.hasBall = false;
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