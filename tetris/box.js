class Block {
	constructor(x, y, col){
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color(col);
		this.updatetime = 60;
		this.time = 0;
	}
	update(){
		if (!this.landed() && this.time >= this.updatetime){
			this.y += 1;
			this.y = constrain(this.y, 0, grid.length-1);	
			this.time = 0;
		} else {
			this.time++;
		}
	}
	move(dir){
		if (!this.landed()) {
			this.x += dir;	
		}
		this.x = constrain(this.x, 0, grid[0].length-1);
	}
	show(){
		fill(this.color);
		rect(this.x*this.size, this.y*this.size, this.size, this.size);
	}
	landed(){
		var land = false;
		if (grid[this.y+1][this.x] == 1){
			land = true;
		} else {
			return false;
		}
		if (land == true) {
			grid[this.y][this.x] = 1;
		}
		return land;
	}
}


class Placeholder {
	constructor(x, y, size, col){
		this.x = x;
		this.y = y;
		this.size = size;
		this.col = color(col);
	}
	show(){
		fill(this.col);
		rect(this.x*this.size, this.y*this.size, this.size, this.size);
	}
}
