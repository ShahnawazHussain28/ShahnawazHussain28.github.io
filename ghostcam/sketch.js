let video;
function setup() {
  pixelDensity(1);
  createCanvas(displayWidth-3, displayHeight-150);
  video = createCapture(VIDEO, ready);
  background(255);
  video.hide();
  effect = createSlider(1, 200, 30);
  effect.size(width*0.5);
  effect.style("max-width", "400px");
  effect.position(width, height - 30).style("transform:translate(-105%,0)");
  createP("Ghost Effect: ").position(5, height-30).style("transform:translate(0,-50%)");
}
function ready() {
  var w, h;
  var ratio = video.height / video.width;
  if (height > width) {
    w = width;
    h = width*ratio;
  } else {
    h = height;
    w = height/ratio;
  }
  video.size(w, h);
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1,1);
  tint(255, effect.value());
  image(video, 0, 0);
  pop();
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
};