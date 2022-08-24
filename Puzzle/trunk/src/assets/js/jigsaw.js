'use strict';
/*
===============================================================
Global Variable Declaration
Below are the varaibles used globally. So don't rename them
===============================================================
*/
var tolerance = 20;
var edgeMargin = 0;
var shortList;
var cellDim = new Object();
var row, col, unit, pic, pieceArray, pieceIndex;
var picDim = new Object();
var complete = 1;
var trans, xm, ym, ts;
var timeElapsed;
var hintImage, ghostImage, previewImage, previewOutline, resizeHandler, fiftyPercentScale;
var angle = [0, 90, 180, 270];
var rnd;
var inGame = false;
var throwEffect;
var selectedPic;
var fromLocalStorage = false; // satya
var lsData = {};
var key = null;
var commonKey = "treecardgames.jigsaw.options";
var borderPadding = {};
var zIndexNPiece = [];
var completedGameSaved = false;
var backgroundImg = null;

var grayScale = new createjs.ColorMatrixFilter([
    0.30, 0.30, 0.30, 0, 0, // red component
    0.30, 0.30, 0.30, 0, 0, // green component
    0.30, 0.30, 0.30, 0, 0, // blue component
    0, 0, 0, 1, 0  // alpha
]);
var colorScale = new createjs.ColorMatrixFilter([
    1, 0, 0, 0, 0, // red component
    0, 1, 0, 0, 0, // green component
    0, 0, 1, 0, 0, // blue component
    0, 0, 0, 1, 0  // alpha
]);
var bgAudio = "bg.mp3";
/*
===============================================================
This function runs after getImageMetadata dispatch an event
This funcation is the starting point to finalize the image that
need to be selected for jigsaw puzzle.
===============================================================
*/
function onImageLoaded(e) {
    var rcArray = [];
    hintImage = new createjs.Bitmap(e.target);
    ghostImage = new createjs.Bitmap(e.target);
    previewImage = new createjs.Bitmap(e.target);
    pic = new createjs.Bitmap(e.target);
    var bitmap = new createjs.Bitmap(e.target);
    debug.innerHTML = bitmap.image.width + " x " + bitmap.image.height;


    // apply width and height of image based on size
    // size list is counted from here

    var w = (gw - 110) * dpi - 20 * edgeMargin * dpi;
    var h = gh * dpi - 20 * edgeMargin * dpi;

    var sk = 1;
    if (bitmap.image.width > w * 0.5 && bitmap.image.width > bitmap.image.height) {
        w = w * 0.5;
        sk = w / e.target.width;
    } else if (bitmap.image.height > h * 0.8) {
        h = h * 0.8;
        sk = h / e.target.height;
    }

    // var sk = w / e.target.width;
    // if (e.target.height * sk > h) {
    //     sk = h / e.target.height;
    // }

    var imgW = bitmap.image.width * sk;
    var imgH = bitmap.image.height * sk;
    unit = 40;
    getRowCol();
    /*
    ===============================================================
    getRowCol function is used to get all the possible image sizes
    keeping the jigsaw piece shape as square, orientation and edge
    margin.
    ===============================================================
    */
    function getRowCol() {
        var row = Math.floor(imgH / unit);
        var col = Math.floor(imgW / unit);
        var sx, sy;
        sx = sy = imgH / row / 40;
        var nsk = (40 * row * sx) / pic.image.height;
        pic.scale = nsk;
        //--------===========================================sssssssssssssssssssssssssssssssss
        // console.log((pic.image.width * nsk) / (40 * sx))
        col = Math.round((pic.image.width * nsk) / (40 * sx));

        if (row * col > 200) {
            unit += 1;
            getRowCol();
        } else {
            if (row * col < 4 || (row < 2 || col < 2)) {
                rcArray = rcArray.reverse();
                getShortList();
            } else {
                rcArray.push({ row: row, col: col, unit: unit, imgScale: nsk, sx: sx });
                unit += 1;
                getRowCol();
            }
        }
        var cx = (game.clientWidth - col * 40 * nsk) / 2

    }
    /*
    ===============================================================
    The list obtained by getRowCol is then be short listed by 
    getShortList function.
    ===============================================================
    */
    function getShortList() {
        shortList = [];
        var items = [];
        shortList.push({ row: rcArray[0].row, col: rcArray[0].col, unit: rcArray[0].unit, imgScale: rcArray[0].imgScale, sx: rcArray[0].sx });
        items.push(rcArray[0].row * rcArray[0].col);
        // items.push(rcArray[0].row + " x " + rcArray[0].col + " (" + rcArray[0].row * rcArray[0].col + " pieces)");
        for (var s = 1; s < rcArray.length; s++) {
            if (rcArray[s - 1].row !== rcArray[s].row && rcArray[s - 1].col !== rcArray[s].col) {
                // } else {
                shortList.push({ row: rcArray[s].row, col: rcArray[s].col, unit: rcArray[s].unit, imgScale: rcArray[s].imgScale, sx: rcArray[s].sx });
                items.push(rcArray[s].row * rcArray[s].col);
                // items.push(rcArray[s].row + " x " + rcArray[s].col + " (" + rcArray[s].row * rcArray[s].col + " pieces)");
            }
        }
        rcArray = shortList;
        populateSize(items);
    }
}
/*
===============================================================
This function perform the following tasks:
1. lock game area
2. play loop audio
3. setup header icons
4. Garbage Collection or Nullify previous game assets stored in
gameBox, hintBox and hintOutline
5. set row & col
6. Reset framerate according the the device and (row x col) combination
7. Reset time and counter
8. Set all the display objects based on settings provided in screenSetup
9. Compute timeLimit & warnAt values
10. Execute create Piece function
===============================================================
*/
function createJigsawPuzzle(fromLS) {
    gameStarted = true;
    fromLocalStorage = fromLS ? true : false;
    var commonOptions = JSON.parse(localStorage.getItem(commonKey));
    if (fromLocalStorage) {
        // pieceArray = JSON.parse(localStorage.getItem(key)).pieces;
        settings = JSON.parse(localStorage.getItem(key)).settings;
        var lsd = JSON.parse(localStorage.getItem(key)).lsData;
        var bgImg = commonOptions.bgImg;
        document.getElementById('game').style.backgroundImage = "url('assets/images/backgrounds/large/" + bgImg + "')";
        var image1 = new Image();
        image1.onload = function (e) {
            pic = new createjs.Bitmap(e.target);
            hintImage = new createjs.Bitmap(e.target);
            ghostImage = new createjs.Bitmap(e.target);
            previewImage = new createjs.Bitmap(e.target).set({ cursor: "move" });
            row = lsd.row;
            col = lsd.col;
            unit = lsd.unit;
            pic.scale = lsd.scale;
            picDim.sx = lsd.sx;
            picDim.xf = lsd.xf;
            connectedPieces = lsd.connectedPieces;
            zIndexNPiece = lsd.zIndex;

            lsData.row = row;
            lsData.col = col;
            lsData.unit = unit;
            lsData.scale = pic.scale;
            lsData.sx = picDim.sx;
            lsData.xf = picDim.xf;
            lsData.completed = false;
            lsData.timeElapsed = lsd.timeElapsed;
            lsData.connectedPieces = lsd.connectedPieces;
            lsData.zIndex = lsd.zIndex;
            // applyCommonSettings(commonOptions);
            fromLocalStorage = true;
            createJigsaw();
        };
        image1.src = settings.pic;
    } else {
        //document.getElementById('game').style.backgroundImage = 'none';
        row = shortList[settings.sizeIndex].row;
        col = shortList[settings.sizeIndex].col;
        unit = shortList[settings.sizeIndex].unit;
        pic.scale = shortList[settings.sizeIndex].imgScale;
        picDim.sx = shortList[settings.sizeIndex].sx;
        picDim.xf = ((col * 40 * picDim.sx) - (pic.image.width * shortList[settings.sizeIndex].imgScale)) / 2;

        connectedPieces = [];
        lsData.connectedPieces = [];

        lsData.row = row;
        lsData.col = col;
        lsData.unit = unit;
        lsData.scale = pic.scale;
        lsData.sx = picDim.sx;
        lsData.xf = picDim.xf;
        lsData.completed = false;
        lsData.timeElapsed = 0;
        // applyCommonSettings(commonOptions);
        fromLocalStorage = false;
        createJigsaw();
    }
}

