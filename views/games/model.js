function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

const HORIZONTALSIDE = "horizontal side";
const VERTICALSIDE = "vertical side";

const TOPLEFTCORNER = "top left corner";
const TOPRIGHTCORNER = "top right corner";
const BOTTOMLEFTCORNER = "bottom left corner";
const BOTTOMRIGHTCORNER = "botttom right corner";

const BALLRADIUS = 5;
const PLAYERSPEED = 5;
const PLAYERLENGTH = 100;

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

	isLost() {
		return this.player.lives == 0;
	}

	resetInitialState() {
		this.balls.push(new Ball(this.player.xpos, this.player.ypos-8, this.player.speed));
		this.player.setHeldBall(this.balls[0]);
	}

	checkBallPlayerCollision(ball) {
		if (ball.ypos + ball.radius >= this.player.ypos - (this.player.height/2) &&
			this.player.xpos - (this.player.length/2) <= ball.xpos && ball.xpos <= this.player.xpos + (this.player.length/2)) {

			let collisionPoint = ball.xpos - this.player.xpos;
			collisionPoint = collisionPoint / this.player.xpos;

			let angle = collisionPoint * (2*Math.PI);
			ball.bounce("player", angle);
		}
	}

	checkBallBrickCollision(ball) {
		var points = 0;
		for (let brick of this.bricks) {
			let inXRange = ball.xpos >= brick.xpos - ball.radius && ball.xpos <= brick.xpos + brick.width + ball.radius;
			let inYRange = ball.ypos >= brick.ypos - ball.radius && ball.ypos <= brick.ypos + brick.height + ball.radius;
			
			if (inXRange && inYRange) {
				brick.active = false;
				points = brick.points;
				
				if (ball.xpos + ball.radius >= brick.xpos && ball.xpos - ball.radius <= brick.xpos + brick.width && ball.ypos >= brick.ypos && ball.ypos <= brick.ypos + brick.height) {
					ball.bounce(VERTICALSIDE);
				} else if (ball.ypos + ball.radius >= brick.ypos && ball.ypos - ball.radius <= brick.ypos + brick.height && ball.xpos >= brick.xpos && ball.xpos <= brick.xpos + brick.width) {
					ball.bounce(HORIZONTALSIDE);
				} else {
					let topLeftCorner = Math.sqrt(Math.pow(ball.xpos - brick.xpos, 2) + Math.pow(ball.ypos - brick.ypos, 2));
					let topRightCorner = Math.sqrt(Math.pow(ball.xpos - (brick.xpos + brick.width), 2) + Math.pow(ball.ypos - brick.ypos, 2));
					let bottomLeftCorner = Math.sqrt(Math.pow(ball.xpos - brick.xpos, 2) + Math.pow(ball.ypos - (brick.ypos + brick.height), 2));
					let bottomRightCorner = Math.sqrt(Math.pow(ball.xpos - (brick.xpos + brick.width), 2) + Math.pow(ball.ypos - (brick.ypos + brick.height), 2));

					let corners = [topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner];
					let closestCornerIndex = corners.indexOf(Math.min(topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner));

					switch(closestCornerIndex) {
						case 0:
							ball.bounce(TOPLEFTCORNER);
							break;
						case 1:
							ball.bounce(TOPRIGHTCORNER);
							break;
						case 2:
							ball.bounce(BOTTOMLEFTCORNER);
							break;
						case 3:
							ball.bounce(BOTTOMRIGHTCORNER);
							break;
					}
				}
			}
		}
		return points;
	}

	checkBallWallCollision(ball) {
		if (ball.ypos - ball.radius <= 1) {
			ball.bounce(HORIZONTALSIDE);
		} else if (ball.xpos - ball.radius <= 1) {
			ball.bounce(VERTICALSIDE);
		} else if (ball.xpos + ball.radius >= this.canvas.width-1) {
			ball.bounce(VERTICALSIDE);
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

		if (this.isLost()) {
			console.log("You lose...");
			endGame();
		}

		for (let ball of this.balls) {
			if (!ball.onPlayer) {
				this.checkBallPlayerCollision(ball);
				this.checkBallWallCollision(ball);
				let points = this.checkBallBrickCollision(ball);
				if (points != 0) {
					this.player.increaseScore(points);
				}
			}
		}

		// Check Player can't move off the board
		if (this.player.xpos + (this.player.speed * this.player.xDirection) < BALLRADIUS + 1 ||
			this.player.xpos + (this.player.speed * this.player.xDirection) > this.canvas.width - 1 - BALLRADIUS) {
			this.player.stop("moving", this.player.hasBall);
		} else {
			this.player.update();
		}
		
		// Update new locations of stage elements
		for (let ball of this.balls) {
			ball.update();
			if (ball.ypos >= this.stage.height) {
				this.balls.splice(this.balls.indexOf(ball), 1);
				this.player.loseLife();
			}
		}

		if (this.balls.length == 0 && !this.isLost()) {
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

		context.font = "18px Comic Sans MS";
	    context.fillStyle = "yellow";

	    context.fillText("Lives: " + this.player.lives, 10, 20);
	    context.fillText("Score: " + this.player.score, 10, 40);
	}
}

class Ball {
	constructor(xpos, ypos, playerSpeed) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.radius = BALLRADIUS;
		this.xvelocity = 0;
		this.yvelocity = 0;
		this.onPlayer = playerSpeed;
		this.playerDirection = 0;
		this.numOfBounces = 0;
		this.speed = 5;
		this.speedCap = 20;
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

	bounce(objHit=null, angle=0) {
		if (this.onPlayer) {
			this.onPlayer = 0;
			this.yvelocity *= -1 * this.speed;
		} else {
			if (objHit == "player") {
				this.xvelocity = this.speed * Math.sin(angle);
				this.yvelocity = -1 * this.speed * Math.abs(Math.cos(angle));
			} else if (objHit == HORIZONTALSIDE) {
				this.yvelocity *= -1;
			} else if (objHit == VERTICALSIDE) {
				this.xvelocity *= -1;
			} else if (objHit == TOPLEFTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? this.xvelocity : -1*this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? this.yvelocity : -1*this.yvelocity;
			} else if (objHit == TOPRIGHTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? -1*this.xvelocity : this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? this.yvelocity : -1*this.yvelocity;
			} else if (objHit == BOTTOMLEFTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? this.xvelocity : -1*this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? -1*this.yvelocity : this.yvelocity;
			} else if (objHit == BOTTOMRIGHTCORNER) {
				this.xvelocity = this.xvelocity < 0 ? -1*this.xvelocity : this.xvelocity;
				this.yvelocity = this.yvelocity < 0 ? -1*this.yvelocity : this.yvelocity;
			}
		}
	}

	update() {
		if (this.onPlayer) {
			this.xpos += this.onPlayer * this.playerDirection;
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
	constructor(xpos, ypos) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.height = 6;
		this.length = PLAYERLENGTH;
		this.speed = PLAYERSPEED;
		this.xDirection = 0;
		this.hasBall = null;
		this.lives = 3;
		this.score = 0;
	}

	setHeldBall(ball) {
		this.hasBall = ball;
	}

	increaseScore(points) {
		this.score += points;
	}

	loseLife() {
		this.lives -= 1;
	}

	releaseBall() {
		this.hasBall.setXVelocity(0);
		this.hasBall.setYVelocity(1);
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
		if (action == "moving") {
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
		this.points = 20;
	}

	isAlive() {
		return this.active;
	}

	draw(context) {
		context.beginPath();
		context.rect(this.xpos, this.ypos, this.width, this.height);
		context.fillStyle = this.colour;
		context.fill();
	}
}