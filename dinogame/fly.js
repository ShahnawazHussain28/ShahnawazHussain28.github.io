class Fly {
  constructor() {
    this.h = 30;
    this.w = 50;
    this.x = width;
    if (random(1) < 0.5){
      this.y = groundlevel - this.h - 5;
    } else {
      this.y = groundlevel - this.h - dinosaur.r - 5;
    }
    this.sprite = fly1;
  }
  update(){
    this.x -= speed;
  }
  show(){
    if (frameCount % 14 == 0){
      this.sprite = fly1;
      this.y += 10;
    } else if (frameCount % 14 == 7){
      this.sprite = fly2;
      this.y -= 10;
    }
    image(this.sprite, this.x-10, this.y-5, this.w+10, this.h+10);
//    rect(this.x, this.y, this.w, this.h);
  }
}