function applyCommonSettings(data) {
    if (data) {
        settings.pieceColor = data.pieceColor;
        settings.shape = data.shape;
        // settings.sounds = data.sounds;
        settings.pieceDistribution = data.pieceDistribution;
    }
}

function createJigsaw() {
    lock.style.display = "block";
    playLoopAudio("assets/audios/" + bgAudio);
    // header.getChildByName("btnSetup1").visible = true;
    // header.getChildByName("btnPlayOn").visible = true;
    // header.getChildByName("btnPlayOff").visible = false;

    // header.getChildByName("btnMuteOn").visible = (volume == 0) ? false : true;
    // header.getChildByName("btnMuteOff").visible = (volume == 0) ? true : false;

    while (gameBox.numChildren != 0) {
        gameBox.removeChildAt(0);
    }
    hintBox.uncache();
    while (hintBox.numChildren != 0) {
        hintBox.removeChildAt(0);
    }
    ghostBox.uncache();
    while (ghostBox.numChildren != 0) {
        ghostBox.removeChildAt(0);
    }
    // previewBox.uncache();
    while (previewBox.numChildren != 0) {
        previewBox.removeChildAt(0);
    }
    hintOutline.uncache();
    while (hintOutline.numChildren != 0) {
        hintOutline.removeChildAt(0);
    }
    ghostOutline.uncache();
    while (ghostOutline.numChildren != 0) {
        ghostOutline.removeChildAt(0);
    }

    if (device == "smart") {
        createjs.Ticker.framerate = Math.round((30 + (row * col) / 6.5));
    }

    header.getChildByName("txtTime").text = "Time:\n00:00:00";
    header.visible = true;

    hintImage.scale = shortList ? shortList[settings.sizeIndex].imgScale : lsData.scale;
    hintImage.alpha = 0.01;
    ghostImage.scale = shortList ? shortList[settings.sizeIndex].imgScale : lsData.scale;
    hintBox.mouseChildren = false;
    hintBox.addChild(hintImage);
    hintBox.addChild(hintOutline);
    ghostBox.mouseChildren = false;
    ghostBox.addChild(ghostImage);
    ghostBox.addChild(ghostOutline);
    previewImage.scale = shortList ? shortList[settings.sizeIndex].imgScale / 2 : lsData.scale / 2;
    fiftyPercentScale = previewImage.scale;
    // previewImage.regX = 0;//previewImage.image.width / 2;
    // previewImage.regY = 0;//previewImage.image.height / 2;
    previewImage.cursor = "move";
    //var borderSize = previewImage.image.width * 5 / 100;
    borderPadding = previewImage.image.width * previewImage.scale * 0.2;
    var g = new createjs.Graphics().beginFill("#FFFFFF").drawRect(-borderPadding / 2, -borderPadding / 2, previewImage.image.width + borderPadding, previewImage.image.height + borderPadding).endFill();
    previewOutline = new createjs.Shape(g).set({
        rotation: previewImage.rotation,
        // regX: previewImage.image.width / 2 + borderSize / 2,
        // regY: previewImage.image.height / 2 + borderSize / 2,
        scale: previewImage.scale,
        shadow: new createjs.Shadow("#000000", 0, 0, 2.5)
    });
    var g1 = new createjs.Graphics().beginFill("#666666").drawPolygon(0, 0, 0, -50, 20, -50, 20, 20, -50, 20, -50, 0, 0, 0).endFill();
    resizeHandler = new createjs.Shape(g1).set({
        regX: -20 * previewImage.scale,
        regY: -22 * previewImage.scale,
        scale: previewImage.scale,
        cursor: "se-resize"
    });
    previewBox.addChild(previewOutline);
    previewBox.addChild(previewImage);
    previewBox.addChild(resizeHandler);


    previewImage.addEventListener('mousedown', function (e) { onTouch1(e); });
    previewImage.addEventListener('pressmove', function (e) { onTouch1(e); });

    resizeHandler.addEventListener('mousedown', function (e) { onTouchResize(e); });
    resizeHandler.addEventListener('pressmove', function (e) { onTouchResize(e); });

    // background frames to show outline
    hintOutline.visible = (settings.gameType == "position" || settings.gameType == "one-piece") ? true : false;
    ghostOutline.visible = false;//(settings.gameType == "position") ? true : false;
    ghostImage.alpha = (settings.hint == "Yes") ? .6 : 0;
    hintBox.x = ((gw * dpi - 110) - hintBox.getBounds().width) / 2;
    hintBox.y = (gh * dpi - hintBox.getBounds().height) / 2;

    previewImage.x = hintBox.x;// - hintImage.image.width * hintImage.scale / 2;
    previewImage.y = hintBox.y;// - hintImage.image.height * hintImage.scale / 2;

    // if (ghostBox) {
    ghostBox.x = ((gw * dpi - 110) - ghostBox.getBounds().width) / 2;
    ghostBox.y = (gh * dpi - ghostBox.getBounds().height) / 2;

    // previewImage.x = ghostBox.x;// - hintImage.image.width * hintImage.scale / 2;
    // previewImage.y = ghostBox.y;// - hintImage.image.height * hintImage.scale / 2;
    // }

    previewOutline.x = previewImage.x// - borderPadding.w/2;
    previewOutline.y = previewImage.y// - borderPadding.h/2;
    resizeHandler.x = previewImage.x + previewImage.image.width * previewImage.scale;
    resizeHandler.y = previewImage.y + previewImage.image.height * previewImage.scale;
    // ///////////////////////
    // pic.scale = shortList[settings.sizeIndex].imgScale;
    // picDim.sx = shortList[settings.sizeIndex].sx;
    // picDim.xf = ((col * 40 * picDim.sx) - (pic.image.width * shortList[settings.sizeIndex].imgScale)) / 2;
    // ///////////////////////
    if (fromLocalStorage) {
        pieceArray = JSON.parse(localStorage.getItem(key)).pieces;
    } else {
        pieceArray = getPieceArray(row, col);
    }
    
    pieceIndex = 0;
    gameBox.visible = false;
    hintBox.visible = false;
    ghostBox.visible = false;
    previewBox.visible = false;
    piecesBox.visible = false;
    lsDOptions.sounds == "Yes" ? toggleMute(false) : toggleMute(true);
    var rotationFactor = (settings.rotation == "Yes") ? 2 : 1;
    var hintFactor = (settings.hint == "No") ? 2 : 1;
    // var throwFactor = (settings.throw == "all") ? 1 : 2;
    var colorFactor = (settings.pieceColor == "colored") ? 1 : 2;
    timeLimit = row * col * rotationFactor * hintFactor * colorFactor * 2; //* throwFactor
    // timeLimit = 4; // 4 seconds
    warnAt = Math.round(timeLimit / 4);
    complete = 0; // (settings.gameType == "position") ? 0 : 1;
    header.getChildByName("txtCount").text = "Pieces:\n" + complete + "/" + (row * col);
    createPiece();
    stage.update();
}

