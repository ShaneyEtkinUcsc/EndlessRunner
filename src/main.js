/*
Name: Shaney Etkin
Game title: Dart Throw
Approx. hrs: ~28 :(
Creative tilt justification:
 - I'm not sure if I did anything necessarily new technically,
 but I tried to make it so that the platforms and balls would
 speed up as time went on.
 - I really like my pixelart for this game. I experimented with 
 new blending techniques on the background and the platform, and 
 i created multiple animations for the ball, although i didn't end 
 up using the second one.
*/

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