let col = 10;
let row = 18;
let size = 50;
let grid = [];
let box;
let tetromino;
let placeholder = [];
var ptouchposx = 0;
var boxoffset, prevpos;
var score = 0;
let dropcounter = 0;


function setup () {
	// size = (windowWidth-20)/col;
	var sizeCreate = 0;
	while (sizeCreate*col <= windowWidth-20 && sizeCreate*row <= windowHeight-50){
		sizeCreate++;
		size = sizeCreate;
	}
	canvas = createCanvas(col*size, row*size);
	canvas.position((windowWidth/2)-(width/2), (windowHeight/2)-(height/2));
	frameRate(60);
	for (let j = 0; j < row; j++) {
		grid[j] = [];
		for (let i = 0; i < col; i++) {
			grid[j][i] = 0;
			if (j == row-1){
				grid[j][i] = 1;
			}
		}
	}
	box = new Block(5, 0, [random(255), random(255), random(255)]);
}

function keyPressed(){
	if (keyCode == LEFT_ARROW) {
		box.move(-1);
	} else if (keyCode == RIGHT_ARROW){
		box.move(1);
	} else if (!box.landed() && keyCode == DOWN_ARROW){
		for (var j = 0; j < grid.length; j++) {
			if (grid[box.y + 1][box.x] == 0) {
				box.y++;
			}
		}
	}
}


function draw () {
	background(240);
	noFill();
	gameover();

	// Making Grid
	noStroke();
	for (let j = 0; j < grid.length; j++) {
		for (let i = 0; i < grid[0].length; i++) {
			if (grid[j][i] == 0){
				fill(230, 230, 255);
			} else if (grid[j][i] == 1){
				fill(0);
			}
			rect(i*(width/col), j*(width/col), (width/col), (width/col));
		}
	}

	// box

	box.update();
	box.show();
	box.landed();

	// tetromino

	if (box.landed()) {
		var color = box.color;
		placeholder.push(new Placeholder(box.x, box.y, size, color));
		box = new Block(5, 0, [random(255), random(255), random(255)]);
	}
	

	// Placeholder

	for (let i = placeholder.length-1; i >= 0 ; i--){
		placeholder[i].show();
	}
	clearLine();
	fill(0);
	textSize(28);
	text('SCORE: '+score, 0, 25);

	dropcounter++;
}

function touchStarted(){
	prevpos = box.x;
	boxoffset = box.x * box.size;
	ptouchposx = touches[0].x;
}

function touchMoved(){
	var offset = ptouchposx - boxoffset;
	var boxx = floor(map(touches[0].x, offset, width + offset, 0, col));
	boxx = constrain(boxx, 0, col-1);
	box.x = boxx;
}

function touchEnded(){
	var newpos = box.x;
	if (dropcounter > 5) {
		if (prevpos == newpos) {
			if (!box.landed()){
				for (var j = 0; j < grid.length; j++) {
					if (grid[box.y + 1][box.x] == 0) {
						box.y++;
					}
				}
			}
			dropcounter = 0;		
		}	
	}	
}




function clearLine () {
	for (var j = grid.length - 2; j >= 0; j--) {
		var filled = false;
		for (var i = 0; i < grid[0].length; i++) {
			if (grid[j][i] == 0) {
				break;
			}
			if (i == grid[0].length-1) {
				filled = true;
			}
		}
		if (filled == true) {
			for (var i = grid[0].length - 1; i >= 0; i--) {
				grid[j][i] = 0;
				for (var k = placeholder.length - 1; k >= 0; k--) {
					if (placeholder[k].y == j && placeholder[k].x == i) {
						placeholder.splice(k, 1);
					}
				}
				
			}
			for (var l = j; l >= 1; l--) {
				for (var i = 0; i < grid[0].length; i++) {
					grid[l][i] = grid[l-1][i];
				}
			}
			for (var i = 0; i < grid[0].length; i++) {
				grid[0][i] = 0;
			}
			movedown(j);
			score += 10;
		}
	}
}
function movedown (mdlvl){
	for (var j = mdlvl - 1; j >= 0; j--) {
		for (var i = 0; i < grid[0].length; i++) {
			for (var k = placeholder.length - 1; k >= 0; k--) {
				if (placeholder[k].y == j && placeholder[k].x == i) {
					placeholder[k].y += 1;
				}
			}
		}
	}
}

function gameover (){
	if (box.y == 0 && grid[box.y+1][box.x] == 1) {
		noLoop();
		if (confirm("Gameover! Want to play again?")){
			for (let j = 0; j < row; j++) {
				grid[j] = [];
				for (let i = 0; i < col; i++) {
					grid[j][i] = 0;
					if (j == row-1){
						grid[j][i] = 1;
					}
				}
			}
			placeholder = [];
			loop();
			box = new Block(5, 0, [random(255),random(255),random(255)]);
		}
	}
}

window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}
