'use strict';
/*
===============================================================
Global Variable Declaration
Below are the varaibles used globally. So don't rename them
===============================================================
*/
var debug = true;
var device;
if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
) {
    device = 'smart';
} else {
    device = 'pc'
}
var minHeightForControls = 530;
var mousedownPos0, stagePos0, pieceMoving, panEndPos;
var gameStarted = false;
var pieces3D = false;
var bgImages = ['bkg01.jpg', 'bkg02.jpg', 'bkg03.jpg', 'bkg04.jpg', 'bkg05.jpg', 'bkg06.jpg', 'bkg07.jpg', 'bkg08.jpg', 'bkg09.jpg'];
var selectedPic, selectedCategory;
var dpi = window.devicePixelRatio;
var canvas, stage;
var tray, ovenStage, ovenCanvas, setupBox, setupBox2, alert, alertMsg, alertOk;
var dragCanvas, dragStage;
var dragBox = new createjs.Container();
var dropBox, game, gameBox, hintBox, ghostBox, previewBox, piecesBox, menuBox, bgBox, hintOutline, ghostOutline, txtCutCount, gw, gh;
var screenInfo, screenSplash, screenSetup, mainMenuContainer, screenDropInside, screenCategory, screenGallery, difficultyModal, cNameContainer, screenSize, screenResult, screenConfirm, header, header1;
// var screenRotate;
// var btnPlayOn, btnPlayOff, btnMuteOn, btnMuteOff;
var btnSetup, btnOptions, btnBack, btnGhosted, btnPreview, btnPieces;
var galleryDir, shapeData;
var openedOptionsFromGame = false;
var newPuzzuleForThisImage = false;
// var currentGameInProgress = null;
var lsDOptions = localStorage.getItem(commonKey) ? JSON.parse(localStorage.getItem(commonKey)) : null;// { sounds: "Yes", pieceDistribution: "grid", pieceColor: "colored", shape: "regular" };
var bgImage = lsDOptions ? lsDOptions.bgImg : 'bkg01.jpg';
var throwC = 0;
var imgLsd = getImgLsData();
var unConn = [];

var settings = {
    gameType: lsDOptions ? lsDOptions.gameType : "classic",
    throw: lsDOptions ? lsDOptions.throw : "all",
    pieceColor: lsDOptions ? lsDOptions.pieceColor : "colored",
    rotation: lsDOptions ? lsDOptions.rotation : "No",
    time: lsDOptions ? lsDOptions.time : "time-counter",
    hint: lsDOptions ? lsDOptions.hint : "Yes",
    image: lsDOptions ? lsDOptions.image : "Gallery",
    pieceDistribution: lsDOptions ? lsDOptions.pieceDistribution : "grid",
    shape: lsDOptions ? lsDOptions.shape : "regular",
    folderIndex: lsDOptions ? lsDOptions.folderIndex : 0,
    sizeIndex: lsDOptions ? lsDOptions.sizeIndex : 0,
    pic: lsDOptions ? lsDOptions.pic : "",
    orient: lsDOptions ? lsDOptions.orient : 0,
    sounds: lsDOptions ? lsDOptions.sounds : "No",
    bgImg: lsDOptions ? lsDOptions.bgImg : "bkg01.jpg"
};

if (!lsDOptions) {
    localStorage.setItem(commonKey, JSON.stringify(settings));
    lsDOptions = settings;
}

var uitype, startTime;
var timeOn = false;
var timeLimit, warnAt;
var imgRot;
var lock;
var tStage = "stage";
var grp, downTime, dx, dy;
var tapTolerance = (device == "smart") ? 10 : 0;
var drag = false;
var win = true;
var warnActivated = false;
var galleryItems;
var debug;
var gameFont = "Segoe UI, Helvetica, Arial";
var currentCategory = "";



// (function ($) {
//     windowResize();
//     $(window).resize(function () {
//         windowResize();
//     });
// })(jQuery);

// var initialWidth = window.innerWidth;
// var newWidth;
// function windowResize() {
//     newWidth = window.innerWidth;
//     var test = newWidth/initialWidth;
//     $('canvas').css({ transform: 'translate(0%) scale('+test+')' });
//     // $('canvas').width(window.innerWidth);
//     // $('canvas').height(window.innerHeight);
//     // var test = (window.innerHeight / 500) * 1;
//     // exportRoot.scaleX = exportRoot.scaleY = test;
// }



// (function ($) {
//     windowResize();
//     $(window).resize(function () {
//         windowResize();
//     });
// })(jQuery);

// var initialWidth = window.innerWidth;
// var newWidth;
// var initialHeight = window.innerHeight;
// var newHeight;
// var ratio = initialWidth / initialHeight;
// function windowResize() {
//     var wr, hr, difw, difh;

//     newWidth = window.innerWidth;
//     wr = newWidth / initialWidth;
//     difw = 100 * (1 - wr) / 2;

//     newHeight = window.innerHeight;
//     hr = newHeight / initialHeight;
//     difh = 100 * (1 - hr) / 2;

//     $('canvas').css({ transform: 'translate(-' + difw + '%, -' + difh + '%) scale(' + wr + ')' });
//     // $('canvas').css({ transform: 'translate(-' + difw + '%, -' + difh + '%) scale(' + wr + ', ' + hr + ')' });
//     resizeToMinimum(100,100)
// }

// function resizeToMinimum(w,h){
//     w=w>window.outerWidth?w:window.outerWidth;
//     h=h>window.outerHeight?h:window.outerHeight;
//     window.resizeTo(w, h);
// };


(function ($) {
    // windowResize();
    $(window).resize(function () {
        windowResize();
    });
})(jQuery);

var initialWidth = window.innerWidth;
var newWidth;
var initialHeight = window.innerHeight;
var newHeight;
var ratio, wRatio = 1;// = initialWidth / initialHeight;
function windowResize() {
    // $('canvas').width(window.innerWidth);
    newWidth = window.innerWidth;
    wRatio = newWidth / initialWidth;
    // debugger
    // tolerance = 20 * wRatio;
    newHeight = window.innerHeight;
    var allCanvas = document.querySelectorAll("canvas");
    for (var i = 0; i < allCanvas.length; i++) {
        allCanvas[i].width = window.innerWidth;
        allCanvas[i].height = window.innerHeight;
    }

    if (stage) {
        var header = stage.getChildByName('header');
        header.x = gw * wRatio - gw;
        menuBox.x = gw * wRatio - gw;
        piecesBox.x = gw * wRatio - gw;
        stage.update();
    }

    // if (stage) {
    //     var elementsTotransform = stage.children;
    //     for (var i = 0; i < elementsTotransform.length; i++) {
    //         elementsTotransform[i].x = elementsTotransform[i].sX * wRatio;
    //         elementsTotransform[i].y = elementsTotransform[i].sY * wRatio;
    //         elementsTotransform[i].xp = elementsTotransform[i].sXp * wRatio;
    //         elementsTotransform[i].yp = elementsTotransform[i].sYp * wRatio;
    //         elementsTotransform[i].scaleX = elementsTotransform[i].sscaleX * wRatio;
    //         elementsTotransform[i].scaleY = elementsTotransform[i].sscaleY * wRatio;
    //     }
    //     stage.update();
    // }
    // if (dragStage) {
    //     var elementsTotransform1 = dragStage.children;
    //     for (var i = 0; i < elementsTotransform1.length; i++) {
    //         elementsTotransform1[i].x = elementsTotransform1[i].sX * wRatio;
    //         elementsTotransform1[i].y = elementsTotransform1[i].sY * wRatio;
    //         elementsTotransform1[i].xp = elementsTotransform1[i].sXp * wRatio;
    //         elementsTotransform1[i].yp = elementsTotransform1[i].sYp * wRatio;
    //         elementsTotransform1[i].scaleX = elementsTotransform1[i].sscaleX * wRatio;
    //         elementsTotransform1[i].scaleY = elementsTotransform1[i].sscaleY * wRatio;
    //     }
    //     dragStage.update();
    // }

    // if (ovenStage) {
    //     var elementsTotransform2 = ovenStage.children;
    //     for (var i = 0; i < elementsTotransform2.length; i++) {
    //         elementsTotransform2[i].x = elementsTotransform2[i].sX * wRatio;
    //         elementsTotransform2[i].y = elementsTotransform2[i].sY * wRatio;
    //         elementsTotransform2[i].xp = elementsTotransform2[i].sXp * wRatio;
    //         elementsTotransform2[i].yp = elementsTotransform2[i].sYp * wRatio;
    //         elementsTotransform2[i].scaleX = elementsTotransform2[i].sscaleX * wRatio;
    //         elementsTotransform2[i].scaleY = elementsTotransform2[i].sscaleY * wRatio;
    //     }
    //     ovenStage.update();
    // }
}

