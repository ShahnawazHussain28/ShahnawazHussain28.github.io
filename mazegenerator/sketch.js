let grid = [];
var backtrack = [], solvedPath = [];
var size;
var w = 30, cols, rows;
var current;
let speedSlider;
let generating = true, solving = false;

function setup() {
	size = min(windowWidth, windowHeight) - 50;
	createCanvas(600, 600);
	speedSlider = createSlider(1, 60, 10, 1);
	background(51);
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
	stroke(255);
	// noFill();
	frameRate(60);
}

function draw() {
	background(51);
	frameRate(speedSlider.value());
	strokeWeight(1);
	for (var j = 0; j < grid.length; j++) {
		for (var i = 0; i < grid[0].length; i++) {
			grid[j][i].show();
		}
	}
	if (generating) {
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
	if (solving){
		for (var i = 1; i < solvedPath.length; i++) {
			var py = solvedPath[i-1][0];
			var px = solvedPath[i-1][1];
			var y = solvedPath[i][0];
			var x = solvedPath[i][1];
			stroke("red");
			strokeWeight(10);
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

class Cell {
	constructor(i, j){
		this.i = i;
		this.j = j;
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
		if(top && !top.visited){
			neighbours.push(top);
		}
		if(right && !right.visited){
			neighbours.push(right);
		}
		if(bottom && !bottom.visited){
			neighbours.push(bottom);
		}
		if(left && !left.visited){
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
		if(this.walls[0])
			line(x,   y,   x+w, y);
		if(this.walls[1])
			line(x+w, y,   x+w, y+w);
		if(this.walls[2])
			line(x,   y+w, x+w, y+w);
		if(this.walls[3])
			line(x,   y,   x,   y+w);
		if (this.visited) {
			// fill(255, 0, 255, 100);
			noStroke();
			// rect(x, y, w, w);
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
	
	// visitedBlocks.push([j, i]);
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