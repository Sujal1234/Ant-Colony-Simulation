class Colony {
    ants = [];

    static radius = 25;

    constructor(x, y, n){
        this.home = createVector(x, y);
        // If n is undefined, default to 1 ant
        this.ants = Array.from({length: n || 1}, () => new Ant(x, y, grid, this));
    }

    show(layer){
        layer.begin();
        clear();
        
        push();
        noStroke();
        fill(0, 0, 255);
        circle(this.home.x, this.home.y, Colony.radius * 2);
        pop();

        push();
        imageMode(CENTER);
        for(let ant of this.ants){
            ant.show();
        }
        pop();
        layer.end();
    }

    update(dt){
        for(let ant of this.ants){
            ant.update(dt);
        }
    }
}