//platform prefab
class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        //super(scene, game.config.width, Phaser.Math.Between(0, this.game.config.height), 'platform'); 
        super(scene, game.config.width + 16, Phaser.Math.Between(64, game.config.height - 64), 'platform'); 
        
        this.parentScene = scene;  

        // set up physics sprite
        this.parentScene.add.existing(this);  
        this.parentScene.physics.add.existing(this); 
        this.setVelocityX(velocity); 
        this.setImmovable();                    
        this.newPlatform = true;
    }

    update() {
        if(this.newPlatform && this.x < centerX) {
            // recursively calling
            this.parentScene.addPlatform(this.parent, this.velocity);
            this.newPlatform = false;
        }

        if(this.x < -this.width) {
            this.destroy();
        }
    }
}