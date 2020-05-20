function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

const TOPSIDE = "top side";
const LEFTSIDE = "left side";
const BOTTOMSIDE = "bottom side";
const RIGHTSIDE = "right side";

const TOPLEFTCORNER = "top left corner";
const TOPRIGHTCORNER = "top right corner";
const BOTTOMLEFTCORNER = "bottom left corner";
const BOTTOMRIGHTCORNER = "botttom right corner";


class Stage {
	constructor(stage) {
		this.stage = stage;
		this.canvas = null;
		this.player = new Player();
		this.initialBall = new Ball(this.player.xpos, this.player.ypos-8, this.player.speed);
		this.balls = [this.initialBall];
		this.player.setHeldBall(this.balls[0]);
		this.bricks = [];

		// Initialize bricks of stage
		for (let i = 0; i < 10; i++) {
			this.bricks.push(new Brick(50*(i+1), 50*(i+1)));
		}
	}

	resetInitialState() {
		this.balls.push(new Ball(this.player.xpos, this.player.ypos-8, this.player.speed));
		this.player.setHeldBall(this.balls[0]);
	}

	checkCollision(ball) {
		// Checks collisions
		// Returns the player or the brick it collided with
		if (ball.ypos + ball.radius >= this.player.ypos - (this.player.height/2)
			&& this.player.xpos - (this.player.length/2) <= ball.xpos
			&& ball.xpos <= this.player.xpos + (this.player.length/2)) {
			ball.bounce("player");
		} else if (ball.ypos - ball.radius <= 1) {
			ball.bounce("top wall");
		} else if (ball.xpos - ball.radius <= 1) {
			ball.bounce("left wall");
		} else if (ball.xpos + ball.radius >= this.canvas.width-1) {
			ball.bounce("right wall");
		}

		// Check ball collisions with bricks
		for (let brick of this.bricks) {
			switch(brick.isHit(ball)) {
				case BOTTOMSIDE:
					ball.lastHitObject = brick;
					ball.bounce(BOTTOMSIDE);
					break;
				case TOPSIDE:
					ball.lastHitObject = brick;
					ball.bounce(TOPSIDE);
					break;
				case LEFTSIDE:
					ball.lastHitObject = brick;
					ball.bounce(LEFTSIDE);
					break;
				case RIGHTSIDE:
					ball.lastHitObject = brick;
					ball.bounce(RIGHTSIDE);
					break;
				case TOPLEFTCORNER:
					ball.lastHitObject = brick;
					ball.bounce(TOPLEFTCORNER);
					break;
				case TOPRIGHTCORNER:
					ball.lastHitObject = brick;
					ball.bounce(TOPRIGHTCORNER);
					break;
				case BOTTOMLEFTCORNER:
					ball.lastHitObject = brick;
					ball.bounce(BOTTOMLEFTCORNER);
					break;
				case BOTTOMRIGHTCORNER:
					ball.lastHitObject = brick;
					ball.bounce(BOTTOMRIGHTCORNER);
					break;
			}
		}
	}

	calculateReboundAngle(ball) {
		var player = stage.player;

		// Checks where ball collided with the player
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
		for (let ball of this.balls) {
			if (!ball.onPlayer) {

				// TODO: Make checking collisions work with decimals/double/floating point numbers

				// TODO: Ball bounce off angles from player
				// 5 different sections on player determines angle adjustments

				// TODO: Ball bounce off angles from wall corners

				// TODO: Breaking bricks when ball hits it
				this.checkCollision(ball);
			}
		}

		// Check Player can't move off the board
		if (this.player.xpos + (this.player.speed * this.player.xDirection) < this.initialBall.radius ||
			this.player.xpos + (this.player.speed * this.player.xDirection) > this.canvas.width-this.initialBall.radius) {
			this.player.stop("left", this.initialBall);
		} else {
			this.player.update();
		}
		
		// Update new locations of moving stage elements
		for (let ball of this.balls) {
			ball.update();
			if (ball.ypos >= 800) {
				this.balls.splice(this.balls.indexOf(ball), 1);
			}
		}

		if (this.balls.length == 0) {
			this.resetInitialState();
		}
	}

	draw() {
		var context = this.canvas.getContext('2d');
		this.drawBackground(context, "black");
		this.drawBorder(context, "red");
		this.player.draw(context);

		for (let ball of this.balls) {
			ball.draw(context);
		}

		for (let brick of this.bricks) {
			brick.draw(context);
		}
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
		this.initialSpeed = 2;
		this.speedCap = 8;
		this.lastHitObject = null;
	}

	setXDirection(direction) {
		this.xDirection = direction;
	}

