let walk;
let imgWidth, imgHeight;
let antWidth, antHeight;

const imgScale = 0.1;
const numAnts = 8; //Number of ants in a row/column of the square spritesheet
const numSprites = 62;

let colony, grid;

let antsLayer, pherLayer;

function preload(){
    walk = loadImage("walk.png");
}

function getSpriteCoords(spriteNum){
    let x = (spriteNum % numAnts) * antWidth;
    let y = Math.floor(spriteNum / numAnts) * antHeight;
    return [x ,y];
}

function getPointsInCircle(x, y, radius){
    // Check points in a square for distance <= radius.
    // Checks only one quadrant.
    let points = [];
    for(let i = 0; i <= radius; i++){
        for(let j = 1; j <= radius; j++){
            if(i == 0){
                points.push([x, y + j]);
                points.push([x, y - j]);
                points.push([j, y]);
                points.push([-j, y]);
                continue;
            }
            if(i * i + j * j <= radius * radius){
                points.push([x + i, y + j]);
                points.push([x - i, y + j]);
                points.push([x + i, y - j]);
                points.push([x - i, y - j]);
            }
        }
    }
    return points;
}

function setup() {
    createCanvas(1100, 500, WEBGL);
    frameRate(60);
    
    pherLayer = createFramebuffer();
    antsLayer = createFramebuffer();
    
    imgWidth = walk.width * imgScale;
    imgHeight = walk.height * imgScale;
    
    antWidth = walk.width / numAnts;
    antHeight = walk.height / numAnts;
    
    for(let i = 0; i < numSprites; i++){
        let pos = getSpriteCoords(i);
        let ant = walk.get(pos[0], pos[1], antWidth, antHeight);
        // ant.resize(antWidth * imgScale, antHeight * imgScale);
        
        Ant.sprites.push(ant);
    }
    
    grid = new Grid(width, height);
    colony = new Colony(0, 0, 100);

    // Add food in a square
    let foodX = -200, foodY = -200, foodSize = 25;

    for(let i = foodX - foodSize; i <= foodX + foodSize; i++){
        for(let j = foodY - foodSize; j <= foodY + foodSize; j++){
            let index = grid.coordsToIndex(i, j);
            if(index !== -1){
                grid.cells[index].addFood();
            }
        }
    }
}

function draw() {
    background(220);
    
    // draw pheromones & food first, then ants
    grid.show(pherLayer);
    colony.show(antsLayer);
    colony.update(1 / 60);
    
    image(pherLayer, -width/2, -height/2);
    image(antsLayer, -width/2, -height/2);
}