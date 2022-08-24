/*
===============================================================
This javascript file is holding collection of UI components
for createjs and DOM componets
===============================================================
*/
var uiDragY;
var drag;
var list;
var grid;
var offset;
/*
===============================================================
Div is a DOM componet function use to create div
===============================================================
*/
function Div(id, container, position, zindex, transformOrigin, x, y, width, height, backgroundColor, color, backgroundRepeat, backgroundImage) {
    var div = document.createElement("DIV");
    div.setAttribute("id", id);
    div.style.position = position;
    div.style.transformOrigin = transformOrigin;
    div.style.width = width;
    div.style.height = height;
    div.style.zIndex = zindex;
    div.style.left = x;
    div.style.top = y;
    div.style.font = "12px " + gameFont;
    div.style.backgroundColor = backgroundColor;
    div.style.color = color;
    if (backgroundRepeat) div.style.backgroundRepeat = backgroundRepeat;
    if (backgroundImage) {
        div.style.backgroundImage = backgroundImage;
        div.style.backgroundSize = "contain";
        // div.style.backgroundRepeat = "repeat";
    }
    if (container == "body") {
        document.body.appendChild(div);
    } else {
        document.getElementById(container).appendChild(div);
    }
    return div;
}
/*
===============================================================
Canvas is a DOM componet function use to create canvas
===============================================================
*/
function Canvas(canvasId, container) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvasId);
    canvas.style.position = "absolute";
    canvas.width = game.clientWidth * dpi;
    canvas.height = game.clientHeight * dpi;
    // canvas.style.width = game.clientWidth + "px";
    // canvas.style.height = game.clientHeight + "px";
    container.appendChild(canvas);
    return canvas;
}
/*
===============================================================
addText is a createjs componet function use to create labels or
editable text
===============================================================
*/
function addText(id, container, text, gameFont, size, color, x, y, shadow, bold) {
    var txt = new createjs.Text();
    if (shadow) {
        txt.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    }
    txt.id = txt.name = id;
    txt.text = text;
    txt.font = size + "px " + gameFont;
    txt.color = color;
    txt.fontWeight = bold ? bold : '';
    txt.x = (x == "c") ? (gw * dpi - txt.getBounds().width) / 2 : x;
    txt.y = (y == "c") ? (gh * dpi - txt.getBounds().height) / 2 : y;
    container.addChild(txt);
    return txt;
}


