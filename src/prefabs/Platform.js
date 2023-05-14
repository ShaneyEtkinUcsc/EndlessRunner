//platform prefab
class Platform extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        //this.parentScene = scene;
        //this.parentScene.add.existing(this);
        this.moveSpeed = game.settings.platformSpeed;
        //this.newPlatform = true;
    }

    update() {
        //if(this.newPlatform && this.x < centerX) {
        //    this.parentScene.addPlatform();
        //    this.newPlatform = false;
        //}

        this.x -= this.moveSpeed;

        if(this.x <= 0 - this.width) {
            this.destroy();
            platformExists = false;
        }
    }

    //position reset
    //reset() {
    //    this.x = game.config.width;
    //}
}