//platform prefab
class Platform extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        //this.moveSpeed = game.settings.addlater;
    }

    update() { //figure out how to spawn a new one each time it's destroyed
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}