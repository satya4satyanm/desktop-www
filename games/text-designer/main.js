var game;
window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 640,
        height: 240,
        parent: 'phaser-game',
        backgroundColor:0xffffff,
        scene: [SceneMain]
    };
    game = new Phaser.Game(config);
}

