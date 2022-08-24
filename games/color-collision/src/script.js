var gameConfig = {
	colors: ["0xffffff", "0xff0000", "0x00ff00", "0x0000ff", "0xffff00"],
};
var game;
var gw, gh;
var tempy, speed = 3;
var currentLvl = 1, topLvl = 1;
var stars = [0, -1, -1, -1, -1, -1, -1 - 1, -1, -1 - 1, -1, -1 - 1, -1];

window.onload = function () {
	var gc = {
		type: Phaser.AUTO,
		scale: {
			mode: Phaser.Scale.RESIZE,
			parent: 'phaser-example',
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: '100%',
			height: '100%',
		},
		// width: window.innerWidth,
		// height: window.innerHeight,
		backgroundColor: 0x000000,
		scene: [BootScene, PreloadScene, LevelSelect, IntroScene, PlayLevel],
	}
	game = new Phaser.Game(gc);
	gw = window.innerWidth;
	gh = window.innerHeight;
	// resize();
	// window.addEventListener("resize", resize, false);
}

class BootScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' });
	}

	create() {
		this.scene.start("PreloadScene");
	}
}

class PreloadScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PreloadScene' });
	}

	preload() {
		this.load.image('background', './background.png');
	}

	create() {
		this.scene.start("IntroScene");
	}
}



class IntroScene extends Phaser.Scene {
	constructor() {
		super({ key: 'IntroScene' });
	}

	preload() {
		this.load.image('logo', './logo2.png');
	}

	create() {

		this.wrongElecton = this.add.text(gw / 2, gh / 4, "Get the Right", {
			fontFamily: "Arial", fontSize: 20,
			fill: "#ffffff",
			align: "center"
		}).setOrigin(0.5);

		this.logo = this.add.image(gw / 2, gh / 3, "logo").setOrigin(0.5);
		this.rbsc = this.add.container();
		this.pBall = new PBalls(this, 40, this.rbsc);
		var t = this;
		this.btn = new Button(this, 0xFF0000, 0xefc53f, 1, 200, 4, "START", function () {
			t.scene.start("LevelSelect");
		});
		this.btn.position(gw / 2, gh * 2 / 3);

		this.scale.on('resize', this.resize, this);

	}

	resize(gameSize, baseSize, displaySize, resolution) {
		var width = gameSize.width;
		var height = gameSize.height;

		this.cameras.resize(width, height);

		gw = window.innerWidth;
		gh = window.innerHeight;

		this.btn.position(width / 2, height * 2 / 3);
		this.logo.setPosition(width / 2, height / 3);
	}
}


class LevelSelect extends Phaser.Scene {
	constructor() {
		super({ key: 'LevelSelect' });
	}

	create() {

		this.rbsc = this.add.container();
		this.pBall = new PBalls(this, 40, this.rbsc);
		var t = this;


		var k = 0;
		var bgcolorLvl = 0x999999;
		var brdrcolorLvl = 0xcccccc;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 5; j++) {
				if (k < topLvl) {
					bgcolorLvl = 0x019ad2;
					brdrcolorLvl = 0xcccccc;
				} else {
					bgcolorLvl = 0x999999;
					brdrcolorLvl = 0xcccccc;
				}
				new LevelItem(this, (gw / 2 - 200) + j * 100, (gh / 2 - 100) + i * 100, k + 1, bgcolorLvl, brdrcolorLvl, stars[k]);
				k++;
			}
		}



		// this.btn = new Button(this, 0xFF0000, 0xefc53f, 1, 100, 4, "PLAY", function () {
		// 	// currentLvl
		// 	t.scene.start("PlayLevel");
		// });
		// this.btn.position(gw / 2, gh * 4 / 5);

		this.scale.on('resize', this.resize, this);
	}

	resize(gameSize, baseSize, displaySize, resolution) {
		var width = gameSize.width;
		var height = gameSize.height;

		this.cameras.resize(width, height);

		gw = window.innerWidth;
		gh = window.innerHeight;

		this.btn.position(width / 2, height * 2 / 3);
	}
}