function onTouch1(e) {
    if (e.type == "mousedown") {
        previewBox.offset = { x: previewBox.x - e.stageX, y: previewBox.y - e.stageY };
    } else if (e.type == "pressmove") {
        previewBox.x = previewBox.offset.x + e.stageX;
        previewBox.y = previewBox.offset.y + e.stageY;
    }
}
function onTouchResize(e) {
    if (e.type == "mousedown") {
        resizeHandler.offset = { x: previewImage.x, y: previewImage.y };
    } else if (e.type == "pressmove") {
        var diagonalHalf = dpi * (Math.sqrt(Math.pow(previewImage.image.width, 2) + Math.pow(previewImage.image.height, 2)));

        var dist = Math.sqrt(Math.pow((e.stageX - previewBox.x - resizeHandler.offset.x), 2) + Math.pow((e.stageY - previewBox.y - resizeHandler.offset.y), 2));

        var calcScale = dist / diagonalHalf;
        // calculate min and max
        if (calcScale <= fiftyPercentScale * 2 / 5) {
            calcScale = fiftyPercentScale * 2 / 5;
        } else if (calcScale >= fiftyPercentScale * 2) {
            calcScale = fiftyPercentScale * 2;
        }
        previewImage.scale = previewOutline.scale = calcScale;
        resizeHandler.x = previewImage.x + previewImage.image.width * previewImage.scale;
        resizeHandler.y = previewImage.y + previewImage.image.height * previewImage.scale;
        resizeHandler.scale = previewImage.scale;

        // if(e.stageX > resizeHandler.offset.x && e.stageY > resizeHandler.offset.y) {
        //     console.log("increase size")
        // }
    }
    stage.update();

}