/*
===============================================================
addBitmap is a createjs componet function use to create bitmap
===============================================================
*/
function addBitmap(id, container, src, x, y, scaleX, scaleY, clickCb, loadCb = null, visible = true) {
    var img = new Image();
    img.id = id;
    img.onload = function (e) {
        var bitmap = new createjs.Bitmap(e.target);
        bitmap.x = (x == "c") ? (gw * dpi - bitmap.image.width) / 2 : x;
        bitmap.y = (y == "c") ? (gh * dpi - bitmap.image.height) / 2 : y;
        bitmap.scaleX = scaleX ? scaleX : 1;
        bitmap.scaleY = scaleY ? scaleY : 1;
        bitmap.addEventListener('click', function (e) {
            clickCb(e);
        })
        // bitmap.visible = visible;
        container.addChild(bitmap);
        if (loadCb) loadCb(bitmap, visible);

        return bitmap;
    }
    img.src = src;
}
/*
===============================================================
Container is a createjs componet function use to create component
A container in createjs is used bound/group set of displayable 
objects
===============================================================
*/
function Container(id, container, w, h, show) {
    var con = new createjs.Container();
    con.id = con.name = id;
    var bg = new createjs.Shape();
    bg.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, w * dpi, h * dpi);
    con.addChild(bg);
    con.visible = show;
    container.addChild(con);
    return con;
}
/*
===============================================================
Button is a createjs componet function use to create buttons
Button support text or image
===============================================================
*/
function Button(id, container, shp, fillColor, borderColor, borderThickness, pivot, padding, arc, caption, gameFont, size, textColor, icon, scale, x, y, show) {
    var btn = new createjs.Container();
    var box = new createjs.Container();
    btn.mouseChildren = false;
    btn.id = btn.name = id;
    btn.uitype = "button";

    if (caption) {
        var item = new createjs.Text();
        item.font = size * dpi + "px " + gameFont;
        item.color = textColor;
        item.text = caption;
        var bound = item.getBounds();
    } else {
        var item = new createjs.Container();
        var icon1 = new createjs.Bitmap(icon);
        var iconShadow = new createjs.Bitmap(icon);
        iconShadow.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
        item.addChild(iconShadow, icon1);
        item.scale = scale;
        item.setBounds(0, 0, 32 * scale, 32 * scale);
        var bound = item.getBounds();
    }
    var shape = new createjs.Shape();
    var pad = padding;
    var a = arc * dpi;
    if (shp == 'rect') {
        shape.graphics.beginFill(fillColor).drawRect(0, 0, bound.width + 4 * pad, bound.height + 2 * pad);
        item.x = 2 * pad;
        item.y = pad;
    } else if (shp == 'roundrect') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRoundRect(0, 0, bound.width + 4 * pad, bound.height + 2 * pad, a);
        item.x = 2 * pad;
        item.y = pad;
    } else if (shp == 'square') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRect(0, 0, bound.width + 2 * pad, bound.width + 2 * pad);
        item.x = pad;
        item.y = (bound.width + 2 * pad - bound.height) / 2;
    } else if (shp == 'roundsquare') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRoundRect(0, 0, bound.width + 2 * pad, bound.width + 2 * pad, a);
        item.x = pad;
        item.y = (bound.width + 2 * pad - bound.height) / 2;
    } else if (shp == 'circle') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawCircle(0, 0, bound.width / 2 + pad);
        item.x = -bound.width / 2;
        item.y = -bound.height / 2;
    }
    shape.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    if (pivot == "TL") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
            box.y = (bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "TC") {
        if (shp == "circle") {
            box.y = (bound.width + 2 * pad) / 2;
        } else {
            box.x = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "TR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = (bound.width + 2 * pad) / 2;
        } else {
            box.x = -(bound.width + 2 * pad);
        }
    } else if (pivot == "ML") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.y = -(bound.height + 2 * pad) / 2;
        } else if (shp == "square" || shp == "roundsquare") {
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "MC") {
        if (shp == "circle") {

        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.height + 2 * pad) / 2;
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "MR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.height + 2 * pad) / 2;
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "BL") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.y = -(bound.width + 2 * pad);
        }
    } else if (pivot == "BC") {
        if (shp == "circle") {
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad);
        }
    } else if (pivot == "BR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.width + 2 * pad);
        }
    }
    box.addChild(shape);
    box.addChild(item);
    btn.addChild(box);

    btn.x = (x == "c") ? (gw * dpi - (bound.width + 2 * pad)) / 2 : x * dpi;
    btn.y = (y == "c") ? (gh * dpi - (bound.height + 2 * pad)) / 2 : y * dpi;
    btn.visible = show;
    container.addChild(btn);
    btn.addEventListener("click", function (e) { btnActions(e); });
    return btn;
}



