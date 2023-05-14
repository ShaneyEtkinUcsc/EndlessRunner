let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT, keyUP, keyDOWN;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// define globals
let level;
let centerX = game.config.width/2;
let centerY = game.config.height/2;