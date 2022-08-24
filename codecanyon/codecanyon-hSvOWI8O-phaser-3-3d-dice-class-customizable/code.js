var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    parent: 'phaser-example',
    fps: 60,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var model;
rands = [];
highLow = null;
total = 0;

function Dice(quads, x, y, points) {
    this.x = x;
    this.y = y;
    this.stopped = true;
    this.points = points;
    this.points2d = [];
    for (var i = 0; i < this.points.length; i++) {
        this.points2d[i] = { x: 0, y: 0, z: 0 };
    }
    this.rotations = { x: 0, y: 0, z: 0 }; // initial rotation of the dices
    this.finalRot = { x: 0, y: 0, z: 0 };
    this.quad1 = me.add.quad(40, 40, quads, 0);
    this.quad2 = me.add.quad(40, 40, quads, 4);
    this.quad3 = me.add.quad(40, 40, quads, 5);
    this.quad4 = me.add.quad(40, 40, quads, 1);
    this.quad5 = me.add.quad(40, 40, quads, 2);
    this.quad6 = me.add.quad(40, 40, quads, 3);
    this.lastTime = new Date().getTime();
    this.draw2d = function () {
        var diceX = this.x;
        var diceY = this.y;
        this.quad1.setTopLeft(this.points2d[model["quads"][0][0]].x + diceX, this.points2d[model["quads"][0][0]].y + diceY);
        this.quad1.setTopRight(this.points2d[model["quads"][0][1]].x + diceX, this.points2d[model["quads"][0][1]].y + diceY);
        this.quad1.setBottomLeft(this.points2d[model["quads"][0][2]].x + diceX, this.points2d[model["quads"][0][2]].y + diceY);
        this.quad1.setBottomRight(this.points2d[model["quads"][0][3]].x + diceX, this.points2d[model["quads"][0][3]].y + diceY);
        this.quad1.depth = this.points2d[model["quads"][0][0]].z + this.points2d[model["quads"][0][1]].z +
            this.points2d[model["quads"][0][2]].z + this.points2d[model["quads"][0][3]].z;

        this.quad2.setTopLeft(this.points2d[model["quads"][1][0]].x + diceX, this.points2d[model["quads"][1][0]].y + diceY);
        this.quad2.setTopRight(this.points2d[model["quads"][1][1]].x + diceX, this.points2d[model["quads"][1][1]].y + diceY);
        this.quad2.setBottomLeft(this.points2d[model["quads"][1][2]].x + diceX, this.points2d[model["quads"][1][2]].y + diceY);
        this.quad2.setBottomRight(this.points2d[model["quads"][1][3]].x + diceX, this.points2d[model["quads"][1][3]].y + diceY);
        this.quad2.depth = this.points2d[model["quads"][1][0]].z + this.points2d[model["quads"][1][1]].z +
            this.points2d[model["quads"][1][2]].z + this.points2d[model["quads"][1][3]].z;

        this.quad3.setTopLeft(this.points2d[model["quads"][2][0]].x + diceX, this.points2d[model["quads"][2][0]].y + diceY);
        this.quad3.setTopRight(this.points2d[model["quads"][2][1]].x + diceX, this.points2d[model["quads"][2][1]].y + diceY);
        this.quad3.setBottomLeft(this.points2d[model["quads"][2][2]].x + diceX, this.points2d[model["quads"][2][2]].y + diceY);
        this.quad3.setBottomRight(this.points2d[model["quads"][2][3]].x + diceX, this.points2d[model["quads"][2][3]].y + diceY);
        this.quad3.depth = this.points2d[model["quads"][2][0]].z + this.points2d[model["quads"][2][1]].z +
            this.points2d[model["quads"][2][2]].z + this.points2d[model["quads"][2][3]].z;

        this.quad4.setTopLeft(this.points2d[model["quads"][3][0]].x + diceX, this.points2d[model["quads"][3][0]].y + diceY);
        this.quad4.setTopRight(this.points2d[model["quads"][3][1]].x + diceX, this.points2d[model["quads"][3][1]].y + diceY);
        this.quad4.setBottomLeft(this.points2d[model["quads"][3][2]].x + diceX, this.points2d[model["quads"][3][2]].y + diceY);
        this.quad4.setBottomRight(this.points2d[model["quads"][3][3]].x + diceX, this.points2d[model["quads"][3][3]].y + diceY);
        this.quad4.depth = this.points2d[model["quads"][3][0]].z + this.points2d[model["quads"][3][1]].z +
            this.points2d[model["quads"][3][2]].z + this.points2d[model["quads"][3][3]].z;

        this.quad5.setTopLeft(this.points2d[model["quads"][4][0]].x + diceX, this.points2d[model["quads"][4][0]].y + diceY);
        this.quad5.setTopRight(this.points2d[model["quads"][4][1]].x + diceX, this.points2d[model["quads"][4][1]].y + diceY);
        this.quad5.setBottomLeft(this.points2d[model["quads"][4][2]].x + diceX, this.points2d[model["quads"][4][2]].y + diceY);
        this.quad5.setBottomRight(this.points2d[model["quads"][4][3]].x + diceX, this.points2d[model["quads"][4][3]].y + diceY);
        this.quad5.depth = this.points2d[model["quads"][4][0]].z + this.points2d[model["quads"][4][1]].z +
            this.points2d[model["quads"][4][2]].z + this.points2d[model["quads"][4][3]].z;

        this.quad6.setTopLeft(this.points2d[model["quads"][5][0]].x + diceX, this.points2d[model["quads"][5][0]].y + diceY);
        this.quad6.setTopRight(this.points2d[model["quads"][5][1]].x + diceX, this.points2d[model["quads"][5][1]].y + diceY);
        this.quad6.setBottomLeft(this.points2d[model["quads"][5][2]].x + diceX, this.points2d[model["quads"][5][2]].y + diceY);
        this.quad6.setBottomRight(this.points2d[model["quads"][5][3]].x + diceX, this.points2d[model["quads"][5][3]].y + diceY);
        this.quad6.depth = this.points2d[model["quads"][5][0]].z + this.points2d[model["quads"][5][1]].z +
            this.points2d[model["quads"][5][2]].z + this.points2d[model["quads"][5][3]].z;
    }

    this.rotateX3DTo = function (theta) { // radians
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        for (var n = 0; n < model.verts.length; n++) {
            var vert = model.verts[n];
            var staticVerts = model.staticVerts[n];
            var y = staticVerts.y;
            var z = staticVerts.z;

            vert.y = y * tc - z * ts;
            vert.z = z * tc + y * ts;
        }
    }

    this.rotateY3DTo = function (theta) {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        for (var n = 0; n < model.verts.length; n++) {
            var vert = model.verts[n];
            var staticVerts = model.staticVerts[n];
            var x = staticVerts.x;
            var z = staticVerts.z;

            vert.x = x * tc - z * ts;
            vert.z = z * tc + x * ts;
        }
    }

    this.rotateZ3DTo = function (theta) {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        for (var n = 0; n < model.verts.length; n++) {
            var vert = model.verts[n];
            var staticVerts = model.staticVerts[n];
            var x = staticVerts.x;
            var y = staticVerts.y;

            vert.x = x * tc - y * ts;
            vert.y = y * tc + x * ts;
        }
    }

    this.animate = function () {
        var t = this;
        var time = new Date().getTime();
        var diffTime = (time - t.lastTime) * 0.001;
        if (diffTime > 0.1) diffTime = 0.1;

        var rotIncrement = 2;
        if (Math.abs(Math.ceil(t.finalRot.x * 100) - Math.ceil(t.rotations.x * 100)) > rotIncrement + 1) {
            t.rotations.x += diffTime * rotIncrement;
            t.stopped = false;
        } else {
            t.rotations.x = t.finalRot.x;
            t.stopped = true;
        }

        if (Math.abs(Math.ceil(t.finalRot.y * 100) - Math.ceil(t.rotations.y * 100)) > rotIncrement + 1) {
            t.rotations.y += diffTime * rotIncrement;
        } else {
            t.rotations.y = t.finalRot.y;
        }

        if (Math.abs(Math.ceil(t.finalRot.z * 100) - Math.ceil(t.rotations.z * 100)) > rotIncrement + 1) {
            t.rotations.z += diffTime * rotIncrement;
        } else {
            t.rotations.z = t.finalRot.z;
        }

        t.lastTime = time;
        t.updateFrameFunc();
    }

    this.updateFrameFunc = function () {
        var t = this;
        var sin = Math.sin;
        var cos = Math.cos;
        var points2d = t.points2d;

        var x, y, z, xy, xz, yx, yz, zx, zy;
        var sx = sin(t.rotations.x);
        var cx = cos(t.rotations.x);
        var sy = sin(t.rotations.y);
        var cy = cos(t.rotations.y);
        var sz = sin(t.rotations.z);
        var cz = cos(t.rotations.z);

        for (var i = 0; i < t.points.length; i++) {
            x = t.points[i].x;
            y = t.points[i].y;
            z = t.points[i].z;
            xy = cx * y - sx * z;
            xz = sx * y + cx * z;
            yz = cy * xz - sy * x;
            yx = sy * xz + cy * x;
            zx = cz * yx - sz * xy;
            zy = sz * yx + cz * xy;
            points2d[i].x = zx;
            points2d[i].y = zy;
            points2d[i].z = yz;
        }
        t.draw2d();
    }
}

