stage = null;
view = null;
interval = null;
gameStatus = false;

function setupGame() {
	stage = new Stage(document.getElementById('stage'));
	gameStatus = true;

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('keyup', stopByKey);
}

function startGame() {
	stage.canvas = document.getElementById('stage');
	interval = setInterval( () => { stage.update(); stage.draw(); }, 20);
}

function pauseGame() {
	clearInterval(interval);
	interval = null;
}

function endGame() {
	pauseGame();
	gameStatus = false;
}

function isGameActive() {
	return gameStatus;
}

function moveByKey(event) {
	var key = event.key;
	var moveMap = {
		'a': { "move": "left" },
		'd': { "move": "right" },
		'ArrowLeft': { "move": "left" },
		'ArrowRight': { "move": "right" },
		' ': { "move": "spacebar" }
	};

	if (key in moveMap) {
		stage.player.hasBall ?
		stage.player.move(moveMap[key].move, stage.ball) : 
		stage.player.move(moveMap[key].move);
	}
}

function stopByKey(event) {
	var key = event.key;
	var moveMap = {
		'a': { "move": "left" },
		'd': { "move": "right" },
		'ArrowLeft': { "move": "left" },
		'ArrowRight': { "move": "right" },
		' ': { "move": "spacebar" }
	};

	if (key in moveMap) {
		stage.player.hasBall ?
		stage.player.stop(moveMap[key].move, stage.ball) : 
		stage.player.stop(moveMap[key].move);
	}
}