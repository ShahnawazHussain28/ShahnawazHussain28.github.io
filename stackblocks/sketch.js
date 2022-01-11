let canvas;
let block;
let cam;
let font;
var score = 0;
var highScore = 0;
var paused = false;
let scoredisplay, highscoredisplay;
let ui, replaybtn, pausebtn, resumebtn;
let onscreentext;
var blockorientation = 1;
let placeholders = [];
var speed = 2;
var onscreentexts = ["Wow", "Kamaal", "Nice", "Good", "Cool", "Gazab", "Oohh"];

function setup() {
  pixelDensity(1);
  if (displayWidth < displayHeight) {
    canvas = createCanvas(displayWidth, displayHeight, WEBGL);
  } else {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  }
  block = new Block(150, 150, blockorientation);
  cam = createCamera();
  onscreentext = createP("Touch or Press Space").position(0, 40);
  onscreentext.id("onscreentext");
  scoredisplay = createP("Score: " + score).position(0, 0);
  scoredisplay.id("scoredisplay");
  replaybtn = select("#replaybtn");
  replaybtn.mousePressed(restart);
  pausebtn = createElement("i").class("fa fa-pause").mousePressed(pause)
            .position(0, 0).id("pausebtn");
  resumebtn = select("#resumebtn").mousePressed(resume);
  canvas.mousePressed(controls);
  ui = select("#ui");
  highscoredisplay = select("#highscoredisplay").html("Highest: " + highScore);
}

function draw() {
  rotateX(QUARTER_PI*1.2);
  rotateZ(QUARTER_PI);
  background('rgba(0,0,0,0)');
  fill(220, 0, 0);
  box(150, 150, 20);
  for (var i = 0; i < placeholders.length; i++) {
    placeholders[i].show();
  }  
  block.update();
  block.show();
  scoredisplay.html("Score: " + score);
}

function keyPressed() {
  if (key == " ") {
    controls();
  }
}

function controls(){
  if (!paused) {
    block.fire();
    if (!checkgameover(block)) {
      if (abs(block.xpos) <= 5 && abs(block.ypos) <= 5) {
        block.xpos = 0;
        block.ypos = 0;
        score += 3;
        onscreentext.html("Excellent !!!!");
      } else {
        onscreentext.html(random(onscreentexts));
        score ++;
      }
      var neww = block.w - abs(block.xpos);
      var newh = block.h - abs(block.ypos);
      placeholders.push(
        new Placeholder(block.xpos/2, block.ypos/2, neww, newh, block.d, block.color)
      );
      blockorientation *= -1;
      block = new Block(neww, newh, blockorientation);
      cam.move(0, -15, 15);
      if (score > highScore) {
        highScore = score;
      }
      highscoredisplay.html("Highest: " + highScore);
      speed += 0.02;
      block.speed = speed;
    }
  }  
}

function checkgameover(bloc){
  if (abs(bloc.xpos) >= bloc.w || abs(bloc.ypos) >= bloc.h) {
    console.log("GAME OVER");
    onscreentext.html("GAME OVER");
    ui.style("backdrop-filter: blur(2px)");
    resumebtn.hide();
    replaybtn.style("left: calc(50% - 0.5em)");
    scoredisplay.style("font-size: 2em");
    scoredisplay.style("font-weight: 900");
    scoredisplay.style("line-height: 2px");
    highscoredisplay.style("text-align: center");
    highscoredisplay.style("font-size: 2em");
    highscoredisplay.style("top: 15%");
    onscreentext.style("text-shadow: 0 0 10px yellow");
    pausebtn.hide();
    ui.show()
    return true;
  }
}

function pause (){
  paused = true;
  pausebtn.hide();
  ui.show();
  noLoop();
}

function resume (){
  paused = false;
  pausebtn.show();
  ui.hide();
  loop();
}

function restart () {
  placeholders = [];
  paused = false;
  cam.setPosition(0, 0, (height/2) / tan(PI/6));
  onscreentext.html("Let's Play Again");
  ui.hide();
  ui.style("backdrop-filter: blur(5px)");
  resumebtn.show();
  replaybtn.style("left: 25%");
  pausebtn.show();
  scoredisplay.style("font-size: 1.5em");
  scoredisplay.style("font-weight: normal");
  scoredisplay.style("line-height: normal");
  highscoredisplay.style("text-align: left");
  highscoredisplay.style("font-size: 1em");
  highscoredisplay.style("top: 0%");
  onscreentext.style("text-shadow: none"); 
  score = 0;
  block = new Block(150, 150, blockorientation);
  loop();
}

class Block {
  constructor(w, h, orientation = 1) {
    this.w = w;
    this.h = h;
    this.d = 20;
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = this.d;
    if (orientation == 1) {
      this.xpos = -200;
      this.dir = createVector(1, 0);
    } else if (orientation == -1) {
      this.ypos = -200;
      this.dir = createVector(0, 1);
    }
    this.speed = 2;
    this.moving = true;
    this.color = color(random(255), random(255), random(255));
  }
  update() {
    if (this.moving == true) {
      this.xpos += this.dir.x * this.speed;
      this.ypos += this.dir.y * this.speed;
      if (this.xpos >= 200) {
        this.dir.x = -1;
      } else if (this.xpos <= -200) {
        this.dir.x = 1;
      }
      if (this.ypos >= 200) {
        this.dir.y = -1;
      } else if (this.ypos <= -200) {
        this.dir.y = 1;
      }
    } else {
      this.zpos -= 2;
    }
  }
  fire() {
    this.moving = false;
  }
  show() {
    fill(this.color)
    translate(this.xpos, this.ypos, this.zpos);
    box(this.w, this.h, this.d);
  }
}

class Placeholder {
  constructor(x, y, w, h, d, colour = color(255,0,200)) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.d = d;
    this.color = colour;
  }
  show() {
    fill(this.color);
    translate(this.x, this.y, this.d);
    box(this.w, this.h, this.d);
  }
}

window.onload = () => {
    let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
    bannerNode.parentNode.removeChild(bannerNode);
}