/*
===============================================================
init
This function is an entry point, triggered from index.html 
Below is a list of actions performed in this function.
1. create game div, Canvases
2. initiate createjs engine
3. set events
4. create UI
===============================================================
*/
function init() {
    game = Div("game", "body", "absolute", 0, "0 0", "0px", "0px", "100%", "100%", "rgba(65,0,0,1)", "#000000", "repeat", "url('assets/images/backgrounds/large/" + bgImage + "')"); // url('assets/images/backgrounds/large/" + bgImage + "')
    debug = Div("debug", "body", "absolute", 100, "0 0", "100px", "0px", "50%", "50px", "rgba(0,0,0,1)", "#ffffff");
    debug.style.display = "none";
    gw = game.clientWidth;
    gh = game.clientHeight;
    tray = new createjs.Container();
    ovenCanvas = Canvas("ovenCanvas", game);
    ovenCanvas.style.display = "none";
    ovenCanvas.style.zIndex = 0;
    ovenStage = new createjs.Stage("ovenCanvas");
    ovenStage.addChild(tray);
    // ovenStage.scaleX = .50;
    // ovenStage.scaleY = .50;

    dragCanvas = Canvas("dragCanvas", game)
    dragStage = new createjs.Stage("dragCanvas");
    dragStage.addChild(dragBox);
    dragCanvas.style.display = "none";
    // dragStage.scaleX = .50;
    // dragStage.scaleY = .50;

    canvas = Canvas("canvas", game);
    canvas.style.zIndex = 1;
    stage = new createjs.Stage("canvas");
    // stage.scaleX = .50;
    // stage.scaleY = .50;

    stage.enableMouseOver(10);
    gameBox = new createjs.Container();
    gameBox.x = gameBox.y = 0;
    hintBox = new createjs.Container();
    hintBox.x = hintBox.y = 0;
    ghostBox = new createjs.Container();
    ghostBox.x = ghostBox.y = 0;
    previewBox = new createjs.Container();
    previewBox.x = previewBox.y = 0;

    hintOutline = new createjs.Container();
    ghostOutline = new createjs.Container();

    piecesBox = new createjs.Container();
    menuBox = new createjs.Container();
    bgBox = new createjs.Container();

    hintBox.mouseChildren = false;
    hintBox.visible = false;
    ghostBox.mouseChildren = false;
    ghostBox.visible = false;
    previewBox.visible = false;
    piecesBox.visible = false;
    menuBox.visible = false;
    bgBox.visible = false;


    // function drawShape() { 
    //     var shape = new createjs.Shape();
    //     stage.addChild(shape);
    //     shape.graphics.clear()
    //         .beginBitmapFill(img);//, "repeat", matrix)
    //         var fill = shape.graphics.drawRect(0,0,gw,gh).command;
    // }
    // var img = new Image();
    // img.onload = drawShape;
    // img.src = "assets/images/wood3.jpg";




    // pieces box start
    var rectangle9 = new createjs.Shape();
    rectangle9.id = rectangle9.name = "piecesBoxBg";
    rectangle9.graphics.beginFill("rgba(108, 122, 137, 1)").drawRect(gw * dpi - 300, gh * dpi / 2 - 50, 200, 220); //setStrokeStyle(2).beginStroke("#ffffff")
    piecesBox.addChild(rectangle9);

    var rst = new createjs.Shape();
    rst.graphics.setStrokeStyle(3).beginStroke("#000000").beginFill("rgba(255,255,255,1)").drawRect(gw * dpi - 300, gh * dpi / 2 - 50, 195, 215);
    piecesBox.addChild(rst);

    function tickLoad(img, visible) {
        img.visible = visible;
    }

    addBitmap("imgt", piecesBox, "assets/images/checked.png", gw * dpi - 280, gh * dpi / 2 - 30, 1, 1, null, tickLoad, false);

    var ttt = addText("ttt", piecesBox, "Edges only", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi / 2 - 30);
    var hit = new createjs.Shape();
    hit.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi / 2 - 30, ttt.getMeasuredWidth() + 25, ttt.getMeasuredHeight());
    ttt.hitArea = hit;
    piecesBox.addChild(hit);

    hit.addEventListener('click', function (e) {
        if (piecesBox.getChildAt(11).visible) {
            piecesBox.getChildAt(11).visible = false;
            piecesBox.getChildByName("ttt").x = gw * dpi - 280;
            for (var i = 0; i < row * col; i++) {
                var grp = gameBox.getChildAt(i);
                if (grp && !grp.edgePiece) {
                    grp.visible = true;
                }
            }
        } else {
            piecesBox.getChildAt(11).visible = true;
            piecesBox.getChildByName("ttt").x = gw * dpi - 260;
            for (var i = 0; i < row * col; i++) {
                var grp = gameBox.getChildAt(i);
                if (grp) {
                    if (grp.edgePiece) {
                        grp.visible = true;
                    } else {
                        grp.visible = false;
                    }
                }
            }
        }

    });

    var ttt1 = addText("ttt1", piecesBox, "Arrange in Grid", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi / 2 + 40);
    var hit1 = new createjs.Shape();
    hit1.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi / 2 + 40, ttt1.getMeasuredWidth() + 10, ttt1.getMeasuredHeight());
    ttt1.hitArea = hit1;
    piecesBox.addChild(hit1);

    function getRandomUnconnected() {
        var conPieces = [];
        for (var item of connectedPieces) {
            conPieces.push(item['movedP']); conPieces.push(item['connectedTo']);
        }

        unConn = pieceArray.filter(function (item) { return conPieces.indexOf(item.id) === -1 });
        unConn.sort(function (a, b) { return Math.random() - 0.5; });
    }

    hit1.addEventListener('click', function (e) {
        getRandomUnconnected();

        var inc = 0;
        var margin = 80;
        var totalAvailableWidth = (gw * dpi - 110) - margin * 2;
        var totalAvailableHeight = (gh * dpi) - margin * 2;
        var gapX = totalAvailableWidth / col;
        var gapY = totalAvailableHeight / row;
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= col; j++) {
                if (inc < unConn.length) {
                    var grp = gameBox.getChildByName(unConn[inc].id);

                    var xp = margin / 2 + gapX * j;
                    var yp = margin / 2 + gapY * i;

                    trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                    if (grp) tween("tween", grp, 0, false, false, trans, true, throwDone);
                    inc++;
                }
            }
        }


        function throwDone() {
            throwC++;
            if (throwC == unConn.length) {
                gameSave();
                throwC = 0;
            }
        }
    });

    var ttt2 = addText("ttt2", piecesBox, "Arrange in Frame", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi / 2 + 80);
    var hit2 = new createjs.Shape();
    hit2.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi / 2 + 80, ttt2.getMeasuredWidth() + 10, ttt2.getMeasuredHeight());
    ttt2.hitArea = hit2;
    piecesBox.addChild(hit2);

    hit2.addEventListener('click', function (e) {
        getRandomUnconnected();

        var step = 40;
        var r = 20;
        var c = 20;
        var flow = ["LR", "TB", "BL", "LT"];
        var flowIndex = 0;
        var margin = 80;
        var pieceSize = picDim.sx;
        for (var i = 0; i < unConn.length; i++) {
            var xp = c * pieceSize + margin;
            var yp = r * pieceSize + margin;
            if (flow[flowIndex] == "LR") {
                c += step;
                if (xp >= ((gw - 30) * dpi - margin) - margin * pieceSize - margin) {
                    xp = ((gw - 30) * dpi - margin) - margin * pieceSize - margin
                    flowIndex++;
                }
            }
            else if (flow[flowIndex] == "TB") {
                r += step;
                if (yp >= gh * dpi - margin * pieceSize - margin) {
                    flowIndex++;
                }
            }
            else if (flow[flowIndex] == "BL") {
                c -= step;
                if (xp <= margin * pieceSize + margin) {
                    flowIndex++;
                }
            }
            else if (flow[flowIndex] == "LT") {
                r -= step;
                if (yp <= margin * pieceSize + margin) {
                    flowIndex = 0;
                }
            }
            var grp = gameBox.getChildByName(unConn[i].id);
            trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
            if (grp) tween("tween", grp, i * 30, false, false, trans, true, throwDone);
        }


        function throwDone() {
            throwC++;
            if (throwC == unConn.length) {
                gameSave();
                throwC = 0;
            }
        }
    });

    var ttt3 = addText("ttt3", piecesBox, "Disarrange", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi / 2 + 120);
    var hit3 = new createjs.Shape();
    hit3.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi / 2 + 120, ttt3.getMeasuredWidth() + 10, ttt3.getMeasuredHeight());
    ttt3.hitArea = hit3;
    piecesBox.addChild(hit3);

    hit3.addEventListener('click', function (e) {
        getRandomUnconnected();

        var margin = 80;
        var totalAvailableWidth = (gw * dpi - 110) - margin * 2;
        var totalAvailableHeight = (gh * dpi) - margin * 2;

        for (var i = 0; i < unConn.length; i++) {

            var grp = gameBox.getChildByName(unConn[i].id);

            var xp = totalAvailableWidth * Math.random() + margin;
            var yp = totalAvailableHeight * Math.random() + margin;

            trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
            if (grp) tween("tween", grp, 0, false, false, trans, true, throwDone);
        }


        function throwDone() {
            throwC++;
            if (throwC == unConn.length) {
                gameSave();
                throwC = 0;
            }
        }
    });

    var line = new createjs.Shape();
    piecesBox.addChild(line);
    line.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)");
    line.graphics.moveTo(gw * dpi - 280, gh * dpi / 2 + 10);
    line.graphics.lineTo(gw * dpi - 135, gh * dpi / 2 + 10);
    // pieces box end


    // Menu box start

    var rectangle9m = new createjs.Shape();
    rectangle9m.id = rectangle9m.name = "menuBoxBg";
    rectangle9m.graphics.beginFill("rgba(108, 122, 137, 1)").drawRect(gw * dpi - 300, gh * dpi - 210, 200, 195); //setStrokeStyle(2).beginStroke("#ffffff")
    menuBox.addChild(rectangle9m);

    var rstm = new createjs.Shape();
    rstm.graphics.setStrokeStyle(3).beginStroke("#000000").beginFill("rgba(255,255,255,1)").drawRect(gw * dpi - 300, gh * dpi - 210, 195, 190);
    menuBox.addChild(rstm);

    addBitmap("imgtm", menuBox, "assets/images/checked.png", gw * dpi - 280, gh * dpi - 150);

    // var tttm = addText("tttm", menuBox, "Options", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi - 230);
    // var hitm = new createjs.Shape();
    // hitm.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi - 230, tttm.getMeasuredWidth() + 25, tttm.getMeasuredHeight());
    // tttm.hitArea = hitm;
    // menuBox.addChild(hitm);


    // hitm.addEventListener('click', function (e) {
    //     stage.setChildIndex(screenSetup, stage.numChildren - 1);
    //     openedOptionsFromGame = true;
    //     menuBox.visible = false;
    //     exitGame("options");
    // });


    var ttt1m = addText("ttt1m", menuBox, "Background", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi - 190);
    var hit1m = new createjs.Shape();
    hit1m.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi - 190, ttt1m.getMeasuredWidth() + 10, ttt1m.getMeasuredHeight());
    ttt1m.hitArea = hit1m;
    menuBox.addChild(hit1m);

    var bgClicked = false;

    hit1m.addEventListener('click', function (e) {
        menuBox.visible = false;
        bgBox.visible = true;
        bgClicked = true;
        e.stopPropagation();
    });

    var ttt2m = addText("ttt2m", menuBox, "Sounds", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 260, gh * dpi - 150);
    var hit2m = new createjs.Shape();
    hit2m.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi - 150, ttt2m.getMeasuredWidth() + 40, ttt2m.getMeasuredHeight());
    ttt2.hitArea = hit2m;
    menuBox.addChild(hit2m);

    hit2m.addEventListener('click', function (e) {
        if (menuBox.getChildAt(11).visible) {
            menuBox.getChildAt(11).visible = false;
            menuBox.getChildByName("ttt2m").x = gw * dpi - 280;
            lsDOptions.sounds = "No";
            toggleMute(true);
        } else {
            menuBox.getChildAt(11).visible = true;
            menuBox.getChildByName("ttt2m").x = gw * dpi - 260;
            lsDOptions.sounds = "Yes";
            toggleMute(false);
        }
        localStorage.setItem(commonKey, JSON.stringify(lsDOptions));
        gameSave();
    });

    var ttt3m = addText("ttt3", menuBox, "Statistics", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi - 95);
    var hit3m = new createjs.Shape();
    hit3m.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi - 95, ttt3m.getMeasuredWidth() + 10, ttt3m.getMeasuredHeight());
    ttt3m.hitArea = hit3m;
    menuBox.addChild(hit3m);

    var ttt4m = addText("ttt4", menuBox, "About", gameFont, (device == "smart") ? 5 * dpi : 18, "#000000", gw * dpi - 280, gh * dpi - 55);
    var hit4m = new createjs.Shape();
    hit4m.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(gw * dpi - 280, gh * dpi - 55, ttt4m.getMeasuredWidth() + 10, ttt4m.getMeasuredHeight());
    ttt4m.hitArea = hit4m;
    menuBox.addChild(hit4m);

    var linem = new createjs.Shape();
    menuBox.addChild(linem);
    linem.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)");
    linem.graphics.moveTo(gw * dpi - 280, gh * dpi - 115);
    linem.graphics.lineTo(gw * dpi - 135, gh * dpi - 115);

    // menuBox.y = (gh * dpi * 0.87) / dpi - 430;

    // Menu box end


    // bgBox start

    var rectangle9b = new createjs.Shape();
    rectangle9b.id = rectangle9b.name = "gameBg";
    rectangle9b.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(gw * dpi / 2 - 510, gh * dpi - 150, 920, 120); //setStrokeStyle(2).beginStroke("#ffffff")
    bgBox.addChild(rectangle9b);


    for (var i = 0; i < bgImages.length; i++) {
        addBitmap("imgbg" + (i + 1), bgBox, "assets/images/backgrounds/thumbnails/bkg0" + (i + 1) + ".jpg", gw * dpi / 2 - 490 + i * 100, gh * dpi - 130, 0.64, 0.64, thumbClick);
    }

    // bgBox end
    function thumbClick(e) {
        var src = e.target.image.src;
        var img = src.split("/").pop();
        document.getElementById('game').style.backgroundImage = "url(\"assets/images/backgrounds/large/" + img + "\")";
        bgClicked = true;
        settings.bgImg = img;
        localStorage.setItem(commonKey, JSON.stringify(settings));
    }



    stage.addChild(hintBox);
    stage.addChild(ghostBox);
    stage.addChild(gameBox);
    stage.addChild(previewBox);

    stage.addChild(piecesBox);
    stage.addChild(menuBox);
    stage.addChild(bgBox);




    txtCutCount = addText("txtCutCount", stage, "", gameFont, (device == "smart") ? 8 * dpi : 30, "#ffffff", gw * dpi / 2, gh * dpi / 2);
    txtCutCount.textAlign = "center";
    txtCutCount.visible = false;

    createjs.Ticker.framerate = 24; //60
    createjs.Ticker.on("tick", tictic);
    createjs.Touch.enable(stage);

    document.querySelector('#game').addEventListener('click', function (e) {
        if (bgBox.visible && !bgClicked) {
            bgBox.visible = false;
        }
        bgClicked = !bgClicked;
    });


    function pan(ev2) {
        var stageDelta = { 'x': ev2.clientX - mousedownPos0.x, 'y': ev2.clientY - mousedownPos0.y };

        gameBox.x = stagePos0.x + stageDelta.x;
        gameBox.y = stagePos0.y + stageDelta.y;
        hintBox.x = stagePos0.x + stageDelta.x;
        hintBox.y = stagePos0.y + stageDelta.y;
        ghostBox.x = stagePos0.x + stageDelta.x;
        ghostBox.y = stagePos0.y + stageDelta.y;
        previewBox.x = stagePos0.x + stageDelta.x;
        previewBox.y = stagePos0.y + stageDelta.y;

        dragStage.x = stagePos0.x + stageDelta.x;
        dragStage.y = stagePos0.y + stageDelta.y;
        ovenStage.x = stagePos0.x + stageDelta.x;
        ovenStage.y = stagePos0.y + stageDelta.y;
        stage.update();
        dragStage.update();
        ovenStage.update();
    }

    document.querySelector('#game').addEventListener("mousedown", function (ev1) {
        if (!pieceMoving) {
            mousedownPos0 = { 'x': ev1.clientX, 'y': ev1.clientY };
            stagePos0 = { 'x': dragStage.x, 'y': dragStage.y };
            document.querySelector('#game').addEventListener('mousemove', pan);

            document.querySelector('#game').addEventListener('mouseup', function () {
                document.querySelector('#game').removeEventListener('mousemove', pan);
                panEndPos = { 'x': dragStage.x, 'y': dragStage.y };
            });
        }
    });



    gameBox.addEventListener('mousedown', function (e) {
        onTouch(e);
    });
    stage.addEventListener("click", function (e) {
        onTouch(e);
    });
    stage.mouseMoveOutside = true;

    dragStage.addEventListener("pressmove", function (e) { onTouch(e); });
    dragStage.addEventListener("pressup", function (e) { onTouch(e); });

    $(window).blur(function (e) {
        if (loopAudio) loopAudio.volume = 0;
    });
    $(window).focus(function (e) {
        // if (btnMuteOn.visible) {
        if (loopAudio) loopAudio.volume = volume;
        // }
    });

    disableEvents();

    /*
    UI Design
    ==================================================================
    Create Screens
    1.  Splash
    2.  Setup
    3.  Drop Inside
    4.  Category
    5.  Gallery
    6.  Rotate
    7.  Size
    8.  Jigsaw
    9.  Result
    10. Confirm    
    11. Header
    ==================================================================
    */
    // screenSplash
    screenSplash = Container("screenSplash", stage, gw, gh, true);
    var rect023 = new createjs.Shape();
    rect023.graphics.setStrokeStyle(1).beginFill("rgba(65,0,0,1)").drawRect(0, -800, gw * dpi, (gh * dpi) + 1600);
    screenSplash.addChild(rect023);

    addBitmap("logo", screenSplash, "assets/images/splash.png", "c", (device == "smart") ? (gh * dpi / 2 - 70) : (gh * dpi / 2 - 120));
    var percent = addText("percent", screenSplash, "Loaded: 0%", gameFont, 20, "#ffffff", "c", "c", true);
    Button("btnStart", screenSplash, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Start", gameFont, 25, "#ffffff", "", 2, "c", (device == "smart") ? (gh * dpi / 2 + 20) : (gh * dpi / 2 + 40), false);


    // Main menu
    mainMenuContainer = Container("mainMenuContainer", stage, gw, gh, false);
    var mainMenu = Container("mainMenu", mainMenuContainer, 10, 10, true);
    var rect02 = new createjs.Shape();

    rect02.graphics.setStrokeStyle(1).beginFill("rgba(65,0,0,1)").drawRect(0, -800 * dpi, gw * dpi, (gh * dpi) + 1600 * dpi);
    mainMenu.addChild(rect02);

    // console.log(gh, dpi);
    addText("lblSplashTitle", mainMenu, "Jigsaw Puzzle", gameFont, 35 * dpi, "#FFFFFF", "c", gh * 0.1);
    // console.log(gh * 0.1);

    Button("btnPlay", mainMenu, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "      Play      ", gameFont, 25, "#ffffff", "", 2, "c", gh * 0.225, true);
    // console.log(gh * 0.225);

    Button("btnOptions", mainMenu, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "   Options   ", gameFont, 25, "#ffffff", "", 2, "c", gh * 0.425, true);
    // console.log(gh * 0.425);

    Button("btnStatistics", mainMenu, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "  Statistics  ", gameFont, 25, "#ffffff", "", 2, "c", gh * 0.625, true);
    // console.log(gh * 0.625);

    Button("btnAbout", mainMenu, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "    About    ", gameFont, 25, "#ffffff", "", 2, "c", gh * 0.825, true);
    mainMenu.y = (gh * dpi - mainMenu.getBounds().height) / 2 - 50;
    // console.log(gh * 0.825);

    // screenSetup Options
    screenSetup = Container("screenSetup", stage, 0, 0, false);
    setupBox = Container("setupBox", screenSetup, 0, 0, true);
    setupBox2 = Container("setupBox2", screenSetup, 0, 0, true);
    setupBox2.visible = false;
    alert = Container("alert", screenSetup, 0, 0, true);
    alert.visible = false;

    var rect0g = new createjs.Shape();
    rect0g.graphics.setStrokeStyle(1).beginFill("rgba(255,255,255,1)").drawRect(gw * dpi / 2 - 300, gh * dpi / 2 - 120, 650, 120);
    alert.addChild(rect0g);

    var rect0gb = new createjs.Shape();
    rect0gb.graphics.setStrokeStyle(1).beginFill("#cccccc").drawRect(gw * dpi / 2 + 200, gh * dpi / 2 - 50, 120, 30);
    alert.addChild(rect0gb);

    alertMsg = addText("alertMsg", alert, "Sample", gameFont, 22, "#000000", gw * dpi / 2 - 270, gh * dpi / 2 - 90);
    alertOk = addText("alertOk", alert, "OK", gameFont, 22, "#000000", gw * dpi / 2 + 250, gh * dpi / 2 - 45, true);

    rect0gb.addEventListener("click", function () {
        hideOptions();
    });
    alertOk.addEventListener("click", function () {
        hideOptions();
    });

    var rect0 = new createjs.Shape();
    rect0.graphics.setStrokeStyle(1).beginFill("rgba(65,0,0,1)").drawRect(0, -800, gw * dpi, (gh * dpi) + 1600);
    setupBox.addChild(rect0);

    var rect0 = new createjs.Shape();
    rect0.graphics.setStrokeStyle(1).beginFill("rgba(65,0,0,1)").drawRect(0, -800, gw * dpi, (gh * dpi) + 1600);
    setupBox2.addChild(rect0);

    addText("lblOptionsTitle", setupBox, "Options", gameFont, 35, "#ffffff", (gw * dpi - 100) / 2, 30 * dpi);
    addText("lblOptionsTitle", setupBox2, "Advanced Options", gameFont, 35, "#ffffff", (gw * dpi - 250) / 2, 30 * dpi);

    ///////////////////////////////OPTIONS/////////////////////////////////
    Radio("pieceDistribution", setupBox2, "TL", "Piece distribution", ["Grid", "By rows", "Circle", "Frame"], ['grid', 'rows', 'circle', 'frame'], settings.pieceDistribution == "grid" ? 0 : settings.pieceDistribution == "rows" ? 1 : settings.pieceDistribution == "circle" ? 2 : 3, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 - 250) * dpi, 120 * dpi, true);

    // Radio("throw", setupBox2, "TL", "Pieces throw", ["All", "One piece at a time"], ['all', 'one-piece'], settings.throw == "all" ? 0 : 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, gw * dpi / 2 - 180, 120, true);

    Radio("pieceColor", setupBox2, "TL", "Piece color", ["Colored", "Black & white"], ['colored', 'black-n-white'], settings.pieceColor == "colored" ? 0 : 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 + 100) * dpi, 120 * dpi, true);

    Radio("time", setupBox2, "TL", "Time", ["Time counter", "Against the time"], ['time-counter', 'against-time'], settings.time == 'time-counter' ? 0 : 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 - 250) * dpi, 340 * dpi, true);


    Radio("sounds", setupBox, "TL", "Sounds", ["Yes", "No"], ['Yes', 'No'], settings.sounds == "Yes" ? 0 : 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 - 250) * dpi, 120 * dpi, true);

    Radio("shape", setupBox, "TL", "Piece shape", ["Regular", "Pointed", "Rounded"], ['regular', 'pointed', 'rounded'], settings.shape == "regular" ? 0 : settings.shape == "pointed" ? 1 : 2, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 - 250) * dpi, 300 * dpi, true);

    Radio("gameType", setupBox, "TL", "Game type", ["Classic", "Search position (All Pieces)", "Search position (One Piece at a time)"], ['classic', 'position', 'one-piece'], settings.gameType == "classic" ? 0 : settings.gameType == "position" ? 1 : 2, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 + 50) * dpi, 120 * dpi, true);

    Radio("rotation", setupBox, "TL", "Piece rotation", ["Yes", "No"], ['Yes', 'No'], settings.rotation == 'Yes' ? 0 : 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", gameFont, "#ffffff", (device == "smart") ? 1 : 1.5, (gw / 2 + 50) * dpi, 300 * dpi, true);
    ///////////////////////////////OPTIONS/////////////////////////////////


    Button("btnOptionsAdv", setupBox, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Advanced Options", gameFont, 25, "#ffffff", "", 2, "c", 460, true);
    Button("btnOptionsOk", setupBox, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "             Ok            ", gameFont, 25, "#ffffff", "", 2, "c", 520, true);
    Button("btnOptionsOk2", setupBox2, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "             Ok            ", gameFont, 25, "#ffffff", "", 2, "c", 480, true);
    setupBox.y = (gh * dpi - setupBox.getBounds().height) / 2 - 50;

    var input = document.createElement("INPUT");
    input.setAttribute("id", "btnCamFile");
    input.style.position = "absolute";
    input.style.display = "none";
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png, .jpg, .jpeg");
    input.setAttribute("onchange", "onCameraFileSelected(this)");
    document.body.appendChild(input);

    // screenDropInside
    screenDropInside = Div("screenDropInside", "body", "absolute", 1000, "0 0", 0, 0, gw + "px", gh + "px", "rgba(65,0,0,1)", "#ffffff");
    addImage("dropBoxBg", "screenDropInside", true, 1, 0, "assets/images/drop.svg", "", (gw / 2 - 200) + "px", (gh / 2 - 200) + "px", false, 10);
    dropBox = Div("dropBox", "screenDropInside", "absolute", 0, "0 0", 0, 0, gw + "px", gh + "px", "rgba(0,0,0,0)", "#ffffff");
    dropBox.innerHTML = '<input type="file" id="file-input" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" />';
    dropBox.addEventListener('dragenter', dropBoxEventHandler, false);
    dropBox.addEventListener('dragover', dropBoxEventHandler, false);
    dropBox.addEventListener('dragleave', dropBoxEventHandler, false);
    dropBox.addEventListener('drop', dropBoxEventHandler, false);
    dropBox.addEventListener('click', function (e) {
        $('#file-input').click();
        $('#file-input').change(dropBoxEventHandler);
    }, false);
    addImage("btnExitDropInside", "screenDropInside", true, 1, 0, "assets/images/backDropInside.svg", " ", "30px", "30px", false, 10);
    screenDropInside.style.display = "none";

    // ScreenCategory
    screenCategory = List("screenCategory", "category", "Select Category", "btnExitCategory", "btnBack1");

    // ScreenGallery
    screenGallery = Grid("screenGallery", "gallery", "Select Image", "btnExitGallery", "btnBack");

    // ScreenRotate
    // screenRotate = Container("screenRotate", stage, gw, gh, false);
    // var rotBox = new createjs.Container();
    // imgRot = new createjs.Container();
    // rotBox.addChild(imgRot);
    // rotBox.x = gw / 2 * dpi;
    // rotBox.y = gh / 2 * dpi;
    // rotBox.mouseChildren = false;
    // rotBox.id = rotBox.name = "rotBox";
    // rotBox.addEventListener("mousedown", function (e) { imgRot.rotation += 90; if (imgRot.rotation == 360) imgRot.rotation = 0; stage.update(); settings.orient = imgRot.rotation });
    // var icoRotate = new createjs.Bitmap("assets/images/rotate.svg");
    // icoRotate.scale = 4;
    // icoRotate.x = -32 * 4 / 2;
    // icoRotate.y = -32 * 4 / 2;
    // rotBox.addChild(icoRotate);
    // addText("txtRotate", screenRotate, "Tap on image to rotate", gameFont, (device == "smart") ? 8 * dpi : 30, "#ffffff", "c", 30 / dpi);
    // var btnExitRotate = new createjs.Bitmap("assets/images/backDropInside.svg");
    // btnExitRotate.id = btnExitRotate.name = "btnExitRotate";
    // btnExitRotate.x = gw * dpi - 50;
    // btnExitRotate.y = 20;
    // btnExitRotate.addEventListener("mousedown", function (e) { btnActions(e); });
    // screenRotate.addChild(rotBox);
    // screenRotate.addChild(btnExitRotate);
    // stage.update();
    // Button("btnDone", screenRotate, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Done", gameFont, 25, "#ffffff", "", 2, "c", gh - 100, true);

    // ScreenSize
    screenSize = List("screenSize", "size", "Select Size", "btnExitSize");

    // Header
    header = new createjs.Container();

    var rect023x = new createjs.Shape();
    rect023x.graphics.beginFill("rgba(0,0,0,1)").drawRect(gw * dpi - 100, -300, 200, gh * dpi + 6000);
    header.addChild(rect023x);

    var headerHeight = gh < minHeightForControls ? minHeightForControls : gh;


    header.id = header.name = "header";
    var txtCount = addText("txtCount", header, "Pieces:\n192/192", gameFont, (device == "smart") ? 16 * dpi : 16, "#ffffff", gw * dpi - 50, headerHeight * dpi * 0.62, true);
    txtCount.textAlign = "center";
    var txtTime = addText("txtTime", header, "Time:\n00:00:00", gameFont, (device == "smart") ? 16 * dpi : 16, "#ffffff", gw * dpi - 50, headerHeight * dpi * 0.7, true);
    txtTime.textAlign = "center";

    // var puzzleTitle = addText("ptitle", header, "Jigsaw Puzzle", gameFont, (device == "smart") ? 8 * dpi : 30, "#ffffff", "c", 10 / dpi, true);
    // txtTime.textAlign = "left";

    // btnSetup = Button("btnSetup1", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/setup.svg", 1, gw - 90 / dpi, 16 / dpi, true);
    // btnMuteOn = Button("btnMuteOn", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/muteOn.svg", 1, gw - 180 / dpi, 16 / dpi, true);
    // btnMuteOff = Button("btnMuteOff", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/muteOff.svg", 1, gw - 180 / dpi, 16 / dpi, false);
    // btnPlayOn = Button("btnPlayOn", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/pauseOn.svg", 1, gw - 270 / dpi, 16 / dpi, false);
    // btnPlayOff = Button("btnPlayOff", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/pauseOff.svg", 1, gw - 270 / dpi, 16 / dpi, false);
    // Button("btnInfo", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/info.svg", 1, gw - 360 / dpi, 16 / dpi, true);


    btnBack = TextButton("btnBack2", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Back", gameFont, 16, "#ffffff", "assets/images/buttons/back.png", 1, gw * dpi - 50, headerHeight * dpi * 0.025, true);

    btnGhosted = TextButton("btnGhosted", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Ghost\nImage", gameFont, 16, "#ffffff", "assets/images/buttons/ghosted.png", 1, gw * dpi - 50, headerHeight * dpi * 0.15, true);

    btnPreview = TextButton("btnPreview", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Preview", gameFont, 16, "#ffffff", "assets/images/buttons/preview.png", 1, gw * dpi - 50, headerHeight * dpi * 0.31, true);

    btnPieces = TextButton("btnPieces", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Pieces", gameFont, 16, "#ffffff", "assets/images/buttons/pieces.png", 1, gw * dpi - 50, headerHeight * dpi * 0.45, true);


    // btnSetup = TextButton("btnSetup1", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Menu", gameFont, 16, "#ffffff", "assets/images/buttons/menu.png", 1, gw - 50 / dpi, gh - 75 / dpi, true);
    btnOptions = TextButton("btnMenuInGame", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Menu", gameFont, 16, "#ffffff", "assets/images/buttons/options.png", 1, gw * dpi - 50, headerHeight * dpi * 0.87, true);
    // btnOptions = TextButton("btnOptionsInGame", header, "", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "Options", gameFont, 16, "#ffffff", "assets/images/buttons/options.png", 1, gw * dpi - 50, (gh * dpi * 0.87) / dpi, true);


    stage.addChild(header);
    header.visible = false;

    // screenResult
    screenResult = Div("screenResult", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("resultFrame", "screenResult", true, "350px", "160px", 10, "#ffffff", "calc(50% - 175px)", "calc(50% - 80px)", 0, "solid", "rgba(0,0,0,0)", 10);
    var txtResult = addDOMText("txtResult", "resultFrame", true, 300, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Congratulation!", "center", "#994400", true, 30, gameFont);
    var txtScore = addDOMText("txtScore", "resultFrame", true, 300, 50, 0, "c", 50, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "You have completed (17 x 17) Jigsaw Puzzle in 00:05:55", "center", "#000000", true, 20, gameFont);
    addDOMButton("btnOk", "resultFrame", true, "Close", 80, 30, 5, "#994400", "#ffffff", 20, true, 70, 110, 0, "solid", "#000000", 0, 0);
    addDOMButton("btnReplay", "resultFrame", true, "Replay", 80, 30, 5, "#994400", "#ffffff", 20, true, 200, 110, 0, "solid", "#000000", 0, 0);
    screenResult.style.display = "none";

    // screenConfirm
    screenConfirm = Div("screenConfirm", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("confirmFrame", "screenConfirm", true, "300px", "120px", 10, "#ffffff", "calc(50% - 150px)", "calc(50% - 60px)", 0, "solid", "rgba(0,0,0,0)", 10);
    addDOMText("txtConfirm", "confirmFrame", true, 300, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Are you sure?", "center", "#994400", true, 30, gameFont);
    addDOMButton("btnYes", "confirmFrame", true, "Yes", 80, 30, 5, "#994400", "#ffffff", 20, true, 50, 75, 0, "solid", "#000000", 0, 0);
    addDOMButton("btnNo", "confirmFrame", true, "No", 80, 30, 5, "#994400", "#ffffff", 20, true, 170, 75, 0, "solid", "#000000", 0, 0);
    screenConfirm.style.display = "none";

    // screenInfo
    screenInfo = Div("screenInfo", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("infoFrame", "screenInfo", true, "400px", "160px", 10, "#ffffff", "calc(50% - 200px)", "calc(50% - 80px)", 0, "solid", "rgba(0,0,0,0)", 10);
    addDOMText("txtInfoTitle", "infoFrame", true, 400, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Audios & Visuals", "center", "#994400", true, 30, gameFont);
    addDOMText("txtInfoImage", "infoFrame", true, 400, 36, 0, "c", 45, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Images: https://pixabay.com/", "center", "#000000", true, 20, gameFont);
    addDOMText("txtInfoAudio", "infoFrame", true, 400, 36, 0, "c", 75, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Audios: http://www.purple-planet.com/", "center", "#000000", true, 20, gameFont);
    addDOMButton("btnInfoClose", "infoFrame", true, "OK", 80, 30, 5, "#994400", "#ffffff", 20, true, "c", 115, 0, "solid", "#000000", 0, 0);
    screenInfo.style.display = "none";

    // lock
    lock = Div("lock", "body", "absolute", 2000, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0)");
    lock.style.display = "none";

    header1 = new createjs.Container();
    header1.visible = false;
    stage.addChild(header1);

    /*
    ==================================================================
    Now load gallery file structure and jigsaw pieces shapes geometry
    then load all Assets.
    When all assets loaded then populateCategory
    and show start button in screenSplash
    ==================================================================
    */

    jQuery.get("assets/puzzle/puzzle.json", function (data) {
        galleryDir = data;
        jQuery.get("assets/json/path.json", function (shapesJSON) {
            shapeData = shapesJSON;
            loadAssets();
        });
    });


}

function hideOptions() {
    alert.visible = false;
    setupBox2.visible = false;
    setupBox.visible = true; // this is to show the first options next time
    screenSetup.visible = false;
}

function applyPan(ev2) {
    var stageDelta = ev2;

    gameBox.x = stagePos0.x + stageDelta.x;
    gameBox.y = stagePos0.y + stageDelta.y;
    hintBox.x = stagePos0.x + stageDelta.x;
    hintBox.y = stagePos0.y + stageDelta.y;
    ghostBox.x = stagePos0.x + stageDelta.x;
    ghostBox.y = stagePos0.y + stageDelta.y;
    previewBox.x = stagePos0.x + stageDelta.x;
    previewBox.y = stagePos0.y + stageDelta.y;

    dragStage.x = stagePos0.x + stageDelta.x;
    dragStage.y = stagePos0.y + stageDelta.y;
    ovenStage.x = stagePos0.x + stageDelta.x;
    ovenStage.y = stagePos0.y + stageDelta.y;
    stage.update();
    dragStage.update();
    ovenStage.update();
}

function positionPiecesByPan() {
    var sortPiecesByPosX = pieceArray.slice();
    var sortPiecesByPosX = sortPiecesByPosX.sort(function (a, b) { return (Number(a.x) - Number(b.x)) });

    var sortPiecesByPosY = pieceArray.slice();
    var sortPiecesByPosY = pieceArray.sort(function (a, b) { return (Number(a.y) - Number(b.y)) });
    var pWidth = sortPiecesByPosX[0].w;
    var totalWidth = Math.abs(sortPiecesByPosX[0].x - sortPiecesByPosX[sortPiecesByPosX.length - 1].x)*2;
    var totalHeight = Math.abs(sortPiecesByPosY[0].y - sortPiecesByPosX[sortPiecesByPosY.length - 1].y)*2;
    var currentLeft = sortPiecesByPosX[0].x-2*pWidth;
    var currentTop = sortPiecesByPosY[0].y-2*pWidth;
    console.log(totalWidth, totalHeight);
    var panX = (gw-110) > totalWidth ? currentLeft - (gw - 110 - totalWidth) / 2 : -(currentLeft - (totalWidth - 110 - gw) / 2);
    var panY = gh > totalHeight ? currentTop - (gh - totalHeight) / 2 : -(currentTop - (totalHeight - gh) / 2);

    var rectangle9 = new createjs.Shape();
    rectangle9.id = rectangle9.name = "piecesBoxBg";
    rectangle9.graphics.setStrokeStyle(1).beginFill("rgba(65,0,0,1)").drawRect(currentLeft, currentTop, totalWidth, totalHeight)
    gameBox.addChild(rectangle9);

    debugger

    applyPan({ x: currentLeft, y: currentTop });
    // applyPan({ x: 150, y: 150 });
}

/*
==================================================================
This function runs when a user select an image via mobile/tablet 
camera or take a snap from mobile device.
==================================================================
*/
function onCameraFileSelected(e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        debug.innerHTML = "onCameraFileSelected onload"
        settings.pic = e.target.result;
        getImageMetadata(settings.pic, true);
        screenSetup.visible = false;
    }
    reader.readAsDataURL(e.files[0]);
}
/*
==================================================================
This function runs when a user drag and drop image in drop inside
box located in drop inside screen.
==================================================================
*/
function loadMime(file, callback) {

    //List of known mimes
    var mimes = [
        {
            mime: 'image/jpeg',
            pattern: [0xFF, 0xD8, 0xFF],
            mask: [0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'image/png',
            pattern: [0x89, 0x50, 0x4E, 0x47],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        }
        // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];

    function check(bytes, mime) {
        for (var i = 0, l = mime.mask.length; i < l; ++i) {
            if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
                return false;
            }
        }
        return true;
    }

    var blob = file.slice(0, 4); //read the first 4 bytes of the file

    var reader = new FileReader();
    reader.onloadend = function (e) {
        if (e.target.readyState === FileReader.DONE) {
            var bytes = new Uint8Array(e.target.result);

            for (var i = 0, l = mimes.length; i < l; ++i) {
                if (check(bytes, mimes[i])) return callback(mimes[i].mime);
                // if (check(bytes, mimes[i])) return callback("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
            }

            return callback("Mime: unknown <br> Browser:" + file.type);
        }
    };
    reader.readAsArrayBuffer(blob);
}

function dropBoxEventHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    debug.innerHTML = "dropBoxEventHandler";
    if (e.type == "drop") {
        debug.innerHTML = "dropBoxEventHandler drop";
        var file = e.dataTransfer.files[0];
        loadMime(file, function (mime) {
            if (mime === "image/jpeg" || mime === "image/png") {
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    settings.pic = reader.result;
                    getImageMetadata(settings.pic, true);
                    screenDropInside.style.display = "none";
                    // screenSize.style.display = "block";
                }, false);
                reader.readAsDataURL(file);
            } else {
                alert("Invalid or corrupted file");
            }
        });
    } else if (e.type == "change") {
        var files = e.target.files;
        if (files.length < 1) {
            return;
        }
        var file = files[0];
        loadMime(file, function (mime) {
            if (mime === "image/jpeg" || mime === "image/png") {
                var reader = new FileReader();
                reader.onload = function () {
                    settings.pic = reader.result;
                    getImageMetadata(settings.pic, true);//
                    screenDropInside.style.display = "none";
                };
                reader.readAsDataURL(file);
            } else {
                alert("Invalid or corrupted file");
            }
        });
    }
    event.target.value = '';
}
/*
==================================================================
This function is used to populate category.
galleryDir holds structure of gallery located in server side.
==================================================================
*/
function populateCategory() {
    var items = Object.keys(galleryDir)
    populateList("category", items, galleryDir);
}

function checkOptionChanges() {
    var propsChanged = [];

    if (settings.gameType !== screenSetup.getChildByName("setupBox").getChildByName("gameType").lskey) {
        propsChanged.push('gameType')
    }
    // if (settings.throw !== screenSetup.getChildByName("setupBox2").getChildByName("throw").lskey) {
    //     propsChanged.push('throw')
    // }
    if (settings.pieceColor !== screenSetup.getChildByName("setupBox2").getChildByName("pieceColor").lskey) {
        propsChanged.push('pieceColor')
    }
    if (settings.rotation !== screenSetup.getChildByName("setupBox").getChildByName("rotation").lskey) {
        propsChanged.push('rotation')
    }
    if (lsDOptions.sounds !== screenSetup.getChildByName("setupBox").getChildByName("sounds").lskey) {
        propsChanged.push('sounds')
    }
    if (settings.pieceDistribution !== screenSetup.getChildByName("setupBox2").getChildByName("pieceDistribution").lskey) {
        propsChanged.push('pieceDistribution')
    }
    if (settings.shape !== screenSetup.getChildByName("setupBox").getChildByName("shape").lskey) {
        propsChanged.push('shape')
    }

    if (propsChanged.length == 1) {
        if (propsChanged[0] == 'sounds') {
            alertMsg.text = "Don't show alert.";
            hideOptions();
        } else {
            alertMsg.text = "The option changed will take effect in the next game.";
            alert.visible = true;
        }
    } else if (propsChanged.length > 1) {
        if (propsChanged.indexOf('sounds') > -1) {
            alertMsg.text = "Some of the options changed will take effect in the next game.";
        } else {
            alertMsg.text = "The options changed will take effect in the next game.";
        }
        alert.visible = true;
    } else {
        hideOptions();
    }
}
/*
==================================================================
All button actions events are handle by this function.
==================================================================
*/
function btnActions(e) {
    var id = e.target.id;
    debug.innerHTML = e.target.id;
    if (id == "btnStart") {
        screenSplash.visible = false;
        mainMenuContainer.visible = true;
    } else if (id == "btnPlay") {
        mainMenuContainer.visible = false;
        document.getElementById("btnCamFile").value = "";
        settings.time = screenSetup.getChildByName("setupBox2").getChildByName("time").lskey;
        settings.hint = "Yes"; // screenSetup.getChildByName("setupBox").getChildByName("hint").lskey;
        if (settings.image == "Drop Inside") {
            screenSetup.visible = false;
            screenDropInside.style.display = "block";
            // enableDropEvents();
        } else if (settings.image == "Camera") {
            // disableDropEvents();
            document.getElementById('btnCamFile').click();
        } else if (settings.image == "Gallery") {
            // disableDropEvents();
            screenSetup.visible = false;
            screenCategory.style.display = "block";
        }
    } else if (id == "btnOptions") {
        openedOptionsFromGame = false;
        mainMenuContainer.visible = false;
        screenSetup.visible = true;
    } else if (id == "btnOptionsAdv") {
        setupBox2.visible = true;
        setupBox.visible = false;
    } else if (id == "btnOptionsOk" || id == "btnOptionsOk2") {

        if (!openedOptionsFromGame) {
            mainMenuContainer.visible = true;
            setupBox2.visible = false;
            setupBox.visible = true; // this is to show the first options next time
            screenSetup.visible = false;
        } else {
            checkOptionChanges();

            // timeOn = true;
            newPuzzuleForThisImage = false;
            completedGameSaved = false;
            // key = currentGameInProgress;
            if (localStorage.getItem(key)) {
                connectedPieces = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)).lsData.connectedPieces ? JSON.parse(localStorage.getItem(key)).lsData.connectedPieces : [] : [];
                lsData.connectedPieces = connectedPieces;
                settings.pic = JSON.parse(localStorage.getItem(key)).settings.pic;
                lsData.name = JSON.parse(localStorage.getItem(key)).lsData.name;
                // screenGallery.style.display = "none";
                createJigsawPuzzle(true);
            }
        }

        settings.sounds = screenSetup.getChildByName("setupBox").getChildByName("sounds").lskey;
        settings.gameType = screenSetup.getChildByName("setupBox").getChildByName("gameType").lskey;
        settings.rotation = screenSetup.getChildByName("setupBox").getChildByName("rotation").lskey;
        settings.shape = screenSetup.getChildByName("setupBox").getChildByName("shape").lskey;


        settings.time = screenSetup.getChildByName("setupBox2").getChildByName("time").lskey;
        // settings.throw = screenSetup.getChildByName("setupBox2").getChildByName("throw").lskey;
        settings.pieceColor = screenSetup.getChildByName("setupBox2").getChildByName("pieceColor").lskey;
        settings.pieceDistribution = screenSetup.getChildByName("setupBox2").getChildByName("pieceDistribution").lskey;
        // settings.image = screenSetup.getChildByName("setupBox").getChildByName("image").lskey;

        // if(settings.gameType === 'one-piece') {
        //     settings.gameType = 'position';
        // }

        if (openedOptionsFromGame) {
            lsDOptions.sounds == "Yes" ? toggleMute(false) : toggleMute(true);
            gameSave();
        } else {
            localStorage.setItem(commonKey, JSON.stringify({
                bgImg: settings.bgImg,
                gameType: settings.gameType,
                // throw: settings.throw,
                pieceColor: settings.pieceColor,
                rotation: settings.rotation,
                time: settings.time,
                hint: settings.hint,
                pieceDistribution: settings.pieceDistribution,
                shape: settings.shape,
                orient: settings.orient,
                sounds: settings.sounds,
                image: settings.image,
                folderIndex: settings.folderIndex,
                sizeIndex: settings.sizeIndex,
                pic: settings.pic
            }));
        }
    } else if (id == "btnExitDropInside") {
        screenDropInside.style.display = "none";
        screenGallery.style.display = "block";
    } else if (id == "btnExitCategory") {
        screenCategory.style.display = "none";
        screenSetup.visible = false;
        mainMenuContainer.visible = true;
    } else if (id == "btnExitGallery") {
        screenGallery.style.display = "none";
        mainMenuContainer.visible = true;
    } else if (id == "btnBack") {
        screenGallery.style.display = "none";
        screenCategory.style.display = "block";
        populateCategory();
        populateGallery();

    } else if (id == "btnBack1") {
        screenCategory.style.display = "none";
        mainMenuContainer.visible = true;
        populateCategory();
        populateGallery();

    } else if (id == "btnExitRotate") {
        // screenRotate.visible = false;
        if (settings.image == "Drop Inside" || settings.image == "Camera") {
            screenSetup.visible = true;
        } else if (settings.image == "Gallery") {
            screenGallery.style.display = "block";
        }
    } else if (id == "btnExitSize") {
        screenSize.style.display = "none";
        if (settings.image == "Drop Inside" || settings.image == "Camera") {
            screenSetup.visible = true;
        } else if (settings.image == "Gallery") {
            // screenGallery.style.display = "block";
            // screenRotate.visible = true;
        }
    }
    /*else if (id == "btnPlayOn") {
           btnPlayOn.visible = false;
           btnPlayOff.visible = true;
           togglePlay(true);
       } else if (id == "btnPlayOff") {
           btnPlayOff.visible = false;
           btnPlayOn.visible = true;
           togglePlay(false);
       } else if (id == "btnMuteOff") {
           btnMuteOff.visible = false;
           // btnMuteOn.visible = true;
           toggleMute(false);
       } else if (id == "btnMuteOn") {
           btnMuteOn.visible = false;
           btnMuteOff.visible = true;
           toggleMute(true);
       }*/
    else if (id == "btnBack2") {
        exitGame(true);
        populateCategory();
        populateGallery();

    } else if (id == "btnBack3") {
        exitGame(true);
        header1.visible = false;
        populateCategory();
        populateGallery();
    } else if (id == "btnGhosted") {
        if (ghostBox.visible) {
            ghostBox.visible = false;
        } else {
            ghostBox.visible = true;
        }
    } else if (id == "btnPreview") {
        if (previewBox.visible) {
            previewBox.visible = false;
        } else {
            previewBox.visible = true;
        }
    } else if (id == "btnPieces") {
        if (piecesBox.visible) {
            piecesBox.visible = false;
        } else {
            piecesBox.visible = true;
        }
    } else if (id == "btnMenu") {
        exitGame();
    } else if (id == "btnSetup1") {
        // if (inGame) {
        //     showConfirm(); are you sure
        // } else {
        exitGame();
        populateCategory();
        populateGallery();

        // window.location.reload(); // need to revisit this Satya, InProgress and Completed categoryimage need updated on game complete
        // }
    } else if (id == "btnSetup3") {
        exitGame();
        populateCategory();
        populateGallery();

        header1.visible = false;
    } else if (id == "btnNo") {
        screenConfirm.style.display = "none";
    } else if (id == "btnYes") {
        exitGame();
    } else if (id == "btnSetup") {
        exitGame();
        // } else if (id == "btnOptionsInGame") {
        //     // first set the key properly when a thumb nail is selected
        //     stage.setChildIndex(screenSetup, stage.numChildren - 1);
        //     openedOptionsFromGame = true; // this must be set when option is clicked from menu
        //     // timer need to be stopped counting
        //     // currentGameInProgress = key;
        //     exitGame("options"); // this must be set when option is clicked from menu
    } else if (id == "btnMenuInGame") {
        if (menuBox.visible) {
            menuBox.visible = false;
        } else {
            menuBox.visible = true;
        }

    } else if (id == "btnReplay") {
        replay();
    } else if (id == "btnOk") {
        screenResult.style.display = "none";
        if (!win) {
            if (settings.gameType == "position" || settings.gameType == "one-piece") {
                for (var i = 0; i < pieceArray.length; i++) {
                    var grp = gameBox.getChildByName(pieceArray[i].gid);
                    grp.positioned = true;
                    trans = [
                        [{ rotation: 0, x: pieceArray[i].xp, y: pieceArray[i].yp }, 1000, createjs.Ease.getPowOut(5)]
                    ];
                    tween("tween", grp, 0, false, false, trans, true);
                }
            } else if (settings.gameType == "classic") {
                var union = gameBox.getChildByName(0);
                union.x = union.y = 0;
                var dk = 0;
                for (var i = 0; i < gameBox.numChildren; i++) {
                    var grp = gameBox.getChildByName(i);
                    trace(grp.numChildren);
                    for (var j = grp.numChildren - 1; j >= 0; j--) {
                        var cell = grp.getChildByName(j);
                        cell.uncache();
                        var info = pieceArray[cell.id];
                        cell.alpha = 0;
                        trans = [
                            [{ alpha: 1, rotation: 0, x: info.xp, y: info.yp }, 1000, createjs.Ease.elasticOut]
                        ];
                        tween("tween", cell, dk * 5, false, false, trans, true);
                        union.addChild(cell);
                        dk++;
                    }
                }
            }
        }
    } else if (id == "btnDone") {
        // screenRotate.visible = false;
        createOrientedImage();
    }
    /*else if (id == "btnInfoClose") {
           screenInfo.style.display = "none";
       } else if (id == "btnInfo") {
           screenInfo.style.display = "block";
       }*/
}
/*
==================================================================
This function runs when user finalize the orientatio of image.
Supported values are 0, 90, 180 and 270.
It is recomended to set the rotation that match with screen 
resolution.
==================================================================
*/
function createOrientedImage() {
    var bitmap = new createjs.Bitmap(selectedPic);
    // if (settings.orient == 90) {
    //     bitmap.regX = 0;
    //     bitmap.regY = bitmap.image.height;
    // } else if (settings.orient == 180) {
    //     bitmap.regX = bitmap.image.width;
    //     bitmap.regY = bitmap.image.height;
    // } else if (settings.orient == 270) {
    //     bitmap.y = bitmap.image.width;
    // }
    bitmap.rotation = settings.orient;
    // if (settings.orient == 90 || settings.orient == 270) {
    //     ovenCanvas.width = bitmap.image.height;
    //     ovenCanvas.height = bitmap.image.width;
    // } else {
    ovenCanvas.width = bitmap.image.width;
    ovenCanvas.height = bitmap.image.height;
    // }
    while (tray.numChildren != 0) {
        tray.removeChildAt(0);
    }
    tray.addChild(bitmap);
    ovenStage.update();
    tray.snapToPixel = true;
    var image1 = new Image();
    image1.onload = function (e) {
        onImageLoaded(e)
    };

    image1.src = ovenCanvas.toDataURL("image/png"); //, 1
    // screenSize.style.display = "block";
}
/*
==================================================================
On executing this function it will show the setupScreen and reset
all the game values
==================================================================
*/
function exitGame(catMenu) {
    reset();
    timeOn = false;

    if (catMenu == "options") {
        screenSetup.visible = true;
    } else {
        header.visible = false;
        gameBox.visible = false;
        hintBox.visible = false;
        ghostBox.visible = false;
        previewBox.visible = false;
        piecesBox.visible = false;
        menuBox.visible = false;
        screenConfirm.style.display = "none";
        screenResult.style.display = "none";
        if (catMenu) {
            // screenCategory.style.display = "block";
            screenGallery.style.display = "block";
        } else {
            mainMenuContainer.visible = true;
        }
    }
    createjs.Sound.stop();
}
/*
==================================================================
This function reset all the required varialbes.
==================================================================
*/
function reset() {
    win = true;
    warnActivated = false;
    var txtTime = header.getChildByName("txtTime");
    txtTime.color = "#ffffff";
    createjs.Tween.removeTweens(txtTime);
    txtTime.scale = 1
}
/*
==================================================================
This function will show the confirmation screen if you are if 
inGame is true
==================================================================
*/
function showConfirm() {
    screenConfirm.style.display = "block";
}
/*
==================================================================
This function will reset and reload the game keeping all the settings
as it is but only the jigsaw puzzle shapes will re-create
==================================================================
*/
function replay() {
    reset();
    screenResult.style.display = "none";
    if (fromLocalStorage) {
        createJigsawPuzzle(true);
    } else {
        createJigsawPuzzle();
    }
}
/*
==================================================================
gridAction is an event listener triggered by Gird component which
is loacated in screenGallery   for Category
==================================================================
*/
function gridActions(e) {
    // look the current img name and load settings from that
    if (e[3] === "completed") {
        newPuzzuleForThisImage = false;
        console.log("The puzzle is already complete.")
    } else if (e[2] === "in-progress") {
        newPuzzuleForThisImage = false;
        completedGameSaved = false;
        key = e[3];
        settings = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)).settings : settings;
        // settings.sounds = lsDOptions.sounds;
        connectedPieces = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)).lsData.connectedPieces ? JSON.parse(localStorage.getItem(key)).lsData.connectedPieces : [] : [];
        lsData.connectedPieces = connectedPieces;
        settings.pic = e[1];
        lsData.name = e[4];
        screenGallery.style.display = "none";
        createJigsawPuzzle(true);
    } else if (e[2] === "completed") {
        settings = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)).settings : settings;
        // settings.sounds = lsDOptions.sounds;
        newPuzzuleForThisImage = false;
        key = e[3];
        settings.pic = e[1];
        lsData.name = e[4];
        screenGallery.style.display = "none";
        showCompletedNBack(key);
    } else if (e[2] === "customized") {
        settings = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)).settings : settings;
        // settings.sounds = lsDOptions.sounds;
        newPuzzuleForThisImage = true;
        completedGameSaved = false;
        settings.pic = e[5]; // e[1];
        lsData.name = e[4];
        getImageMetadata(settings.pic, false);
    } else {
        settings = localStorage.getItem(commonKey) ? JSON.parse(localStorage.getItem(commonKey)) : settings;
        newPuzzuleForThisImage = true;
        completedGameSaved = false;
        settings.pic = "assets/puzzle/" + e[2] + "/large/" + e[5]; // e[1];
        lsData.name = e[4];
        getImageMetadata(settings.pic, false);
        // screenGallery.style.display = "none"; // this has to be called on image load satya
        // screenSize.style.display = "block";
    }

    var snd = lsDOptions ? lsDOptions.sounds : settings.sounds;
    if (snd === "Yes") {
        menuBox.getChildAt(11).visible = true;
        menuBox.getChildByName("ttt2m").x = gw * dpi - 260;
    } else {
        menuBox.getChildAt(11).visible = false;
        menuBox.getChildByName("ttt2m").x = gw * dpi - 280;
    }
}

function viewFileSelect() {
    screenGallery.style.display = "none";
    screenDropInside.style.display = "block";
}
/*
==================================================================
listAction is an event listener triggered by List component which
is loacated in screenCategory and screenSize
==================================================================
*/
function listActions(e) {
    initialWidth = window.innerWidth;
    initialHeight = window.innerHeight;
    ratio = initialWidth / initialHeight;
    // var elementsTotransform = stage.children;
    // for (var i = 0; i < elementsTotransform.length; i++) {
    //     elementsTotransform[i].sX = elementsTotransform[i].x;
    //     elementsTotransform[i].sY = elementsTotransform[i].y;
    //     elementsTotransform[i].sXp = elementsTotransform[i].xp;
    //     elementsTotransform[i].sYp = elementsTotransform[i].yp;
    //     elementsTotransform[i].sscaleX = elementsTotransform[i].scaleX;
    //     elementsTotransform[i].sscaleY = elementsTotransform[i].scaleY;
    // }
    // var elementsTotransform1 = dragStage.children;
    // for (var i = 0; i < elementsTotransform1.length; i++) {
    //     elementsTotransform1[i].sX = elementsTotransform1[i].x;
    //     elementsTotransform1[i].sY = elementsTotransform1[i].y;
    //     elementsTotransform1[i].sXp = elementsTotransform1[i].xp;
    //     elementsTotransform1[i].sYp = elementsTotransform1[i].yp;
    //     elementsTotransform1[i].sscaleX = elementsTotransform1[i].scaleX;
    //     elementsTotransform1[i].sscaleY = elementsTotransform1[i].scaleY;
    // }
    // var elementsTotransform2 = ovenStage.children;
    // for (var i = 0; i < elementsTotransform2.length; i++) {
    //     elementsTotransform2[i].sX = elementsTotransform2[i].x;
    //     elementsTotransform2[i].sY = elementsTotransform2[i].y;
    //     elementsTotransform2[i].sXp = elementsTotransform2[i].xp;
    //     elementsTotransform2[i].sYp = elementsTotransform2[i].yp;
    //     elementsTotransform2[i].sscaleX = elementsTotransform2[i].scaleX;
    //     elementsTotransform2[i].sscaleY = elementsTotransform2[i].scaleY;
    // }

    if (e[0] == "category") {
        settings.folderIndex = e[2];
        currentCategory = e[2];
        populateGallery(e[2]);
        selectedCategory = e[1];
        lsData.name = e[3];
        var frame = document.getElementById("screenGalleryFrame");
        var html = frame.innerHTML.split("Select Image");
        frame.innerHTML = html.join("Select Image" + "<br/><span class='cat-name'>" + selectedCategory.split("-").join(" ") + "</span>");
        screenCategory.style.display = "none";
        screenGallery.style.display = "block";
    } else if (e[0] == "size") {
        settings.sizeIndex = e[1];
        // screenSize.style.display = "none";
        screenGallery.style.display = "none";
        difficultyModal.style.display = "none";
        trace("Index:" + settings.sizeIndex);
        createJigsawPuzzle();
    }
}
/*
==================================================================
This fucntion will populate image gallery Grid component.
==================================================================
*/
function populateGallery() {
    populateGrid("gallery", galleryDir["completed"], "completed");
    if (currentCategory) {
        populateGrid("gallery", galleryDir[currentCategory], currentCategory);
    }

    // below items must be handled properly for displayed list
    // populateGrid("gallery", galleryDir["in-progress"], "in-progress");

    // populateGrid("gallery", galleryDir["customized"], "customized");

}
/*
==================================================================
This fucntion will populate list componet for sizes.
==================================================================
*/
function populateSize(items) {
    updateDifficultyModal("size", items, galleryDir);
}
/*
==================================================================
This fucntion is a listener triggered when user start dragging a
piece of jigsaw puzzle.
==================================================================
*/
function dragCell(e) {
    var grp = e.target;
    grp.x = e.stageX + offset.x;
    grp.y = e.stageY + offset.y;
    // scaling drag
}
/*
==================================================================
Once you finalize orientation in screenRotate this function then 
execute.
==================================================================
*/
function finalizeOrientation(e) {
    imgRot.rotation = 0;
    settings.orient = 0;
    while (imgRot.numChildren != 0) imgRot.removeChildAt(0);
    var bitmap = new createjs.Bitmap(e.target);
    bitmap.regX = bitmap.image.width / 2;
    bitmap.regY = bitmap.image.height / 2;
    var s = 300 / bitmap.image.height;
    bitmap.scale = s;
    imgRot.addChild(bitmap);
    stage.update();
    // screenRotate.visible = true;
    // add modal satya

}

function selectDificulty(img) {
    populateDifficulty("difficultyContainer", img);
    createOrientedImage();
}

function populateCustomGameName(img) {
    populateCNameModal("cNameContainer", img);
}
/*
==================================================================
This function handle three type of event mousedown, pressmove and
pressup.
==================================================================
*/
function onTouch(e) {
    // var ele = e.currentTarget;
    if (e.type == "mousedown") {
        pieceMoving = true;

        grp = e.target;
        debug.innerHTML = grp.getBounds().width + " x " + grp.getBounds().height;
        downTime = new Date();
        dx = e.stageX;
        dy = e.stageY;
        // grp.x = grp.x * wRatio;
        // grp.y = grp.y * wRatio;
        // grp.scaleX = grp.sscaleX * wRatio;
        // grp.scaleY = grp.sscaleY * wRatio;
        grp.x -= 3;
        grp.y -= 3;
        grp.shadow = new createjs.Shadow("rgba(0,0,0,.5)", 6, 6, 3);
        offset = { x: grp.x - dx, y: grp.y - dy };
        dragStage.addChild(grp); // this enables piece move
        dragStage.update();
        canvas.style.zIndex = 3;
        dragCanvas.style.zIndex = 4;
        // grp.x += 3;
        // grp.y += 3;
        stage.update();
        dragCanvas.style.display = "block";
    } else if (e.type == "pressmove") {
        pieceMoving = true;

        if (settings.gameType == "classic" || (settings.gameType == "position" && !e.target.positioned) || (settings.gameType == "one-piece" && !e.target.positioned)) {
            var grp = e.target;
            grp.x = e.stageX + offset.x - 3;
            grp.y = e.stageY + offset.y - 3;
            dragStage.update();
        }
    } else if (e.type == "pressup") {
        pieceMoving = false;

        var grp = e.target;
        var cell = grp.getChildAt(0);
        gameBox.addChild(grp);
        canvas.style.zIndex = 4;
        dragCanvas.style.zIndex = 3;
        // grp.x = grp.x / wRatio;
        // grp.y = grp.y / wRatio;
        // grp.scaleX = 1;
        // grp.scaleY = 1;
        grp.x += 3;
        grp.y += 3;
        grp.shadow = new createjs.Shadow("rgba(0,0,0,0)", 0, 0, 0);
        stage.update();
        dragStage.update();
        var elapse = new Date() - downTime;
        if ((settings.gameType == "position" || settings.gameType == "one-piece") && !e.target.positioned && grp.numChildren == 1 && settings.rotation == "Yes" && Math.abs(e.stageX - dx) <= tapTolerance && Math.abs(e.stageY - dy) <= tapTolerance && elapse <= 250) {
            drag = false;
            cell.rotation += 90;
            if (cell.rotation == 360) cell.rotation = 0;
        } else if (settings.gameType == "classic" && grp.numChildren == 1 && settings.rotation == "Yes" && Math.abs(e.stageX - dx) <= tapTolerance && Math.abs(e.stageY - dy) <= tapTolerance && elapse <= 250) {
            drag = false;
            cell.rotation += 90;
            if (cell.rotation == 360) cell.rotation = 0;
        } else {
            drag = true;
            if (cell.rotation == 0) {
                if (settings.gameType == "classic" || (settings.gameType == "position" && !e.target.positioned) || (settings.gameType == "one-piece" && !e.target.positioned)) {
                    checkAfterRelease(grp);
                }
            }
        }
    }
}




/*
==================================================================
This function is used to toggle loop audio.
The button located in game header is responsible to handle this event
==================================================================
*/
function toggleMute(stage) {
    if (stage) {
        volume = 0;
    } else {
        volume = 1;
    }
    loopAudio.volume = volume;
}
/*
==================================================================
This function is used to toggle play pause.
The button located in game header is responsible to handle this event
==================================================================
*/
function togglePlay(state) {
    if (state) {
        gameBox.visible = false;
        hintBox.visible = false;
        ghostBox.visible = false;
        previewBox.visible = false;
        piecesBox.visible = false;
        menuBox.visible = false;
        // timeElapsed += new Date() - startTime;
        timeOn = false;
    } else {
        gameBox.visible = true;
        // hintBox.visible = true;
        startTime = new Date();
        timeOn = true;
    }
}
/*
==================================================================
This function runs after
1. Game completed successfully. (Elapse Time mode)
2. You win! (Limit Time mode)
3. You Lose! (Limit Time mode)
==================================================================
*/
function showResult() {
    lock.style.display = "none";
    screenResult.style.display = "block";
    var txtResult = document.getElementById("txtResult");
    var txtScore = document.getElementById("txtScore");

    if (settings.time == "time-counter") {
        playEventSound("complete", 250);
        txtResult.innerHTML = "Congratulation!"
        txtScore.innerHTML = "You have completed (" + row + "x" + col + ") Jigsaw Puzzle in " + header.getChildByName("txtTime").text;
    } else if (settings.time == "against-time") {
        txtResult.innerHTML = win ? "You Win!" : "You Lose!";
        if (win) {
            playEventSound("complete", 250);
            txtScore.innerHTML = "Well Done";
        } else {
            playEventSound("lose", 250);
            txtScore.innerHTML = "Try Again";
        }
    }
    inGame = false;
}
/*
==================================================================
This function is a createjs timer based on framerate. 
This function handle canvas redraw mechanism.
For optimization it is necessary to call update only when required
If stage containing 200 nested items update after 60 mili-second 
then this will slow down the overall performance. So in order to 
handle this we need to set which stage need to be update.
==================================================================
*/
function tictic() {
    var t = 0;
    if (tStage == "stage") {
        stage.update();
    } else if (tStage == "dragStage") {
        dragStage.update();
    }
    if (timeOn) {


        var ctime = new Date();
        if (ctime != startTime) {
            var t1 = parseInt((ctime - startTime + lsData.timeElapsed) / 1000);
            if (settings.time == "against-time") { // old Limit 
                var t2 = timeLimit - t1;
                lsData.timeElapsed = t2;
                t = convertNumberToTime(t2);
                if (t2 == warnAt && !warnActivated) {
                    warnActivated = true;
                    var txtTime = header.getChildByName("txtTime");
                    txtTime.color = "#ff0000";
                    trans = [
                        [{ scale: 1.25 }, 250],
                        [{ scale: 1 }, 250]
                    ];
                    tween("tween", txtTime, 250, true, true, trans, true);
                }
            } else if (settings.time == "time-counter") { // old Elapsed
                lsData.timeElapsed = t1;
                t = convertNumberToTime(t1);
            }
            header.getChildByName("txtTime").text = "Time:\n" + t;
            stage.update();
            if (timeLimit - t1 == 0 && settings.time == "against-time") {
                timeOn = false;
                win = false;
                lsData.completed = false;
                showResult();
            }
        }
        if (!debug) gameSave();
    }
}
/*
==================================================================
createjs library also support tween.
this function is used for animation of any canvas object.
==================================================================
*/
function tween(id, element, delay, loop, reverse, trans, autoPlay, fun) {
    var anim = createjs.Tween.get(element, { loop: loop, reversed: reverse });
    anim.wait(delay);
    for (var i = 0; i < trans.length; i++) {
        anim.to(trans[i][0], trans[i][1], trans[i][2]);
    }
    if (fun != undefined) {
        anim.call(fun);
    }
    if (!autoPlay) {
        anim.setPaused(true);
    }
}
/*
==================================================================
In order to get the dimension of image we need to first get its
metadata information. To do so we have to first load the image.
This function is actually preload image before scaling, cutting
for jigsaw pieces or applying filters on it.
==================================================================
*/
function getImageMetadata(file, localImg) {
    var img = new Image();
    img.addEventListener("imgLoaded", function (e) {
        // finalizeOrientation(e);
        if (localImg) {
            selectedPic = file;
            populateCustomGameName(file);
        } else {
            selectedPic = e.target;
            selectDificulty(e.target); //file
        }
    }, false);
    var imageLoadedEvent = new Event('imgLoaded');
    img.onload = function (e) {
        img.dispatchEvent(imageLoadedEvent);
    }
    img.src = file;
}
/*
==================================================================
This function is used to disable some browser events.
1. mouse right click
2. print screen
3. Ctrl + Shift + I
4. Ctrl + Shift + J
5. Ctrl + S
6. Ctrl + U
7. F11
8. F12
==================================================================
*/
function disableEvents() {
    function removeActionBtn() {
        var myobj = document.getElementsByClassName("delete-option");
        if (myobj[0]) {
            myobj[0].remove();
        }
    }

    function removeItem(event) {
        localStorage.removeItem(event.target.getAttribute("data-key"));
        removeActionBtn();
        populateCategory();
        populateGallery();
    }
    document.addEventListener("click", function () {
        removeActionBtn();
    })
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var myobj = document.getElementsByClassName("delete-option");
        if (myobj[0]) {
            myobj[0].remove();
        }
        var check = e.target.getAttribute('onclick');
        if (check !== null && check.indexOf("gridActions") > -1) {
            let name = e.target.parentElement.parentElement.textContent;
            let new_row = document.createElement('div');
            new_row.innerHTML = "Delete puzzle '" + name + "'";
            new_row.setAttribute("class", "delete-option");
            new_row.setAttribute("data-key", check.split(",")[3].split("'").join(""));
            new_row.setAttribute("style", "left:" + e.clientX + "px; top:" + e.clientY + "px");
            document.body.appendChild(new_row);
            // setTimeout(function(){
            //     new_row.removeEventListener("click", removeItem, true);
            //     removeActionBtn();
            // }, 5000)
            new_row.addEventListener("click", removeItem, true);
        }
    }, false);
    document.addEventListener("keyup", function (e) { disablePrintScreenEvent(e); }, false);

    function disablePrintScreenEvent(e) {
        if (e.keyCode == 44) {
            var tempElement = document.createElement("input");
            tempElement.style.cssText = "width:0!important;padding:0!important;border:0!important;margin:0!important;outline:none!important;boxShadow:none!important;";
            document.body.appendChild(tempElement);
            tempElement.value = ' ' // Empty string won't work!
            tempElement.select();
            document.execCommand("copy");
            document.body.removeChild(tempElement);
        }
    }
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 18) {
            disableAction(e);
        }
        // "I" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            disableAction(e);
        }
        // "J" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            disableAction(e);
        }
        // "S" key + macOS
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            disableAction(e);
        }
        // "U" key
        if (e.ctrlKey && e.keyCode == 85) {
            disableAction(e);
        }
        // "F12" key
        if (event.keyCode == 123) {
            disableAction(e);
        }
        // "F11" key
        if (event.keyCode == 122) {
            disableAction(e);
        }
    }, false);

    function disableAction(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
    }
}