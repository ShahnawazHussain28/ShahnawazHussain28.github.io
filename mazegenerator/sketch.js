let grid = [];
var backtrack = [], solvedPath = [];
var size;
var w = 40, cols, rows;
var current;
let speedSlider;
let generating = true, solving = false;
var mazeType = 0, mazeTypeButton, resetButton, sizeSlider;
let container;

function setup() {
	if (windowWidth < windowHeight) {
		size = windowWidth - 10;
	} else {
		size = windowHeight - 150;
	}
	createCanvas(size, size);
	container = createDiv().id("container").style("max-width", size + "px");
	createElement("label").html("Speed").parent(container);
	speedSlider = createSlider(1, 120, 10, 1).parent(container);
	mazeTypeButton = createButton("Maze Type").mousePressed(changeMazeType).parent(container);
	createElement("label").html("Size").parent(container);
	sizeSlider = createSlider(10, 100, 40, 1).parent(container);
	resetButton = createButton("Reset").mousePressed(reset).parent(container);
	background(51);
	createGrid();
	stroke(255);
	frameRate(60);
}

function draw() {
	var speed = 1;
	background(51);
	if (speedSlider.value() <= 60)
		frameRate(speedSlider.value());
	else speed = speedSlider.value() - 60;
	strokeWeight(1);
	for (var j = 0; j < grid.length; j++) {
		for (var i = 0; i < grid[0].length; i++) {
			grid[j][i].show();
		}
	}
	for (var i = 0; i < speed; i++) {
		if (generating) {
			if (mazeType == 1) {
				var next = current.checkNeighbours();
				if (next) {
					addBlocks(current, next);
					current = next;
					fill(0, 255, 255);
					rect(current.i*w, current.j*w, w, w);
					if(!current.visited)
						backtrack.push([current.i, current.j]);
					current.visited = true;
				}
				if (backtrack.length == 0) generating = false;
			}
			else if (mazeType == 0) {
				var next = current.checkNeighbours();
				if (next) {
					removeWalls(current, next);
					current = next;
					fill(0, 255, 255);
					rect(current.i*w, current.j*w, w, w);
					if(!current.visited)
						backtrack.push([current.i, current.j]);
					current.visited = true;
				}
				if (backtrack.length == 0) generating = false;
			}
		}
	}

	if (solving){
		for (var i = 1; i < solvedPath.length; i++) {
			var py = solvedPath[i-1][0];
			var px = solvedPath[i-1][1];
			var y = solvedPath[i][0];
			var x = solvedPath[i][1];
			stroke("red");
			strokeWeight(w / 4);
			line((px*w)+(w/2), (py*w)+(w/2), (x*w)+(w/2), (y*w)+(w/2));
		}
	}

}


function mousePressed(){
	if(!generating){
		var x = floor(map(mouseX, 0, width, 0, cols));
		var y = floor(map(mouseY, 0, height, 0, rows));
		solvedPath = solveMaze(grid, [0, 0], [y, x]);
		solving = true;
	}
}

function createGrid () {
	cols = floor(width/w);
	rows = floor(height/w);
	for (var j = 0; j < rows; j++) {
		grid[j] = [];
		for (var i = 0; i < cols; i++) {
			grid[j][i] = new Cell(i, j);
		}
	}
	current = grid[0][0];
	current.visited = true;
	backtrack.push([current.i, current.j]);
}

class Cell {
	constructor(i, j){
		this.i = i;
		this.j = j;
		this.block = false;
		this.walls = [true,true,true,true];
		this.visited = false;
	}

	checkNeighbours(){
		var neighbours = [];
		if(this.j != 0)
			var top    = grid[this.j-1][this.i];
		if(this.i != cols-1)
			var right  = grid[this.j][this.i+1];
		if(this.j != rows-1)
			var bottom = grid[this.j+1][this.i];
		if(this.i != 0)
			var left   = grid[this.j][this.i-1];
		if(top && !top.visited && !top.block){
			neighbours.push(top);
		}
		if(right && !right.visited && !right.block){
			neighbours.push(right);
		}
		if(bottom && !bottom.visited && !bottom.block){
			neighbours.push(bottom);
		}
		if(left && !left.visited && !left.block){
			neighbours.push(left);
		}
		if(neighbours.length > 0){
			var idx = floor(random(0, neighbours.length));
			return neighbours[idx]; 
		} else {
			backtrack.pop();
			var idx = backtrack[backtrack.length-1];
			if (idx)
				return grid[idx[1]][idx[0]];
		}
	}

