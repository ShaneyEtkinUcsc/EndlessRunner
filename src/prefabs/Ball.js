//ball prefab
class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene, game.config.width, Phaser.Math.Between(0, game.config.height), 'ball'); 
        
        this.parentScene = scene;  

        // set up physics sprite
        this.parentScene.add.existing(this);  
        this.parentScene.physics.add.existing(this); 
        this.setVelocityX(velocity); 
        this.setImmovable();                    
        this.newBall = true;
    }

    update() {
        if(this.newBall && this.x < centerX) {
            // recursively calling
            this.parentScene.addBall(this.parent, this.velocity);
            this.newBall = false;
        }

        if(this.x < -this.width) {
            this.destroy();
        }
    }
}