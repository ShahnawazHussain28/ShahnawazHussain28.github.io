var board = [];
var coppiedboard;
var outOfBounds, showOutOfBounds = false;
var rows = 50, cols = 50;
var edit = "draw";
var patternToPlace;
var density = 0.2;
var size;
var canvasSize, canv;
var wrap = true;
var isPlaying = false;
var placing = false;
let gamecont, container;

let pauseplayBtn, patternSelect, dragPlace, editPatternBtn, randomizeBtn, clearBtn,
	colsInput, rowsInput, setRowsColsBtn, wrapBtn;

function setup(){
	frameRate(15);
	container = select("#container");
	canvasSize = setCanvasSize(windowWidth, windowHeight);
	canv = createCanvas(canvasSize.x, canvasSize.y).attribute("onmouseup", "dragup()").attribute("ontouchend", "dragup()").parent(container);
	gamecont = createDiv().id("gamecont").parent(container);
	outOfBounds = createGraphics(width, height);
	background(100);
	push();
	outOfBounds.textSize(38);
	outOfBounds.textAlign(CENTER);
	outOfBounds.fill(255);
	outOfBounds.background(50, 150);
	outOfBounds.text("Pattern is Out Of Bounds", width/2, height/2 - 50);
	outOfBounds.textSize(26);
	outOfBounds.text("Move the Pattern inside", width/2, height/2);
	outOfBounds.text("Or change Rows and Columns", width/2, height/2 + 50);
	pop();
	pauseplayBtn = createButton("PLAY").mouseClicked(pausePlay).parent(gamecont);
	patternSelect = createSelect();
	patternSelect.option('Glider');
	patternSelect.option('Glider Gun');
	patternSelect.option('The Line');
	patternSelect.option('Pulsar');
	patternSelect.option('Pentadecathlon');
	patternSelect.option('Light Spaceship');
	patternSelect.option('Middle Spaceship');
	patternSelect.option('Heavy Spaceship');
	patternSelect.option('Clover Leaf')
	patternSelect.parent(gamecont);
	dragPlace = createButton("GRAG").attribute("onmousedown", "dragdown()").attribute("onmouseup", "dragup()").attribute("ontouchstart", "dragdown()").attribute("ontouchend", "dragup()").parent(gamecont);
	select("body").attribute("onmouseup", "dragup()").attribute("ontouchend", "dragup()");
	editPatternBtn = createButton("Erase").mouseClicked(editPattern).parent(gamecont);
	randomizeBtn = createButton("Randomize").mouseClicked(randomize).parent(gamecont);
	clearBtn = createButton("Clear").mouseClicked(clearBoard).parent(gamecont);
	colsInput = createElement("input").attribute("type", "text").parent(gamecont);
	rowsInput = createElement("input").attribute("type", "text").parent(gamecont);
	setRowsColsBtn = createButton("Set").mouseClicked(setRowsCols).parent(gamecont);
	wrapBtn = select("#wrapbtn").style("left", width+"px").changed(wrapStateChange);
	select("label").style("left", width+"px");
	patternToPlace = select("select").elt.value;
	setRowsCols();
	colsInput.attribute("placeholder", "Columns: "+cols);
	rowsInput.attribute("placeholder", "Rows: "+rows);
	coppiedboard = copyBoard(board);
	setCssGrid();
	noStroke();
}

function draw(){
	background(100);
	if (isPlaying) {
		simulate();
		drawBoard(board);
	} else {	
		drawBoard(coppiedboard);
	}
	if (showOutOfBounds) {
		image(outOfBounds, 0, 0, width, height);
	}
}

function setCanvasSize(w, h){
	var thisSize = createVector(w, h);
	if (h > w) {
		thisSize.x = w - 30;
		thisSize.y = h - 175;
	} else {
		thisSize.x = w - 200;
		thisSize.y = h - 30;
	}
	return thisSize;
}

function setRowsCols(){
	var thisrows = rowsInput.value();
	var thiscols = colsInput.value();
	if (thisrows == '' && thiscols == '') {
		var thisSize = 45;
		if (width > height) {
			size = height / thisSize;
			rows = thisSize;
			cols = floor((width / height) * rows);
		} else {
			size = width / thisSize;
			cols = thisSize;
			rows = floor((height / width) * cols);
		}
	} else if (thisrows != '' && thiscols == '') {
		rows = parseInt(thisrows);
		size = height / rows;
		cols = floor((width / height) * rows);
	} else if (thisrows == '' && thiscols != '') {
		cols = parseInt(thiscols);
		size = width / cols;
		rows = floor((height / width) * cols);
	} else if (thisrows != '' && thiscols != '') {
		cols = parseInt(thiscols);
		rows = parseInt(thisrows);
		if ((width / height) > (cols / rows)) {
			size = height / rows;
		} else {
			size = width / cols;
		}
		size = width / cols;
	}
	board = createBoard(true);
	coppiedboard = copyBoard(board);
	if (isPlaying) {
		pausePlay();
	}
}

