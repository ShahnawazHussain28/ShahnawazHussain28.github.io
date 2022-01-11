let asteroids = [];
let bullets = [];
let pausebtn, resumebtn, leftbtn, rightbtn, boostbtn, shootbtn;
let ship;
var shipHealth = 5;
var leftKeyIsDown = false;
var rightKeyIsDown = false;
var damageOnFrameNumber = 0;
var score = 0;

function setup(){
	createCanvas(windowWidth, windowHeight - 80);
	for (var i = 0; i < 5; i++) {
		var x = random(width);
		var y = random(height);
		while(dist(x, y, width/2, height/2) < 100) {
			x = random(width);
			y = random(height);
		}
		asteroids[i] = new Asteroid(x, y, random(35,50));

	}
	ship = new Ship(width/2, height/2);
	leftbtn = createButton("<i class='fa fa-arrow-left'></i>").id("leftbtn");
	leftbtn.elt.ontouchstart = leftdown;
	leftbtn.elt.ontouchend = leftup;
	rightbtn = createButton("<i class='fa fa-arrow-right'></i>").id("rightbtn");
	rightbtn.elt.ontouchstart = rightdown;
	rightbtn.elt.ontouchend = rightup;
	boostbtn = createButton("<i class='fa fa-fire'></i>").id("boostbtn");
	boostbtn.elt.ontouchstart = boostdown;
	boostbtn.elt.ontouchend = boostup;
	shootbtn = createButton("S").id("shootbtn");
	shootbtn.elt.ontouchstart = shootinput;
	document.ontouchend = windowUp;
	pausebtn = createElement("i").class("fa fa-pause").id("pausebtn").mouseClicked(pause);
	resumebtn = select("#resumebtn");
}
function draw(){
	background(51);
	fill(51);
	stroke(255);
	for (var i = 0; i < asteroids.length; i++) {
		asteroids[i].update();
		asteroids[i].show();
	}
	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].update();
		bullets[i].show();
		for (var j = asteroids.length - 1; j >= 0; j--) {
			if(bullets[i].hits(asteroids[j])){
				var x = asteroids[j].pos.x;
				var y = asteroids[j].pos.y;
				var r = asteroids[j].r;
				asteroids.splice(j, 1);
				bullets.splice(i, 1);
				if (r > 20) {
					score += 1;
					for (var i = 0; i < floor(random(2, 4)); i++) {
						asteroids.push(new Asteroid(x, y, r/2));
					}
				} else {
					score += 3;
				}
				return;
			}
		}
		if (bullets[i].pos.x > width || bullets[i].pos.x < 0 || bullets[i].pos.y > height || bullets[i].pos.y < 0) {
			bullets.splice(i, 1);
		}
	}
	if (ship.damage()){
		shipHealth--;
		damageOnFrameNumber = frameCount;
		shipHealth = constrain(shipHealth, 0, 6);
	}
	if (frameCount > 24 && frameCount - damageOnFrameNumber < 20) {
		fill("red");
	} else {
		damageOnFrameNumber = 0;
	}
	if (shipHealth <= 0) {
		gameOver();
	}
	ship.update();
	ship.show();
	spawnAsteroids();
	scoreDisplay();
	healthBar(shipHealth);
}

function keyPressed(){
	if (keyCode == LEFT_ARROW) {
		leftKeyIsDown = true;
		ship.rotate(-1);
	} else if (keyCode == RIGHT_ARROW) {
		rightKeyIsDown = true;
		ship.rotate(1);
	}
	if (keyCode == UP_ARROW) {
		ship.boost(true);
	}
	if (key == " ") {
		ship.shoot();
	}
}
function keyReleased(){
	if (keyCode == LEFT_ARROW) {
		leftKeyIsDown = false;
		if (!rightKeyIsDown) {
			ship.rotate(0);
		}
	}
	if (keyCode == RIGHT_ARROW) {
		rightKeyIsDown = false;
		if (!leftKeyIsDown) {
			ship.rotate(0);
		}
	}
	if (keyCode == UP_ARROW) {
		ship.boost(false);
	}
}

function leftdown(){
	leftKeyIsDown = true;
	ship.rotate(-1);
}
function leftup(){
	leftKeyIsDown = false;
	if (!rightKeyIsDown) {
		ship.rotate(0);
	}
}
function rightdown(){
	rightKeyIsDown = true;
	ship.rotate(1);
}
function rightup(){
	rightKeyIsDown = false;
	if (!leftKeyIsDown) {
		ship.rotate(0);
	}
}
function boostdown(){
	ship.boost(true);
}
function boostup(){
	ship.boost(false);
}
function shootinput(){
	ship.shoot();
}
function windowUp(){
	leftup();
	rightup();
	boostup();
}

function gameOver(){
	noLoop();
	leftbtn.hide();
	rightbtn.hide();
	boostbtn.hide();
	shootbtn.hide();
	resumebtn.hide();
	pausebtn.hide();
	select("#gameoverscreen").show();
}
function restart(){
	leftbtn.show();
	rightbtn.show();
	boostbtn.show();
	shootbtn.show();
	pausebtn.show();
	resumebtn.show();
	select("#gameoverscreen").hide();
	asteroids = [];
	bullets = [];
	for (var i = 0; i < 5; i++) {
		var x = random(width);
		var y = random(height);
		while(dist(x, y, width/2, height/2) < 100) {
			x = random(width);
			y = random(height);
		}
		asteroids[i] = new Asteroid(x, y, random(35,50));
	}
	ship = new Ship(width/2, height/2);
	shipHealth = 6;
	score = 0;
	loop();
}

