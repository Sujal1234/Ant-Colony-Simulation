const PheromoneType = Object.freeze({
    toHome: Symbol("toHome"),
    toFood: Symbol("toFood"),
}); // Works like an enum

class Pheromone {
    static evaporationTime = 10; // In seconds
    intensity = 1;
    time = 0;

    constructor(x ,y, type){
        this.pos = createVector(x, y);
        this.type = type; //toHome or toFood
    }

    update(dt){
        this.time += dt;
        this.intensity -= dt / Pheromone.evaporationTime;
    }

    show(){
        push();
        if(this.type === PheromoneType.toHome){
            stroke(255, 0, 0, this.intensity * 255); // Red while searching
        }
        else {
            stroke(0, 153, 153, this.intensity * 255); // Blue-green while returning home
        }
        point(this.pos.x, this.pos.y);
        pop();
    }
}