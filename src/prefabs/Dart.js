class Dart extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        this.moveSpeed = 2;
    }

    update() {
        //side movement
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        } //else if (keyUP.isDown && this.y (not sure what math to put here figure it out)) {
            //this.y += this.moveSpeed;
        //} else if (keyDOWN.isDown && this.y (not sure about this math either)) {
            //this.y -= this.moveSpeed;
        //}
    }
}