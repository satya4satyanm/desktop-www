import 'phaser';

function createPoss(row, column) {
    return (row << 3) | column;
}
function GVM() {
    var moveList = [];
    var am = GenerateAllMoves(whiteTurn);
    if (!g_inCheck)
        for (var i = am.length - 1; i >= 0; i--) {
            var m = am[i];
            MakeMove(m);
            GenerateAllMoves(whiteTurn);
            if (!g_inCheck)
                moveList[moveList.length] = m;
            UnmakeMove(m);
        }
    return moveList;
}

function etog(emo) {
    var xmo = etox(emo);
    return xtog(xmo);
}

function etox(emo) {
    var l = 'abcdefgh';
    var n = '87654321';
    var a = emo.split('');
    var n1 = l.indexOf(a[0]);
    var n2 = n.indexOf(a[1]);
    var n3 = l.indexOf(a[2]);
    var n4 = n.indexOf(a[3]);
    var ns = (n2 << 3) | n1;
    var nd = (n4 << 3) | n3;
    return { s: ns, d: nd, p: emo.charAt(4) };
}

function mapRtoC(gmo) {
    var ma = (gmo & 0xFF);
    var mb = (gmo >> 8) & 0xFF;
    var max = (ma & 0x7);
    var mbx = (mb & 0x7);
    var may = (ma >> 3);
    var mby = (mb >> 3);
    ma = may * 8 + max;
    mb = mby * 8 + mbx;
    return { s: ma, d: mb, p: 'q' };
}

function xtog(xmo) {
    var max = xmo.s & 7;
    var mbx = xmo.d & 7;
    var may = xmo.s >> 3;
    var mby = xmo.d >> 3;
    var sa = createPoss(may, max);
    var sb = createPoss(mby, mbx);
    var move = sa | (sb << 8);
    if (xmo.p) {
        if (xmo.p == 'q') move = move | moveflagPromoteQueen;
        else if (xmo.p == 'r') move = move | moveflagPromoteRook;
        else if (xmo.p == 'b') move = move | moveflagPromoteBishop;
        else move = move | moveflagPromoteKnight;
    }
    var moves = GVM();
    for (var i = 0; i < moves.length; i++) {
        if ((move & 0xFFFF) == (moves[i] & 0xFFFF))
            if (moves[i] & moveflagPromotion) {
                if ((move & 0xF0FFFF) == (moves[i] & 0xF0FFFF))
                    return moves[i];
            } else return moves[i];
    }
    return null;
}

function cHistory() {
    this.fen = '';
    this.list = [];
}

cHistory.prototype.Add = function (m) {
    this.list.push(m);
}

cHistory.prototype.Clear = function () {
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.list = [];
}

cHistory.prototype.movesToString = function () {
    var s = '';
    for (var n = 0; n < this.list.length; n++)
        s += ' ' + this.list[n];
    return s;
}

var cRapuci = function () { }

cRapuci.prototype.GetInt = function (tokens, key, shift, def) {
    for (var i = 0; i < tokens.length; i++)
        if (tokens[i] == key)
            return parseInt(tokens[i + shift]);
    return def;
}

cRapuci.prototype.GetStr = function (tokens, key) {
    for (var i = 0; i < tokens.length; i++)
        if (tokens[i] == key)
            return tokens[i + 1];
    return '';
}

cRapuci.prototype.stringToEnd = function (tokens, key, def) {
    var val = '';
    for (var i = 0; i < tokens.length; i++)
        if (tokens[i] == key) {
            for (var j = i + 1; j < tokens.length; j++)
                val += tokens[j] + ' ';
            return val;
        }
    return def;
}

function cEngine() {
    this.engine = null;
    this.owner = null;
    this.name = '';
    this.author = '';
    this.goparam = '';
}

cEngine.prototype.move = function () {
    //enable/disable below line for development to get control from both sides
    this.engine.postMessage('position fen ' + History.fen + ' moves' + History.movesToString());//
    this.engine.postMessage('go ' + this.goparam);//
}