function preload() {
    this.load.image('bg', 'bg1.png');
    this.load.spritesheet('d1', 'd1.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d2', 'd2.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d3', 'd3.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d4', 'd4.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d5', 'd5.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d6', 'd6.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d7', 'd7.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('d8', 'd8.png', { frameWidth: 80, frameHeight: 80 });

    this.load.image('roll', 'roll.png');
}

function create() {
    var diceSize = 20;
    model = {
        "staticVerts": [
            { x: -diceSize, y: -diceSize, z: diceSize }, { x: diceSize, y: -diceSize, z: diceSize }, { x: diceSize, y: diceSize, z: diceSize },
            { x: -diceSize, y: diceSize, z: diceSize }, { x: -diceSize, y: -diceSize, z: -diceSize }, { x: diceSize, y: -diceSize, z: -diceSize },
            { x: diceSize, y: diceSize, z: -diceSize }, { x: -diceSize, y: diceSize, z: -diceSize }
        ],
        "verts": [
            { x: -diceSize, y: -diceSize, z: diceSize }, { x: diceSize, y: -diceSize, z: diceSize }, { x: diceSize, y: diceSize, z: diceSize },
            { x: -diceSize, y: diceSize, z: diceSize }, { x: -diceSize, y: -diceSize, z: -diceSize }, { x: diceSize, y: -diceSize, z: -diceSize },
            { x: diceSize, y: diceSize, z: -diceSize }, { x: -diceSize, y: diceSize, z: -diceSize }
        ]
        , "quads": [[0, 1, 3, 2], [4, 0, 7, 3], [5, 4, 6, 7], [1, 5, 2, 6], [3, 2, 7, 6], [4, 5, 0, 1]]
    };
    me = this;
    var quads1 = 'd1';
    var quads2 = 'd2';
    var quads3 = 'd3';
    var quads4 = 'd4';
    var quads5 = 'd5';
    var quads6 = 'd6';
    var quads7 = 'd7';
    var quads8 = 'd8';
    dices = [];
    var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.alpha = 0.1;

    d1 = new Dice(quads1, 165, 120, model.verts);
    dices.push(d1);

    d2 = new Dice(quads2, 250, 120, model.verts);
    dices.push(d2);

    d3 = new Dice(quads3, 340, 120, model.verts);
    dices.push(d3);

    d4 = new Dice(quads4, 425, 120, model.verts);
    dices.push(d4);

    d5 = new Dice(quads5, 145, 200, model.verts);
    dices.push(d5);

    d6 = new Dice(quads6, 245, 200, model.verts);
    dices.push(d6);

    d7 = new Dice(quads7, 345, 200, model.verts);
    dices.push(d7);

    d8 = new Dice(quads8, 445, 200, model.verts);
    dices.push(d8);

    var roll = this.add.image(300, 300, 'roll');

    //  Make them all input enabled
    roll.setInteractive();

    roll.on('clicked', startRoll, this);

    this.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
    }, this);

    this.lastTime = new Date().getTime();

    this.add.text(130, 16, 'Phaser 3 3d rotating Dice', { fontSize: '22px', fill: '#fff' });
    this.t = this.add.text(80, 350, 'Works with Phaser 3 Quads', { fontSize: '30px', fill: '#ffb900', fontWeight: 600 });
    this.add.text(130, 416, 'Phaser 3 3d rotating Dice', { fontSize: '22px', fill: '#fff' });
}

