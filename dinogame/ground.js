class Ground {
  constructor(){
    this.x = 0;
    this.y = groundlevel - 18;
    this.w = 2400;
    this.h = 24;
  }
  
  update(){
    this.x -= speed;
    if(this.x <= -this.w){
      this.x = 0;
   } 
  }
  
  show(){
    image(groundimg, this.x, this.y, this.w, this.h);
    image(groundimg, this.x + this.w, this.y, this.w, this.h);
  }

}