function setCssGrid(){
	if (windowHeight > windowWidth) {
		container.class("containerVerical");
		gamecont.style("width", width+"px");
		gamecont.style("grid-template-rows: repeat(3, 1fr)");
		gamecont.style("grid-template-columns: repeat(3, 1fr)");
	} else{
		container.class("containerHorizontal");
	}
}


function mousePressed(){
	var x = floor(mouseX / size);
	var y = floor(mouseY / size);
	if(y >= 0 && y < rows && x >= 0 && x < cols){
		if (!isPlaying && !placing) {
			if (edit == "draw") {
				coppiedboard[y][x] = 1;
				board[y][x] = 1;
			} else if (edit == "erase"){
				coppiedboard[y][x] = 0;
				board[y][x] = 0;
			}
		}
	}
}

function mouseDragged(){
	var x = floor(mouseX / size);
	var y = floor(mouseY / size);

	if (placing) {
		coppiedboard = copyBoard(board);
		var x = floor(mouseX / size);
		var y = floor(mouseY / size);
		coppiedboard = placePattern(patternToPlace, coppiedboard, y, x);
	}

	if (y >= 0 && y < rows && x >= 0 && x < cols && !isPlaying && !placing){
		if (edit == "draw"){
			coppiedboard[y][x] = 1;
			board[y][x] = 1;
		}
		else if (edit == "erase") {
			coppiedboard[y][x] = 0;
			board[y][x] = 0;
		}
	}
}


function keyPressed(){
	if (key == " ") {
		pausePlay();	
	}
}


function simulate(){
	var newBoard = createBoard();
	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < cols; i++) {
			var liveNeighbours = countNeighbours(board, j, i);
			var state = board[j][i];

			if(state == 0 && liveNeighbours == 3) {
				newBoard[j][i] = 1;
			} else if (state == 1 && (liveNeighbours < 2 || liveNeighbours > 3)) {
				newBoard[j][i] = 0;
			} else {
				newBoard[j][i] = state;
			}
		}
	}
	board = newBoard;
}

function drawBoard(thisBoard){
	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < cols; i++) {
			if (thisBoard[j][i] == 1) {
				fill(0);
			} else {
				fill(200);
			}
			rect(i*size, j*size, size, size);
		}
	}
}

function countNeighbours(board, y, x){
	var sum = 0;
	if (!wrap) {
		if (x == 0 || x == cols - 1 || y == 0 || y == rows - 1) {
			return sum;
		}
	}
	for (var j = -1; j < 2; j++) {
		for (var i = -1; i < 2; i++) {
			let col = (x + i + cols) % cols;
			let row = (y + j + rows) % rows;
			sum += board[row][col];
		}
	}
	sum -= board[y][x];
	return sum;
}

function createBoard(blank = true){
	thisBoard = [];
	for (var j = 0; j < rows; j++) {
		thisBoard[j] = [];
		for (var i = 0; i < cols; i++) {
			if(!blank){
				if (random(0, 1) < density) {
					thisBoard[j][i] = 1;
				} else {
					thisBoard[j][i] = 0;
				}
			} else {
				thisBoard[j][i] = 0;
			}
		}
	}
	return thisBoard;
}

function placeHandler(pattern, thisBoard,  y, x){
	var centerX = floor(pattern[0].length / 2);
	var centerY = floor(pattern.length / 2);
	for (var j = 0; j < pattern.length; j++) {
		for (var i = 0; i < pattern[0].length; i++) {
			var placeX = x - centerX + i;
			var placeY = y - centerY + j;
			if (placeX >= 0 && placeX < cols && placeY >= 0 && placeY < rows) {
				if (pattern[j][i] == 1) {
					thisBoard[y - centerY + j][x - centerX + i] = pattern[j][i];
				}
				showOutOfBounds = false;
			} else {
				showOutOfBounds = true;
			}
		}
	}
	return thisBoard;
}

function copyBoard(thisBoard){
	var returnBoard = [];
	for (var j = 0; j < rows; j++) {
		returnBoard[j] = [];
		for (var i = 0; i < cols; i++) {
			returnBoard[j][i] = thisBoard[j][i];
		}
	}
	return returnBoard;
}

function pausePlay(){
	if (isPlaying) {
		dragPlace.elt.disabled = false;
		editPatternBtn.elt.disabled = false;
		isPlaying = false;
		pauseplayBtn.html("PLAY");
		coppiedboard = copyBoard(board);
	} else {
		dragPlace.elt.disabled = true;
		editPatternBtn.elt.disabled = true;
		isPlaying = true;
		pauseplayBtn.html("STOP");
		placing = false;
	}
}

