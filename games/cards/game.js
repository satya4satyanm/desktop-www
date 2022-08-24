// const { Phaser } = require("./phaser");

let game, gw, gh, graphics, guess, btn, bg;
let sf = 2.8;
let completedMove = false;
var cardHistory = [];
var s = "s", c = "c", d = "d", h = "h", J = "J", Q = "Q", K = "K", A = "A";
var firstMove = true, coins = 250;
var n=0;

var cardnSuit = [
    { num: A, suit: s },
    { num: 2, suit: s },
    { num: 3, suit: s },
    { num: 4, suit: s },
    { num: 5, suit: s },
    { num: 6, suit: s },
    { num: 7, suit: s },
    { num: 8, suit: s },
    { num: 9, suit: s },
    { num: 10, suit: s },
    { num: J, suit: s },
    { num: Q, suit: s },
    { num: K, suit: s },
    { num: A, suit: c },
    { num: 2, suit: c },
    { num: 3, suit: c },
    { num: 4, suit: c },
    { num: 5, suit: c },
    { num: 6, suit: c },
    { num: 7, suit: c },
    { num: 8, suit: c },
    { num: 9, suit: c },
    { num: 10, suit: c },
    { num: J, suit: c },
    { num: Q, suit: c },
    { num: K, suit: c },
    { num: A, suit: d },
    { num: 2, suit: d },
    { num: 3, suit: d },
    { num: 4, suit: d },
    { num: 5, suit: d },
    { num: 6, suit: d },
    { num: 7, suit: d },
    { num: 8, suit: d },
    { num: 9, suit: d },
    { num: 10, suit: d },
    { num: J, suit: d },
    { num: Q, suit: d },
    { num: K, suit: d },
    { num: A, suit: h },
    { num: 2, suit: h },
    { num: 3, suit: h },
    { num: 4, suit: h },
    { num: 5, suit: h },
    { num: 6, suit: h },
    { num: 7, suit: h },
    { num: 8, suit: h },
    { num: 9, suit: h },
    { num: 10, suit: h },
    { num: J, suit: h },
    { num: Q, suit: h },
    { num: K, suit: h },
];

let gameOptions = {
    cardWidth: 173.923,
    cardHeight: 257.5,
    cardScale: 0.5
}