function TextButton(id, container, shp, fillColor, borderColor, borderThickness, pivot, padding, arc, caption, gameFont, size, textColor, icon, scale, x, y, show) {
    var btn = new createjs.Container();
    var box = new createjs.Container();
    btn.mouseChildren = false;
    btn.id = btn.name = id;
    btn.uitype = "button";

    var item = new createjs.Container();
    var icon1 = new createjs.Bitmap(icon);
    var iconShadow = new createjs.Bitmap(icon);
    iconShadow.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    item.addChild(iconShadow, icon1);
    item.scale = scale;
    item.setBounds(0, 0, 45 * scale, 45 * scale);
    var bound = item.getBounds();


    if (caption) {
        var item1 = new createjs.Text();
        item1.font = size * dpi + "px " + gameFont;
        item1.textAlign = "center";
        item.x = -bound.width / 2;
        item1.y = 50;
        item1.color = textColor;
        item1.text = caption;
    }


    var shape = new createjs.Shape();
    var pad = padding;
    shape.graphics.beginFill(fillColor).drawCircle(0, 0, bound.width / 2);
    shape.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    shape.y = 25;
    box.addChild(item);
    box.addChild(item1);
    box.addChild(shape);
    btn.addChild(box);

    btn.x = (x == "c") ? (gw * dpi - (bound.width + 2 * pad)) / 2 : x;
    btn.y = (y == "c") ? (gh * dpi - (bound.height + 2 * pad)) / 2 : y;
    btn.visible = show;
    container.addChild(btn);
    btn.addEventListener("click", function (e) { btnActions(e); });
    return btn;
}
/*
===============================================================
Radio is a createjs componet function use to create radio buttons
===============================================================
*/
function Radio(id, container, pivot, label, opt, keys, selectedIndex, baseColor, strokeThickness, strokeColor, selectedColor, gameFont, color, scale = 1, x, y, show) {
    var rdoGrp = new createjs.Container();
    rdoGrp.opt = opt;
    rdoGrp.uitype = "radio";
    rdoGrp.name = rdoGrp.id = id;

    var txt = new createjs.Text();
    txt.text = label;
    txt.font = "20px " + gameFont;
    txt.color = color;
    rdoGrp.addChild(txt);
    var bound = txt.getBounds();
    for (var i = 0; i < opt.length; i++) {
        var rdo = new createjs.Container();
        rdo.uitype = "radioItem"
        rdo.id = rdo.name = opt[i];
        rdo.y = 15 + bound.height;  //x
        id = opt[i];
        rdoGrp.addChild(rdo);
        rdo.selectedIndex = i;
        rdo.selectedLabel = opt[i];
        rdo.lskey = keys[i];
        var dot = new createjs.Shape();
        dot.id = dot.name = 'dot';
        var r = 8
        dot.graphics.setStrokeStyle(strokeThickness).beginStroke(strokeColor).beginFill(baseColor).drawCircle(0, 0, r);
        dot.x = 10; // y
        rdo.addChild(dot);

        var dotSelected = new createjs.Shape();
        dotSelected.id = dotSelected.name = 'dotSelected';
        dotSelected.graphics.beginFill(selectedColor).drawCircle(0, 0, r / 2);
        dotSelected.x = 10; // y
        rdo.addChild(dotSelected);
        dotSelected.visible = false;
        if (i == selectedIndex) {
            rdoGrp.selectedIndex = selectedIndex
            rdoGrp.selectedLabel = opt[i];
            rdoGrp.lskey = keys[i];
            dotSelected.visible = true;
        }
        txt = new createjs.Text();
        txt.x = r + 15; // y
        txt.y = -6;
        txt.text = opt[i];
        txt.font = "14px " + gameFont;
        txt.color = color;
        rdo.addChild(txt);
        bound = rdo.getBounds();
        var rectangle = new createjs.Shape();
        rectangle.id = rectangle.name = "btnRadio";
        rectangle.graphics.beginFill("rgba(255,0,0,.5)").drawRect(0, 0, bound.width + 12 + r, bound.height);
        rectangle.y = dot.y - r; // x
        rectangle.x = bound.x;  // y
        rdo.hitArea = rectangle

        bound = rdoGrp.getBounds();
        rdo.mouseChildren = false;
        bound.width = bound.width + 5;
        rdo.addEventListener("click", function (e) {
            var radio = e.target;
            // if (e.target.id == "Classic") {
            //     updateRadio(screenSetup.getChildByName("setupBox").getChildByName("gameType"), 0);
            // } else if (e.target.id == "one-piece") {
            //     updateRadio(screenSetup.getChildByName("setupBox2").getChildByName("throw"), 1);
            // } else {
            // updateRadio(radio.parent, radio.selectedIndex);
            // }

            // if (e.target.id == "One piece at a time") {
            //     updateRadio(screenSetup.getChildByName("setupBox").getChildByName("gameType"), 1);
            //     settings.gameType = "position";
            // }
            updateRadio(radio.parent, radio.selectedIndex);
        });
    }
    container.addChild(rdoGrp);
    bound = rdoGrp.getBounds();
    rdoGrp.scale = scale * dpi;

    if (pivot == "TL") {
        rdoGrp.regX = 0;
        rdoGrp.regY = 0;
    } else if (pivot == "TC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = 0;
    } else if (pivot == "TR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = 0;
    } else if (pivot == "ML") {
        rdoGrp.regX = 0;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "MC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "MR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "BL") {
        rdoGrp.regX = 0;
        rdoGrp.regY = rdoGrp.getBounds().height;
    } else if (pivot == "BC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = rdoGrp.getBounds().height;
    } else if (pivot == "BR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = rdoGrp.getBounds().height;
    }
    bound = rdoGrp.getBounds();
    rdoGrp.x = (x == "c") ? (gw * dpi - dpi * bound.width * scale) / 2 : x;
    rdoGrp.y = (y == "c") ? (gh * dpi - bound.height * scale) / 2 : y;
    rdoGrp.visible = show;
    return rdoGrp;
}
/*
===============================================================
This function handle the update event once the user switch the 
option. 
===============================================================
*/
function updateRadio(rdoGrp, index) {
    for (i = 1; i < rdoGrp.numChildren; i++) {
        rdo = rdoGrp.getChildAt(i);
        var dotSelected = rdo.getChildByName("dotSelected");
        dotSelected.visible = false;
        if (i - 1 == index) {
            rdoGrp.selectedIndex = index;
            rdoGrp.selectedLabel = rdoGrp.opt[index];
            rdoGrp.lskey = rdo.lskey;// rdoGrp.opt[index]; // lskey[index]
            dotSelected.visible = true;
        }
    }
}
/*
===============================================================
addDOMText is a DOM componet function use to create text
===============================================================
*/
function addDOMText(divId, parentDivId, show, w, h, curve, x, y, bgcolor, bdrThickness, bdrStyle, bdrColor, txt, align, color, bold, size, fontFamily) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    (w != 0) ? (div.style.width = w + "px") : "";
    (h != 0) ? (div.style.height = h + "px") : "";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.top = ypos + "px";
    div.style.left = xpos + "px";
    div.style.textAlign = align;
    div.style.backgroundColor = bgcolor;
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";

    div.style.fontSize = "12px";
    div.style.margin = "0px";
    div.style.float = "left";
    div.style.overflowX = "hidden";
    div.style.overflowY = "hidden";
    div.style.color = color;
    div.style.position = "absolute";
    div.style.fontWeight = (bold) ? "bold" : "";
    div.style.fontSize = size + "px";
    div.style.align = "center";
    div.style.display = (show) ? "block" : "none";
    div.style.fontFamily = fontFamily;
    div.innerHTML = txt;
    document.getElementById(parentDivId).appendChild(div);
}
/*
===============================================================
addDOMButton is a DOM componet function use to create button
===============================================================
*/
function addDOMButton(divId, parentDivId, show, label, w, h, curve, bgcolor, tcolor, size, bold, x, y, bdrThickness, bdrStyle, bdrColor, bdrAlpha, shadow) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    div.style.width = w + "px";
    div.style.height = h + "px";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.left = xpos + "px";
    div.style.top = ypos + "px";
    div.style.background = bgcolor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";
    div.style.position = "absolute";
    div.style.float = "left";
    div.style.color = tcolor;
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.boxShadow = "0px 0px " + shadow + "px #000000";
    div.style.position = "absolute";
    div.style.fontSize = size + "px";
    div.style.display = (show) ? "block" : "none";
    div.style.fontWeight = (bold) ? "bold" : "";
    div.style.fontFamily = "Arial, Geneva, sans-serif";
    div.style.textAlign = "center";
    var txtDiv = window.document.createElement('div');
    txtDiv.setAttribute('id', divId);
    txtDiv.style.cursor = 'pointer';
    txtDiv.innerHTML = label;
    if (parentDivId == "body") {
        window.document.body.appendChild(div);
    } else {
        document.getElementById(parentDivId).appendChild(div);
    }
    div.appendChild(txtDiv);
    div.onclick = btnActions;
    txtDiv.style.padding = (parseInt(div.offsetHeight) - parseInt(txtDiv.offsetHeight)) / 2 + "px";
}
/*
===============================================================
List is a DOM componet function use to create List
===============================================================
*/
function List(screenId, listId, title, backButtonId, backBtn) {
    var div = Div(screenId, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0.5)");
    addDiv(screenId + "Frame", screenId, true, "100%", "100%", 0, "rgba(65,0,0,1)", "0%", "0%", 0, "solid", "rgba(0,0,0,0)", 10, "visible");
    var frame = document.getElementById(screenId + "Frame");
    frame.style.textAlign = "left"; // satya
    frame.style.color = "#ffffff";
    var fontsize = (device == "smart") ? 10 * dpi : 30;
    frame.style.font = fontsize + "px " + gameFont;
    // frame.style.fontWeight = "bold";
    frame.style.padding = "23px 0 0 90px";
    frame.style.boxSizing = "border-box";
    frame.innerHTML = title;
    addDiv(listId, screenId + "Frame", true, "calc(100% - 70px)", "calc(100% - 125px)", 0, "rgba(65,0,0,1)", "70px", "101px", 0, "solid", "rgba(0,0,0,0)", 0, "auto");

    // addImage(backButtonId, screenId, true, .5, 0, "assets/images/back.svg", " ", "1%", "25px", false, 10);
    addImage(backBtn, screenId, true, 1, 0, "assets/images/dialog_back.png", " ", (window.innerWidth - 76) + "px", "25px", false, 10);

    document.body.appendChild(div);
    div.style.display = "none";
    return div;
}