	show(){
		var x = this.i * w;
		var y = this.j * w;
		stroke(255);
		if (mazeType == 0) {
			if(this.walls[0])
				line(x,   y,   x+w, y);
			if(this.walls[1])
				line(x+w, y,   x+w, y+w);
			if(this.walls[2])
				line(x,   y+w, x+w, y+w);
			if(this.walls[3])
				line(x,   y,   x,   y+w);
		} else if (mazeType == 1) {
			if (this.block) fill(0);
			else 			fill(255);
			rect(x, y, w, w);
		}
	}
}

function removeWalls (current, next) {
	var xDiff = next.i - current.i;
	var yDiff = next.j - current.j;
	if(xDiff == 1){
		current.walls[1] = false;
		next.walls[3] = false;
	} else if (xDiff == -1){
		current.walls[3] = false;
		next.walls[1] = false;
	} else if (yDiff == 1){
		current.walls[2] = false;
		next.walls[0] = false;
	} else if (yDiff == -1){
		current.walls[0] = false;
		next.walls[2] = false;
	}
}

function addBlocks (current, next) {
	var xDiff = next.i - current.i;
	var yDiff = next.j - current.j;
	if(xDiff == 1){
		if(grid[current.j-1]) 
			if (!grid[current.j-1][current.i].visited) grid[current.j-1][current.i].block = true;
		if(grid[current.j+1]) 
			if (!grid[current.j+1][current.i].visited) grid[current.j+1][current.i].block = true;
	} else if (xDiff == -1){
		if(grid[current.j-1])
			if (!grid[current.j-1][current.i].visited) grid[current.j-1][current.i].block = true;
		if(grid[current.j+1]) 
			if (!grid[current.j+1][current.i].visited) grid[current.j+1][current.i].block = true;
	} else if (yDiff == 1){
		if(grid[current.j][current.i-1] && !grid[current.j][current.i-1].visited) grid[current.j][current.i-1].block = true;
		if(grid[current.j][current.i+1] && !grid[current.j][current.i+1].visited) grid[current.j][current.i+1].block = true;
	} else if (yDiff == -1){
		if(grid[current.j][current.i-1] && !grid[current.j][current.i-1].visited) grid[current.j][current.i-1].block = true;
		if(grid[current.j][current.i+1] && !grid[current.j][current.i+1].visited) grid[current.j][current.i+1].block = true;
	}
}

function solveMaze (graph, src, dst) {
	var path = hasPath(graph, src, dst, new Set());
	if (path) return path;
	else return [];
}

function hasPath(graph, src, dst, visited){
	if (src[0] == dst[0] && src[1] == dst[1]) return [src];

	var j = src[0];
	var i = src[1];

	var id = (j*cols)+i;
	if (visited.has(id)) return undefined;
	
	visited.add(id);
	var neighbours = getNeighbours(graph, j, i);
	for (let neighbour of neighbours){
		var path = hasPath(graph, neighbour, dst, visited);
		if (path) {
			path.push([j, i]);
			return path;
		}
	}
	return undefined;
}

function getNeighbours (maze, j, i) {
	neighbours = [];
	var curr = maze[j][i];
	if (mazeType == 0) {
		if (j != 0 && !curr.walls[0]) {
			neighbours.push([j-1, i]);
		}
		if (i != cols-1 && !curr.walls[1]) {
			neighbours.push([j, i+1]);
		}
		if (j != rows-1 && !curr.walls[2]) {
			neighbours.push([j+1, i]);
		}
		if (i != 0 && !curr.walls[3]) {
			neighbours.push([j, i-1]);
		}
	} else if (mazeType == 1) {
		if (j != 0 && !maze[j-1][i].block) {
			neighbours.push([j-1, i]);
		}
		if (i != cols-1 && !maze[j][i+1].block) {
			neighbours.push([j, i+1]);
		}
		if (j != rows-1 && !maze[j+1][i].block) {
			neighbours.push([j+1, i]);
		}
		if (i != 0 && !maze[j][i-1].block) {
			neighbours.push([j, i-1]);
		}
	}
	for (var idx = neighbours.length - 1; idx >= 0; idx--) {
		var y = neighbours[idx][0];
		var x = neighbours[idx][1];
		if(maze[y][x] == 0){
			neighbours.splice(idx, 1);
		}
	}
	return shuffle(neighbours);
}

function shuffle(arr){
    for (var t = 0; t < arr.length; t++) {
        var tmp = arr[t];
        var r = floor(random(t, arr.length));
        arr[t] = arr[r];
        arr[r] = tmp;
    }
    return arr;
}

function changeMazeType () {
	if (mazeType == 0) mazeType = 1;
	else 			   mazeType = 0;
	reset();
}

function reset () {
	grid = [];
	backtrack = [];
	solvedPath = [];
	w = sizeSlider.value();
	createGrid();
	generating = true;
	solving = false;
}
