class Menu extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('platform', './assets/platform.png');
        this.load.image('dart', './assets/dart.png');
        this.load.image('sunset', './assets/sunset.png');
        this.load.atlas('ball', './assets/ball.png', './assets/ball.json');
    }

    create() {
        //https://www.youtube.com/watch?v=ffemDAdJySU
        this.frameNames = this.textures.get('ball').getFrameNames();
        this.anims.create({
            key: 'bounce',
            frames: [
                {key: 'ball', frame: "ballbounce1.png" },
                {key: 'ball', frame: "ballbounce2.png" },
                {key: 'ball', frame: "ballbounce3.png" },
                {key: 'ball', frame: "ballbounce4.png" },
                {key: 'ball', frame: "ballbounce5.png" }
            ], 
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'pop',
            frames: [
                {key: 'ball', frame: "ballpop1.png" },
                {key: 'ball', frame: "ballpop2.png" },
                {key: 'ball', frame: "ballpop3.png" },
                {key: 'ball', frame: "ballpop4.png" },
                {key: 'ball', frame: "ballpop5.png" }
            ], 
            frameRate: 10,
            repeat: -1
        });
        
        // reset parameters
        this.barrierSpeed = -450;
        this.barrierSpeedMax = -1000;
        level = 0;

        // set up audio, play bgm
        this.bgm = this.sound.add('music', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        // set up player paddle (physics sprite) and set properties
        /* I WANT GRAVITY FOR MY PLAYER OBJECT - MAKE THIS CODE WORK FOR IT
        paddle = this.physics.add.sprite(32, centerY, 'paddle').setOrigin(0.5);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(0.5);
        paddle.setImmovable();
        paddle.setMaxVelocity(0, 600);
        paddle.setDragY(200);
        paddle.setDepth(1);             // ensures that paddle z-depth remains above shadow paddles
        paddle.destroyed = false;       // custom property to track paddle life
        paddle.setBlendMode('SCREEN');  // set a WebGL blend mode
        */

        /* ALL OF THIS FOR MY PLATFORMS - 
        // FIGURE OUT HOW TO SPAWN PLATFORM TEXTURE AND MAKE THEM BOUNCY RATHER THAN KILLY
        // set up barrier group
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        // wait a few seconds before spawning barriers
        this.time.delayedCall(2500, () => { 
            this.addPlatform(); 
        });

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });
        */

        // set up cursor keys
        //cursors = this.input.keyboard.createCursorKeys();
    }

    // create new barriers and add them to existing barrier group
    // EDIT TO ADD PLATFORMS USING PLATFORM IMAGE
    addPlatform() { //LOOK BACK AT CREATING SPACESHIPS - MAYBE JUST DO THIS INSTEAD AND RANDOMIZE SPEED AND POSITION
        let speedVariance =  Phaser.Math.Between(0, 50);
        let barrier = new Barrier(this, this.barrierSpeed - speedVariance);
        this.barrierGroup.add(barrier);
    }

    update() {
        // make sure paddle is still alive
        if(!paddle.destroyed) {
            // check for player input
            if(cursors.up.isDown) {
                paddle.body.velocity.y -= paddleVelocity;
            } else if(cursors.down.isDown) {
                paddle.body.velocity.y += paddleVelocity;
            }
            // check for collisions
            // IF COLLIDED WITH PLATFORM, BOUNCE UP AND MOVE DOWN STEADILY
            // PLAY BOUNCE ANIMATION
            this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);
        }
    }

    levelBump() {
        // increment level (ie, score)
        level++;

        // bump speed every 5 levels (until max is hit)
        if(level % 5 == 0) {
            //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            //this.sound.play('clang', { volume: 0.5 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
            }
        }
    }

    paddleCollision() { //CHANGE SO THAT WHEN COLLIDE, BALL BOUNCES - WHEN BALL HITS BOTTOM OF SCREEN, DESTROY AND GAMEOVER
        paddle.destroyed = true;                    // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        this.sound.play('death', { volume: 0.25 }); // play death sound
        
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });
       
        // kill paddle
        paddle.destroy();    

        // switch states after timer expires
        this.time.delayedCall(4000, () => { this.scene.start('menuScene'); });
    }
}
