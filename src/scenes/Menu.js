class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('music', './assets/043792206-cinematic-hip-hop-loop.mp3');
        this.load.audio('sfx_pop', './assets/Balloon_Pop.mp3');
        this.load.audio('sfx_boing', './assets/Cartoon_Boing.mp3');
    }

    create() {
        // find background - this.smth = this.add.tileSprite(0, 0, 640, 480, 'smth').setOrigin(0, 0);

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
        menuConfig.fontSize = '28px';
        this.add.text(game.config.width/2, game.config.height/2, 'Use arrows to move, jump on the platforms and avoid obstacles', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press -> to start', menuConfig).setOrigin(0.5);

        //define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //easy mode
            game.settings = {
                platformSpeed: 2,
                ballSpeed: 3
            }
            //this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}