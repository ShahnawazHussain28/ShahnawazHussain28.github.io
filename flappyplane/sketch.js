let pipes = [];
let stars;
let bird;
var spawntime = 100;
var spawncountup = 0;
var firsttap = false;
let canvas, scoredisplay, highscoredisplay;
let menuscreen, pausebtn, resumebtn;
let plane, building;
var score = 0;
var highscore = 0;


function preload(){
  plane = loadImage('plane.png');
  building = loadImage('building.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.touchStarted(touch);
  bird = new Bird(50, height/3);
  stars = new Stars();
  menuscreen = select('#menu');
  pausebtn = select('#pause');
  resumebtn = select('#resume');
  scoredisplay = createP('Score: ' + score)
    .style("position:absolute")
    .style("color: white").style("z-index: 50")
    .style("font-size: 1.2em").style("margin:10px");
  highscoredisplay = createP('Hi-Score: ' + highscore)
    .style("position:absolute")
    .style("color: white").style("z-index: 50")
    .style("font-size: 1.2em").style("width:100%")
    .style("text-align:right").style("padding-right:20px")
    .style("box-sizing:border-box");
}

function draw() {
  background('#050530');
  stars.show();
  spawnpipe();
  for (var i = pipes.length-1; i >= 0 ; i--) {
    pipes[i].update();
    pipes[i].show();
    if(pipes[i].x <= -pipes[i].w){
      pipes.splice(i, 1);
      score++;
      scoredisplay.html("Score: " + score);
    }
  }
  bird.update();
  bird.death();
  bird.show();
  highscore = max(highscore, score);
  highscoredisplay.html("Hi-Score: " + highscore);
  if (firsttap == false) {
    noLoop();
  }
}

function keyPressed () {
  if (key == " ") {
    touch();
  }
}

function touch () {
  if (!firsttap) {
    firsttap = true;
    loop();
  }
  bird.move();
}


function spawnpipe(){
  if(spawncountup >= spawntime){
    pipes.push(new Pipe(random(0.2, 0.9)));
    spawncountup = 0;
  } else {
    spawncountup++;
  }
}

function gameOver () {
  noLoop();
  menuscreen.show();
  pausebtn.hide();
  resumebtn.hide();
}
function pause(){
  noLoop();
  pausebtn.hide();
  menuscreen.show();
}
function resume(){
  menuscreen.hide();
  pausebtn.show();
  loop();
}
function restart(){
  menuscreen.hide();
  resumebtn.show();
  pausebtn.show();
  bird = new Bird(50, height/3);
  pipes = [];
  score = 0;
  scoredisplay.html("Score: " + score);
  loop();
  firsttap = false;
}
function share(){
  window.location.href = "https://wa.me/?text=I%20Scored%20" + highscore + "%0ACan%20You%20Beat%20Me%3F%0Ahttps%3A%2F%2Fitsfunzone.000webhostapp.com%2Fflappybird";
}


class Pipe {
  constructor(y) {
    this.h = height;
    this.w = 40;
    this.x = width;
    this.gap = 150;
    this.y1 = map(y, 0, 1, 0, height-this.gap) - height;
    this.y2 = this.y1 + this.h + this.gap;
  }
  update() {
    this.x -= 2.5;
    // this.x -= 0.005;
  }
  show() {
    fill(255, 0, 0);
    push();
    imageMode(CORNER);
    rect(this.x, this.y1, this.w, this.h);
    image(building, this.x, this.y1, this.w, this.h);
    fill(0, 255, 255);
    rect(this.x, this.y2, this.w, this.h);
    image(building, this.x, this.y2, this.w, this.h);
    pop();
  }
}

class Bird {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.yVel = 0;
    this.gravity = 0.3;
    // this.gravity = 0.001;
  }
  update(){
    this.y += this.yVel;
    this.y = constrain(this.y, 0, height+10-this.size/2);
    this.yVel += this.gravity;
  }
  move(){
    this.yVel = -6;
  }
  show(){
    push();
    translate(this.x, this.y);
    var rotation = constrain(QUARTER_PI * this.yVel / 4, -QUARTER_PI, HALF_PI*0.7);
    rotate(rotation);
    imageMode(CENTER);
    image(plane, 0, 0, this.size + 8, this.size);
    pop();
  }
  death(){
    for (var i = 0; i < pipes.length; i++) {
      var hit1 = collideRectCircle(pipes[i].x, pipes[i].y1, pipes[i].w, pipes[i].h, this.x, this.y, this.size);
      var hit2 = collideRectCircle(pipes[i].x, pipes[i].y2, pipes[i].w, pipes[i].h, this.x, this.y, this.size);
      if (hit1 || hit2) {
          gameOver();
      }
    }
    if (bird.y >= height - this.size / 2) {
      gameOver();
    }
  }
}

class Stars {
  constructor(){
    this.amount = 300;
    this.xposlist = [];
    this.yposlist = [];
    this.strokeweightlist = [];
    for (var i = 0; i < this.amount; i++) {
      this.xposlist[i] = random(0, width);
      this.yposlist[i] = random(0, height);
      this.strokeweightlist[i] = random(0.5, 3);
    }
  }
  show(){
    for (var i = 0; i < this.amount; i++) {
      stroke(255);
      if (random() < 0.02) {
        this.strokeweightlist[i] = random(0.5, 3);
      }
      strokeWeight(this.strokeweightlist[i]);
      point(this.xposlist[i], this.yposlist[i]);
    }
  }
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}