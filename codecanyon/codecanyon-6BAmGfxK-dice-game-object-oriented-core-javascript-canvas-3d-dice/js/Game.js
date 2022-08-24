/****Game.js*****/
var Game = function (canvas, FPS) {
	var t = this;
	t.gui = new GameUI();
	t.sm = Object.create(StateMachine);

	t.GE = new GameEngine(canvas, FPS, t.gui, t.sm);
	t.c = t.GE.context2D;

	function drawAndUpdate() {
		requestAnimationFrame(drawAndUpdate);
		t.c.canvas.width = t.c.canvas.width;
		//t.c.clearRect();
		t.GE.draw();
	}

	drawAndUpdate();
}