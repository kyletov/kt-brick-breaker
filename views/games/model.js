function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(stage) {
		this.stage = stage;
		this.canvas = null;
		this.player = new Player();
		this.ball = new Ball(this.player.xpos, this.player.ypos-10);
	}

	draw() {
		var context = this.canvas.getContext('2d');
		this.player.draw(context);
		this.ball.draw(context);
	}
}

class Ball {
	constructor(xpos, ypos) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.speed = 1;
	}

	draw(context) {
		context.font="18px Comic Sans MS";
		context.fillStyle = "blue";
		context.fillText("Ball", this.xpos, this.ypos);
	}
}

class Player {
	constructor() {
		this.xpos = 400;
		this.ypos = 780;
		this.speed = 1;
	}

	draw(context) {
		context.font="18px Comic Sans MS";
		context.fillStyle = "blue";
		context.fillText("Player", this.xpos, this.ypos);
	}
}