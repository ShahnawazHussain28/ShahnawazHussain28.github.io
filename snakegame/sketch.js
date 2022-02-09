let snakeBody = [];
let head, food;
let w = 20;
let rows, cols;
let controls, up, down, left, right;
var score = 0, scoreDisplay;
let gameOverScreen, restartBtn;


function setup() {
	var canvasW = constrain(windowWidth - 30, 0, 900);
	var canvasH = windowHeight-200;
	rows = floor(canvasH / w);
	cols = floor(canvasW / w);
	createCanvas(cols*w, rows*w);
	head = new Head(floor(cols/2), floor(rows/2));
	snakeBody.push([head.pos.x, head.pos.y]);
	food = new Food();
	frameRate(10);
	gameOverScreen = createDiv().id("gameOverScreen").hide();
	restartBtn = createButton("Restart").mousePressed(restart).parent(gameOverScreen);
	controls = createDiv().id("controls").parent(select("body"));
	createDiv().parent(controls).id("centerBtn");
	up = createButton("&#11165;").parent(controls).class("button").id("up").attribute("onmousedown", "UpAction()");
	down = createButton("&#11167;").parent(controls).class("button").id("down").attribute("onmousedown", "DownAction()");
	left = createButton("&#11164;").parent(controls).class("button").id("left").attribute("onmousedown", "LeftAction()");
	right = createButton("&#11166;").parent(controls).class("button").id("right").attribute("onmousedown", "RightAction()");
	scoreDisplay = createP("Score: 0").id("score");
}

function draw() {
	background(51);
	head.update();
	head.show();	
	food.show();

	if (head.pos.x == food.pos.x && head.pos.y == food.pos.y) {
		snakeBody.push([snakeBody[snakeBody.length-1][0], snakeBody[snakeBody.length-1][1]]);
		score++;
		scoreDisplay.html("Score: " + score);
		food = new Food();
	}
	head.collision();
}

function keyPressed() {
	if     (keyCode == LEFT_ARROW && head.dir.x != 1)   head.dir = createVector(-1,  0);
	else if(keyCode == RIGHT_ARROW && head.dir.x != -1) head.dir = createVector( 1,  0);
	else if(keyCode == UP_ARROW && head.dir.y != 1)     head.dir = createVector( 0, -1);
	else if(keyCode == DOWN_ARROW && head.dir.y != -1)  head.dir = createVector( 0,  1);
}

function UpAction(){
	if(head.dir.y != 1) head.dir = createVector(0, -1);
}
function DownAction(){
	if(head.dir.y != -1) head.dir = createVector(0, 1);
}
function LeftAction(){
	if(head.dir.x != 1) head.dir = createVector(-1, 0);
}
function RightAction(){
	if(head.dir.x != -1) head.dir = createVector(1, 0);
}

function win() {
	textAlign(CENTER, CENTER);
	textSize(36);
	noStroke();
	text("You Won", width/2, height/2);
	noLoop();
}

function restart () {
	snakeBody = [];
	score = 0;
	scoreDisplay.html("Score: " + score);
	head = new Head(floor(cols/2), floor(rows/2));
	snakeBody.push([head.pos.x, head.pos.y]);
	food = new Food();
	gameOverScreen.hide();
	loop();
}
function gameOver () {
	gameOverScreen.style("display", "flex");
	noLoop();
}


class Head {
	constructor(x, y){
		this.pos = createVector(x, y);
		this.dir = createVector(0, -1);
	}
	update(){
		this.pos.add(this.dir);

		if (this.pos.x < 0){
			this.pos.x = cols-1;
		} else if (this.pos.x > cols - 1){
			this.pos.x = 0;
		}
		if (this.pos.y < 0){
			this.pos.y = rows-1;
		} else if (this.pos.y > rows - 1){
			this.pos.y = 0;
		}

		for (var i = snakeBody.length - 1; i >= 0; i--) {
			if (i == 0) {
				snakeBody[i] = [this.pos.x, this.pos.y];
			} else {
				snakeBody[i] = snakeBody[i-1];
			}
		}
	}
	collision(){
		var collided = false;
		for (var i = 2; i < snakeBody.length; i++) {
			if (head.pos.x == snakeBody[i][0] && head.pos.y == snakeBody[i][1]) {
				collided = true;
				gameOver();
				break;
			}
		}
	}
	show(){
		noStroke();
		fill("brown");
		for (var i = 0; i < snakeBody.length; i++) {
			var part = snakeBody[i];
			rect(part[0]*w, part[1]*w, w, w);
		}
		noFill();
		stroke(255);
		strokeWeight(5);
		rect(this.pos.x*w, this.pos.y*w, w, w);
	}
}

class Food {
	constructor(){
		var availableSpots = [];
		for (var j = 0; j < rows; j++) {
			for (var i = 0; i < cols; i++) {
				availableSpots.push([i, j]);
			}
		}
		for (var i = 0; i < snakeBody.length; i++) {
			var body = snakeBody[i];
			availableSpots.splice(availableSpots.indexOf([body[0], body[1]]), 1);
		}
		var rand = random(availableSpots);
		if (availableSpots.length == 0) win();
		else this.pos = createVector(rand[0], rand[1]);	
	}
	show(){
		fill(0, 255, 255);
		rect(this.pos.x*w, this.pos.y*w, w, w);
	}
}
