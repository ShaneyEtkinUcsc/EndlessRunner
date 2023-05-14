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
        this.sunset = this.add.tileSprite(0, 0, 640, 480, 'sunset').setOrigin(0, 0);

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

        //https://www.youtube.com/watch?v=ffemDAdJySU
        // set up animations for texture atlas
        this.frameNames = this.textures.get('ball').getFrameNames();
        /* THE BALL WAS GONNA BE THE PLAYER, BUT I CHANGED IT TO THE POINTS YOU GET SO THIS ANIM WONT BE USED :(
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
        */
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

        //make background greeen
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        //add white borders (on each side)
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //add dart p1
        this.p1Dart = new Dart(this, game.config.width - borderUISize - borderPadding, game.config.height/2, 'dart').setOrigin(0.5, 0);

        //add ball and platform
        this.ship01 = new Platform(this, game.config.width, borderUISize*6 + borderPadding*4, 'platform', 0).setOrigin(0, 0);
        this.ship02 = new Ball(this, game.config.width + borderUISize*6, borderUISize*4, 'ball', 0, 1).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //initialize score
        this.p1Score = 0;
        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#2491f0',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //'GAME OVER' flag
        this.gameOver = false;

        //play timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //show UI text for play timer
        this.playTimer = this.add.text(game.config.width/2, borderUISize + borderPadding*2, this.clock, scoreConfig);
    }

    // create new barriers and add them to existing barrier group
    // EDIT TO ADD PLATFORMS USING PLATFORM IMAGE
    //addPlatform() { //LOOK BACK AT CREATING SPACESHIPS - MAYBE JUST DO THIS INSTEAD AND RANDOMIZE SPEED AND POSITION
        //let speedVariance =  Phaser.Math.Between(0, 50);
        //let platform = new Platform(this, this.barrierSpeed - speedVariance, 'platform');
        //this.barrierGroup.add(platform);
    //}

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.sunset.tilePositionX += 4;

        //to get remaining time in clock
        //https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.Time.TimerEvent-getRemaining
        this.playTimer.text = Math.floor((this.clock.getRemaining()/1000));

        if(!this.gameOver) {
            this.p1Dart.update();
            this.ship01.update();
            this.ship02.update();
        }

        //check collisions
        if(this.checkCollision(this.p1Dart, this.ship02)) { //ball collision
            this.p1Dart.reset();
            this.ballPop(this.ball01);   
        }
        //if (this.checkCollision(this.p1Dart, this.ship01)) { //platform collision
            //DESTROY P1DART and gameOver=true
            //p1Dart.destroy();
            //gameOver = true;
            // add tween to fade out audio
            /*
            this.tweens.add({
                targets: this.bgm,
                volume: 0,
                ease: 'Linear',
                duration: 2000,
            });
            */
        //}
    }

    /*
    levelBump() { //CHANGE TO IF SCORE % 5 == 0 BUMP UP SPEED, SHOULD BUMP EVERY 5 BALLPOPS
        // increment level (ie, score)
        level++;

        // bump speed every 5 levels (until max is hit)
        if(level % 5 == 0) {
            //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            //this.sound.play('clang', { volume: 0.5 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                this.bgm.rate += 0.01;                          // increase bgm playback rate
            }
        }
    }
    */

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    ballPop(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    
            ship.reset();                         
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;      

        this.sound.play("sfx_pop");
    }
}