	bounce(item=null) {
		console.log("bounce");
		// Deals with ball bounces
		if (this.onPlayer) {
			this.onPlayer = 0;
			this.yvelocity *= -1;
		} else {
			console.log(item);

			// Bounce off Player

			// Bounce off Top Wall or top/bottom of brick
			if (item == "player" || item == "top wall" || item == TOPSIDE || item == BOTTOMSIDE) {
				this.yvelocity *= -1;
			}

			// Bounce off Left Wall or Right Wall or left/right of brick
			if (item == "left wall" || item == "right wall" || item == LEFTSIDE || item == RIGHTSIDE) {
				this.xvelocity *= -1;
			}

			if (item == TOPLEFTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? this.xvelocity : -1*this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? this.yvelocity : -1*this.yvelocity;
			} else if (item == TOPRIGHTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? -1*this.xvelocity : this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? this.yvelocity : -1*this.yvelocity;
			} else if (item == BOTTOMLEFTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? this.xvelocity : -1*this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? -1*this.yvelocity : this.yvelocity;
			} else if (item == BOTTOMRIGHTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? -1*this.xvelocity : this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? -1*this.yvelocity : this.yvelocity;
			}
		}

		// Increase ball speed
		// if (++this.numOfBounces % 10 == 0) {
		// 	var xvel = this.xvelocity * 1.10;
		// 	var yvel = this.yvelocity * 1.10;
		// 	this.xvelocity = (Math.abs(xvel) > this.speedCap) ? (xvel > 0 ? this.speedCap : -1*this.speedCap) : xvel;
		// 	this.yvelocity = (Math.abs(yvel) > this.speedCap) ? (yvel > 0 ? this.speedCap : -1*this.speedCap) : yvel;
		// }

		// var xvel = this.xvelocity * 1.10;
		// var yvel = this.yvelocity * 1.10;
		// this.xvelocity = (Math.abs(xvel) > this.speedCap) ? (xvel > 0 ? this.speedCap : -1*this.speedCap) : xvel;
		// this.yvelocity = (Math.abs(yvel) > this.speedCap) ? (yvel > 0 ? this.speedCap : -1*this.speedCap) : yvel;
	}

	update() {
		if (this.onPlayer) {
			this.xpos += this.onPlayer * this.xDirection;
		} else {
			this.xpos += this.xvelocity;
			this.ypos += this.yvelocity;
			// if ((0 < Math.abs(this.xpos) && Math.abs(this.xpos) < 1) || (0 < Math.abs(this.ypos) && Math.abs(this.ypos) < 1)) {
			// 	// window.alert("Decimal position!: (" + this.xpos + ", " + this.ypos + ")");
			// 	console.log("Decimal position!: (" + this.xpos + ", " + this.ypos + ")");
			// }
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
		this.length = 70;
		this.speed = 10;
		this.xDirection = 0;
		this.hasBall = null;
	}

	setHeldBall(ball) {
		this.hasBall = ball;
	}

	releaseBall() {
		this.hasBall.xvelocity = this.hasBall.initialSpeed;
		this.hasBall.yvelocity = this.hasBall.initialSpeed;
		this.hasBall.bounce();
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

	move(action) {
		console.log(action);
		if (action == "left") {
			this.xDirection = -1;
			if (this.hasBall) {
				this.hasBall.setXDirection(this.xDirection);
			}
		} else if (action == "right") {
			this.xDirection = 1;
			if (this.hasBall) {
				this.hasBall.setXDirection(this.xDirection)
			}
		} else if (action == "spacebar") {
			if (this.hasBall) {
				console.log("released ball");
				this.releaseBall(this.hasBall);
				this.hasBall = null;
			} else {
				console.log("fired bullet");
				this.fireBullets();
			}
		}
	}

	stop(action) {
		if (action == "left" || action == "right") {
			this.xDirection = 0;
			if (this.hasBall) {
				this.hasBall.setXDirection(0);
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
	constructor(xpos, ypos) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.width = 50;
		this.height = 20;
		this.colour = "green";
	}

	whichCorner(ball) {
		let topLeftCorner = Math.sqrt(Math.pow(ball.xpos - this.xpos, 2) + Math.pow(ball.ypos - this.ypos, 2));
		let topRightCorner = Math.sqrt(Math.pow(ball.xpos - (this.xpos + this.width), 2) + Math.pow(ball.ypos - this.ypos, 2));
		let bottomLeftCorner = Math.sqrt(Math.pow(ball.xpos - this.xpos, 2) + Math.pow(ball.ypos - (this.ypos + this.height), 2));
		let bottomRightCorner = Math.sqrt(Math.pow(ball.xpos - (this.xpos + this.width), 2) + Math.pow(ball.ypos - (this.ypos + this.height), 2));

		let corners = [topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner];
		let closestCornerIndex = corners.indexOf(Math.min(topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner));

		switch(closestCornerIndex) {
			case 0:
				return TOPLEFTCORNER;
				break;
			case 1:
				return TOPRIGHTCORNER;
				break;
			case 2:
				return BOTTOMLEFTCORNER;
				break;
			case 3:
				return BOTTOMRIGHTCORNER;
				break;
		}
	}

	isHit(ball) {
		if (ball.lastHitObject == this) {
			return false;
		}

		let inXRange = ball.xpos >= this.xpos - ball.radius && ball.xpos <= this.xpos + this.width + ball.radius;
		let inYRange = ball.ypos >= this.ypos - ball.radius && ball.ypos <= this.ypos + this.height + ball.radius;
		
		// Check if in hitzone
		if (inXRange && inYRange) {
			if (ball.xpos + ball.radius <= this.xpos && ball.ypos - ball.radius >= this.ypos && ball.ypos + ball.radius <= this.ypos + this.height) { // left side
				return LEFTSIDE;
			} else if (ball.ypos + ball.radius <= this.ypos && ball.xpos - ball.radius >= this.xpos && ball.xpos + ball.radius <= this.xpos + this.width) { // top side
				return TOPSIDE;
			} else if (ball.xpos - ball.radius >= this.xpos + this.width && ball.ypos - ball.radius >= this.ypos && ball.ypos + ball.radius <= this.ypos + this.height) { // right side
				return RIGHTSIDE;
			} else if (ball.ypos - ball.radius >= this.ypos + this.height && ball.xpos - ball.radius >= this.xpos && ball.xpos + ball.radius <= this.xpos + this.width) { // bottom side
				return BOTTOMSIDE;
			} else { // One of the corners
				// Figure out which corner
				return this.whichCorner(ball);
			}
		}
	}

	draw(context) {
		context.beginPath();
		context.rect(this.xpos, this.ypos, this.width, this.height);
		context.fillStyle = this.colour;
		context.fill();
	}
}