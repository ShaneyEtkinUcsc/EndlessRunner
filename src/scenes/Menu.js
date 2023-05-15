class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('music', './assets/043792206-cinematic-hip-hop-loop.mp3');
        this.load.audio('sfx_pop', './assets/Balloon_Pop.mp3');
        this.load.audio('sfx_boing', './assets/Cartoon_Boing.mp3');
        this.load.audio('sfx_bloop', './assets/BloopSound.mp3');
        this.load.audio('sfx_death', './assets/VideoGameDeath.mp3');
        this.load.image('sunset', './assets/sunset.png');
    }

    create() {
        this.sunset = this.add.tileSprite(0, 0, 640, 480, 'sunset').setOrigin(0, 0);

        //menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#fcba03',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        menuConfig.fontSize = '40px';
        this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'Dart Throw', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '16px';
        this.add.text(game.config.width/2, game.config.height/2, 'Use arrows to move, dodge platforms and pop balls for points!', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '20px';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press -> to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 400, 'Music by Pinrecords, assets by Shaney Etkin', menuConfig).setOrigin(0.5);

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.sunset.tilePositionX += 4;
        
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('sfx_bloop');
            this.scene.start('playScene');
        }
    }
}