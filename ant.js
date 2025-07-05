class Ant {
    static sprites = [];

    static walkCyclesPerSec = 60;
    
    static maxSpeed = 80;
    static steerStrength = 20;

    static dirChangeTime = 1.5; // In seconds

    static border = 100; // How close to the borders of the canvas the ant can get
                        // before it's forced to go in the opposite direction. 

    time = 0;
    lastDirChangeTime = 0;
    angle = 0; // Angle of ant's direction with the vertical
    vel = p5.Vector.random2D().setMag(Ant.maxSpeed);
    targetVel = this.vel;

    constructor(x = 0, y = 0) {
        this.pos = createVector(x, y);
    }

    show(){
        let sprite = Ant.sprites[Math.floor(this.time * Ant.walkCyclesPerSec) % numSprites];
        
        push(); // ant
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y); //Set origin to ant's position.
        rotate(this.angle); //Rotates about the origin
        image(sprite, 0, 0, antWidth*imgScale, antHeight*imgScale);
        pop(); //ant
    }

    update(dt){
        if(this.lastDirChangeTime >= Ant.dirChangeTime){
            this.changeDir();
        }
        
        let acc = p5.Vector.sub(this.targetVel, this.vel);
        acc.mult(Ant.steerStrength)
        acc.limit(Ant.steerStrength);
        
        this.vel.add(p5.Vector.mult(acc, dt));
        this.vel.limit(Ant.maxSpeed);

        this.pos.add(p5.Vector.mult(this.vel, dt));

        //Don't let the ant go out of bounds.
        this.pos.x = constrain(this.pos.x, -width/2, width/2);
        this.pos.y = constrain(this.pos.y, -height/2, height/2);
        
        this.handleWallCollision();
        
        //-y coordinate because the screen's y axis direction is opposite of the cartesian one.
        this.angle = HALF_PI - Math.atan2(-this.vel.y, this.vel.x);
        
        this.time += dt;
        this.lastDirChangeTime += dt;
    }

    changeDir(){        
        this.targetVel = p5.Vector.random2D().mult(Ant.maxSpeed);
        this.lastDirChangeTime = 0;
    }

    handleWallCollision(){
        if(this.pos.x > width/2 - Ant.border){
            if(this.targetVel.x > 0){
                this.targetVel.x *= -1;
            }
            this.targetVel.setMag(Ant.maxSpeed);
            // console.log("Crossing the right border");
        }
        else if(this.pos.x < -width/2 + Ant.border){
            if(this.targetVel.x < 0){
                this.targetVel.x *= -1;
            }
            this.targetVel.setMag(Ant.maxSpeed);
            // console.log("Crossing the right border");
        }
        if(this.pos.y > height/2 - Ant.border){
            if(this.targetVel.y > 0){
                this.targetVel.y *= -1;
            }
            this.targetVel.setMag(Ant.maxSpeed);
            // console.log("Crossing the bottom border");
        }
        else if(this.pos.y < -height/2 + Ant.border){
            if(this.targetVel.y < 0){
                this.targetVel.y *= -1;
            }
            this.targetVel.setMag(Ant.maxSpeed);
            // console.log("Crossing the top border");
        }
    }
}