class PlayLevel extends Phaser.Scene {
	constructor() {
		super("PlayLevel");
	}
	init() {
		console.log("game started")
	}
	preload() { }
	create() {
		var t = this;

		this.movingBall = null;
		this.pageText = this.add.text(20, 15, "Score", {
			fontFamily: "Arial", fontSize: 20,
			fill: "#ffffff",
			align: "center"
		});
		this.score = this.add.text(80, 15, "0", {
			fontFamily: "Arial", fontSize: 20,
			fill: "#ffffff",
			align: "center"
		});


		this.rbsc = this.add.container();
		this.pBall = new PBalls(this, 20, this.rbsc);
		this.rbsc.add(this.pBall);

		this.gameCont = this.add.container();
		this.r1 = this.add.circle(gw / 2, gh / 2 - gh / 10, 20, 0x6666ff).setName("r1");
		this.r1.color = 0x6666ff;
		this.r2 = this.add.circle(gw / 2, gh / 2 + gh / 10, 20, 0x996633).setName("r2");
		this.r2.color = 0x996633;
		this.createBall();
		this.gameCont.add(this.r1);
		this.gameCont.add(this.r2);


		this.input.on('pointerdown', function (p) {
			if (speed > 0) {
				var t = this.scene;
				tempy = t.r1.y;
				t.r1.y = t.r2.y;
				t.r2.y = tempy;
			}
		});


		this.wrongElecton = this.add.text(gw / 2, gh / 4, "Wrong Electron Caught!", {
			fontFamily: "Arial", fontSize: 20,
			fill: "#ffffff",
			align: "center"
		}).setOrigin(0.5);
		this.wrongElecton.visible = false;

		this.clickToSwapColors = this.add.text(gw / 2, gh * 9 / 10, "Click to swap the colors!", {
			fontFamily: "Arial", fontSize: 20,
			fill: "#ffffff",
			align: "center"
		}).setOrigin(0.5);

		this.restartBtn = new Button(this, 0xFF0000, 0xefc53f, 1, 200, 4, "RESTART", function () {
			t.scene.restart();
			speed = 3;
		});
		this.restartBtn.position(gw / 2, gh * 2 / 3);
		this.restartBtn.hide();

		this.nextBtn = new Button(this, 0xFF0000, 0xefc53f, 1, 200, 4, "Next Level", function () {
			// t.scene.restart();
			t.scene.start("LevelSelect");
			speed = 3;
		});
		this.nextBtn.position(gw / 2, gh * 2 / 3 + 70);
		this.nextBtn.hide();

		this.scale.on('resize', resize, this);
		this.scale.on('resize', this.resize, this);
	}

	resize(gameSize, baseSize, displaySize, resolution) {
		var width = gameSize.width;
		var height = gameSize.height;

		this.cameras.resize(width, height);

		gw = window.innerWidth;
		gh = window.innerHeight;

		this.restartBtn.position(width / 2, height * 2 / 3);
		this.nextBtn.position(width / 2, height * 2 / 3 + 70);
		this.r1.setPosition(width / 2, height / 2 - height / 10);
		this.r2.setPosition(width / 2, height / 2 + height / 10);
		this.wrongElecton.setPosition(width / 2, height / 4);
		this.movingBall.setPosition(width / 2, this.movingBall.y);
	}

	update() {
		if (speed > 0) {
			if (this.movingBall) {
				if (this.movingBall.y < gh / 2 - 25) {
					this.movingBall.y += speed;
				} else if (this.movingBall.y > gh / 2 + 25) {
					this.movingBall.y -= speed;
				} else {
					this.movingBall.y = gh / 2;
					speed = 0;
					this.restartBtn.show();
					this.nextBtn.show();
					this.wrongElecton.visible = true;

					if (this.score.text > 50 && topLvl == currentLvl) {
						topLvl++;
					}
				}
				this.checkHit();
			}
		}
		this.pBall.update();
	}

	createBall() {
		this.movingBall = this.add.circle(gw / 2, -50, 20, 0x6666ff);
		this.movingBall.color = 0x6666ff;
		this.gameCont.add(this.movingBall);
	}

	checkHit() {
		if (Math.abs(this.movingBall.y - this.r1.y) < 40) {
			if (this.movingBall.color == this.r1.color) {
				this.score.setText(parseInt(this.score.text) + 10);
				this.recreateBall();
			} else {
				console.log("game over");
				speed = 0;
				this.restartBtn.show();
				this.nextBtn.show();
				this.wrongElecton.visible = true;
				this.cameras.main.shake(200);

				stars[currentLvl - 1] = Math.ceil(Math.random() * 3);

				if (this.score.text > 50 && topLvl == currentLvl) {
					topLvl++;
				}
			}

		} else if (Math.abs(this.movingBall.y - this.r2.y) < 40) {
			if (this.movingBall.color == this.r2.color) {
				this.score.setText(parseInt(this.score.text) + 10);
				this.recreateBall();
			} else {
				console.log("game over");
				speed = 0;
				this.restartBtn.show();
				this.nextBtn.show();
				this.wrongElecton.visible = true;
				stars[currentLvl - 1] = Math.ceil(Math.random() * 3);
				this.cameras.main.shake(200);

				if (this.score.text > 50 && topLvl == currentLvl) {
					topLvl++;
				}
			}
		}


	}

