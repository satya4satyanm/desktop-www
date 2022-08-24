class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload() {}
    create() {
        console.log(game);
        this.showStroke = false;
        this.showShadow = false;
        //
        //
        this.textColor = 'black';
        this.stextColor = 'black';
        this.shadowColor = 'black';

        this.font = 'Fresca';
        this.fontSize = 22;
        this.strokeSize = 1;
        this.shadowSize = 1;
        this.shadowFill = true;
        this.shadowStroke = false;
        //
        //
        this.back = this.add.graphics();
        this.back.lineStyle(2, '0x000000', 2);
        this.back.strokeRect(0, 0, game.config.width, game.config.height);
        //
        //
        this.makeText();
        var cp = document.getElementById('colorPicker');
        cp.addEventListener("change", this.watchColorPicker.bind(this), false);
        var fontSelect = document.getElementById('fonts');
        var cb = document.getElementById('checkBox');
        fontSelect.addEventListener('change', this.changeFont.bind(this), false);
        cb.addEventListener('change', this.changeStroke.bind(this), false);
        var cp2 = document.getElementById('colorPicker2');
        cp2.addEventListener("change", this.watchColorPicker2.bind(this), false);
        //
        //
        var fontSizeSelect = document.getElementById('fontSize');
        fontSizeSelect.addEventListener('change', this.changeFontSize.bind(this), false);
        var strokeSizeSelect = document.getElementById('strokeSize');
        strokeSizeSelect.addEventListener('change', this.changeStrokeSize.bind(this), false);
        //
        //
        var cb2 = document.getElementById('checkBox2');
        cb2.addEventListener('change', this.changeShadow.bind(this), false);
        //
        //
        var shadowSizeSelect = document.getElementById('shadowSize');
        shadowSizeSelect.addEventListener('change', this.changeShadowSize.bind(this), false);
        //
        //
        var cp2 = document.getElementById('colorPicker3');
        cp2.addEventListener("change", this.watchColorPicker3.bind(this), false);
        var fillOptSelect = document.getElementById('fillOptions');
        fillOptSelect.addEventListener('change', this.changeFillOption.bind(this), false);
    }
    changeFillOption(event) {
        this.fillOptions = parseInt(event.target.value);
        switch(this.fillOptions)
        {
            case 1:
            this.shadowFill=true;
            this.shadowStroke=false;
            break;

            case 2:
             this.shadowFill=false;
            this.shadowStroke=true;
            break;

            case 3:
             this.shadowFill=true;
            this.shadowStroke=true;
            break;
        }
        this.makeText();
    }
    changeShadowSize(event) {
        this.shadowSize = parseInt(event.target.value);
        this.makeText();
    }
    changeStrokeSize(event) {
        this.strokeSize = parseInt(event.target.value);
        this.makeText();
    }
    changeShadow() {
        this.showShadow = !this.showShadow;
        console.log(this.showShadow);
        this.makeText();
    }
    changeStroke() {
        this.showStroke = !this.showStroke;
        this.makeText();
    }
    changeFontSize(event) {
        this.fontSize = event.target.value;
        this.makeText();
    }
    makeText() {
        var textConfig = {
            fontFamily: this.font,
            fontSize: this.fontSize + "px",
            color: this.textColor
        };
        if (this.text1) {
            this.text1.destroy();
        }
        this.text1 = this.add.text(game.config.width / 2, game.config.height / 2, "HELLO!", textConfig);
        this.text1.setOrigin(0.5, 0.5);
        if (this.showStroke == true) {
            console.log(this.strokeSize);
            console.log(this.stextColor);
            this.text1.setStroke(this.stextColor, this.strokeSize);
        }
        if (this.showShadow == true) {
            this.text1.setShadow(2, 2, this.shadowColor, this.shadowSize, this.shadowStroke, this.shadowFill);
        }
        //
        var output = document.getElementById('output');
        console.log(output);
        var textString = "var textConfig={fontFamily:" + this.font + ",\nfontSize:" + this.fontSize + "px,\ncolor:'" + this.textColor + "'}";
        textString+="\nthis.text1=this.add.text(x,y,'Hello!',textConfig);";

        if (this.showStroke == true) {
            textString += "\nthis.text1.setStroke('" + this.stextColor + "'," + this.strokeSize + ");";
        }
        if (this.showShadow == true) {
            textString += "\nthis.text1.setShadow(2,2,'" + this.shadowColor + "'," + this.shadowSize + ","+this.shadowStroke+","+this.shadowFill+");";
        }
        output.value = textString;
    }
    watchColorPicker(event) {
        this.textColor = event.target.value.toString(16);
        this.makeText();
    }
    watchColorPicker2(event) {
        this.stextColor = event.target.value.toString(16);
        this.makeText();
    }
    watchColorPicker3(event) {
        this.shadowColor = event.target.value.toString(16);
        this.makeText();
    }
    changeFont(event) {
        this.font = event.target.value;
        this.makeText();
    }
    dump(obj) {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }
        return out;
    }
    update() {}
}