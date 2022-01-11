class Dinosaur {
  constructor(){
    this.r = 50;
    this.x = 30;
    this.ground = groundlevel + 3 - this.r;
    this.y = this.ground;
    this.velocity = 0;
    this.gravity = 1;
    this.sprite = dinowalk1;
  }
  
  update(){
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.y = constrain(this.y, 0, groundlevel + 3 - this.r);
  }
  
  jump(){
    if (this.y == this.ground){
      this.velocity = -15;
    }
  }
  
  show(){
    if (this.y < this.ground) {
      this.sprite = dinojump;
    } else {
      if (frameCount % 14  == 0) {
        this.sprite = dinowalk1;
      } else if (frameCount % 14 == 7){
        this.sprite = dinowalk2;
      }
    }
    image(this.sprite, this.x, this.y, this.r, this.r);
    noFill();
  } 
  
  hits(c) {
    var collided;
    ellipseMode(CENTER);
    collided = collideRectCircle(c.x, c.y, c.w, c.h, this.x+this.r/2, this.y-2+this.r/2, this.r*0.75);
//    ellipse(this.x+this.r/2, this.y-2+this.r/2, this.r*0.75, this.r*0.75);
    if (collided) {
      this.sprite = dinodead;
      noLoop();
      deathsound.play();
    } 
    return collided;
  }
  
  
}