	recreateBall() {
		this.movingBall.destroy();
		this.movingBall = null;
		var rnd = Math.ceil(Math.random() * 2);
		if (rnd == 1) {
			this.movingBall = this.add.circle(gw / 2, -50, 20, 0x6666ff);
			this.movingBall.color = 0x6666ff;
			this.gameCont.add(this.movingBall);

		} else {
			this.movingBall = this.add.circle(gw / 2, -50, 20, 0x996633);
			this.movingBall.color = 0x996633;
			this.gameCont.add(this.movingBall);

		}
		var rnd2 = Math.ceil(Math.random() * 2);
		if (rnd2 == 1) {
			this.movingBall.y = -50;
		} else {
			this.movingBall.y = gh + 50;
		}
		speed += 0.05;
		if (speed > 15) speed = 1;
	}
}

function resize(gameSize, baseSize, displaySize, resolution) {
	var width = gameSize.width;
	var height = gameSize.height;

	this.cameras.resize(width, height);

	gw = window.innerWidth;
	gh = window.innerHeight;

	//this.bg.setSize(width, height);
	//this.logo.setPosition(width / 2, height / 2);
}

var LevelItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,
	initialize: function LevelItem(scene, x, y, txt, bgcolor, brdrcolor, stars) {
		this.level = new Button(scene, bgcolor, brdrcolor, 1, 50, 3, txt, function () {
			if (txt <= topLvl) {
				currentLvl = txt;
				// topLvl = txt;
				scene.scene.start("PlayLevel");
			}
		});
		this.level.position(x, y);
		this.level.num = txt;

		if (stars >= 1) {
			var star1 = scene.add.star(x - 20, y + 35, 5, 5, 10, 0xff0000);
			star1.setStrokeStyle(2, 0xefc53f);
		} else {
			var star3 = scene.add.star(x - 20, y + 35, 5, 5, 10, 0x333333);
			star3.setStrokeStyle(2, 0x999999);
		}
		if (stars >= 2) {
			var star2 = scene.add.star(x, y + 30, 5, 8, 16, 0xff0000);
			star2.setStrokeStyle(2, 0xefc53f);
		} else {
			var star3 = scene.add.star(x, y + 30, 5, 8, 16, 0x333333);
			star3.setStrokeStyle(2, 0x999999);
		}
		if (stars >= 3) {
			var star1 = scene.add.star(x + 20, y + 35, 5, 5, 10, 0xff0000);
			star1.setStrokeStyle(2, 0xefc53f);
		} else {
			var star3 = scene.add.star(x + 20, y + 35, 5, 5, 10, 0x333333);
			star3.setStrokeStyle(2, 0x999999);
		}
	}
});


var Button = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,
	initialize: function Button(scene, bgcolor, brdrcolor, alpha, w, borderSize, txt, cb) {
		this.c = scene.add.rectangle(0, 0, w, 50, bgcolor).setOrigin(0.5);
		this.c.setInteractive({ cursor: 'pointer' });
		this.c.on('pointerdown', function () {
			cb();
		});
		this.c.setStrokeStyle(borderSize, brdrcolor);
		this.c.setAlpha(alpha);
		this.ttt = scene.add.text(0, 0, txt, {
			fontFamily: "Arial", fontSize: 30, fontWeight: "bold",
			fill: "#ffffff"
		}).setOrigin(0.5);
		this.ttt.inputEnabled = false;
	},
	show: function () {
		this.c.visible = true;
		this.ttt.visible = true;
		// this.c.setInteractive({ cursor: 'pointer' });
	},
	hide: function () {
		this.c.visible = false;
		this.ttt.visible = false;
		// this.c.setInteractive({ cursor: 'pointer' });
	},
	position: function (x, y) {
		this.c.setPosition(x, y);
		this.ttt.setPosition(x, y);
	}
})

var PBalls = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,
	initialize: function PBall(scene, count, c) {
		Phaser.GameObjects.Container.call(this, scene);
		this.c = c;

		var color = new Phaser.Display.Color();

		for (var i = 0; i < count; i++) {
			color.random(50);
			var pb = scene.add.circle(Math.random() * (gw - 100) + 50, Math.random() * (gh - 100) + 50, Math.random() * 10, color.color).setAlpha(Math.random());
			pb.speedX = pb.speedY = Math.random() * 2;
			c.add(pb);
		}
	},
	update: function () {
		this.c.list.map(function (pb) {
			pb.x += pb.speedX;
			pb.y += pb.speedY;
			if (pb.x <= 0) {
				pb.speedX = -pb.speedX;
			} else if (pb.y <= 0) {
				pb.speedY = -pb.speedY;
			} else if (pb.x >= gw) {
				pb.speedX = -pb.speedX;
			} else if (pb.y >= gh) {
				pb.speedY = -pb.speedY;
			}
		});
	}
});