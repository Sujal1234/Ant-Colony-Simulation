let walk;
let imgWidth, imgHeight;
let antWidth, antHeight;

const imgScale = 0.15;
const numAnts = 8; //Number of ants in a row/column of the square spritesheet
const numSprites = 62;

let ant;

function preload(){
    walk = loadImage("walk.png");
}

function getCoords(spriteNum){
    let x = (spriteNum % numAnts) * antWidth;
    let y = Math.floor(spriteNum / numAnts) * antHeight;
    return [x ,y];
}

function setup() {
    createCanvas(window.innerWidth - 50, window.innerHeight - 50);
    frameRate(60);
    
    //   imgScale = height / walk.height
    
    imgWidth = walk.width * imgScale;
    imgHeight = walk.height * imgScale;
    
    antWidth = walk.width / numAnts;
    antHeight = walk.height / numAnts;
    
    for(let i = 0; i < numSprites; i++){
        let pos = getCoords(i);
        let ant = walk.get(pos[0], pos[1], antWidth, antHeight);
        
        Ant.sprites.push(ant);
    }
    
    ant = new Ant();
}

function draw() {
    background(220);
    translate(width/2, height/2);
    
    ant.show();
    ant.update(1 / 60);
    // if(frameCount % 60 == 0){
        // console.log("Ant's velocity: ", ant.vel.x, ant.vel.y);
        // console.log("Ant's position: ", ant.pos.x, ant.pos.y);
        // console.log("Ant's target velocity: ", ant.targetVel.x, ant.targetVel.y);
    // }
}