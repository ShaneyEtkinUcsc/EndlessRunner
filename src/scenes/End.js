class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    preload() {
        this.load.image('sunset', './assets/sunset.png');
    }

    create() {
        this.sunset = this.add.tileSprite(0, 0, 640, 480, 'sunset').setOrigin(0, 0);

        //end scene text config
        let endConfig = {
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

        //show end text
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', endConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press -> to Restart or <- for Menu', endConfig).setOrigin(0.5);

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.sunset.tilePositionX += 4;
        
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('sfx_bloop');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_bloop');
            this.scene.start("menuScene");
        }
    }
}