cEngine.prototype.Init = function (param) {
    this.name = '';
    this.author = '';
    this.goparam = param;
    this.Stop();
    this.engine = new Worker('./worker.js');
    this.engine.owner = this;
    this.engine.onmessage = function (e) {
        var message = e.data;
        message = message.trim();
        message = message.replace(/\s+/g, ' ');
        var tokens = message.split(' ');
        if (tokens[0] == 'bestmove') {
            Chess.roboMove(tokens[1]);
        } else if (tokens[0] == 'info') {
            var s = '';
            var mate = Rapuci.GetStr(tokens, 'score');
            var score = Rapuci.GetInt(tokens, 'score', 2, false);
            var depth = Rapuci.GetInt(tokens, 'depth', 1);
            var seldepth = Rapuci.GetInt(tokens, 'seldepth', 1, 0);
            var nps = Rapuci.GetInt(tokens, 'nps', 1, false);
            var pv = Rapuci.stringToEnd(tokens, 'pv', false);
            var sDepth = depth;
            if (depth) {
                if (seldepth) sDepth += '/' + seldepth;
                s += 'depth ' + sDepth + ' ';
            }
            if (nps) {
                var nls = nps.toLocaleString();
                s += 'nps ' + nls + ' ';
            }
            if (pv)
                s += 'pv ' + pv;
            if (score !== false) {
                if (score > 0) score = '+' + score;
                if (mate == 'mate') {
                    score += 'M';
                    if (score == "+1M")
                        showGameOver(message);
                }
            }
            if (pv) {
                this.pv = pv;
                this.sDepth = sDepth;
            }
        } else if (tokens[0] == 'id') {
            var a = Rapuci.stringToEnd(tokens, 'author');
            var n = Rapuci.stringToEnd(tokens, 'name');
            if (a) this.owner.author = a;
            if (n) this.owner.name = n;
        }
    }

    this.engine.postMessage('uci');
    this.engine.postMessage('ucinewgame');
}

cEngine.prototype.Stop = function () {
    if (this.engine) this.engine.terminate();
    this.engine = null;
}

function cChess() {
    this.fieldS = -1;
}

cChess.prototype.afterMove = function () {
    if (!whiteTurn)
        Engine.move();
}

cChess.prototype.Animate = function (isou, ides, eng) {
    movePpiece(isou, ides, eng);
    Chess.afterMove();
}

cChess.prototype.roboMove = function (emo) {
    var gmo = etog(emo);
    if (!gmo) return false;
    this.move(gmo, true);
    return true;
}

cChess.prototype.move = function (gmo, engg = false) {
    History.Add(FormatMove(gmo));
    MakeMove(gmo);
    var xmo = mapRtoC(gmo);
    this.fieldS = xmo.d;
    this.Animate(xmo.s, xmo.d, engg);
}

cChess.prototype.NewGame = function () {
    this.fieldS = -1;
    startGame();
    History.Clear();
    var param = 'movetime 1000';
    if (typeof resetPBoard === "function") resetPBoard();
    Engine.Init(param);
}


cChess.prototype.SetSelected = function (i) {
    var xmo = { s: this.fieldS, d: i, p: 'q' };
    var gmo = xtog(xmo);
    if (gmo) {
        this.move(gmo);
        return true;
    } else {
        this.fieldS = i;
        return false;
    }
}


var History = new cHistory();
var Engine = new cEngine();
var Rapuci = new cRapuci();
var Chess = new cChess();


var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 567,
    parent: 'phaser-example',
    fps: 120,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
