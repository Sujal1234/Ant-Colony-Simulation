class Ant {
    static sprites = [];
    static dt = 1 / 60;
    static walkCyclesPerSec = 60;
    static maxSpeed = 20;
    static steerStrength = 10;

    time = 0;
    angle = 0;
    vel = createVector(0, -Ant.maxSpeed);

    //Randomly set target for now
    target = createVector(50, -50);

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

    update(){
        this.target = createVector(mouseX, mouseY);
        this.target.sub(width/2, height/2); //mouseX, mouseY are relative to top-left even after translate()

        let targetDir = p5.Vector.sub(this.target, this.pos).normalize();
        let targetVel = p5.Vector.mult(targetDir, Ant.maxSpeed);

        let acc = p5.Vector.sub(targetVel, this.vel);
        acc.mult(Ant.steerStrength)
        acc.limit(Ant.steerStrength);

        this.vel.add(p5.Vector.mult(acc, Ant.dt));
        this.vel.limit(Ant.maxSpeed);

        this.pos.add(p5.Vector.mult(this.vel, Ant.dt));

        //-y coordinate because the screen's y axis direction is opposite of the cartesian one.
        this.angle = HALF_PI - Math.atan2(-this.vel.y, this.vel.x);
        this.time += Ant.dt;
    }
}