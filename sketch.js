
var monkey , monkey_running,monkey_jump,monkey_cry;
var banana ,bananaImage, obstacle, obstacleImage;
var foodGroup, obstacleGroup;
var ground, groundImage,Iground ;
var gameOver,gameOverImage ;
var BG,BGImage,BGsound;
var start, startImage ;
var score = 0 ;
var OVER = 1;
var PLAY = 2;
var NULL = 0;
var y = 800 ;
var gameState = NULL ;

function preload(){
  
  //loading images
  monkey_running = loadAnimation("monkeyR-1.png","monkeyR-2.png","monkeyR-3.png","monkeyR-4.png","monkeyR-5.png","monkeyR-6.png","monkeyR-7.png","monkeyR-8.png","monkeyR-9.png");
  monkey_jump = loadAnimation("monkeyJ-1.png","monkeyJ-2.png","monkeyJ-3.png","monkeyJ-4.png");
  monkey_cry = loadImage("monkeyCry.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  groundImage = loadImage("ground.png");
  gameOverImage = loadImage("gameOver1.png");
  BGImage = loadImage("BG2.png");
  startImage = loadImage("start.png");
  
  //loading sounds
  BGsound = loadSound("BG.mp3");
}

function setup() {
  createCanvas(600,300);
  
  //creating sprites
  monkey = createSprite(100,190,10,10);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("jump",monkey_jump);
  monkey.addAnimation("cry",monkey_cry);
  monkey.scale = 0.8 ;
  
  ground = createSprite(300,300,10,10);
  ground.addAnimation("ground",groundImage);
  ground.scale = 2.5 ;
    
  Iground = createSprite(300,240,600,10);
  Iground.visible = false ;
  
  gameOver =createSprite(300,100,10,10);
  gameOver.addAnimation("gameover",gameOverImage);
  gameOver.visible = false ;
  
  BG = createSprite(300,90,1,1);
  BG.addImage("BG",BGImage);
  BG.scale = 0.7 ;
  
  start = createSprite(500,200,1,1);
  start.addImage("start",startImage);
  start.scale = 0.7 ;
  
  //sound
  BGsound.play();
  BGsound.setLoop(true);
  
  //creating groups
  obstacleGroup = createGroup();
  foodGroup = createGroup();
  
}


function draw() {
  
  background(rgb(50,100,150));
    
  //changing gameState
  if(gameState === NULL && mousePressedOver(start)){
     gameState = PLAY ;
     BG.visible = false ;
     start.visible = false ;
     y= 20 ;
  }
  
  monkey.collide(ground);
  
  //providing gravity to monkey
  monkey.velocityY += 1;
  
  //gameState play 
  if(gameState === PLAY){
    
        
    //creating infinite ground
    ground.velocityX = -(10 + score/10);
    if(ground.x <= 240){ 
       ground.x = 300 ;
    }
    
    //making the monkey jump
    if(keyDown("space")&& monkey.isTouching(Iground)){
       monkey.velocityY = -15;
    } 
    
    if(monkey.isTouching(Iground)){
      monkey.changeAnimation("running",monkey_running); 
    }
    else{
      monkey.changeAnimation("jump",monkey_jump);
    }
    
    //calling obstacles function
    createObstacles();
    createBanana();

    //increasing score 
    if(monkey.isTouching(foodGroup)){
       
      foodGroup.destroyEach();
      score += 2 ;
      
    }
    
    //increasing size of monkey 
    switch(score){
      case 10 : monkey.scale = 0.85;
      break ;
      
      case 20 : monkey.scale = 0.9 ;
      break ;
      
      case 40 : monkey.scale = 0.95;
      break ;
       
      case 80 : monkey.scale = 1 ;
      break ;
      
    }
    
    //changing gameState
    if(monkey.isTouching(obstacleGroup)&& gameState === PLAY){
      gameState = OVER ;
      monkey.scale = 0.8 ; 
      
    }
    
  }
  
  // gameState end 
  if(gameState === OVER){
    obstacleGroup.setVelocityXEach(0) ;
    foodGroup.setVelocityXEach(0) ;
    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    ground.velocityX = 0 ;
    monkey.changeAnimation("cry",monkey_cry);
    gameOver.visible = true ;
    
    //restart
    if(mousePressedOver(gameOver)){
       reset();
    }
    
  }
  console.log(frameRate());
  drawSprites();
  
  //showing score
  fill("black");
  textSize(20);
  text("Score: " + score,500,y);
}

//creating obstacles
function createObstacles(){
 if (frameCount % 100 === 0){
   obstacle = createSprite(600,ground.y - 80,10,40);
   obstacle.velocityX = -(10 + score/10);
   obstacle.addImage(obstacleImage);
   
   //assign scale and lifetime to the obstacle           
   obstacle.scale = 0.15;
   obstacle.lifetime = 300;
   obstacle.setCollider("circle",0,0,180);
   
   //add each obstacle to the group
   obstacleGroup.add(obstacle);
 }
}

//creating banana
function createBanana(){
 if (frameCount % 80 === 0){
   banana = createSprite(600,100,10,40);
   banana.velocityX = -(10 + score/10);
   banana.addImage(bananaImage);
   banana.y = random(50,80);
   
   //assign scale and lifetime to the obstacle           
   banana.scale = 0.13;
   banana.lifetime = 300;
   banana.setCollider("circle",0,0,180);
   
   banana.depth = monkey.depth ;
   monkey.depth += 1 ;
   
   //add each obstacle to the group
   foodGroup.add(banana);
 }
}

function reset(){

  gameState = NULL ;
  gameOver.visible = false ;
  BG.visible = true ;
  start.visible = true ;
  monkey.changeAnimation("running",monkey_running);
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  y= 800 ;
  score = 0 ;
}