window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        transparent: true,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 350,
            height: 620
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    gw = 350;
    gh = 620;
    window.focus();
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('image0', '1.png');
        // this.load.image('gear', 'gear.png');
        // this.load.image('music', 'music.png');
        this.load.spritesheet("icons", "icons.png", {
            frameWidth: 50,
            frameHeight: 53
        });
        this.load.audio('btn', ['btn.mp3']);
        this.load.audio('bg', ['bg.mp3']);

        this.load.image('keys', 'keys.png');
        this.load.image('mist1', 'mist1.png');
        this.load.image('white-smoke', 'smoke0.png');
        this.load.image('mist2', 'mist2.png');
        this.load.image('popup', 'popup.png');
        this.load.image('spark0', 's1.png');
        this.load.image('hat', 'hat.png');
        this.load.image('bat', 'bat.png');
        this.load.image('cigar', 'cigar.png');
        this.load.spritesheet("cards", "cs.png", {
            frameWidth: gameOptions.cardWidth,
            frameHeight: gameOptions.cardHeight
        });

        this.load.spritesheet("symbols", "symbols.png", {
            frameWidth: 50,
            frameHeight: 50
        });
    }
    create() {

        btn = this.sound.add('btn');
        var fx = this.sound.add('bg', { loop: -1 });
        fx.play();
        // this.add.tileSprite(0, 0, gw, gh, 'image0').setOrigin(0);
        this.add.image(gw / 2, gh * 3 / 4, 'mist1').setOrigin(0.5).setScale(0.4).setAlpha(0.2);
        this.add.image(gw * 1.5 / 2, gh * 3.6 / 4, 'mist2').setOrigin(0.5).setScale(0.4).setAlpha(0.2);
        this.rbsc = this.add.container();
        this.pBall = new PBalls(this, 40, this.rbsc);

        var emitter0 = this.add.particles('spark0').createEmitter({
            x: gw / 2,
            y: gh / 3,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            rotate: { start: 0, end: 360 },
            scale: { start: 0.1, end: 0.5 },
            alpha: { start: 0, end: 0.7 },
            lifespan: 4000,
            gravityY: 0
        });

        this.gear = this.add.sprite(gw * 9 / 10, gh / 4, 'icons', 0).setOrigin(0.5).setScale(0.85).setInteractive({ cursor: 'pointer' });
        this.gear.on('pointerdown', function () {
            btn.play();
            popupC.visible = true;
        });
        this.sound = this.add.sprite(gw * 9 / 10, gh / 3, 'icons', 1).setOrigin(0.5).setScale(0.85).setInteractive({ cursor: 'pointer' });
        this.sound.on('pointerdown', function () {
            // btn.play();
            // alert("sound")
            if (fx.isPaused) {
                fx.resume();
                r1.visible = false;
            }
            else if (fx.isPlaying) {
                fx.pause();
                r1.visible = true;
            }
        });

        var r1 = this.add.line(gw * 9 / 10, gh / 3 + 3, 0, 0, 50, 0, 0x00ffff);
        r1.setLineWidth(3);
        r1.setRotation(-45);
        r1.visible = false;

        // this.add.image(gw/2, gh*1/3, 'bat').setOrigin(0.5).setScale(0.7);
        // this.add.image(gw/2+150, gh/2, 'cigar').setOrigin(0.5).setScale(0.6);
        this.add.image(gw / 2 - 130, gh / 4, 'cigar').setOrigin(0.5).setScale(-0.6, 0.6);
        this.ee = this.add.particles('white-smoke').createEmitter({
            x: { min: gw / 2 - 120, max: gw / 2 - 90 },
            y: gh / 4 + 45,
            speed: { min: 10, max: 60 },
            angle: { min: -88, max: -92 },
            scale: { start: 0, end: 0.3, ease: 'Back.easeOut' },
            alpha: { start: 0.3, end: 0, ease: 'Quart.easeOut' },
            blendMode: 'SCREEN',
            lifespan: 4000
        });
        this.ee.width = 30;

        this.add.image(gw / 2 + 130, gh / 2, 'hat').setOrigin(0.5).setScale(0.7).setRotation(0.523599);
        this.add.image(gw / 2 - 120, gh / 2.2, 'keys').setOrigin(0.5).setScale(0.3).setRotation(-1);
        graphics = this.add.graphics();
        // graphics.fillStyle(0x001d00, .9);
        graphics.lineStyle(1, 0x635632, 1);
        graphics.fillGradientStyle(0xebcb73, 0xebcb73, 0xd48a3f, 0xd48a3f, 1);
        graphics.fillRect(gw / 2 - 150, 20, 300, 47, 5);
        graphics.strokeRect(gw / 2 - 150, 20, 300, 47, 5);

        graphics.fillStyle(0x000000, .9);
        graphics.fillRoundedRect(gw / 2 - 50, gh / 3 - 70, 100, 140, 12);
        graphics.strokeRoundedRect(gw / 2 - 50, gh / 3 - 70, 100, 140, 12);

        graphics.fillStyle(0xea8d4e, .9);
        graphics.lineStyle(2, 0x001d00, 1);

        graphics.fillGradientStyle(0xd9bd75, 0xd9bd75, 0xea8d4e, 0xea8d4a, 1);
        graphics.lineStyle(1, 0x635632, 1);
        graphics.fillRect(gw / 2 - 150, gh - 62, 300, 40, 5);
        graphics.strokeRect(gw / 2 - 150, gh - 62, 300, 40, 5);

        this.ttt = this.add.text(gw / 2, 24, "High-Low Cards!", {
            fontFamily: "cursive", fontSize: 25,
            fill: "#fffb8f"
        }).setOrigin(0.5, 0);
        this.ttt.inputEnabled = false;
        this.ttt.setStroke('#00f', 1);
        this.ttt.height = 40;
        this.ttt.setShadow(2, 2, "#ffffff", 2, true, true);
        this.ttt.setTint(0x009479, 0x009479, 0x01264a, 0x01264a);

        this.msg = this.add.text(gw / 2, gh * 11 / 20, "Guess what's next!", {
            fontFamily: "cursive", fontSize: 18, fontWeight: "bold",
            fill: "#ffffff"
        }).setOrigin(0.5, 0);
        this.msg.inputEnabled = false;
        this.msg.setStroke('rgba(0,0,0,1)', 3);
        this.msg.setTint(0x33FFFF, 0x33FFFF, 0xFF00FF, 0xFF00FF);

        this.bal = this.add.text(gw / 2, gh / 7, "Chip Balance: " + coins, {
            fontFamily: "cursive", fontSize: 22, fontWeight: "bold",
            fill: "#ffffff"
        }).setOrigin(0.5, 0);
        this.bal.inputEnabled = false;
        this.bal.setStroke('rgba(0,0,0,1)', 3);
        this.bal.setTint(0xfad126, 0xfad126, 0xff544f, 0xff544f);

        // create an array with 52 integers from 0 to 51
        this.deck = Phaser.Utils.Array.NumberArray(0, 51);

        // shuffle the array
        Phaser.Utils.Array.Shuffle(this.deck);

        // the two cards in game
        this.cardsInGame = [];
        for (var i = 0; i < this.deck.length; i++) {
            this.cardsInGame.push(this.createCard(this.deck[i]));
        }

        // we already have card 0 in game so next card index is 1
        this.nextCardIndex = 0;

        // a tween to make first card enter into play
        var firstCard = this.cardsInGame[this.nextCardIndex];
        this.tweens.add({
            targets: firstCard,
            x: gw / 2,
            duration: 500,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onComplete: function () {
                // console.log(this.nextCardIndex)
                completedMove = true;
                this.nextCardIndex++;
                this.createHistory(firstCard);

            }
        });

        this.curCard = firstCard;

        var t = this;
        // this.betbtn = new Button(this, 0x003200, 0xea8d4e, 1, 80, 3, "Bet", function () {
        //     console.log("Bet added")
        // });
        // this.betbtn.position(gw / 2, gh * 0.8);

        this.high = new Button(this, 0x001d00, 0xea8d4e, 1, 80, 3, "High", function () {
            guess = "h";
            t.moveCards();
        }, 1);
        this.high.position(gw / 2 - 50, gh * 0.8);

        this.low = new Button(this, 0x660005, 0xea8d4e, 1, 80, 3, "Low", function () {
            guess = "l";
            t.moveCards();
        }, -1);
        this.low.position(gw / 2 + 50, gh * 0.8);


        this.red = new Button(this, 0xca0d05, 0xea8d4e, 1, 80, 3, "Red", function () {
            guess = "r";
            t.moveCards();
        });
        this.red.position(gw / 2, gh * 0.675);

        this.jqka = new Button(this, 0x000000, 0xea8d4e, 1, 80, 3, "JQKA", function () {
            guess = "jqka";
            t.moveCards();
        });
        this.jqka.position(gw / 2 - 100, gh * 0.675);

        this.black = new Button(this, 0x000000, 0xea8d4e, 1, 80, 3, "Black", function () {
            guess = "b";
            t.moveCards();
        });
        this.black.position(gw / 2 + 100, gh * 0.675);

        this.historyContainer = this.add.container(0, 0);

        var popupC = this.add.container(5, 0);
        var bg = this.add.rectangle(0, 0, gw, gh, 0x000000).setOrigin(0, 0).setAlpha(0.01).setInteractive({ cursor: 'pointer' });
        popupC.add(bg);
        popupC.add(this.add.image(gw / 2, gh / 2, 'popup').setOrigin(0.5));
        bg.on("pointerdown", function () {
            btn.play();
            popupC.visible = false;
        })
    }

    update() {
        this.pBall.update();
    }
    createHistory(cardi) {
        cardHistory.push(cardi);
        var revC = cardHistory.map(function(x) { return x });
        console.log(n++);
        this.historyContainer.removeAll();

        var max = revC.length > 10 ? 10 : revC.length;

        for (var i = 0; i < max; ++i) {
            var card = revC[revC.length-i-1];//this.cardsInGame[i];
            var symbolToCreate = card.suit === "s" ? 0 : card.suit === "c" ? 1 : card.suit === "d" ? 2 : card.suit === "h" ? 3 : null;
            if (symbolToCreate != null) {
                this.historyContainer.add(this.add.sprite(30 * i + 42, gh - 49, "symbols", symbolToCreate).setScale(0.3));
                this.historyContainer.add(this.add.text(30 * i + 42, gh - 34, card.num, {
                    fontFamily: "cursive Black", fontSize: 12, fontWeight: "bold",
                    fill: "#000000"
                }).setOrigin(0.5));
            }
        }
        if (firstMove === true) {
            firstMove = false;
        } else {
            this.payout(cardi);
        }
    }

    payout(card) {
        var cNum = this.getCardNum(card.num);

        if (!firstMove) {
            var prevCard = this.curCard;
            debugger
            if (this.getCardNum(prevCard.num) < cNum && guess === "h") {
                coins += 10;
            } else if (this.getCardNum(prevCard.num) > cNum && guess === "l") {
                coins += 10;
            } else if ((card.suit === "h" || card.suit === "d") && guess === "r") {
                coins += 25;
            } else if ((card.suit === "s" || card.suit === "c") && guess === "b") {
                coins += 25;
            } else if(cNum > 10 && guess === "jqka") {
                coins += 15;
            } else {
                coins -= 5;
            }

            
            this.bal.setText("Chip Balance: " + coins);
            this.curCard = card;
            this.nextCardIndex++;
        }
    }

    getCardNum(l) {
        if (l === "J") {
            return 11;
        } else if (l === "Q") {
            return 12;
        } else if (l === "K") {
            return 13;
        } else if (l === "A") {
            return 1;
        }
        return l;
    }

    createCard(i) {
        let card = this.add.sprite(- gameOptions.cardWidth * gameOptions.cardScale, gh * 1 / 3, "cards", i);
        card.num = cardnSuit[i].num;
        card.suit = cardnSuit[i].suit;
        card.setScale(gameOptions.cardScale);
        return card;
    }



    moveCards() {
        // console.log("move cards")
        if (completedMove) {
            completedMove = false;
            this.tweens.add({
                targets: this.cardsInGame[this.nextCardIndex - 1],
                y: gh * 2,
                duration: 500,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function () {
                    completedMove = true;
                    if (this.nextCardIndex == 51) {
                       // one deck over
                       // level up or restart shuffle

                        // Phaser.Utils.Array.Shuffle(this.cardsInGame);
                        // this.nextCardIndex = 0;
                        // cardHistory = [];
                    }

                }
            });

            // console.log(this.cardsInGame[this.nextCardIndex])
            this.tweens.add({
                targets: this.cardsInGame[this.nextCardIndex],
                x: gw / 2,
                duration: 500,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function () {
                    this.createHistory(this.cardsInGame[this.nextCardIndex]);

                }
            });


        }
    }
}


