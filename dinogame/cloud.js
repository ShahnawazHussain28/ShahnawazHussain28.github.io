class Cloud {
  constructor () {
    this.x = width + 100;
    this.y = random(10, groundlevel - 70);
  }
  update(){
    this.x -= 0.7;
  }
  show(){
    image(cloud, this.x, this.y, 100, 40);
  }
}