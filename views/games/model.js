function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

const LEFTMOSTPLAYER = "left most player";
const NEXTLEFTMOSTPLAYER = "next left most player";
const MIDDLEPLAYER = "middle player";
const NEXTRIGHTMOSTPLAYER = "next right most player";
const RIGHTMOSTPLAYER = "right most player";

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
		this.startingXPos = this.stage.width/2;
		this.startingYPos = this.stage.height-20;
		this.player = new Player(this.startingXPos, this.startingYPos);
		this.initialBall = new Ball(this.player.xpos, this.player.ypos-8, this.player.speed);
		this.balls = [this.initialBall];
		this.player.setHeldBall(this.balls[0]);
		this.bricks = [];

		// Initialize bricks of stage
		for (let i = 0; i < 10; i++) {
			this.bricks.push(new Brick(50*(i+1), 50*(i+1)));
		}
	}

	isWon() {
		return this.bricks.length == 0;
	}

	resetInitialState() {
		this.balls.push(new Ball(this.player.xpos, this.player.ypos-8, this.player.speed));
		this.player.setHeldBall(this.balls[0]);
	}

	checkCollision(ball) {
		// Check ball collisions with player
		switch(this.player.isHit(ball)) {
			case LEFTMOSTPLAYER:
				ball.bounce(LEFTMOSTPLAYER);
				break;
			case NEXTLEFTMOSTPLAYER:
				ball.bounce(NEXTLEFTMOSTPLAYER);
				break;
			case MIDDLEPLAYER:
				ball.bounce(MIDDLEPLAYER);
				break;
			case NEXTRIGHTMOSTPLAYER:
				ball.bounce(NEXTRIGHTMOSTPLAYER);
				break;
			case RIGHTMOSTPLAYER:
				ball.bounce(RIGHTMOSTPLAYER);
				break;
		} 

		// Check ball collisions with walls 
		if (ball.ypos - ball.radius <= 1) {
			ball.setLastObjectHit("top wall");
			ball.bounce("top wall");
		} else if (ball.xpos - ball.radius <= 1) {
			ball.setLastObjectHit("left wall");
			ball.bounce("left wall");
		} else if (ball.xpos + ball.radius >= this.canvas.width-1) {
			ball.setLastObjectHit("right wall");
			ball.bounce("right wall");
		}

		// Check ball collisions with bricks
		for (let brick of this.bricks) {
			switch(brick.isHit(ball)) {
				case BOTTOMSIDE:
					ball.bounce(BOTTOMSIDE);
					break;
				case TOPSIDE:
					ball.bounce(TOPSIDE);
					break;
				case LEFTSIDE:
					ball.bounce(LEFTSIDE);
					break;
				case RIGHTSIDE:
					ball.bounce(RIGHTSIDE);
					break;
				case TOPLEFTCORNER:
					ball.bounce(TOPLEFTCORNER);
					break;
				case TOPRIGHTCORNER:
					ball.bounce(TOPRIGHTCORNER);
					break;
				case BOTTOMLEFTCORNER:
					ball.bounce(BOTTOMLEFTCORNER);
					break;
				case BOTTOMRIGHTCORNER:
					ball.bounce(BOTTOMRIGHTCORNER);
					break;
			}
		}
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
		if (this.isWon()) {
			console.log("You win!");
			endGame();
		}

		for (let ball of this.balls) {
			if (!ball.onPlayer) {
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
		
		// Update new locations of stage elements
		for (let ball of this.balls) {
			ball.update();
			if (ball.ypos >= this.stage.height) {
				this.balls.splice(this.balls.indexOf(ball), 1);
			}
		}

		if (this.balls.length == 0) {
			this.resetInitialState();
		}

		for (let brick of this.bricks) {
			if (!brick.isAlive()) {
				this.bricks.splice(this.bricks.indexOf(brick), 1);
			}
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
		this.playerDirection = 0;
		this.numOfBounces = 0;
		this.speed = 5;
		this.speedCap = 20;
		this.lastHitObject = null;
	}

	setPlayerDirection(direction) {
		this.playerDirection = direction;
	}

	setXVelocity(xvel) {
		this.xvelocity = xvel;
	}

	setYVelocity(yvel) {
		this.yvelocity = yvel;
	}

	setLastObjectHit(obj) {
		this.lastHitObject = obj;
	}

	bounce(item=null) {
		console.log("bounce");
		// Deals with ball bounces
		if (this.onPlayer) {
			this.onPlayer = 0;
			this.lastHitObject = "player";
			this.yvelocity *= -1;
		} else {
			console.log(item);

			// Bounce off Top Wall or top/bottom of brick
			if (item == "top wall" || item == TOPSIDE || item == BOTTOMSIDE) {
				this.yvelocity *= -1;
			}

			// Bounce off Player
			if (item == LEFTMOSTPLAYER) {
				this.xvelocity = this.xvelocity == 0 ? this.xvelocity-2 : this.xvelocity < 0 ? this.xvelocity : (-1*this.xvelocity);
				this.yvelocity *= -1.5;
			} else if (item == NEXTLEFTMOSTPLAYER) {
				this.xvelocity = this.xvelocity == 0 ? this.xvelocity-1 : this.xvelocity < 0 ? this.xvelocity : (-1*this.xvelocity);
				this.yvelocity *= -1.25;
			} else if (item == MIDDLEPLAYER) {
				this.yvelocity *= -1;
			} else if (item == NEXTRIGHTMOSTPLAYER) {
				this.xvelocity = this.xvelocity == 0 ? this.xvelocity+1 : this.xvelocity < 0 ? (-1*this.xvelocity) : this.xvelocity;
				this.yvelocity *= -1.25;
			} else if (item == RIGHTMOSTPLAYER) {
				this.xvelocity = this.xvelocity == 0 ? this.xvelocity+2 : this.xvelocity < 0 ? (-1*this.xvelocity) : this.xvelocity;
				this.yvelocity *= -1.5;
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
			this.xpos += this.onPlayer * this.playerDirection;
		} else {

			// var magnitude = Math.sqrt(Math.pow(((this.xpos + this.speed) - this.xpos), 2) + Math.pow(((this.ypos + this.speed) - this.ypos), 2));
			// console.log(this.xpos, this.ypos);

			// Normalize velocities
			// var xDirection = (1/magnitude);
			// var yDirection = (1/magnitude);

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
	constructor(xpos, ypos) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.height = 6;
		this.length = 100;
		this.speed = 10;
		this.xDirection = 0;
		this.hasBall = null;
	}

	setHeldBall(ball) {
		this.hasBall = ball;
	}

	releaseBall() {
		this.hasBall.setXVelocity(0);
		this.hasBall.setYVelocity(1);
		this.hasBall.bounce();
	}

	isHit(ball) {
		if (ball.lastHitObject == this) {
			return false;
		}

		if (ball.ypos + ball.radius >= this.ypos - (this.height/2) &&
			this.xpos - (this.length/2) <= ball.xpos && ball.xpos <= this.xpos + (this.length/2)) {

			ball.setLastObjectHit("player");

			// console.log("ball position: ");
			// console.log(ball.xpos, ball.ypos);
			// console.log("player position: ");
			// console.log(this.xpos, this.ypos);

			// Checks where the ball hit on player
			let divider = this.length/5;

			let leftMostPlayer = ball.xpos >= this.xpos - (this.length/2) && ball.xpos <= (this.xpos - (this.length/2) + divider);
			let nextLeftMostPlayer = ball.xpos >= this.xpos - (this.length/2) + divider && ball.xpos <= this.xpos - (this.length/2) + (2 * divider);
			let middlePlayer = ball.xpos >= this.xpos - (this.length/2) + (2 * divider) && ball.xpos <= this.xpos - (this.length/2) + ((3 * divider));
			let nextRightMostPlayer = ball.xpos >= this.xpos - (this.length/2) + (3 * divider) && ball.xpos <= this.xpos - (this.length/2) + (4 * divider);
			let RightMostPlayer = ball.xpos >= this.xpos - (this.length/2) + (4 * divider) && ball.xpos <= this.xpos - (this.length/2) + (5 * divider);

			// console.log("leftMostPlayer: " + leftMostPlayer);
			// console.log("nextLeftMostPlayer: " + nextLeftMostPlayer);
			// console.log("middlePlayer: " + middlePlayer);
			// console.log("nextRightMostPlayer: " + nextRightMostPlayer);
			// console.log("RightMostPlayer: " + RightMostPlayer);
			// window.alert("hit player");

			if (leftMostPlayer) {
				return LEFTMOSTPLAYER;
			} else if (nextLeftMostPlayer) {
				return NEXTLEFTMOSTPLAYER;
			} else if (middlePlayer) {
				return MIDDLEPLAYER;
			} else if (nextRightMostPlayer) {
				return NEXTRIGHTMOSTPLAYER;
			} else if (RightMostPlayer) {
				return RIGHTMOSTPLAYER;
			}
		}
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
				this.hasBall.setPlayerDirection(this.xDirection);
			}
		} else if (action == "right") {
			this.xDirection = 1;
			if (this.hasBall) {
				this.hasBall.setPlayerDirection(this.xDirection)
			}
		} else if (action == "shoot") {
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
				this.hasBall.setPlayerDirection(this.xDirection);
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
		this.active = true;
	}

	isAlive() {
		return this.active;
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
			let buffer = ball.radius/4;
			this.active = false;
			if (ball.xpos + ball.radius == this.xpos && ball.ypos - buffer >= this.ypos && ball.ypos + buffer <= this.ypos + this.height) { // left side
				return LEFTSIDE;
			} else if (ball.ypos + ball.radius == this.ypos && ball.xpos - buffer >= this.xpos && ball.xpos + buffer <= this.xpos + this.width) { // top side
				return TOPSIDE;
			} else if (ball.xpos - ball.radius == this.xpos + this.width && ball.ypos - buffer >= this.ypos && ball.ypos + buffer <= this.ypos + this.height) { // right side
				return RIGHTSIDE;
			} else if (ball.ypos - ball.radius == this.ypos + this.height && ball.xpos - buffer >= this.xpos && ball.xpos + buffer <= this.xpos + this.width) { // bottom side
				return BOTTOMSIDE;
			} else { // One of the corners
				// Figure out which corner
				ball.setLastObjectHit(this);
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