var Button = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize: function Button(scene, bgcolor, brdrcolor, alpha, w, borderSize, txt, cb, trianglar) {
        this.c = scene.add.rectangle(0, 0, w, 50, bgcolor).setOrigin(0.5);
        if (trianglar == 1) {
            this.cd = scene.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x160a01);
            this.cd.setScale(0.3, 0.2);
        } else if (trianglar == -1) {
            this.cd = scene.add.triangle(200, 200, 0, 148, 148, 148, 74, 0, 0x160a01);
            this.cd.setScale(0.3, -0.2);
        }

        this.c.setInteractive({ cursor: 'pointer' });
        this.c.on('pointerdown', function () {
            btn.play();
            cb();
        });
        this.c.setStrokeStyle(borderSize, brdrcolor);
        this.c.setAlpha(alpha);
        this.ttt = scene.add.text(0, 0, txt, {
            fontFamily: "cursive", fontSize: 20, fontWeight: "bold",
            fill: "#ffffff"
        }).setOrigin(0.5);
        this.ttt.inputEnabled = false;
        this.ttt.setStroke('#000000', 2);//.setShadow(2, 2, "#333333", 2, true, true);
    },
    show: function () {
        this.c.visible = true;
        this.ttt.visible = true;
    },
    hide: function () {
        this.c.visible = false;
        this.ttt.visible = false;
    },
    position: function (x, y) {
        this.c.setPosition(x, y);
        if (this.cd) this.cd.setPosition(x, y)
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
            var pb = scene.add.star(Math.random() * (gw - 100) + 50, Math.random() * (gh - 100) + 50, 5, Math.random() * 5, Math.random() * 5 + 3, color.color).setAlpha(Math.random() * 0.3);
            // var pb = scene.add.circle(Math.random() * (gw - 100) + 50, Math.random() * (gh - 100) + 50, Math.random() * 10, color.color).setAlpha(Math.random());
            pb.speedX = pb.speedY = Math.random() * 3;
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