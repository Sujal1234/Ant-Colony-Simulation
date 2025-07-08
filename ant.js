class Ant {
    static sprites = [];

    static walkCyclesPerSec = 60;

    static maxSpeed = 80;
    static steerStrength = 20;

    static dirChangeTime = 1.5; // In seconds
    static pheromoneDropTime = 0.5; // In seconds

    static border = 100; // How close to the borders of the canvas the ant can get
                        // before it's forced to go in the opposite direction. 

    time = 0;
    lastDirChangeTime = 0;
    lastPheromoneDropTime = 0;

    angle = 0; // Angle of ant's direction with the vertical
    vel = p5.Vector.random2D().setMag(Ant.maxSpeed);
    targetVel = this.vel;

    pheromonePhase = PheromoneType.toHome;

    constructor(x, y, grid, homeColony) {
        this.pos = createVector(x, y);
        this.grid = grid;
        this.homeColony = homeColony; // p5 vector
    }

    show(){
        let sprite = Ant.sprites[Math.floor(this.time * Ant.walkCyclesPerSec) % numSprites];
        
        push(); // ant
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y); //Set origin to ant's position.

        //-y coordinate because the screen's y axis direction is opposite of the cartesian one.
        let angle = HALF_PI - Math.atan2(-this.vel.y, this.vel.x);

        rotate(angle); //Rotates about the origin
        image(sprite, 0, 0, antWidth*imgScale, antHeight*imgScale);

        //For debugging hitbox
        // noFill();
        // circle(0, 0, 10*2);

        pop(); //ant
    }

    update(dt){
        if(this.lastDirChangeTime >= Ant.dirChangeTime){
            this.changeDir();
        }

        if(this.lastPheromoneDropTime >= Ant.pheromoneDropTime){
            this.dropPheromone();
        }
        
        this.handleWallCollision();

        if(this.pheromonePhase === PheromoneType.toHome){
            this.checkFood();
        }
        else{
            this.checkHome();
        }

        this.updatePosition(dt);

        this.time += dt;
        this.lastDirChangeTime += dt;
        this.lastPheromoneDropTime += dt;
    }

    checkFood(){
        let points = getPointsInCircle(this.pos.x, this.pos.y, 10);

        for(let point of points){
            if(this.grid.hasFood(point[0], point[1])){
                this.grid.removeFood(point[0], point[1]);

                this.pheromonePhase = PheromoneType.toFood;

                this.vel.mult(-1);
                this.targetVel = this.vel;
                return;
            }
        }
    }

    checkHome(){
        let home = this.homeColony.home;
        if(p5.Vector.sub(home, this.pos).magSq() <= Colony.radius * Colony.radius){
            // Now it should start checking for food and start dropping toHome pheromones
            this.pheromonePhase = PheromoneType.toHome;

            this.vel.mult(-1);
            this.targetVel = this.vel;
        }
    }

    updatePosition(dt){
        let acc = p5.Vector.sub(this.targetVel, this.vel);
        acc.mult(Ant.steerStrength)
        acc.limit(Ant.steerStrength);
        
        this.vel.add(p5.Vector.mult(acc, dt));
        this.vel.limit(Ant.maxSpeed);

        this.pos.add(p5.Vector.mult(this.vel, dt));

        //Don't let the ant go out of bounds.
        this.pos.x = constrain(this.pos.x, -width/2, width/2);
        this.pos.y = constrain(this.pos.y, -height/2, height/2);
    }

    dropPheromone(){
        let pheromone = new Pheromone(this.pos.x, this.pos.y, this.pheromonePhase);
        this.grid.addPheromone(this.pos.x, this.pos.y, pheromone);

        this.lastPheromoneDropTime = 0;
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