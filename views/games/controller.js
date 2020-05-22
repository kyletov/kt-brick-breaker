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
	if (!interval) {
		interval = setInterval( () => { stage.update(); stage.draw(); }, 20);
	}
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
		'b': { "move": "shoot" }
	};

	if (key in moveMap) {
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
		'b': { "move": "shoot" }
	};

	if (key in moveMap) {
		stage.player.stop(moveMap[key].move);
	}
}