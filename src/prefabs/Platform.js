class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + paddleWidth, Phaser.Math.Between(paddleHeight/2, game.config.height - paddleHeight/2), texture); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.newBarrier = true;                 // custom property to control barrier spawning
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newBarrier && this.x < centerX) {
            // (recursively) call parent scene method from this context
            this.parentScene.addBarrier(this.parent, this.velocity);
            this.newBarrier = false;
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}

/*
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add to existing scene
        this.points = pointValue; //stor pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;
        //wrap around (this is neat :) )
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    //position reset
    reset() {
        this.x = game.config.width;
    }
}
*/