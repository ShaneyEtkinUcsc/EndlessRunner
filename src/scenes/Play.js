class Play extends Phaser.Scene {
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
        this.sunset = this.add.tileSprite(0, 0, 640, 480, 'sunset').setOrigin(0, 0);

        // reset parameters
        level = 0;
        this.objectSpeed = -100;
        
        // set up audio, play bgm
        this.bgm = this.sound.add('music', { 
            mute: false,
            volume: 0.25,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        //make background white
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFFFFFF).setOrigin(0, 0);

        //https://www.youtube.com/watch?v=ffemDAdJySU
        // set up animations for texture atlas
        this.frameNames = this.textures.get('ball').getFrameNames();
        // THE BALL WAS GONNA BE THE PLAYER, BUT I CHANGED IT TO THE POINTS YOU GET SO BOUNCE ANIM WONT BE USED :(
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


        //add dart p1 and set up physics
        p1Dart = this.physics.add.sprite(32, centerY, 'dart').setOrigin(0.5);
        p1Dart.setCollideWorldBounds(true);
        p1Dart.setBounce(0.5);
        p1Dart.setImmovable();
        p1Dart.setMaxVelocity(0, 600);

        // add platform and ball
        this.platformGroup = this.add.group({
            runChildUpdate: true
        });
        this.ballGroup = this.add.group({
            runChildUpdate: true
        });

        this.time.delayedCall(2500, () => { 
            this.addPlatform();
        });
        this.time.delayedCall(2500, () => { 
            this.addBall();
        });

        // set up difficulty timer (triggers callback every second)
        //nAltice paddle runner
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //initialize score
        this.p1Score = 0;
        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        cursors = this.input.keyboard.createCursorKeys();
    }

    addPlatform() {
        let randSpeed = Phaser.Math.Between(0, 10);
        let platform = new Platform(this, this.objectSpeed - randSpeed);
        this.platformGroup.add(platform);
    }
    addBall() {
        let randSpeed = Phaser.Math.Between(0, 10);
        let ball = new Ball(this, this.objectSpeed - randSpeed);
        this.ballGroup.add(ball);
    }

    update() {
        this.sunset.tilePositionX += 4;
        
        //check collisions
        if(!p1Dart.destroyed) {
            // check for player input
            if(cursors.up.isDown) {
                p1Dart.body.velocity.y -= dartVelocity;
            } else if(cursors.down.isDown) {
                p1Dart.body.velocity.y += dartVelocity;
            }
            // check for collisions
            this.physics.world.collide(p1Dart, this.platformGroup, this.platformCollision, null, this);
            this.physics.world.collide(p1Dart, this.ballGroup, this.ballCollision, null, this);
        }

        //check key input for restart
        /*
        if (p1Dart.destroyed && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.restart();
        }
        if (p1Dart.destroyed && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        */
    }

    levelBump() {
        // increment level
        level++;

        // bump speed every 5 levels
        if(level % 5 == 0) {
            this.objectSpeed -= 5;
            this.bgm.rate += 0.01; // increase bgm playback rate
        }
    }

    ballCollision() {
        this.ball.anims.play('pop');             //play explode animation
        this.ball.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {                      
            this.ball.destroy();
        });

        this.p1Score ++;
        this.scoreLeft.text = this.p1Score;      

        this.sound.play("sfx_pop");
    }

    platformCollision() {
        p1Dart.destroyed = true;                   // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        this.sound.play('sfx_death');
        
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });
       
        p1Dart.destroy();

        //nAltice
        this.time.delayedCall(3000, () => { this.scene.start('endScene'); });
    }
}