function startRoll(btn) {
    var t = this;
    var one = { x: 0, y: 0, z: 0 }; // 1
    var two = { x: 0, y: 4.71238898038469, z: 0 }; // 2
    var three = { x: 1.5707963267948966, y: 0, z: 0 }; // 3
    var four = { x: 4.71238898038469, y: 0, z: 0 }; // 4
    var five = { x: 0, y: 1.5707963267948966, z: 0 }; // 5
    var six = { x: 0, y: 3.141592653589793, z: 0 }; // 6
    rands = [];
    if (dices[0].stopped) {
        dices.forEach(function (dice) {
            var rand = Math.ceil(Math.random() * 6);
            dice.rand = rand;

            if (rand == 1) {
                dice.finalRot = one;
            }
            if (rand == 2) {
                dice.finalRot = two;
            }
            if (rand == 3) {
                dice.finalRot = three;
            }
            if (rand == 4) {
                dice.finalRot = four;
            }
            if (rand == 5) {
                dice.finalRot = five;
            }
            if (rand == 6) {
                dice.finalRot = six;
            }
            dice.rotations = { x: dice.finalRot.x - 28, y: dice.finalRot.y - 28, z: dice.finalRot.z - 28 };
            rands.push(rand - 1);
        });
    }
}


function update() {
    for (var i = 0; i < dices.length; i++) {
        var d = dices[i];
        d.animate();
        if (d.stopped) {}
    }
}