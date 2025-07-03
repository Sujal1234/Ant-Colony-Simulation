let walk;
let imgScale = 0.15;
let imgWidth, imgHeight;
let antWidth, antHeight;
const numAnts = 8; //Number of ants in a row/column of the square spritesheet
const numSprites = 62;

let testAnt;

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
    
    testAnt = new Ant();
}

function draw() {
    background(220);
    translate(width/2, height/2);
    
    testAnt.show();
    testAnt.update();
    if(frameCount % 30 == 0){
        console.log("Target : ", testAnt.target.x, testAnt.target.y);
        console.log("Ant's velocity: ", testAnt.vel.x, testAnt.vel.y);
    }
}