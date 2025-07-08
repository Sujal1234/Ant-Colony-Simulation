class Cell {
    constructor(x, y){
        this.hasFood = false;
        this.x = x;
        this.y = y;
    }

    addPheromone(pheromone) {
        if(pheromone.type === PheromoneType.toFood) {
            if(this.toFoodPheromone === undefined) {
                this.toFoodPheromone = pheromone;
                return;
            }
            if(this.toFoodPheromone.intensity < pheromone.intensity) {
                this.toFoodPheromone = pheromone;
            }
        }
        else{
            if(this.toHomePheromone === undefined) {
                this.toHomePheromone = pheromone;
                return;
            }
            if(this.toHomePheromone.intensity < pheromone.intensity) {
                this.toHomePheromone = pheromone;
            }
        }
    }

    removeToHomePheromone() {
        this.toHomePheromone = undefined;
    }
    removeToFoodPheromone() {
        this.toFoodPheromone = undefined;
    }

    addFood(){
        this.hasFood = true;
    }
    removeFood() {
        this.hasFood = false;
    }

    update(dt){
        if(this.toFoodPheromone){
            this.toFoodPheromone.update(dt);

            if(this.toFoodPheromone.intensity <= 0) {
                this.removeToFoodPheromone();
            }
        }
        if(this.toHomePheromone){
            this.toHomePheromone.update(dt);
            
            if(this.toHomePheromone.intensity <= 0) {
                this.removeToHomePheromone();
            }
        }
    }

    show(){
        if(this.hasFood) {
            push();
            stroke(255, 204, 0); // Yellow for food
            strokeWeight(7);
            point(this.pos.x, this.pos.y);
            pop();
        }

        if(this.toFoodPheromone) {
            this.toFoodPheromone.show();
        }
        if(this.toHomePheromone) {
            this.toHomePheromone.show();
        }
    }
}

class Grid {
    grid = [];

    constructor(gridWidth, gridHeight){
        // x values from 0 to gridWidth are possible so we need gridWidth + 1 columns.
        // Similarly for y
        this.cols = gridWidth + 1;
        this.rows = gridHeight + 1;

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.grid.push(new Cell(j, i));
            }
        }
    }

    coordsToIndex(x, y){
        x += (this.cols - 1) / 2;
        y += (this.rows - 1) / 2;
        if(x < 0 || x > this.cols - 1 || y < 0 || y > this.rows - 1) {
            return -1; // Out of bounds
        }

        x = Math.round(x);
        y = Math.round(y);
        return y * this.cols + x;
    }

    indexToCoords(index){
        if(index < 0 || index >= this.grid.length) {
            return null; // Out of bounds
        }
        let x = index % this.cols;
        let y = Math.floor(index / this.cols);
        return [x - this.cols / 2, y - this.rows / 2];
    }

    show(){
        for(const cell of this.grid) {
            cell.show();
        }
    }

    addPheromone(x, y, pheromone){
        let cell = this.grid[this.coordsToIndex(x, y)];
        // console.table(cell);
        cell.addPheromone(pheromone);
    }

    update(dt){
        for(const cell of this.grid) {
            cell.update(dt);
        }
    }
}