function updateDifficultyModal(listId, items) {
    // items = items.reverse();
    var levelText = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard", "Expert"];

    var itemToPick = 0, setsArray = [], setsArrayIndex = [];
    var str = "";
    var diffs = document.getElementById("footer");
    var pickedItemsIndex = [0, 0, 0, 0, 0, items.length - 1];//[items[0],0,0,0,0,items[items.length-1]];
    var pickedItems = [items[0], 0, 0, 0, 0, items[items.length - 1]];
    var tempArr = [];
    var tempArrIndex = [];
    if (items.length > 6) {
        var numOfitemsinSet = Math.floor((items.length - 2) / 4);
        index = 1;

        for (var i = 0; i < 4; i++) {
            tempArr = [];
            tempArrIndex = [];
            for (var j = 0; j < numOfitemsinSet; j++) {
                if (index < items.length - 1) {
                    tempArr.push(items[index]);
                    tempArrIndex.push(index);
                    index++;
                }
            }
            setsArray.push(tempArr);
            setsArrayIndex.push(tempArrIndex);
        }


        if (setsArray[0].length == 2) {
            itemToPick = 1;
        } else if (setsArray[0].length == 3) {
            itemToPick = 1;
        } else if (setsArray[0].length == 4) {
            itemToPick = 2;
        } else if (setsArray[0].length == 5) {
            itemToPick = 2;
        } else if (setsArray[0].length == 6) {
            itemToPick = 3;
        }
        pickedItems[1] = setsArray[0][itemToPick];
        pickedItems[2] = setsArray[1][itemToPick];
        pickedItems[3] = setsArray[2][itemToPick];
        pickedItems[4] = setsArray[3][itemToPick];

        pickedItemsIndex[1] = setsArrayIndex[0][itemToPick];
        pickedItemsIndex[2] = setsArrayIndex[1][itemToPick];
        pickedItemsIndex[3] = setsArrayIndex[2][itemToPick];
        pickedItemsIndex[4] = setsArrayIndex[3][itemToPick];

        for (var p = 0; p < 6; p++) {
            str += "<div class='dif' id='" + pickedItemsIndex[p] + "' onclick=listActions(['" + listId + "',this.id])><img src='./assets/images/piece_level_" + (p + 1) + ".png'/><span class='num'>" + pickedItems[p] + "</span><br/>Pieces<br/><span class='txt'>" + levelText[p] + "</span></div>";
        }
    } else {
        for (var p = 0; p < 6; p++) {
            if (items[p] >= 0) {
                str += "<div class='dif' id='" + p + "' onclick=listActions(['" + listId + "',this.id])><img src='./assets/images/piece_level_" + (p + 1) + ".png'/><span class='num'>" + items[p] + "</span><br/>Pieces<br/><span class='txt'>" + levelText[p] + "</span></div>";
            } else {
                str += "<div class='dif'>&nbsp;</div>";
            }
        }
    }



    diffs.innerHTML = str;
}
/*
===============================================================
populateList is used to populate list component  =====  for Category
===============================================================
*/
function populateList(listId, items, json) {
    // items is the keys in JSON data
    var list = document.getElementById(listId);
    var str = "<ul>";
    for (var i = 0; i < items.length; i++) {
        if (json[items[i]]) {
            var p = items[i];
            var categoryImg = json[items[i]].file;
            var src = "assets/puzzle/" + p.toLowerCase() + "/" + categoryImg;
            if (p == "in-progress" || p == "completed") {
                var firstItemImg = getLatestImgFromLS(p);
                if (firstItemImg !== null) {
                    firstItemImg = firstItemImg.split("large").join("thumbnails");
                    src = firstItemImg;
                }
            }
            var displayName = json[items[i]].name.split("-").join(" ");
            str += "<li id='" + i + "' onclick=listActions(['" + listId + "','" + json[p].name + "','" + p + "','" + displayName.split(" ").join("-") + "'])><div class='img'><img src='" + src + "'/></div><div class='caption'>" + displayName + "</div></li>";
            if (i == 2) {
                str += "<br/>";
            }
        } else {
            str += "<li class='list' style='cursor:pointer;' id='" + i + "' onclick=listActions(['" + listId + "',this.id]);>" + items[i] + "</li>";
        }
    }
    str += "</ul>";
    list.innerHTML = str;
}

