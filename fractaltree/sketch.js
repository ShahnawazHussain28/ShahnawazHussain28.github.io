let controls, angleSlider, branchSlider;
var symmetric = true;
let randomLength = [];
let randomizeBtn, symmetricBtn;

function setup(){
	createCanvas(400, 400);
	pixelDensity(1);
	background(51);
	stroke(255);
	controls = createDiv().id("controls").parent(select("body"));
	createElement("label").html("Angle: ").parent(controls);
	angleSlider = createSlider(0, PI, PI / 4, 0).parent(controls);
	createElement("label").html("Branches: ").parent(controls);
	branchSlider = createSlider(0, 12, 8).parent(controls);
	createElement("label").html("Symmetric: ").parent(controls);
	symmetricBtn = createCheckbox("", true).parent(controls).changed(symmetricFn);
	createElement("label").html("Randomize: ").parent(controls);
	randomizeBtn = createButton("Randomize").parent(controls).mouseClicked(randomize);
	for (var i = 0; i < 5800; i++) {
		randomLength[i] = random(0.2, 1);
	}
}
var index;
function draw() {
	background(51);
	var angle = angleSlider.value();
	var branchmax = branchSlider.value();
	index = 0;
	branch(width/2, height, angle, 100, 1, branchmax);
}

function branch(x, y, angle, len, lvl, max){
	push();
	translate(x, y);
	strokeWeight(map(lvl, 0, max, 5, 1));
	line(0, 0, 0, -len);
	index++;
	if (lvl <= max) {
		var thisLength;
		if (symmetric == true) {
			thisLength = 0.67;
		} else {
			thisLength = randomLength[index];
		}
		translate(0, -len);
		rotate(angle);
		branch(0, 0, angle, len * thisLength, lvl + 1, max);
		rotate(-2 * angle);
		branch(0, 0, -angle, len * thisLength, lvl + 1, max);
	}
	pop();
}

function symmetricFn(){
	symmetric = symmetricBtn.checked();
}

function randomize(){
	for (var i = 0; i < 5800; i++) {
		randomLength[i] = random(0.2, 1);
	}
	symmetric = false;
	symmetricBtn.checked(false);
}


window.onload = () => {
    let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
    bannerNode.parentNode.removeChild(bannerNode);
}













































































































































// var tree = [];
// var levels = 0;

// function setup(){
// 	createCanvas(600, 600);
// 	background(51);
// 	stroke(255);
// 	var begin = createVector(width/2, height);
// 	var end = createVector(width/2, height - 130);
// 	tree[0] = new Branch(begin, end);
// }

// function mousePressed(){
// 	if (levels < 10) {
// 		for (var i = tree.length - 1; i >= 0; i--) {
// 			if(!tree[i].finished){
// 				tree.push(tree[i].leftbranch());
// 				tree.push(tree[i].rightbranch());
// 				tree[i].finished = true;
// 			}
// 		}
// 	}
// 	levels++;
// }

// function keyPressed(){
// 	if (keyCode = RIGHT_ARROW) {
// 		for (var i = 0; i < tree.length; i++) {
// 			tree[i].changeAngle(1);
// 		}
// 	} else if (keyCode = LEFT_ARROW) {
// 		for (var i = 0; i < tree.length; i++) {
// 			tree[i].changeAngle(-1);
// 		}
// 	}
// }

// function draw(){
// 	background(51);
// 	for (var i = tree.length - 1; i >= 0; i--) {
// 		tree[i].show();
// 		// tree[i].jitter();
// 	}
// }


// class Branch{
// 	constructor(begin, end, lr = 0){
// 		this.begin = begin;
// 		this.end = end;
// 		this.angle = PI / 4;
// 		this.lr = lr;
// 		this.finished = false;
// 		this.dir = p5.Vector.sub(this.end, this.begin);
// 	}
// 	show(){
// 		line(this.begin.x, this.begin.y, this.end.x, this.end.y);
// 	}
// 	jitter(){
// 		this.end.x += random(-1, 1);
// 		this.end.y += random(-1, 1);
// 	}
// 	changeAngle(){
// 		if (this.lr = -1){
// 			this.dir.rotate(-0.01);
// 			this.end = p5.Vector.add(this.begin, this.dir);
// 		} else if (this.lr = 1) {
// 			this.dir.rotate(0.01);
// 			this.end = p5.Vector.add(this.begin, this.dir);
// 		}
// 	}
// 	leftbranch(){
// 		var leftdir = this.dir.copy();
// 		leftdir.rotate(-this.angle);
// 		leftdir.mult(0.67);
// 		var newEnd = p5.Vector.add(this.end, leftdir);
// 		var newBranch = new Branch(this.end, newEnd, -1);
// 		return newBranch;
// 	}
// 	rightbranch(){
// 		var rightdir = this.dir.copy();
// 		rightdir.rotate(this.angle);
// 		rightdir.mult(0.67);
// 		var newEnd = p5.Vector.add(this.end, rightdir);
// 		var newBranch = new Branch(this.end, newEnd, 1);
// 		return newBranch;
// 	}
// }