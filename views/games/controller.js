stage = null;
view = null;
interval = null;
gameStatus = false;

function setupGame() {
	stage = new Stage(document.getElementById('stage'));
	gameStatus = true;
}

function startGame() {
	stage.canvas = document.getElementById('stage');
	stage.draw();
	// interval = setInterval(function(){ stage.update(); stage.draw(); }, 20);
}

function pauseGame() {
	clearInterval(interval);
	interval = null;
}

function endGame() {
	pauseGame();
	gameStatus = false;
}

function gameRunning() {
	return gameStatus;
}

function moveByKey(event){
	var key = event.key;
	var moveMap = {
		'a': { "move": "left"},
		's': { "move": "down"},
		'd': { "move": "right"},
		'w': { "move": "up"}
	};
}