function getLatestImgFromLS(p) {
    var completedFlag = null;
    var items = [];
    for (i = 0; i < window.localStorage.length; i++) {
        key1 = window.localStorage.key(i);
        if (key1.indexOf("treecardgames.jigsaw.games.") == 0) {
            if (key1 !== commonKey) {
                // key = key1;
                var gridObj = { date: "", file: "" };
                var lsg = JSON.parse(window.localStorage.getItem(key1));
                if (p == "in-progress") {
                    completedFlag = !lsg.lsData.completed;
                } else if (p == "completed") {
                    completedFlag = lsg.lsData.completed;
                }
                if (completedFlag) {
                    gridObj.file = lsg.settings.pic;
                    gridObj.date = lsg.lsData.date;
                    items.push(gridObj);
                }
            }
        }
    }
    if (items.length > 0) {
        items.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        return items[0].file;
    } else {
        return null;
    }
}
/*
===============================================================
Grid is a DOM componet function use to create Grid
===============================================================
*/
function Grid(screenId, gridId, title, backButtonId, backBtn) {
    var div = Div(screenId, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,.5)");
    addDiv(screenId + "Frame", screenId, true, "100%", "100%", 0, "rgba(65,0,0,1)", "0%", "0%", 0, "solid", "rgba(0,0,0,0)", 10, "visible");
    var frame = document.getElementById(screenId + "Frame");
    frame.style.textAlign = "left"; // satya
    frame.style.color = "#ffffff";
    var fontsize = (device == "smart") ? 10 * dpi : 30;
    frame.style.font = fontsize + "px " + gameFont;
    // frame.style.fontWeight = "bold";
    frame.style.padding = "23px 0 0 90px";
    frame.style.boxSizing = "border-box";
    frame.innerHTML = title;
    addDiv(gridId, screenId + "Frame", true, "calc(100% - 70px)", "calc(100% - 125px)", 0, "rgba(65,0,0,1)", "70px", "101px", 0, "solid", "rgba(0,0,0,0)", 0, "auto");

    // addImage(backButtonId, screenId, true, .5, 0, "assets/images/back.svg", " ", "1%", "25px", false, 10);

    addImage(backBtn, screenId, true, 1, 0, "assets/images/dialog_back.png", " ", (window.innerWidth - 76) + "px", "25px", false, 10);

    document.body.appendChild(div);
    div.style.display = "none";
    return div;
}
/*
===============================================================
populateGrid is used to populate grid component ==== for inside gallery
===============================================================
*/
function populateGrid(gridId, items, category) {
    var grid = document.getElementById(gridId);
    var str = "<div class='wrap'>"; // for inside gallery
    if (category === "customized") {
        items.subs = [];
        items.subs[0] = {
            "name": "New Puzzle",
            "file": "new_customized.png"
        }; // add the 0th item to default
        for (i = 0; i < window.localStorage.length; i++) {
            key1 = window.localStorage.key(i);
            if (key1.indexOf("treecardgames.jigsaw.games.") == 0) {
                if (key1 !== commonKey) {
                    // key = key1;
                    var gridObj = { name: "", file: "" };
                    var lsg = JSON.parse(window.localStorage.getItem(key1));
                    if (lsg.settings.folderIndex === "customized") {
                        gridObj.name = lsg.lsData.name;
                        gridObj.file = lsg.settings.pic;
                        gridObj.key = key1;
                        gridObj.date = lsg.lsData.date;
                        gridObj.category = lsg.settings.folderIndex;
                        items.subs.push(gridObj);
                    }
                }
            }
        }
    } else if (category === "in-progress") {
        items.subs = [];
        for (i = 0; i < window.localStorage.length; i++) {
            key1 = window.localStorage.key(i);
            if (key1.indexOf("treecardgames.jigsaw.games.") == 0) {
                if (key1 !== commonKey) {
                    // key = key1;
                    var gridObj = { name: "", file: "" };
                    var lsg = JSON.parse(window.localStorage.getItem(key1));
                    if (!lsg.lsData.completed) {
                        gridObj.name = lsg.lsData.name;
                        gridObj.file = lsg.settings.pic;
                        gridObj.key = key1;
                        gridObj.date = lsg.lsData.date;
                        gridObj.category = lsg.settings.folderIndex;
                        items.subs.push(gridObj);
                    }
                }
            }
        }
        items.subs.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    } else if (category === "completed") {
        items.subs = [];
        for (i = 0; i < window.localStorage.length; i++) {
            key1 = window.localStorage.key(i);
            if (key1.indexOf("treecardgames.jigsaw.games.") == 0) {
                if (key1 !== commonKey) {
                    // key = key1;
                    var gridObj = { name: "", file: "" };
                    var lsg = JSON.parse(window.localStorage.getItem(key1));
                    if (lsg.lsData.completed) {
                        gridObj.name = lsg.lsData.name;
                        gridObj.file = lsg.settings.pic;
                        gridObj.key = key1;
                        gridObj.date = lsg.lsData.date;
                        gridObj.category = lsg.settings.folderIndex;
                        items.subs.push(gridObj);
                    }
                }
            }
        }
        items.subs.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    }
    if (items.subs) {
        for (var i = 0; i < items.subs.length; i++) {
            str += "<div class='box'>";
            str += "<div class='boxInner'><div class='img'>";
            var src = "assets/puzzle/" + category + "/thumbnails/" + items.subs[i].file;
            if (category == "in-progress" || category == "completed") {
                // category = items.subs[i].category;
                src = items.subs[i].file.split("large").join("thumbnails");
            }

            if (category == "customized") {
                if (i === 0) {
                    str += "<img id='" + items.subs[i].name + "' onclick=viewFileSelect(); src='" + src + "'/><br/>";
                } else {
                    str += "<img id='" + items.subs[i].name + "' onclick=gridActions(['" + gridId + "',this.id,'" + category + "','" + items.subs[i].key + "','" + items.subs[i].name.split(" ").join("-") + "','" + items.subs[i].file + "']); src='" + items.subs[i].file + "'/><br/>";
                }
            } else {
                str += "<img id='" + items.subs[i].file + "' onclick=gridActions(['" + gridId + "',this.id,'" + category + "','" + items.subs[i].key + "','" + items.subs[i].name.split(" ").join("-") + "','" + items.subs[i].file + "']); src='" + src + "'/><br/>";
            }
            str += "</div><div class='caption'>";
            str += items.subs[i].name.split("-").join(" ");
            str += "</div></div>";
            str += "</div>";
        }
    }
    str += "</div>";
    grid.innerHTML = str;
}


