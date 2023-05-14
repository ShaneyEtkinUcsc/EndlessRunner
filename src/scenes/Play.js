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
        
        // set up audio, play bgm
        this.bgm = this.sound.add('music', { 
            mute: false,
            volume: .5,
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


        //add dart p1
        this.p1Dart = new Dart(this, game.config.width - borderUISize - borderPadding, game.config.height/2, 'dart').setOrigin(0.5, 0);

        /*
        this.platformGroup = this.add.group({
            runChildUpdate: true
        });

        this.ballGroup = this.add.group({
            runChildUpdate: true
        });
        */

        //add platform and ball
        // wait a few seconds before spawning barriers - nAltice paddle game
        let coordRand = Phaser.Math.Between(80, 400);
        this.time.delayedCall(2500, () => { 
            this.ship01 = new Platform(this, game.config.width, coordRand, 'platform', 0).setOrigin(0, 0);
        });
        //this.time.delayedCall(2500, () => { 
        //    this.addPlatform(); 
        //});
        this.time.delayedCall(2500, () => { 
            this.ship02 = new Ball(this, game.config.width + borderUISize*6, coordRand, 'ball', 0, 1).setOrigin(0, 0); 
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
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
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
    }

    /*
    addPlatform() {
        let coordRand = Phaser.Math.Between(80, 400);
        this.ship01 = new Platform(this, game.config.width, coordRand, 'platform', 0).setOrigin(0, 0);
        platformExists = true;
    }
    addBall() {
        let coordRand = Phaser.Math.Between(80, 400);
        this.ship02 = new Ball(this, game.config.width + borderUISize*6, coordRand, 'ball', 0, 1).setOrigin(0, 0);
        ballExists = true;
    }
    */

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.sunset.tilePositionX += 4;

        if(!this.gameOver) {
            this.p1Dart.update();
            this.ship01.update();
            this.ship02.update();
        }

        //check collisions
        if(this.checkCollision(this.p1Dart, this.ship02)) { //ball collision
            this.ballPop(this.ship02);   
        }
        if (this.checkCollision(this.p1Dart, this.ship01)) { //platform collision
            p1Dart.destroy();
            gameOver = true;
            // add tween to fade out audio
            
            this.tweens.add({
                targets: this.bgm,
                volume: 0,
                ease: 'Linear',
                duration: 2000,
            });
            
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        }
    }

    levelBump() {
        // increment level
        level++;

        // bump speed every 5 levels
        if(level % 5 == 0) {
            platformSpeed++;
            ballSpeed++;
            this.bgm.rate += 0.01; // increase bgm playback rate
        }
    }

    checkCollision(dart, ship) {
        if (dart.x < ship.x + ship.width &&
            dart.x + dart.width > ship.x &&
            dart.y < ship.y + ship.height &&
            dart.height + dart.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    ballPop(ship) {
        this.ship02.anims.play('pop');             //play explode animation
        this.ship02.on('animationcomplete', () => {                      
            this.ship02.destroy();
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;      

        this.sound.play("sfx_pop");
    }
}