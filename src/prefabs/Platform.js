//platform prefab
class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene, game.config.width, Phaser.Math.Between(0, game.config.height), 'platform'); 
        
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