let ground;
let dinowalk1, dinowalk2, dinojump, dinodead;
let cacto, fly1, fly2;
let cloud, reloadbtn;
let cactus = [];
let clouds = [];
let jumpsound, deathsound, scoresound;
var score = 0;
var scoredisplay, groundlevel, font;
var highscore = 0;
var highscoredisplay = 0;
var timer = 0;
var spawntime = 150;
var speed = 5;
let touch;


function preload() {
  font = loadFont('assets/pixelfont.ttf');
  dinowalk1 = loadImage('assets/dinowalk1.png');
  dinowalk2 = loadImage('assets/dinowalk2.png');
  fly1 = loadImage('assets/fly1.png');
  fly2 = loadImage('assets/fly2.png');
  dinojump = loadImage('assets/dinojump.png');
  dinodead = loadImage('assets/dinodead.png');
  cacto = loadImage('assets/cactus1.png');
  groundimg = loadImage('assets/ground.png');
  cloud = loadImage('assets/cloud.png');
  soundFormats('mp3', 'ogg');
  jumpsound = loadSound('assets/jump');
  deathsound = loadSound('assets/death');
  scoresound = loadSound('assets/score');
}

function setup() {
  pixelDensity(1);
  if (windowWidth <= 1000){
    gamecnv = createCanvas(displayWidth, 300);
  } else {
    gamecnv = createCanvas(720, 300);
  }
  gamecnv.position(0, 70);
  textFont(font);
  frameRate(60);
  groundlevel = 2 * height / 3;
  dinosaur = new Dinosaur();
  ground = new Ground(5);
  if (getItem('highscore')) {
    highscore = getItem('highscore');
  }
  clouds.push(new Cloud());
  reloadbtn = createImg('assets/reload.png', 'reload');
  reloadbtn.size(60,50);
  reloadbtn.position(width/2-30, height/2-25+70);
  reloadbtn.hide();
  touch = createDiv();
  touch.style('width: 100vw;');
  touch.style('height: 100vh;');
}

function draw() {
  background(255);
  speed = 5 + (1 * score / 100);
  constrain(speed, 4, 17);
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].show();
    clouds[i].update();
    if (clouds[i].x < -100) {
      clouds.splice(i, 1);
      i--;
    }
  }

  ground.update();
  ground.show();
  spawnCactus();
  for (let i = 0; i < cactus.length; i++) {
    cactus[i].update();
    cactus[i].show();
    dinosaur.hits(cactus[i]);

    if (cactus[i].x < -100) {
      cactus.splice(i, 1);
      i--;
    }
  }
  dinosaur.update();
  dinosaur.show();
  gameover();
  if (frameCount % 6 == 0) {
    score++;
  }
  scoredisplay = zeros(score, 5);
  if (score > highscore) {
    highscore = score;
  }
  highscoredisplay = zeros(highscore, 5);
  textSize(25);
  fill(80);
  textAlign(RIGHT);
  storeItem('highscore', highscore);
  text(scoredisplay, -10, 10, width, height / 10);
  text(highscoredisplay, -100, 10, width, height / 10);
  text("HI", -190, 10, width, height / 10);
  if (score != 0 && score % 100 == 0) {
    scoresound.play();
  }
  gamecnv.touchStarted(jumping);
  touch.touchStarted(jumping);
}

function jumping () {
    if (dinosaur.y == dinosaur.ground) {
      jumpsound.play();
    }
    dinosaur.jump();
}


function zeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}


function keyPressed() {
  if (isLooping() && key == ' ') {
    dinosaur.jump();
    if (dinosaur.y == dinosaur.ground) {
      jumpsound.play();
    }
  }
}

function spawnCactus() {
  if (timer >= spawntime) {
    var number;
    var rand = random(1);
    if (rand < 0.12) {
      number = 2;
    } else if (rand > 0.9) {
      number = 3;
    } else {
      number = 1;
    }
    var flyrand = 0.05 + (0.01 * (score - 400) / 70);
    constrain(flyrand, 0, 0.2);
    if (score > 400 && random(1) < flyrand) {
      cactus.push(new Fly());
    } else {
      cactus.push(new Cactus(number));
    }
    if (random(1) < 0.1) {
      clouds.push(new Cloud());
    }
    timer = 0;
    var spawnrand = 70 - (2.5 * (score - 400) / 70);
    constrain(spawnrand, 50, 70);
    if (random(1) < 0.7) {
      spawntime = random(30, spawnrand);
    } else {
      spawntime = random(70, 10 * spawnrand / 7);
    }
  } else {
    timer++;
  }
}

window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}