function dragdown(){
	if (!isPlaying) {
		placing = true;
		patternToPlace = select("select").elt.value;
	}
}
function dragup(){
	var x = floor(mouseX / size);
	var y = floor(mouseY / size);
	if (placing){
		if(!showOutOfBounds) {
			placePattern(patternToPlace, board, y, x);
		} else {
			coppiedboard = copyBoard(board);
		}
	}
	placing = false;
	showOutOfBounds = false;
}

function editPattern(){
	if (edit == "erase") {
		placing = false;
		edit = "draw";
		editPatternBtn.html("Erase");
	} else if (edit == "draw") {
		placing = false;
		edit = "erase";
		editPatternBtn.html("Draw");
	}
	editPatternBtn.elt.blur();
}

function randomize(){
	board = createBoard(false);
	coppiedboard = copyBoard(board);
	randomizeBtn.elt.blur();
}

function clearBoard(){
	board = createBoard(true);
	coppiedboard = copyBoard(board);
	if (isPlaying) {
		pausePlay();
	}
}

function getHelp(){
	var helpbox = select("#helpbox");
	if (helpbox.style("visibility") == 'hidden') {
		helpbox.style("visibility", "visible");
		select("#qumark").html("&cross;");
	} else {
		helpbox.style("visibility", "hidden");
		select("#qumark").html("?");
	}
}

function wrapStateChange(){
	if (wrapBtn.checked() == true) {
		wrap = true;
	} else {
		wrap = false;
	}
}


function placePattern(patterntoplace, thisBoard,  y, x){
	if (patterntoplace == "Glider") {
		return placeHandler(glider, thisBoard,  y, x);
	} else if (patterntoplace == "Glider Gun") {
		return placeHandler(gliderGun, thisBoard, y, x);
	} else if (patterntoplace == "The Line"){
		return placeHandler(theLine, thisBoard, y, x);
	} else if (patterntoplace == "Pulsar"){
		return placeHandler(pulsar, thisBoard, y, x);
	} else if (patterntoplace == "Pentadecathlon"){
		return placeHandler(pentadecathlon, thisBoard, y, x);
	} else if (patterntoplace == "Light Spaceship"){
		return placeHandler(lightSpaceship, thisBoard, y, x);
	} else if (patterntoplace == "Middle Spaceship"){
		return placeHandler(middleSpaceship, thisBoard, y, x);
	} else if (patterntoplace == "Middle Spaceship"){
		return placeHandler(middleSpaceship, thisBoard, y, x);
	} else if (patterntoplace == "Heavy Spaceship"){
		return placeHandler(heavySpaceship, thisBoard, y, x);
	} else if (patterntoplace == "Clover Leaf"){
		return placeHandler(cloverLeaf, thisBoard, y, x);
	} else if (patterntoplace == "test"){
		return placeHandler(test, thisBoard, y, x);
	}
}



var glider = [[1, 0, 1], [0, 1, 1], [0, 1, 0]];

var gliderGun = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

var theLine = [[1, 1, 1, 1, 1, 1, 1]];

var pulsar = [
[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
];

var pentadecathlon = [
[0, 1, 0],
[0, 1, 0],
[1, 1, 1],
[0, 0, 0],
[0, 0, 0],
[1, 1, 1],
[0, 1, 0],
[0, 1, 0],
[0, 1, 0],
[0, 1, 0],
[1, 1, 1],
[0, 0, 0],
[0, 0, 0],
[1, 1, 1],
[0, 1, 0],
[0, 1, 0]
];

var lightSpaceship = [
[0, 0, 1, 1, 0],
[1, 1, 0, 1, 1],
[1, 1, 1, 1, 0],
[0, 1, 1, 0, 0]
];

var middleSpaceship = [
[1, 1, 1, 1, 1, 0],
[1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0],
[0, 1, 0, 0, 0, 1],
[0, 0, 0, 1, 0, 0]
];

var heavySpaceship = [
[1, 1, 1, 1, 1, 1, 0],
[1, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0],
[0, 1, 0, 0, 0, 0, 1],
[0, 0, 0, 1, 1, 0, 0]
];

var cloverLeaf = [
[0, 0, 0, 1, 0, 1, 0, 0, 0],
[0, 1, 1, 1, 0, 1, 1, 1, 0],
[1, 0, 0, 0, 1, 0, 0, 0, 1],
[1, 0, 1, 0, 0, 0, 1, 0, 1],
[0, 1, 1, 0, 1, 0, 1, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 1, 0, 1, 0, 1, 1, 0],
[1, 0, 1, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 1, 0, 0, 0, 1],
[0, 1, 1, 1, 0, 1, 1, 1, 0],
[0, 0, 0, 1, 0, 1, 0, 0, 0]
];




window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}