function populateDifficulty(id, img) {
    var dmodal = document.getElementById(id);
    if (!dmodal) {
        difficultyModal = Div(id, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(65, 0, 0, 1)");
    }
    difficultyModal.style.display = "block";

    var source = '';
    if(typeof img === 'string') {
        source = img;
    } else {
        source = img.src;
    }
    var str = "<div class='difficulty'><div class='head'>Select Difficulty<img id='btnExitDiff' src='assets/images/close.svg' style='position: absolute;transform: scale(0.5);right: 1%;top: 4px;'></div>";
    str += "<div id='imgHolder'><img src='" + source + "' width='750'/></div>";
    str += "<div id='footer'></div>";
    str += "</div>";
    difficultyModal.innerHTML = str;
    document.querySelector("#btnExitDiff").addEventListener("click", function (e) {
        difficultyModal.style.display = "none";
        screenGallery.style.display = "block";
    })
}

function populateCNameModal(id, img) {
    var dmodal = document.getElementById(id);
    if (!dmodal) {
        cNameContainer = Div(id, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(65,0,0,1)");
    }
    cNameContainer.style.display = "block";
    var str = "<div class='difficulty'>";
    str += "<div id='imgHolder'><img src='" + img + "' width='750'/></div>";
    str += "<div id='cfooter'><span>Puzzle name</span><span><input id='inputName' type='text'/></span><div class='buttons'><span class='button' id='cOkBtn' type='button'>OK</span><span class='button' id='cCancelBtn' type='button'>Cancel</span></div></div>";
    str += "</div>";
    cNameContainer.innerHTML = str;
    document.querySelector("#cOkBtn").addEventListener("click", function (e) {
        var inputName = document.querySelector("#inputName").value;
        if (inputName.length > 0) {
            cNameContainer.style.display = "none";
            // set the puzzle name
            lsData.name = inputName;
            selectDificulty(img);
        }
    })
    document.querySelector("#cCancelBtn").addEventListener("click", function (e) {
        cNameContainer.style.display = "none";
        screenGallery.style.display = "block";
    })

}
/*
===============================================================
addImage is a DOM componet function use to add image
===============================================================
*/
function addImage(divId, parentDivId, show, s, curve, urlImage, imgLink, x, y, showBorder, shadow) {
    var pid = document.getElementById(parentDivId);
    var img = window.document.createElement('img');
    img.setAttribute('id', divId);
    img.src = urlImage;
    img.style.position = "absolute";
    img.style.transform = "scale(" + s + ")";
    img.style.right = x; // + "px";
    img.style.top = y; // + "px";
    img.onclick = btnActions;
    document.getElementById(parentDivId).appendChild(img);
    return img;
}
/*
===============================================================
addDiv is a DOM componet function use to add div
===============================================================
*/
function addDiv(divId, parentDivId, show, w, h, curve, bgcolor, x, y, bdrThickness, bdrStyle, bdrColor, shadow, overflow) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    div.style.width = w; //w + "px";
    div.style.height = h; //h + "px";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.left = x; //xpos + "px";
    div.style.top = y; //ypos + "px";
    div.style.margin = "0px";
    // div.style.boxShadow = "0px 0px " + shadow + "px rgba(0,0,0,0.25)";
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.background = bgcolor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";
    div.style.boxSizing = "border-box";
    // div.style.overflowY = "auto"; // check this
    div.style.overflow = overflow ? overflow : "visible"; // check this
    div.style.position = "absolute";
    div.style.display = (show) ? "block" : "none";
    if (parentDivId == "body") {
        window.document.body.appendChild(div);
    } else {
        document.getElementById(parentDivId).appendChild(div);
    }
    return div;
}
/*
===============================================================
This function is simply an ulternate for console.log
===============================================================
*/
function trace(msg) {
    console.log(msg);
}