function preload() {
    this.load.image('chessboard', 'assets/chessboard1.jpg');
    this.load.image('chessboard2', 'assets/chessboard2.jpg');
    this.load.image('winpopup', 'assets/winpopup.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('chessPieces', 'assets/chess_pieces.png');
    this.load.image('blackCube', 'assets/cube.png');
    this.load.image('whiteCube', 'assets/whiteCube.png');
    this.load.image('historyitemrobo', 'assets/historyitemrobo.png');
    this.load.image('historyitemuser', 'assets/historyitemuser.png');
    this.load.image('won', 'assets/won.png');
    this.load.image('lost', 'assets/lost.png');

    // Chess pieces
    this.load.image('black_bishop', 'assets/chessPieces/black_bishop.png');
    this.load.image('black_knight', 'assets/chessPieces/black_knight.png');
    this.load.image('black_king', 'assets/chessPieces/black_king.png');
    this.load.image('black_pawn', 'assets/chessPieces/black_pawn.png');
    this.load.image('black_queen', 'assets/chessPieces/black_queen.png');
    this.load.image('black_tower', 'assets/chessPieces/black_tower.png');
    this.load.image('white_bishop', 'assets/chessPieces/white_bishop.png');
    this.load.image('white_knight', 'assets/chessPieces/white_knight.png');
    this.load.image('white_king', 'assets/chessPieces/white_king.png');
    this.load.image('white_pawn', 'assets/chessPieces/white_pawn.png');
    this.load.image('white_queen', 'assets/chessPieces/white_queen.png');
    this.load.image('white_tower', 'assets/chessPieces/white_tower.png');

}

var board = 'undefined';
var pieces = 'undefined';
var cubes = 'undefined';
var selectedPiece = 'undefined';
var movePpiece = 'undefined';
var that = 'undefined';
var showGameOver = 'undefined';
var resetPBoard = 'undefined';
var side = "User";

function create() {
    board = this.add.sprite(0, 0, 'chessboard').setOrigin(0, 0);
    var initPosBoardX = 150;
    var initPosBoardY = 147;
    var pieceWidth = 45;
    var pieceHeight = 45;
    var cubeType = { 0: 'blackCube', 1: 'whiteCube' };

    var letterACode = 97;
    var position;

    var arrayPosition = [8, 7, 6, 5, 4, 3, 2, 1];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    cubes = this.add.group();
    var currentCube;
    for (var y = 0; y <= 7; y++) {
        for (var x = 0; x <= 7; x++) {
            currentCube = (x + y) % 2;
            var block = cubes.create(initPosBoardX + (x * 45), initPosBoardY + (y * 45), cubeType[currentCube]).setInteractive();
            block.number = x + y + (y * 7);
            block.ptype = "c";
            block.setName("cube" + block.number);
        }
    }

    cubes.children.entries.forEach(function (cube) {
        cube.on('pointerdown', initClick);
    });

    that = this;
    var piece;
    pieces = this.add.group();

    resetPBoard = function () {
        pieces.clear(true, true);
        createBoard();
    }

    var createBoard = function () {

        piece = pieces.create(initPosBoardX, initPosBoardY, 'black_tower');
        piece.number = '0';
        piece.name = 'p0';
        piece.ptype = 'b';
        piece.tower = true;
        piece = pieces.create(initPosBoardX + (pieceWidth), initPosBoardY, 'black_knight');
        piece.number = '1';
        piece.name = 'p1';
        piece.ptype = 'b';
        piece = pieces.create(initPosBoardX + (pieceWidth * 2), initPosBoardY, 'black_bishop');
        piece.number = '2';
        piece.name = 'p2';
        piece.ptype = 'b';
        piece = pieces.create(initPosBoardX + (pieceWidth * 3), initPosBoardY, 'black_queen');
        piece.number = '3';
        piece.name = 'p3';
        piece.ptype = 'b';
        piece = pieces.create(initPosBoardX + (pieceWidth * 4), initPosBoardY, 'black_king');
        piece.number = '4';
        piece.name = 'p4';
        piece.ptype = 'b';
        piece.king = true;
        piece = pieces.create(initPosBoardX + (pieceWidth * 5), initPosBoardY, 'black_bishop');
        piece.number = '5';
        piece.name = 'p5';
        piece.ptype = 'b';
        piece = pieces.create(initPosBoardX + (pieceWidth * 6), initPosBoardY, 'black_knight');
        piece.number = '6';
        piece.name = 'p6';
        piece.ptype = 'b';
        piece = pieces.create(initPosBoardX + (pieceWidth * 7), initPosBoardY, 'black_tower');
        piece.number = '7';
        piece.name = 'p7';
        piece.ptype = 'b';
        piece.tower = true;
        for (x = 0; x <= 7; x++) { // print all pawns
            position = String.fromCharCode(letterACode + x) + '7';
            piece = pieces.create(initPosBoardX + (x * pieceHeight), initPosBoardY + pieceWidth, 'black_pawn');
            piece.number = 8 + x;
            piece.name = "p" + (8 + x);
            piece.ptype = "b";
            piece.pawn = true;
        }

        piece = pieces.create(initPosBoardX, initPosBoardY + (pieceHeight * 7), 'white_tower');
        piece.number = '56';
        piece.name = 'p56';
        piece.ptype = 'w';
        piece.tower = true;
        piece = pieces.create(initPosBoardX + (pieceWidth), initPosBoardY + (pieceHeight * 7), 'white_knight');
        piece.number = '57';
        piece.name = 'p57';
        piece.ptype = 'w';
        piece = pieces.create(initPosBoardX + (pieceWidth * 2), initPosBoardY + (pieceHeight * 7), 'white_bishop');
        piece.number = '58';
        piece.name = 'p58';
        piece.ptype = 'w';
        piece = pieces.create(initPosBoardX + (pieceWidth * 3), initPosBoardY + (pieceHeight * 7), 'white_queen');
        piece.number = '59';
        piece.name = 'p59';
        piece.ptype = 'w';
        piece = pieces.create(initPosBoardX + (pieceWidth * 4), initPosBoardY + (pieceHeight * 7), 'white_king');
        piece.number = '60';
        piece.name = 'p60';
        piece.ptype = 'w';
        piece.king = true;
        piece = pieces.create(initPosBoardX + (pieceWidth * 5), initPosBoardY + (pieceHeight * 7), 'white_bishop');
        piece.number = '61';
        piece.name = 'p61';
        piece.ptype = 'w';
        piece = pieces.create(initPosBoardX + (pieceWidth * 6), initPosBoardY + (pieceHeight * 7), 'white_knight');
        piece.number = '62';
        piece.name = 'p62';
        piece.ptype = 'w';
        piece = pieces.create(initPosBoardX + (pieceWidth * 7), initPosBoardY + (pieceHeight * 7), 'white_tower');
        piece.number = '63';
        piece.name = 'p63';
        piece.ptype = 'w';
        piece.tower = true;
        for (x = 0; x <= 7; x++) { // print all pawns
            position = String.fromCharCode(letterACode + x) + '2';
            piece = pieces.create(initPosBoardX + (x * pieceHeight), initPosBoardY + (pieceHeight * 6), 'white_pawn');
            piece.number = 48 + x;
            piece.name = "p" + (48 + x);
            piece.ptype = "w";
            piece.pawn = true;
        }

        pieces.children.entries.forEach(function (piece) {
            piece.setInteractive();
            piece.on('pointerdown', initPieceClick);
            delete piece.oldPosition;
        });
    }
    createBoard();

    showGameOver = function (msg) {
        // console.log(side + msg); //+1M
        setTimeout(function () {
            wpopup.setVisible(true);
            that.children.bringToTop(wpopup);
            if (msg.indexOf("mate") > -1 && side == "robo") {
                defeat.setVisible(true);
                that.children.bringToTop(defeat);
            } else if (msg.indexOf("mate") > -1 && side == "user") {
                conquered.setVisible(true);
                that.children.bringToTop(conquered);
            }
        }, 200);
    }
    var winHistory = [];
    var container = this.add.container(595, 170);

    var showHistory = function () {
        var len = winHistory.length;
        container.list = [];
        setTimeout(() => {
            if (len > 10) {
                winHistory.slice(Math.max(winHistory.length - 10, 0))
                len = 10;
            } else {
                that.tweens.add({
                    targets: container.list[9],
                    scale: 0,
                    y: 560,
                    duration: 300,
                    ease: 'Linear'
                });
            }
        }, 500)


        if (len > 10) {
            winHistory.slice(Math.max(winHistory.length - 10, 0))
            len = 10;
        }
        var newArray = winHistory.slice().reverse();
        for (var i = 0; i < len; i++) {
            var innerContainer = that.add.container(0, 0);
            innerContainer.add(that.add.image(-3, -5, newArray[i].s === 'robo' ? 'historyitemrobo' : 'historyitemuser').setOrigin(0, 0));
            innerContainer.add(that.add.text(10, 14, newArray[i].p, { fontFamily: "Arial Black", fontSize: 12, color: "#a7602a", padding: 0 }));
            innerContainer.y = i * 30;
            container.add(innerContainer);
        }
    }

    movePpiece = function (s, d, eng) {
        // console.log(letters[s%8] + (8-Math.floor(s/8)) + " to " + letters[d%8] + (8-Math.floor(d/8)));
        side = eng ? "robo" : "user";
        winHistory.push({ p: letters[s % 8] + (8 - Math.floor(s / 8)) + " to " + letters[d % 8] + (8 - Math.floor(d / 8)), s: side });
        showHistory();
        selectedPiece = that.children.getByName("p" + s);
        var promoted = false;
        if (selectedPiece.king && s == 60 && d == 62) {
            var tower = that.children.getByName("p" + 63);
            if (tower.tower) {
                var cd1 = that.children.getByName("cube" + 61);
                that.tweens.add({
                    targets: tower,
                    x: cd1.x,
                    y: cd1.y,
                    duration: 100,
                    ease: 'Linear',
                    easeParams: [1]
                });
                tower.setName("p" + 61);
                tower.number = 61;
            }
        } else if (selectedPiece.king && s == 60 && d == 58) {
            var tower = that.children.getByName("p" + 56);
            if (tower.tower) {
                var cd1 = that.children.getByName("cube" + 59);
                that.tweens.add({
                    targets: tower,
                    x: cd1.x,
                    y: cd1.y,
                    duration: 100,
                    ease: 'Linear',
                    easeParams: [1]
                });
                tower.setName("p" + 59);
                tower.number = 59;
            }
        } else if (selectedPiece.king && s == 4 && d == 2) {
            var tower = that.children.getByName("p" + 0);
            if (tower.tower) {
                var cd1 = that.children.getByName("cube" + 3);
                that.tweens.add({
                    targets: tower,
                    x: cd1.x,
                    y: cd1.y,
                    duration: 100,
                    ease: 'Linear',
                    easeParams: [1]
                });
                tower.setName("p" + 3);
                tower.number = 3;
            }
        } else if (selectedPiece.king && s == 4 && d == 6) {
            var tower = that.children.getByName("p" + 7);
            if (tower.tower) {
                var cd1 = that.children.getByName("cube" + 5);
                that.tweens.add({
                    targets: tower,
                    x: cd1.x,
                    y: cd1.y,
                    duration: 100,
                    ease: 'Linear',
                    easeParams: [1]
                });
                tower.setName("p" + 5);
                tower.number = 5;
            }
        } else if (selectedPiece.pawn && (d < 8 || d > 55)) {
            var target = that.children.getByName("p" + d);
            var x, y;
            if (target) {
                x = target.x;
                y = target.y;
                destroyTarget(d);
            } else {
                target = that.children.getByName("cube" + d);
                x = target.x;
                y = target.y;
            }
            destroyTarget(s);
            var piece;
            if (d < 8) {
                piece = pieces.create(x, y, 'white_queen');
                piece.ptype = 'w';
            } else {
                piece = pieces.create(x, y, 'black_queen');
                piece.ptype = 'b';
            }
            selectedPiece = null;
            piece.number = d;
            piece.name = 'p' + d;
        }
        if (selectedPiece) {
            var cd = that.children.getByName("cube" + d);
            that.tweens.add({
                targets: selectedPiece,
                x: cd.x,
                y: cd.y,
                duration: 100,
                ease: 'Linear',
                easeParams: [1]
            });
            destroyTarget(d, s);
            selectedPiece.setName("p" + d);
            selectedPiece.number = d;
            selectedPiece = null;
        }
    }

    var restartBtn = this.add.sprite(620, 85, 'restart').setOrigin(0, 0).setInteractive().setScale(0.9);
    restartBtn.on("pointerdown", function () {
        winHistory = [];
        Chess.NewGame();
        defeat.setVisible(false);
        conquered.setVisible(false);
        if (tinted) tinted.clearTint();
    })

    var popup = this.add.sprite(0, 0, 'chessboard2').setOrigin(0, 0).setInteractive();
    popup.on("pointerdown", function () {
        this.setVisible(false);
        winHistory = [];
        Chess.NewGame();
        defeat.setVisible(false);
        conquered.setVisible(false);
        if (tinted) tinted.clearTint();
    })

    var wpopup = this.add.sprite(0, 0, 'winpopup').setOrigin(0, 0).setInteractive();
    wpopup.on("pointerdown", function () {
        this.setVisible(false);
        winHistory = [];
        Chess.NewGame();
        defeat.setVisible(false);
        conquered.setVisible(false);
        if (tinted) tinted.clearTint();
    });
    wpopup.alpha = 0.5;
    wpopup.setVisible(false);

    var defeat = that.add.image(405, 250, "lost");
    defeat.alpha = 0.5;
    defeat.setVisible(false);
    var conquered = that.add.image(405, 250, "won");
    conquered.alpha = 0.5;
    conquered.setVisible(false);
}

function destroyTarget(d, s = -1) {
    var target = that.children.getByName("p" + d);
    var pp = s - d;
    if (target) {
        target.destroy();
    } else if (selectedPiece.pawn && selectedPiece.ptype == "w" && (pp == 9 || pp == 7)) {
        destroyTarget(d + 8);
    } else if (selectedPiece.pawn && selectedPiece.ptype == "b" && (pp == -9 || pp == -7)) {
        destroyTarget(d - 8);
    }
}

function initClick(e, t) {
    if (tinted && (t || (e == undefined && t == undefined))) tinted.clearTint();
    Chess.SetSelected(this.number);
}

var tinted = null;
function initPieceClick() {
    if (tinted) tinted.clearTint();
    //enable/disable below line for development to get control from both sides
    if (this.ptype === 'w') {//
        selectedPiece = this;
        Chess.SetSelected(this.number);
        cubes.children.entries[this.number].emit('pointerdown', false);
        cubes.children.entries[this.number].setTintFill(0x00ff96);
        tinted = cubes.children.entries[this.number];
        //enable/disable below line for development to get control from both sides
    }//
    else {//
        cubes.children.entries[this.number].emit('pointerdown');//
    }//
}