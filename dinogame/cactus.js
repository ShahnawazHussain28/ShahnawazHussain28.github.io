class Cactus {
  constructor(number = 1){
    this.number = number;
    this.x =  width + 50;
    this.h = 50;
    if (this.number == 2){
      this.h = 45;
    } else if (this.number == 3) {
      this.h = 40;
    } else {
      this.h = 50;
    }
    this.h -= 5;
    this.ground = groundlevel - this.h;
    this.y = this.ground;
    
    this.heightmultiplier = 1;
    if (random(1) > 0.8){
      this.heightmultiplier = random(0.7, 1);
    }
    this.h = this.h * this.heightmultiplier;
    this.y = this.y + (30*(1-this.heightmultiplier));
    this.w = (this.h / 2) * (this.number*0.8);
    this.offset = this.h / 2;
  }
  update(){
    this.x -= speed;
  }
  
  show(){
    for (let i = 0; i < this.number; i++) {
      image(cacto, this.x + (this.offset * i)-3, this.y-5, this.h/2, this.h+5);
    } 
//    rect(this.x, this.y, this.w, this.h);
  }
  
}