/*
===============================================================
This function perform the following tasks:
1. remove any previously placed instance of item from tray
2. Execute getShapes function to collect shapes for jigsaw piece
3. Once the shape obtained reposition the image, overlay the shape
   apply filter, cache and then    
4. scale ovenCanvas accordingly
5. save ovenCanvas as image.
===============================================================
*/
function createPiece() {
    // document.querySelector("#game").style.backgroundColor = "rgba(65,0,0,0)";

    // https://kudox.jp/java-script/createjs-easeljs-dropshadowfilter  try this

    while (tray.numChildren != 0) {
        tray.removeChildAt(0);
    }
    var shapes = getShapes(pieceArray[pieceIndex].shape, picDim.sx);
    var shapes1 = getShapes(pieceArray[pieceIndex].shape, picDim.sx);
    var stroke = shapes[0].stroke;
    var stroke1 = shapes1[0].stroke;
    hintOutline.addChild(stroke);
    ghostOutline.addChild(stroke1);
    var cell = shapes[0].cell;
    var effect = shapes[0].effect;
    //effect.shadow = new createjs.Shadow("rgba(0,0,0,.3)", 3, 3, 5);
    var outline = shapes[0].outline;
    //var blurFilter = new createjs.BlurFilter(20, 20, 2);
    //outline.filters = [blurFilter];

    var tmp = String(shapes[0].dim).split(" ");
    cellDim.x = tmp[0];
    cellDim.y = tmp[1];
    cellDim.width = tmp[2]; // adjust width here
    cellDim.height = tmp[3];
    cellDim.pivotX = tmp[4];
    cellDim.pivotY = tmp[5];

    hintOutline.x = 20 * picDim.sx - picDim.xf;
    hintOutline.y = 20 * picDim.sx;
    ghostOutline.x = 20 * picDim.sx - picDim.xf;
    ghostOutline.y = 20 * picDim.sx;
    stroke.regX = tmp[4] * picDim.sx;
    stroke.regY = tmp[5] * picDim.sx;

    stroke.x = pieceArray[pieceIndex].xpos * 40 * picDim.sx;
    stroke.y = pieceArray[pieceIndex].ypos * 40 * picDim.sx;

    // pic.scaleX = 1.2; // this is rnd

    pic.x = -(pieceArray[pieceIndex].xpos * 40 - cellDim.pivotX + 20) * picDim.sx + picDim.xf;
    pic.y = -(pieceArray[pieceIndex].ypos * 40 - cellDim.pivotY + 20) * picDim.sx;
    pic.mask = cell;

    var bevel = effect.clone(true);
    bevel.alpha = .35;
    var bevelBlurFilter = new createjs.BlurFilter(3, 3, 2);
    bevel.filters = [bevelBlurFilter];

    // below codes are used in 3d
    // var effect1 = shapes[0].effect;
    // effect1.shadow = new createjs.Shadow("rgba(0,0,0,.8)", 2, 2, -5);

    // var bevel1 = effect1.clone(true);
    // bevel1.alpha = .9;
    // var bevelBlurFilter1 = new createjs.BlurFilter(-50, -50, 48);
    // bevel1.filters = [bevelBlurFilter1];

    var bevelPic = pic.clone(true);
    var bevelPicMask = cell.clone(true);
    bevelPicMask.scale = .988; //985
    bevelPic.mask = bevelPicMask;

    tray.addChild(effect, pic, outline); //, bevel, bevelPic  - enable this for 3d effect, one might have to remove outline in 3d

    ovenCanvas.width = (parseInt(cellDim.width) + 20) * picDim.sx;
    ovenCanvas.height = (parseInt(cellDim.height) + 20) * picDim.sx;

    ovenStage.update();
    tray.snapToPixel = true;
    var image1 = new Image();
    image1.onload = function (e) { onPieceImageLoaded(e) };
    image1.src = ovenCanvas.toDataURL("image/png", 1);
}
/*
===============================================================
This function is actually a lister for image loaded from create Piece
function.
This function get and set the values in pieceArray
This function also check whether the piece count reach to row x col
If No then repeat the creatPiece.
If yes then run pieceDistribution function.
===============================================================
*/
function onPieceImageLoaded(e) {


    // backgroundImg.visible = false;
    var xp = pieceArray[pieceIndex].xpos;
    var yp = pieceArray[pieceIndex].ypos;
    var neighbours = [];
    var edgePiece = false;
    if (xp == 0 && yp == 0) {
        neighbours = [{ id: pieceIndex + 1, pos: "R" }, { id: col, pos: "B" }];
        edgePiece = true;
    } else if (xp > 0 && xp < col - 1 && yp == 0) {
        neighbours = [{ id: xp - 1, pos: "L" }, { id: xp + 1, pos: "R" }, { id: xp + col, pos: "B" }];
        edgePiece = true;
    } else if (xp == col - 1 && yp == 0) {
        neighbours = [{ id: xp - 1, pos: "L" }, { id: xp + col, pos: "B" }];
        edgePiece = true;
    } else if (xp == 0 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: col * (yp - 1), pos: "T" }, { id: col * yp + 1, pos: "R" }, { id: col * (yp + 1), pos: "B" }];
        edgePiece = true;
    } else if (xp > 0 && xp < col - 1 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + 1, pos: "R" }, { id: pieceIndex + col, pos: "B" }];
    } else if (xp == col - 1 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + col, pos: "B" }];
        edgePiece = true;
    } else if (xp == 0 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex + 1, pos: "R" }]
        edgePiece = true;
    } else if (xp > 0 && xp < col - 1 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + 1, pos: "R" }]
        edgePiece = true;
    } else if (xp == col - 1 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }]
        edgePiece = true;
    }
    var bitmap = new createjs.Bitmap(e.target);
    var grp = new createjs.Container();
    grp.mouseChildren = false;

    grp.id = grp.name = pieceIndex;
    grp.edgePiece = edgePiece;
    bitmap.regX = cellDim.pivotX * picDim.sx;
    bitmap.regY = cellDim.pivotY * picDim.sx;
    pieceArray[pieceIndex].neighbour = neighbours;
    pieceArray[pieceIndex].regX = cellDim.pivotX;
    pieceArray[pieceIndex].regY = cellDim.pivotY;
    pieceArray[pieceIndex].s = picDim.sx;
    pieceArray[pieceIndex].id = pieceIndex;
    pieceArray[pieceIndex].gid = pieceIndex;
    pieceArray[pieceIndex].w = cellDim.width;
    pieceArray[pieceIndex].h = cellDim.height;

    xm = 20 * picDim.sx + ((gw * dpi - 110) - 40 * col * picDim.sx) / 2;
    ym = 20 * picDim.sx + (gh * dpi - 40 * row * picDim.sx) / 2;

    // this is piece position
    grp.x = xm + 40 * pieceArray[pieceIndex].xpos * picDim.sx;
    grp.y = ym + 40 * pieceArray[pieceIndex].ypos * picDim.sx;
    grp.xp = grp.x;
    grp.yp = grp.y;
    pieceArray[pieceIndex].xp = grp.x;
    pieceArray[pieceIndex].yp = grp.y;

    if (settings.pieceColor == "Yes") {
        bitmap.filters = [grayScale];
    } else if (settings.pieceColor == "No") {
        bitmap.filters = [colorScale];
    }
    bitmap.cache(0, 0, bitmap.image.width, bitmap.image.height);

    pieceArray[pieceIndex].x = grp.x;
    pieceArray[pieceIndex].y = grp.y;

    bitmap.id = bitmap.name = pieceIndex;
    grp.positioned = false;
    grp.id = grp.name = pieceIndex;
    grp.uitype = "cell";
    grp.addChild(bitmap);
    grp.sX = 1;
    grp.sY = 1;
    grp.sscaleX = 1;
    grp.sscaleY = 1;

    gameBox.addChild(grp);
    pieceIndex++;
    txtCutCount.text = fromLocalStorage ? "" : "Cutting image into pieces " + (pieceIndex) + " / " + (row * col);
    txtCutCount.visible = true;
    if (pieceIndex < row * col) {
        createPiece();
        
    } else {
        txtCutCount.visible = false;
        hintBox.cache(0, 0, hintBox.getBounds().width, hintBox.getBounds().height);
        ghostBox.cache(0, 0, ghostBox.getBounds().width, ghostBox.getBounds().height);
        //previewBox.cache(0, 0, game.clientWidth, game.clientHeight);
        if (!fromLocalStorage) {
            pieceDistribution();
        } else {
            renderPieces();
        }
        positionPiecesByPan();
    }
}
/*
===============================================================
This function is used to randomize array
===============================================================
*/
function randomizeArray(ary) {
    var rndArray = [];
    var len = ary.length;
    for (var i = len - 1; i >= 0; i--) {
        var p = parseInt(Math.random() * ary.length);
        rndArray.push(ary[p]);
        ary.splice(p, 1);
    }
    return rndArray;
}
/*
===============================================================
This function is used to get any value between min and max value
provide as arguments.
===============================================================
*/
function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function renderPieces() {
    gameBox.visible = true;
    // timeElapsed = lsData.timeElapsed;
    startTime = new Date() - (lsData.timeElapsed * 1000);
    for (var i = 0; i < row * col; i++) {
        var grp = gameBox.getChildByName(i);
        if (grp) {
            grp.visible = true;
            grp.x = pieceArray[i].cx;
            grp.y = pieceArray[i].cy;

        }
    }

    // if(openedOptionsFromGame) {
    //     for (var i = 0; i < row * col; i++) {
    //         var grp = gameBox.getChildByName(i);

    //         const event = new MouseEvent('pressup', {
    //             view: window,
    //             bubbles: true,
    //             cancelable: true
    //           });
    //           gameBox.dispatchEvent(event);
    //     }        
    // }

    if (connectedPieces) {
        for (var j = 0; j < connectedPieces.length; j++) {
            var cellA = null, cellB = null;
            // find cellA obj ref
            var gameBoxChildren = gameBox.numChildren;
            for (var k = 0; k < gameBoxChildren; k++) {
                cellA = gameBox.getChildAt(k).getChildByName(connectedPieces[j].movedP);
                if (cellA) break;
            }

            for (var k = 0; k < gameBoxChildren; k++) {
                cellB = gameBox.getChildAt(k).getChildByName(connectedPieces[j].connectedTo);
                if (cellB) break;
            }

            var infoA = pieceArray[cellA.id];
            ts = infoA.s;

            shift([cellA, cellB, connectedPieces[j].pos]);

            // var pair = getPairsOnLoad(cellA, cellB, connectedPieces[j].pos);
            // if (pair) {
            //     shift(pair);
            // }

        }

        // load based on z-index ssssssssssssssssssssss
        for (var i = 0; i < gameBox.numChildren; i++) {
            gameBox.addChild(gameBox.getChildByName(zIndexNPiece[i]));
        }

        // for (var j = 0; j < connectedPieces.length; j++) {
        //     var grp = gameBox.getChildByName(connectedPieces[j].movedP);
        //     if (grp == null) {
        //         // get the grp to which its connected
        //         var nn = connectedPieces.find(function (p) { 
        //             return p.movedP == connectedPieces[j].movedP; 
        //         });
        //         grp = gameBox.getChildByName(nn.grp).getChildByName(connectedPieces[j].movedP);
        //     }
        //     if (grp) {
        //         var pair = getPairsOnLoad(grp, connectedPieces[j].connectedTo);
        //         if (pair) {
        //             shift(pair);
        //         }
        //     }
        // }
    }

    if (settings.gameType == "classic") {
        complete++;
        header.getChildByName("txtCount").text = "Pieces:\n" + complete + "/" + (row * col);
    }

    timeOn = true;
    inGame = true;
    lock.style.display = "none";
}
/*
===============================================================
This function is used to show pieceDistribution effects choosen by user
from screenSetup
===============================================================
*/
function pieceDistribution() {
    var throwCount = 0;
    var series = [];
    if (settings.gameType == "position" || settings.gameType == "one-piece") {
        hintBox.visible = true;
    }
    // hintBox.visible = true;
    for (var i = 0; i < row * col; i++) {
        series[i] = i;
    }
    rnd = randomizeArray(series);
    if (settings.gameType == "classic" || settings.gameType == "position") {
        // debugger
        var checkCount = 0;
        throwEffect = settings.pieceDistribution.toLowerCase() == "grid" ? 0 : settings.pieceDistribution.toLowerCase() == "rows" ? 1 : settings.pieceDistribution.toLowerCase() == "circle" ? 2 : 3;
        if (throwEffect == 0) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildByName(i);
                trans = [[{ x: (gw * dpi - 110) / 2, y: gh * dpi / 2 }, 1000, createjs.Ease.getPowOut(5)]];

                if (grp) tween("tween", grp, 1000, false, false, trans, true, check0);
            }
            function check0() {
                checkCount++;
                if (checkCount == row * col) {
                    var i = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        var grp = gameBox.getChildByName(rnd[i]);
                        var cell = grp.getChildAt(0);
                        var xp = xm + 40 * pieceArray[i].xpos * picDim.sx;
                        var yp = ym + 40 * pieceArray[i].ypos * picDim.sx;
                        if (settings.rotation == "Yes") {
                            var r = angle[randRange(0, 3)];
                            trans = [[{ rotation: r }, 500, createjs.Ease.quadInOut]];
                            tween("tween", cell, 0, false, false, trans, true);
                        }
                        trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        if (grp) tween("tween", grp, 0, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 1) {
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildByName(i);
                grp.scale = 5;
                grp.alpha = 0;
                trans = [[{ x: (gw * dpi - 110) / 2, y: gh * dpi / 2 }, 500, createjs.Ease.getPowOut(5)]];
                if (grp) tween("tween", grp, 1000, false, false, trans, true, check1);
            }
            function check1() {
                checkCount++;
                if (checkCount == row * col) {
                    gameBox.visible = true;
                    var i = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        var grp = gameBox.getChildByName(rnd[i]);
                        var xp = xm + 40 * pieceArray[i].xpos * picDim.sx;
                        var yp = ym + 40 * pieceArray[i].ypos * picDim.sx;
                        trans = [[{ alpha: 1, scale: 1, x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        if (grp) tween("tween", grp, i * 30, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 2) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildByName(i);
                trans = [[{ x: (gw * dpi - 110) / 2, y: gh * dpi / 2 }, 500, createjs.Ease.getPowOut(5)]];
                if (grp) tween("tween", grp, 1000, false, false, trans, true, check2);
            }
            function check2() {
                checkCount++;
                if (checkCount == row * col) {
                    var step = 360 / rnd.length;
                    var angle = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        if (device == "smart") {
                            var radius = Math.min((gw * dpi - 110), gh * dpi) / 2 - 40 * picDim.sx;
                        } else {
                            var radius = (Math.min((gw * dpi - 110), gh * dpi) / 2 - 40 * picDim.sx) * dpi;
                        }
                        var grp = gameBox.getChildByName(rnd[i]);
                        angle += step;
                        var theta = angle / 180 * Math.PI;
                        var xp = (gw * dpi - 110) / 2 + radius * Math.cos(theta);
                        var yp = gh * dpi / 2 + radius * Math.sin(theta);
                        trans = [[{ x: xp * dpi, y: yp * dpi }, 500, createjs.Ease.quadInOut]];
                        if (grp) tween("tween", grp, 0, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 3) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildByName(i);
                trans = [[{ x: (gw * dpi - 80) / 2, y: gh * dpi / 2 }, 500, createjs.Ease.getPowOut(5)]];
                if (grp) tween("tween", grp, 1000, false, false, trans, true, check3);
            }
            function check3() {
                checkCount++;
                if (checkCount == row * col) {
                    // debugger
                    var k = (device == "smart") ? 4 : 1;
                    var step = 40;
                    var r = 20;
                    var c = 20;
                    var flow = ["LR", "TB", "BL", "LT"];
                    var flowIndex = 0;
                    var margin = 80;
                    for (var i = 0; i < rnd.length; i++) {
                        var xp = c * picDim.sx + margin;
                        var yp = r * picDim.sx + margin;
                        if (flow[flowIndex] == "LR") {
                            c += step;
                            if (xp >= (gw * dpi - 110) - 80 * picDim.sx - margin) {
                                // xp = gw;
                                xp = (gw * dpi - 110) - 80 * picDim.sx - margin
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "TB") {
                            r += step;
                            if (yp >= gh * dpi - 80 * picDim.sx - margin) {
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "BL") {
                            c -= step;
                            if (xp <= 80 * picDim.sx + margin) {
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "LT") {
                            r -= step;
                            if (yp <= 80 * picDim.sx + margin) {
                                flowIndex = 0;
                            }
                        }
                        var grp = gameBox.getChildByName(rnd[i]);
                        console.log(xp, yp);
                        trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        if (grp) tween("tween", grp, i * 30, false, false, trans, true, throwDone);
                    }
                }
            }
        }
        function throwDone() {
            throwCount++;
            if (throwCount == row * col) {
                // timeElapsed = 0;
                startTime = new Date();
                timeOn = true;
                inGame = true;
                lock.style.display = "none";


                for (var i = 0; i < pieceArray.length; i++) {
                    pieceArray[i].cx = gameBox.getChildByName(i).x;
                    pieceArray[i].cy = gameBox.getChildByName(i).y;
                    gameBox.getChildByName(i).sX = gameBox.getChildByName(i).x;
                    gameBox.getChildByName(i).sY = gameBox.getChildByName(i).y;
                }

                gameSave();

            }
        }
    } else if (settings.gameType == "one-piece") {
        for (var i = 0; i < row * col; i++) {
            grp = gameBox.getChildByName(i);
            grp.visible = false;
        }
        gameBox.visible = true;
        throwSingle();
        // working on this satya
        hintBox.visible = true;
        // ghostBox.visible = true;
        // timeElapsed = 0;
        startTime = new Date();
        timeOn = true;
        inGame = true;
        lock.style.display = "none";

        for (var i = 0; i < pieceArray.length; i++) {
            pieceArray[i].cx = gameBox.getChildByName(i).x;
            pieceArray[i].cy = gameBox.getChildByName(i).y;
        }
        gameSave();
    }


}
/*
===============================================================
This function is used when user choose "Single" in screenSetup
===============================================================
*/
function throwSingle() {
    grp = gameBox.getChildByName(rnd[complete]);
    grp.alpha = 0;
    grp.scale = 5;
    gameBox.addChild(grp);
    grp.visible = true;
    var cell = grp.getChildByName(0);
    if (settings.rotation == "Yes") {
        var r = angle[randRange(0, 3)];
        trans = [[{ rotation: r }, 500, createjs.Ease.quadInOut]];
        tween("tween", cell, 0, false, false, trans, true);
    }
    trans = [[{ alpha: 1, scale: 1, x: (gw * dpi - 110) / 2, y: gh * dpi / 2 }, 500, createjs.Ease.getPowOut(5)]];
    tween("tween", grp, 0, false, false, trans, true, onSingleDropped);
    function onSingleDropped() {
        if (!inGame) {
            inGame = true;
            // timeElapsed = 0;
            startTime = new Date();
            timeOn = true;
        }
    }
}
/*
===============================================================
This is a common function for both case (Free/Position)
This function is responsible to check whether the pieces are 
paired correctly or postioned correctly.
===============================================================
*/
function checkAfterRelease(grp) {
    // console.log("grp.id" + grp.id + " grp.edgePiece " + grp.edgePiece)
    console.log(grp.x + "    " + grp.y);
    if (complete != row * col) {
        if (settings.gameType == "classic") {
            if (complete == 0) complete = 1;
            console.log(grp.name)
            var pair = getPair(grp);
            if (pair) shift(pair);
        } else if (settings.gameType == "position" || settings.gameType == "one-piece") {
            if (Math.abs(grp.x - grp.xp) <= tolerance && Math.abs(grp.y - grp.yp) <= tolerance) {
                complete++;
                playEventSound("correct", 0, false, true);
                if (complete == row * col) {
                    timeOn = false;
                    lsData.completed = true;
                    // lsData.timeElapsed = timeElapsed;
                    lock.style.display = "block";
                    hideHeaderBtns();
                }
                header.getChildByName("txtCount").text = "Pieces:\n" + complete + "/" + (row * col);
                grp.positioned = true;

                gameBox.addChildAt(grp, 0);
                // try saving the children z-index here to ls
                try {
                    grp.getChildByName(0).uncache();
                } catch (e) { }
                trans = [[{ x: grp.xp, y: grp.yp }, 500, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 0, false, false, trans, true, onPositined);
            }
        }
        // save pieces z-index

    }
    function onPositined(e) {
        if (complete == row * col) {
            lsData.completed = true;
            // lsData.timeElapsed = timeElapsed;
            showResult();
        } else if (settings.gameType == "one-piece") {
            throwSingle();
            updateLsPositions();
            // this is after attach, update positions of all pieces in ls
        }
    }
    updateLsPositions();
}


function updateLsPositions() {
    for (var i = 0; i < row * col; i++) {
        var grp = gameBox.getChildByName(i);
        if (grp) {
            pieceArray[i].cx = grp.x;
            pieceArray[i].cy = grp.y;
        }
    }
    zIndexNPiece = [];
    for (var i = 0; i < gameBox.numChildren; i++) {
        zIndexNPiece.push(gameBox.getChildAt(i).id);
    }
    lsData.zIndex = zIndexNPiece;
    gameSave();
}


function showCompletedNBack() {
    var lsd1 = JSON.parse(localStorage.getItem(key));
    var pic = lsd1.settings.pic;
    var image1 = new Image();
    image1.onload = function (e) {
        var dummyImg = new createjs.Bitmap(e.target);
        var lsd1 = JSON.parse(localStorage.getItem(key));
        var scale = lsd1.lsData.scale;
        dummyImg.scale = scale;
        var x = ((gw * dpi - 110) - dummyImg.image.width * scale) / 2;
        var y = (gh * dpi - dummyImg.image.height * scale) / 2;
        dummyImg.x = x;
        dummyImg.y = y;
        var grp = new createjs.Container();
        grp.mouseChildren = false;
        grp.addChild(dummyImg);
        while (gameBox.numChildren != 0) {
            gameBox.removeChildAt(0);
        }
        gameBox.addChild(grp);
        gameBox.visible = true;

        btnBack = TextButton("btnBack3", header1, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Back", gameFont, 15, "#ffffff", "assets/images/buttons/back.png", 1, 70 * dpi, gh * dpi - 70, true);

        btnSetup = TextButton("btnSetup3", header1, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Menu", gameFont, 15, "#ffffff", "assets/images/buttons/menu.png", 1, gw * dpi - 80, gh * dpi - 70, true);
        // btnOptions = TextButton("btnOptions", header1, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Options", gameFont, 15, "#ffffff", "assets/images/buttons/options.png", 1, gw - 180 / dpi, gh - 70 / dpi, true);

        header1.visible = true;
    };
    image1.src = pic;
    // add a back button and a menu button
}
/*
===============================================================
In Join Mode "Free" We need to get the pair of two shape of
group of shape to paried togather.
This function is used to fulfill this activity
===============================================================
*/

var connectedPieces = [];
lsData.connectedPieces = connectedPieces;
lsData.zIndex = zIndexNPiece;
function getPair(grp) {
    var cellA; // The target cell that needs to pair
    var cellB; // The child of target cell
    var infoA; // Target array from pieceArray for cellA
    var infoB; // Target array from pieceArray for cellA
    var na; // Neighbours of cellA
    var p1; // Point for cellA
    var p2; // Point for cellB     
    for (var i = 0; i < grp.numChildren; i++) { // this is moving group
        cellA = grp.getChildAt(i); // each piece in the moving group
        p1 = grp.localToGlobal(cellA.x, cellA.y);
        infoA = pieceArray[cellA.id];
        var gidA = infoA.gid;
        na = infoA.neighbour; // valid neighbours for all piece in moving group
        ts = infoA.s;
        for (var j = 0; j < na.length; j++) {
            var gidB = pieceArray[na[j].id].gid; // neighbour ref

            if (gidA != gidB) { // this is always true
                // debugger
                var grpB = gameBox.getChildByName(gidB);
                cellB = grpB.getChildByName(na[j].id);
                infoB = pieceArray[cellB.id];
                p2 = grpB.localToGlobal(cellB.x, cellB.y);
                var d1 = Math.pow((Math.pow((infoA.xp - infoB.xp), 2) + Math.pow((infoA.yp - infoB.yp), 2)), .5);
                var d2 = Math.pow((Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)), .5);
                // var d1 = Math.pow((Math.pow((infoA.xp*wRatio - infoB.xp*wRatio), 2) + Math.pow((infoA.yp*wRatio - infoB.yp*wRatio), 2)), .5);
                // var d2 = Math.pow((Math.pow((p1.x*wRatio - p2.x*wRatio), 2) + Math.pow((p1.y*wRatio - p2.y*wRatio), 2)), .5);
                if (Math.abs(d1 - d2) <= tolerance) {  //  * wRatio
                    trace("in range")
                    // push and save the moved piece in an array if its connected to another piece
                    // save the piece its connected to
                    // on load of inProg game, we need to process connections in this sequence
                    var ccpe = checkConnPiecesExist(cellA, cellB);
                    if (!ccpe) {
                        if (na[j].pos == "R" || na[j].pos == "L") {
                            trace("horizontal join")
                            var vd = Math.abs(p1.y - p2.y);
                            var hd = p1.x - p2.x;
                            // find if this pair exist before push
                            if (na[j].pos == "R" && hd < 0 && vd <= tolerance) {
                                connectedPieces.push({ movedP: cellA.id, connectedTo: cellB.id, pos: "R" });
                                lsData.connectedPieces = connectedPieces;
                                return [cellA, cellB, na[j].pos];
                            } else if (na[j].pos == "L" && hd > 0 && vd <= tolerance) {
                                connectedPieces.push({ movedP: cellA.id, connectedTo: cellB.id, pos: "L" });
                                lsData.connectedPieces = connectedPieces;
                                return [cellA, cellB, na[j].pos];
                            }
                        } else if (na[j].pos == "B" || na[j].pos == "T") {
                            trace("vertical join")
                            var hd = Math.abs(p1.x - p2.x);
                            var vd = p1.y - p2.y;
                            if (na[j].pos == "B" && vd < 0 && hd <= tolerance) {
                                connectedPieces.push({ movedP: cellA.id, connectedTo: cellB.id, pos: "B" });
                                lsData.connectedPieces = connectedPieces;
                                return [cellA, cellB, na[j].pos];
                            } else if (na[j].pos == "T" && vd > 0 && hd <= tolerance) {
                                connectedPieces.push({ movedP: cellA.id, connectedTo: cellB.id, pos: "T" });
                                lsData.connectedPieces = connectedPieces;
                                return [cellA, cellB, na[j].pos];
                            }
                        }
                    }

                }


            }
        }
    }
    return null;
}

function checkConnPiecesExist(cellA, cellB) {
    var exist = false;
    exist = connectedPieces.find(function (cp) {
        return (cp.movedP.id == cellA.id && cp.connectedTo.id == cellB.id) || (cp.movedP.id == cellB.id && cp.connectedTo.id == cellA.id);
    })
    return exist ? true : false;
}

function getPairsOnLoad(cellA, cellB, pos) { // grp, connectedTo


    // // This has to be implemented based on connected pieces instead of sequence
    // // fix moved piece position after connections done
    // var cellA; // The target cell that needs to pair
    // var cellB; // The child of target cell
    // var infoA; // Target array from pieceArray for cellA
    // var infoB; // Target array from pieceArray for cellA
    // var na; // Neighbours of cellA
    // var p1; // Point for cellA
    // var p2; // Point for cellB        
    // for (var i = 0; i < grp.numChildren; i++) {
    //     cellA = grp.getChildAt(i);
    //     p1 = grp.localToGlobal(cellA.x, cellA.y);
    //     infoA = pieceArray[cellA.id];
    //     var gidA = infoA.gid;
    //     na = infoA.neighbour;
    //     ts = infoA.s;
    //     // check if neighbor is not available, get the others to which 2nd piece is connected to and repeat
    //     var ids = na.map(function (n) { return n.id });
    //     console.log(gidA, connectedTo);
    //     if (ids.indexOf(connectedTo) == -1) {
    //         // check to which neighbour connectedTo is connected and B will be that
    //         var tt = null;
    //         for (var p = 0; p < ids.length; p++) {
    //             var connections = connectedPieces.find(function (cp) {
    //                 return (cp.movedP == connectedTo && cp.connectedTo == ids[p]) || (cp.movedP == ids[p] && cp.connectedTo == connectedTo);
    //             });
    //             console.log(connections)
    //             if(connections) {
    //                 break;
    //             }
    //         }
    //         // if bug pls check which one should be considered
    //         // check when two groups are connected
    //         if(connections)
    //         connectedTo = connections.connectedTo;

    //     }
    //     var gidB = pieceArray[connectedTo].gid;
    //     if (gidA != gidB) {
    //         var grpB = gameBox.getChildByName(gidB);
    //         cellB = grpB.getChildByName(connectedTo);
    //         infoB = pieceArray[cellB.id];
    //         p2 = grpB.localToGlobal(cellB.x, cellB.y);

    //         var pos = infoB.neighbour.filter(function (item) {
    //             return item.id == gidA;
    //         })
    //         if (pos.length > 0) {
    //             pos = pos[0].pos;
    //             if (pos == "R" || pos == "L") {
    //                 trace("horizontal join")
    //                 if (pos == "R") {
    //                     return [cellB, cellA, pos];
    //                 } else if (pos == "L") {
    //                     return [cellB, cellA, pos];
    //                 }
    //             } else if (pos == "B" || pos == "T") {
    //                 trace("vertical join")
    //                 if (pos == "B") {
    //                     return [cellB, cellA, pos];
    //                 } else if (pos == "T") {
    //                     return [cellB, cellA, pos];
    //                 }
    //             }
    //         }
    //     }

    // }
    return null;
}
/*
===============================================================
This function is used to hide header buttons located in game 
screen
===============================================================
*/
function hideHeaderBtns() {
    // add new buttons here
    // header.getChildByName("btnMuteOn").visible = false;
    // header.getChildByName("btnMuteOff").visible = false;
    // header.getChildByName("btnPlayOn").visible = false;
    // header.getChildByName("btnPlayOff").visible = false;
}
/*
===============================================================
Once we get the pair of two groups we need to shift all the
children (pieces) from one group to another.
This case is only for Join as Free mode.
This function is for this activity
===============================================================
*/
function shift(ary) {
    // this method removes the piece, the moved piece is connected to and creates piece with the target piece
    var cellA = ary[0];
    var cellB = ary[1];
    var pos = ary[2];

    var grpA = cellA.parent;
    var grpB = cellB.parent;
    complete++;
    playEventSound("correct", 0, false, true);

    header.getChildByName("txtCount").text = "Pieces:\n" + complete + "/" + (row * col);
    debugger
    var pA = grpA.localToGlobal(cellA.x, cellA.y);
    var pB = gameBox.localToGlobal(cellB.x, cellB.y);
    debug.innerHTML = pA + "    " + pB;
    grpB.regX = pB.x;
    grpB.regY = pB.y;
    grpA.getChildAt(0).uncache();
    // looks like ts is the pieceSize
    // pos is grpB position
    console.log(grpB.x, pA.x);
    if (pos == "R") {
        grpB.x = pA.x + (40 * ts);
        grpB.y = pA.y;
    } else if (pos == "L") {
        grpB.x = pA.x - (40 * ts);
        grpB.y = pA.y;
    } else if (pos == "B") {
        grpB.x = pA.x;
        grpB.y = pA.y + (40 * ts);
    } else if (pos == "T") {
        grpB.x = pA.x;
        grpB.y = pA.y - (40 * ts);
    }
    var len = grpB.numChildren;
    for (var k = 0; k < len; k++) {
        var cellNew = grpB.getChildAt(0);
        cellNew.uncache();
        pieceArray[cellNew.id].gid = grpA.id;
        var p = grpB.localToGlobal(cellNew.x, cellNew.y);
        p = grpA.globalToLocal(p.x, p.y);
        cellNew.x = p.x;
        cellNew.y = p.y;
        grpA.addChildAt(cellNew, 0);
    }
    gameBox.removeChild(grpB);
    for (var i = 0; i < grpA.numChildren; i++) {
        var cell = grpA.getChildAt(i);
        var neg = pieceArray[cell.id].neighbour;
        for (var j = neg.length - 1; j >= 0; j--) {
            if (grpA.getChildByName(neg[j].id) != null) {
                neg.splice(j, 1);
            }
        }
    }
    if (complete == row * col) {
        timeOn = false;
        lock.style.display = "block";
        hideHeaderBtns();
        trans = [[{ x: grpA.xp, y: grpA.yp }, 500, createjs.Ease.getPowOut(1)]];
        lsData.completed = true;
        // lsData.timeElapsed = timeElapsed;
        tween("tween", grpA, 500, false, false, trans, true, showResult);
    } else {
        lsData.completed = false;
        // lsData.timeElapsed = timeElapsed;
    }
    // gameSave();
}
/*
===============================================================
This function is used to convert seconds into time hh:mm:ss
===============================================================
*/
function convertNumberToTime(n) {
    lsData.timeElapsed = n;
    return String(Math.floor(n / 3600) < 10 ? "0" + String(Math.floor(n / 3600)) : String(Math.floor(n / 3600))) + ":" + String(Math.floor(n / 60) % 60 < 10 ? "0" + String(Math.floor(n / 60) % 60) : String(Math.floor(n / 60) % 60)) + ":" + String(Math.floor(n) % 60 < 10 ? "0" + String(Math.floor(n) % 60) : String(Math.floor(n) % 60));
}

function gameSave() {
    var pName = settings.pic.split("/").pop();
    var name = pName.split(".")[0];
    // lsData.timeElapsed = timeElapsed;
    if (!fromLocalStorage) {
        lsData.date = new Date();
    }
    if (lsData.completed && !completedGameSaved) {
        localStorage.removeItem('treecardgames.jigsaw.games.' + name);
        var now = new Date();
        completedGameSaved = true;
        localStorage.setItem('treecardgames.jigsaw.games.' + name + now.getTime(), JSON.stringify({ "settings": settings, "pieces": pieceArray, "lsData": lsData }));
        populateCategory();
        populateGallery();
    } else if (!lsData.completed) {
        if (newPuzzuleForThisImage) {
            newPuzzuleForThisImage = false;
            localStorage.removeItem('treecardgames.jigsaw.games.' + name);
        }
        key = 'treecardgames.jigsaw.games.' + name;
        localStorage.setItem(key, JSON.stringify({ "settings": settings, "pieces": pieceArray, "lsData": lsData }));
    }
}

function getImgLsData(name) {
    key = 'treecardgames.jigsaw.games.' + name;
    return localStorage.getItem(key);
}