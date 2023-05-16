/*
Name: Shaney Etkin
Game title: Dart Throw
Approx. hrs: ~32 :(
Creative tilt justification:
 - TECHNICAL ASPECT: I tried to make it so that the platforms and balls would
 spawn at random y coordinates using math.between(0, game height). 
 I also have two different enemy sprites - one collision kills you 
 whereas the other increases your score. To acheive the score 
 increase, I had to figure out how to check each individual
 child's collision rather than checking the entire group.
 //https://stackoverflow.com/questions/56082396/how-to-get-a-single-member-from-a-group-in-phaser-3
 ^ this chain was super helpful in figuring that out!!

 - CREATIVE ASPECT: I really like my pixelart for this game. I experimented with 
 new blending techniques on the background and the platform, and 
 i created multiple animations for the ball, although i didn't end 
 up using the second one.

//https://phaser.discourse.group/t/random-spawning/3318
//https://www.html5gamedevs.com/topic/21724-spawning-enemies-at-random-period/ - didn't end up using this
//https://www.thepolyglotdeveloper.com/2020/08/handle-collisions-between-sprites-phaser-arcade-physics/
//https://www.joshmorony.com/phaser-fundamentals-handling-collisions/
//https://phaser.discourse.group/t/how-to-spawn-enemies-in-waves/6054
^ mostly trying to understand arcade physics, as well as random spawning using phaser.math functions
^ also referenced nAltice paddle runner!
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Play, End ]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// define globals
let p1Dart = null;
let level;
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let cursors;
const dartVelocity = 50;