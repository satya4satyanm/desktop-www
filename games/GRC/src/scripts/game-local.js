import 'phaser'
var config = {
     type: Phaser.WEBGL,
     width: 800,
     height: 530,
     backgroundColor: '#000000',
     parent: 'game',
     dom: {
          createContainer: true
     },
     scene: {
          preload,
          create
     }
};
var game = new Phaser.Game(config);
function preload() {
     this.load.path = './assets/';
     this.load.multiatlas('sprites', 'spritesheet.json');
     this.load.image('bg', 'tr.png');
     this.load.image('spark0', 's1.png');
     this.load.image('spark1', 's2.png');
     this.load.image('blue', 'blue.png');
     this.load.image('pix', '1px.png');
     this.load.image('popup', 'popup.png');
     this.load.audio('winSound', [
          'sounds/5win.mp3'
     ]);
     this.load.html('nameform', '../loginform.html');
}

function create() {
     var initialMoney = 1000000;
     var coins = [];
     var selectedCoin = 'c5';
     var prevCoin = null;
     var _this = this;
     var winSound = this.sound.add('winSound', {
          volume: 0.1
     });
     var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setInteractive();
     
     var pix1 = this.add.image(287, 93, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p1');
     var pix2 = this.add.image(347, 93, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p2');
     var pix3 = this.add.image(287, 137, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p3');
     var pix4 = this.add.image(347, 137, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p4');
     var pix5 = this.add.image(287, 181, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p5');
     var pix6 = this.add.image(347, 181, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p6');
     var pix7 = this.add.image(287, 223, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p7');
     var pix8 = this.add.image(347, 223, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p8');
     var pix9 = this.add.image(287, 267, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p9');
     var pix10 = this.add.image(347, 267, 'pix').setScale(30).setAlpha(0.1).setInteractive().setName('p10');
     var setSelectedCoin = function (coin) {
          selectedCoin = coin.name;
          if (prevCoin !== null) prevCoin.y += 10;
          coin.y -= 10;
          prevCoin = coin;
     };
     var c5 = this.add.image(263, 350, 'sprites', '5.png').setInteractive().setName('c5');
     c5.on('pointerup', function () { setSelectedCoin(this); });
     var c10 = this.add.image(332, 350, 'sprites', '10.png').setInteractive().setName('c10');
     c10.on('pointerup', function () { setSelectedCoin(this); });
     var c20 = this.add.image(400, 350, 'sprites', '20.png').setInteractive().setName('c20');
     c20.on('pointerup', function () { setSelectedCoin(this); });
     var c25 = this.add.image(296, 404, 'sprites', '25.png').setInteractive().setName('c25');
     c25.on('pointerup', function () { setSelectedCoin(this); });
     var c50 = this.add.image(367, 404, 'sprites', '50.png').setInteractive().setName('c50');
     c50.on('pointerup', function () { setSelectedCoin(this); });

     var spin = this.add.image(468, 502, 'sprites', 'spin.png').setInteractive();
     var rebet = this.add.image(564, 502, 'sprites', 'rebet.png').setInteractive();
     var clear = this.add.image(660, 500, 'sprites', 'clear.png').setInteractive();
     var music = this.add.image(742, 502, 'sprites', 'music.png').setInteractive();
     var bar = this.add.image(758, 463, 'sprites', 'bar.png').setInteractive().setOrigin(0.5, 1);
     var applyCurrencyFormat = function () {
          return initialMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     }
     var applyCurrencyFormatAmt = function (amt) {
          return "$"+amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     }
     var totalBetAmount = 0;
     var addedChipCount = 0;
     var addCoin = function (place) {
          if(totalBetAmount < 150000 && addedChipCount < 5) {
               if (!place.name) place = _this.children.getByName(place);
               initialMoney -= Number(selectedCoin.substr(1)) * 1000;
               totalBetAmount += Number(selectedCoin.substr(1)) * 1000;
               addedChipCount++;
               if(Number(selectedCoin.substr(1)) == 50) {
                    textMsg.setText("You are in for JACKPOT!");
               }
               balanceCoins.setText(applyCurrencyFormat());
               var coin = _this.add.image(place.x, place.y, 'sprites', selectedCoin.substr(1) + ".png").setScale(0.8).setInteractive();
               coin.place = place.name;
               coin.name = selectedCoin;
               coins.push(coin);
               readyForNextSpin = true;
          }
     }
     pix1.on('pointerup', function () { addCoin(this) });
     pix2.on('pointerup', function () { addCoin(this) });
     pix3.on('pointerup', function () { addCoin(this) });
     pix4.on('pointerup', function () { addCoin(this) });
     pix5.on('pointerup', function () { addCoin(this) });
     pix6.on('pointerup', function () { addCoin(this) });
     pix7.on('pointerup', function () { addCoin(this) });
     pix8.on('pointerup', function () { addCoin(this) });
     pix9.on('pointerup', function () { addCoin(this) });
     pix10.on('pointerup', function () { addCoin(this) });


     var emitter0 = this.add.particles('spark0').createEmitter({
          x: 400,
          y: 300,
          speed: { min: -100, max: 100 },
          angle: { min: 0, max: 360 },
          rotate: { start: 0, end: 360 },
          scale: { start: 0.1, end: 0.4 },
          alpha: { start: 0, end: 0.8 },
          lifespan: 7000,
          gravityY: 0
     });

     var emitter1 = this.add.particles('spark1').createEmitter({
          x: 400,
          y: 300,
          speed: { min: -100, max: 100 },
          angle: { min: 0, max: 360 },
          rotate: { start: 0, end: 360 },
          scale: { start: 0.2, end: 0.5 },
          alpha: { start: 0, end: 0.8 },
          lifespan: 7000,
          gravityY: 0
     });

     var fireworks = this.add.particles('spark0').createEmitter({
          x: 400,
          y: 200,
          speed: { min: -800, max: 800 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.5, end: 0.2 },
          blendMode: 'SCREEN',
          lifespan: 600,
          gravityY: 800,
          quantity: 700
     });
     fireworks.stop();


     this.input.on('pointermove', function (pointer) {
          emitter0.setPosition(pointer.x, pointer.y);
          emitter1.setPosition(pointer.x, pointer.y);
          emitter0.explode();
          emitter1.explode();
     });

     var path = new Phaser.Curves.Path(774, 99).circleTo(40);
     var preloader = this.add.particles('blue');
     preloader.createEmitter({
          scale: { start: 0.15, end: 0 },
          blendMode: 'ADD',
          emitZone: { type: 'edge', source: path, quantity: 48, yoyo: false }
     });


     var wpath = new Phaser.Curves.Path(698, 252).circleTo(120);
     var wstars = this.add.particles('blue');
     var wEmitter = wstars.createEmitter({
          speed: { min: -70, max: 70 },
          angle: { min: 0, max: 360 },
          rotate: { start: 0, end: 360 },
          scale: { start: 0.2, end: 0.5 },
          alpha: { start: 1, end: 0.2 },
          blendMode: 'ADD',
          quantity: 3,
          lifespan: 1000,
          emitZone: { type: 'edge', source: wpath, quantity: 48, yoyo: false }
     });
     wEmitter.stop();


     var image = this.add.image(578, 252, 'sprites', 'wheel.png');
     var pin = this.add.image(580, 252, 'sprites', 'jewel.png').setInteractive();
     var numOfParts = 10;
     var num = (360 / numOfParts) * Math.PI / 180; //0.7853981
     var items = ["empty", 150, 100, 200, "empty", 500, 50, "key"];
     items = [1, 10, 9, 8, 7, 6, 5, 4, 3, 2];
     var balanceCoins = this.add.text(635, -2, applyCurrencyFormat(), { fontFamily: "Arial Black", fontSize: 17, color: "#ffffff", padding: 16 });
     balanceCoins.setStroke('#de77ae', 2);

     var textMsg = this.add.text(30, 482, "Welcome Pal!", { fontFamily: "Arial", fontSize: 18, color: "#ffffff", padding: 16 });
     textMsg.setStroke('#000000', 2);

     var rotation1 = 80;
     var prevRndNum = 1;
     var readyForNextSpin = false;
     var spinning = false;

     bg.on('pointerup', function (p) {
          console.log(p.x, p.y);
     });
     var winCoin = null;
     
     var popup = this.add.image(400, 240, 'popup').setInteractive();
     popup.setVisible(false);
     popup.on("pointerup", function() {
          popup.setVisible(false);
          jackpot.setVisible(false);
     })
     var ppt = this.add.image(735, 100, 'pix').setScale(60).setAlpha(0.05).setInteractive();
     ppt.on("pointerup", function() {
          popup.setVisible(true);
          jackpot.setVisible(true);
     })

     var jackpot = this.add.text(400, 310, '').setFont('60px Arial').setColor('#ffff00').setFontStyle('bold');
     jackpot.setOrigin(0.5);
     jackpot.setStroke('rgba(f,f,f,0.5)', 8);
     jackpot.setShadow(2, 2, "#7b3f00", 4, true, true);
     jackpot.setTint(0xffdf77, 0xFF00FF, 0xffdf77);
     jackpot.setVisible(false);

     var tCoins = _this.add.container(image.x - 20, image.y - 20);
     var payWinValue = function () {
          tCoins.x = image.x - 20;
          tCoins.y = image.y - 20;

          for (var i = 0; i < 10; i++) {
               tCoins.add(_this.add.image(Math.random() * 40, Math.random() * 40, 'sprites', winCoin.name.substr(1) + '.png').setScale(0.6));
          }
          setTimeout(function () {
               _this.tweens.add({
                    targets: tCoins,
                    x: winCoin.x - 20,
                    y: winCoin.y - 20,
                    duration: 300,
                    ease: 'Linear',
                    easeParams: [1],
                    onComplete: function () {
                         // hide the winCoin
                         var pay = Number(winCoin.name.substr(1)) * 10;
                         winCoin.destroy();
                         winCoin = null;
                         
                         setTimeout(function () {
                              //individual move tween
                              var i = 0;
                              var l = tCoins.list.length;
                              var count = 0;
                              (function loop(p) {
                                   _this.tweens.add({
                                        targets: tCoins.list[p],
                                        x: balanceCoins.x - tCoins.x,
                                        y: balanceCoins.y - tCoins.y + 20,
                                        duration: 300,
                                        ease: 'Linear',
                                        callbackScope: tCoins.list[p],
                                        onComplete: function () {
                                             console.log("the coin ", this)
                                             count++;
                                             if (count == l) {
                                                  for (i = 0; i < l; i++) {
                                                       tCoins.list[0].destroy();
                                                  }
                                                  winSound.play();
                                                  fireworks.explode();
                                                  textMsg.setText("Big win");
                                                  setTimeout(function () {
                                                       fireworks.setPosition(Math.random() * 300 + 200, Math.random() * 100 + 150,);
                                                       fireworks.explode();
                                                  }, 100);
                                                  setTimeout(function () {
                                                       fireworks.setPosition(Math.random() * 300 + 200, Math.random() * 100 + 50,);
                                                       fireworks.explode();
                                                  }, 200);
                                                  setTimeout(function () {
                                                       fireworks.setPosition(Math.random() * 300 + 200, Math.random() * 100 + 50,);
                                                       fireworks.explode();
                                                       textMsg.setText("Place your bets");
                                                  }, 300);
                                                  initialMoney += pay * 1000;
                                                  balanceCoins.setText(applyCurrencyFormat());
                                                  coins = [];
                                             }
                                        }
                                   });
                                   if (i < l - 1) {
                                        i++;
                                        setTimeout(function () { loop(i) }, 50);
                                   }
                              })(i);
                         }, 200);
                    }
               });
          }, 500);
     }

     var winHistory = [];
     var removeCoins = function (val) {
          spinned = false;
          [...rebetObj] = coins;
          winCoin = coins.filter(function (coin, index) {
               if (coin.place === "p" + val) {
                    return coin;
               }
          });
          winCoin = winCoin[0];

          coins.map(function (coin) {
               if (coin.place !== "p" + val) {
                    _this.tweens.add({
                         targets: coin,
                         x: image.x,
                         y: image.y,
                         scale: 0.1,
                         duration: 300,
                         ease: 'Linear',
                         easeParams: [1],
                         onComplete: function () {
                              coin.destroy();
                              coin = null;
                         }
                    });
               }
          });
          if (winCoin) {
               setTimeout(function () {
                    payWinValue();
               }, 1200);
          } else {
               coins = [];
               textMsg.setText("Place your bets");
          }
          totalBetAmount = 0;
          addedChipCount = 0;
     }
     var container = this.add.container(125, 170);

     var showHistory = function (number) {
          var len = winHistory.length;
          container.list = [];
          setTimeout(() => {
               if (len > 7) {
                    winHistory.slice(Math.max(winHistory.length - 7, 0))
                    len = 7;
               } else {

                    _this.tweens.add({
                         targets: container.list[6],
                         scale: 0,
                         duration: 300,
                         ease: 'Linear'
                    });
               }
          }, 500)


          if (len > 7) {
               winHistory.slice(Math.max(winHistory.length - 7, 0))
               len = 7;
          }
          var newArray = winHistory.slice().reverse();
          var winLose = 'lose';
          for (var i = 0; i < len; i++) {
               var innerContainer = _this.add.container(0, 0);
               innerContainer.add(_this.add.image(-3, -5, 'sprites', 'historyitem.png'));

               winLose = newArray[i].betAmnt > 0 ? 'win.png' : 'lose.png';

               innerContainer.add(_this.add.image(63, -2, 'sprites', winLose).setScale(0.8));
               innerContainer.add(_this.add.text(-23, -12, newArray[i].num, { fontFamily: "Arial Black", fontSize: 12, color: "#c51b7d", padding: 0 }));

               innerContainer.add(_this.add.text(27, -12, newArray[i].betAmnt, { fontFamily: "Arial Black", fontSize: 12, color: "#c51b7d", padding: 0 }));
               innerContainer.y = i * 30;


               container.add(innerContainer);
          }
     }
     clear.on('pointerup', function () {
          this.setScale(1);
          if (!winCoin && !spinning) {
               // if spin did not happen, give the money back
               readyForNextSpin = false;
               coins.map(function (coin) {
                    if (!spinned) {
                         initialMoney += Number(coin.name.substr(1)) * 1000;
                         balanceCoins.setText(applyCurrencyFormat());
                    }
                    coin.destroy();
                    coin = null;
               });
               coins = [];
               if (winCoin) {
                    winCoin.destroy();
                    winCoin = null;
               }
               totalBetAmount = 0;
               addedChipCount = 0;
          }
     })
     spin.on('pointerdown', function () {
          this.setScale(0.88, 0.8);
     });
     rebet.on('pointerdown', function () {
          this.setScale(0.88, 0.8);
     });
     clear.on('pointerdown', function () {
          this.setScale(0.88, 0.8);
     });

     this.draggable1 = this.add.image(13, 57, 'sprites', 'win.png').setInteractive({ pixelPerfect: true, draggable: true });
     this.followers = [];
     for (var i = 0; i < 7; i++) {
          this.followers.push(this.add.image(this.draggable1.x, this.draggable1.y + (i + 1) * 30, 'sprites', 'lose.png'));
     }

     this.draggable2 = this.add.image(793, 57, 'sprites', 'win.png').setInteractive({ pixelPerfect: true, draggable: true });
     this.followers1 = [];
     for (var i = 0; i < 7; i++) {
          this.followers1.push(this.add.image(this.draggable2.x, this.draggable2.y + (i + 1) * 30, 'sprites', 'lose.png'));
     }
     var rebetObj = [];
     rebet.on('pointerup', function () {
          this.setScale(1);
          if (!winCoin && coins.length === 0) {
               for (var i = 0; i < rebetObj.length; i++) {
                    selectedCoin = rebetObj[i].name;
                    addCoin(rebetObj[i].place);
               }
          }
     });
     var spinned = false;
     spin.on('pointerup', function () {
          if (spinning === false && readyForNextSpin) {
               winCoin = null;
               spinned = true;
               // var xmlhttp = new XMLHttpRequest();
               // xmlhttp.open("POST", "http://localhost/Phaser3/Complete-Project/server/api/rnd.php", true);
               // var cs = coins.map(function(c){
               //      return {name:c.name,place:c.place}
               // })
               // var params = {
               //      "bets": cs,
               //      "balance": initialMoney,
               //      "game": "grc"
               // };
               var randNum = Math.ceil(Math.random() * numOfParts);
               var newBank = 1000000;
               jackpot.setText(applyCurrencyFormatAmt(newBank));
               var winCoinVal = coins.filter(function (item) {
                    return item.place == "p" + items[randNum - 1];
               });
               var histObj = { num: items[randNum - 1], betAmnt: winCoinVal.length > 0 ? winCoinVal[0].name.substr(1) : 0 };
               winHistory.push(histObj);
               var randNumDiff = randNum - prevRndNum;
               prevRndNum = randNum;
               rotation1 = image.rotation + (randNumDiff + 80) * num;
               wEmitter.start();
               readyForNextSpin = false;
               spinning = true;
               bar.scaleY = 1;
               _this.tweens.add({
                    targets: bar,
                    scaleY: 178,
                    duration: 6000,
                    ease: 'Linear'
               });
               textMsg.setText("Spinning the wheel");
               _this.tweens.add({
                    targets: image,
                    rotation: rotation1,
                    duration: 6000,
                    ease: 'Linear',
                    easeParams: [1],
                    onComplete: function () {
                         spinning = false;
                         wEmitter.stop();
                         // textMsg.setText("Winning number is : "+ items[randNum - 1]);
                         removeCoins(items[randNum - 1]);
                         showHistory(items[randNum - 1]);
                    }
               });



               // xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
               // // xmlhttp.setRequestHeader('Authorization', 'Bearer ' + jwt); // this wont work for cross domain requests
               // // if your server is in same domain and port, you can use this way of sending JWT. For which in PHP you should read the JWT from auth headers. Currently I am sending JWT to PHP in params as I am using a different port.
               // xmlhttp.onreadystatechange = function () {
               //      if (this.readyState == 4 && this.status == 200) {
               //           //var randNum = Math.ceil(Math.random() * numOfParts);
               //           // this above line can generate front end random number if you need it.
               //           var randNum = this.responseText.split(":")[0];
               //           var newBank = this.responseText.split(":")[1];
               //           jackpot.setText(applyCurrencyFormatAmt(newBank));
               //           var winCoinVal = coins.filter(function (item) {
               //                return item.place == "p" + items[randNum - 1];
               //           });
               //           var histObj = { num: items[randNum - 1], betAmnt: winCoinVal.length > 0 ? winCoinVal[0].name.substr(1) : 0 };
               //           winHistory.push(histObj);
               //           var randNumDiff = randNum - prevRndNum;
               //           prevRndNum = randNum;
               //           rotation1 = image.rotation + (randNumDiff + 80) * num;
               //           wEmitter.start();
               //           readyForNextSpin = false;
               //           spinning = true;
               //           bar.scaleY = 1;
               //           _this.tweens.add({
               //                targets: bar,
               //                scaleY: 178,
               //                duration: 6000,
               //                ease: 'Linear'
               //           });
               //           textMsg.setText("Spinning the wheel");
               //           _this.tweens.add({
               //                targets: image,
               //                rotation: rotation1,
               //                duration: 6000,
               //                ease: 'Linear',
               //                easeParams: [1],
               //                onComplete: function () {
               //                     spinning = false;
               //                     wEmitter.stop();
               //                     // textMsg.setText("Winning number is : "+ items[randNum - 1]);
               //                     removeCoins(items[randNum - 1]);
               //                     showHistory(items[randNum - 1]);
               //                }
               //           });
               //      }
               // };
               // xmlhttp.send(btoa(JSON.stringify(params))+"::"+jwt);

          }
          this.setScale(1);
     });

     var jwt = '';

     var textc = this.add.text(600, 8, 'Welcome Guest!', { color: 'black', fontFamily: 'Arial black', fontSize: '16px', align: 'right' }).setOrigin(1, 0);

     var disabled = this.add.image(0, 0, 'pix').setOrigin(0, 0).setScale(800, 600).setAlpha(0.01).setInteractive();
     var element = this.add.dom(400, 260).createFromCache('nameform').setInteractive();
     element.addListener('click');
     element.on('click', function (event) {
          if (event.target.name === 'loginButton') {
               var inputUsername = this.getChildByName('email');
               var inputPassword = this.getChildByName('password');
               if (inputUsername.value !== '' && inputPassword.value !== '') {
               var elem = this;
               // var xmlhttp = new XMLHttpRequest();
               // xmlhttp.open("POST", "http://localhost/Phaser3/Complete-Project/server/api/login.php", true);
               // var params = {
               //      "email": inputUsername.value,
               //      "password": inputPassword.value,
               //      "game": "grc"
               // };
               // xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
               // xmlhttp.onreadystatechange = function () {
               //      if (this.readyState == 4 && this.status == 200) {
               //           var re = JSON.parse(this.responseText);
               //           jwt = re.jwt;
               //           initialMoney = re.bal;
               //           jackpot.setText(applyCurrencyFormatAmt(re.bank));
               //           console.log(re.bank)
               //           balanceCoins.setText(applyCurrencyFormat());

                         elem.removeListener('click');
                         elem.scene.tweens.add({
                              targets: element, y: 700, duration: 300, ease: 'Power3',
                              onComplete: function () {
                                   element.setVisible(false);
                              }
                         });
                         disabled.setVisible(false);
               //           textc.setText('Welcome ' + re.email.split("@")[0] + "!");
                         
               //      }
               // };
               // xmlhttp.send(JSON.stringify(params));

                    
               }
          }
          if (event.target.name === 'registerButton') {
               var inputUsername = this.getChildByName('email');
               var inputPassword = this.getChildByName('password');
               if (inputUsername.value !== '' && inputPassword.value !== '') {
                    // var xmlhttp = new XMLHttpRequest();
                    // xmlhttp.open("POST", "http://localhost/Phaser3/Complete-Project/server/api/register.php", true);
                    // var params = {
                    //      "email": inputUsername.value,
                    //      "password": inputPassword.value
                    // };
                    // xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                    // xmlhttp.onreadystatechange = function () {
                    //      if (this.readyState == 4 && this.status == 200) {
                    //           alert("You are successfully registered! Please login!");
                    //      }
                    // };
                    // xmlhttp.send(JSON.stringify(params));
               }
          }
     });
}