function pause(){
	noLoop();
	pausebtn.hide();
	select("#gameoverscreen").show();
}
function resume(){
	pausebtn.show();
	select("#gameoverscreen").hide();
	loop();
}
function share(){
  window.location.href = "https://wa.me/?text=I%20Scored%20" + highscore + "%20in%20Asteroids" + "%0ACan%20You%20Beat%20Me%3F%0Ahttps%3A%2F%2Fitsfunzone.000webhostapp.com%2Fasteroids";
}

function spawnAsteroids (){
	var bigAsteroids = 0;
	var smallAsteroids = 0;
	for (var i = 0; i < asteroids.length; i++) {
		if (asteroids[i].r >= 35) {
			bigAsteroids++;
		} else {
			smallAsteroids++;
		}
	}
	if (bigAsteroids < 4 && smallAsteroids < 10) {
		var x = random(width);
		var y = random(height);
		while(dist(x, y, ship.x, ship.y) < 100) {
			x = random(width);
			y = random(height);
		}
		asteroids.push(new Asteroid(x, y, random(35, 50)));
	}
}

function healthBar (health) {
	var size = 20;
	var h = health;
	for (var i = 0; i < 5; i++) {
		push();
		if (h > 0) {
			fill("red");
		} else {
			fill(51);
		}
		stroke(255);
		translate(width - (size + 10) * (i + 1), 10);
		rect(0, 0, 20, 20);
		pop();
		h--;
	}
}

function scoreDisplay(){
	noStroke();
	fill(255);
	textSize(16);
	text("Score: " + score, 10, 10, width, 50);
}

class Ship {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.vel = createVector(0, 0);
		this.rotateDir = 0;
		this.isBoosting = false;
		this.head = 0;
		this.size = 40;
	}
	rotate(dir){
		this.rotateDir = dir;
	}
	update(){
		if (this.x > width + this.size/2) {
			this.x = - this.size/2;
		} else if (this.x < - this.size/2) {
			this.x = width + this.size/2;
		} 
		if (this.y > height + this.size/2) {
			this.y = - this.size/2;
		} else if (this.y < - this.size/2) {
			this.y = height + this.size/2;
		}
		var drag = createVector(-this.vel.x, -this.vel.y);
		this.vel.add(drag.mult(0.01));
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.head += this.rotateDir * 0.05;
		if (this.isBoosting) {
			var force = p5.Vector.fromAngle(this.head);
			this.vel.add(force.mult(0.1));
		}
	}
	boost(bool){
		this.isBoosting = bool;
	}
	shoot(){
		bullets.push(new Bullet(this.x, this.y, this.head));
	}
	damage(){
		for (var i = 0; i < asteroids.length; i++) {
			if (dist(this.x, this.y, asteroids[i].pos.x, asteroids[i].pos.y) < asteroids[i].r*0.7 + this.size*0.5 ) {
				var contact = asteroids[i].isInContact;
				asteroids[i].isInContact = true;
				if (!contact) {
					return true;
				} else {
					return false;
				}
			} else {
				asteroids[i].isInContact = false;
			}
		}
	}
	show(){
		push();
		translate(this.x, this.y);
		rotate(this.head);
		triangle(-this.size/2, this.size/2, -this.size/2, -this.size/2, this.size/2, 0);
		pop();
	}
}

class Bullet {
	constructor(x, y, dir){
		this.pos = createVector(x, y);
		this.dir = dir;
		this.vel = p5.Vector.fromAngle(this.dir).setMag(7);
	}
	update(){
		this.pos = this.pos.add(this.vel);
	}
	hits(asteroid){
		return dist(asteroid.pos.x, asteroid.pos.y, this.pos.x, this.pos.y) < asteroid.r;
	}
	show(){
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.dir);
		line(0, 0, 5, 0);
		pop();
	}
}

class Asteroid {
	constructor(x, y, r){
		this.pos = createVector(x, y);
		this.vel = createVector(random(-1, 1), random(-1, 1));
		this.total = random(5, 15);
		this.offsets = [];
		this.r = r;
		for (var i = 0; i < TWO_PI; i+=TWO_PI/this.total) {
			this.offsets[i] = random(-this.r/2, this.r/2);
		}
		this.isInContact = false;
	}
	update(){
		if (this.pos.x > width + this.r * (3/2)) {
			this.pos.x = - this.r * (3/2);
		} else if (this.pos.x < - this.r * (3/2)) {
			this.pos.x = width + this.r * (3/2);
		} 
		if (this.pos.y > height + this.r * (3/2)) {
			this.pos.y = - this.r * (3/2);
		} else if (this.pos.y < - this.r * (3/2)) {
			this.pos.y = height + this.r * (3/2);
		} 
		this.pos.add(this.vel);
	}
	show(){
		push();
		beginShape();
		translate(this.pos.x, this.pos.y);
		for (var i = 0; i < TWO_PI; i+=TWO_PI/this.total) {
			var x = (this.r + this.offsets[i]) * cos(i);
			var y = (this.r + this.offsets[i]) * sin(i); 
			vertex(x, y);
		}
		endShape(CLOSE);
		pop();
	}
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
};