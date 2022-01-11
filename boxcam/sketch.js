let video;
let vScale = 15;
let colorcheckbox;
var colorvar = false;
var videow, videoh;
var ratio;
let sizediv, lowsize, highsize;
var switchFlag = false;

function setup() {
  var canvas = createCanvas(displayWidth, displayHeight - 110);
  canvas.doubleClicked(switchcamera);
  canvas.position(displayWidth / 2 - width / 2, 10);
  pixelDensity(1);
  video = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    ready
  );
  video.hide();
  colorcheckbox = createCheckbox("Want Color?", false);
  colorcheckbox.id("colorcheckbox");
  colorcheckbox.changed(greyorcolor);
  sizediv = createDiv("Resolution");
  sizediv.id("sizediv");
  lowsize = createButton("-");
  lowsize.id("lowsize");
  highsize = createButton("+");
  highsize.id("highsize");
  lowsize.parent(sizediv);
  highsize.parent(sizediv);
  lowsize.mouseClicked(changeresolutionnegative);
  highsize.mouseClicked(changeresolutionpositive);
  var switchinfo = createP("Double-Tap to Switch Camera");
  switchinfo.id("switchinfo");
}

function switchcamera() {
  switchFlag = !switchFlag;
  if (switchFlag == true) {
    video.remove();
    options = {
      audio: false,
      video: {
        facingMode: "environment"
      }
    };
  } else {
    video.remove();
    options = {
      video: {
        facingMode: "user"
      }
    };
  }
  video = createCapture(options, ready);
  video.hide();
}

function ready() {
  ratio = video.width / video.height;
  if (width < height) {
    video.size(width / vScale, width / vScale / ratio);
  } else {
    video.size((height / vScale) * ratio, height / vScale);
  }
}

function greyorcolor() {
  if (this.checked()) {
    colorvar = true;
  } else {
    colorvar = false;
  }
}
function changeresolutionnegative() {
  if (vScale < 28) {
    vScale += 2;
    vScale = constrain(vScale, 6, 28);
    console.log(vScale);
    if (width < height) {
      video.size(width / vScale, width / vScale / ratio);
    } else {
      video.size((height / vScale) * ratio, height / vScale);
    }
  }
}
function changeresolutionpositive() {
  if (vScale > 6) {
    vScale -= 2;
    vScale = constrain(vScale, 6, 28);
    console.log(vScale);
    if (width < height) {
      video.size(width / vScale, width / vScale / ratio);
    } else {
      video.size((height / vScale) * ratio, height / vScale);
    }
  }
}

function draw() {
  background(0);
  if (video.loadedmetadata) {
    textSize(30);
    video.loadPixels();
    for (var j = 0; j < video.height; j++) {
      for (var i = 0; i < video.width; i++) {
        var index = (i + j * video.width) * 4;
        var r = video.pixels[index + 0];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];
        var brightness = (r + g + b) / 3;
        if (colorvar == true) {
          fill(r, g, b);
        } else {
          fill(brightness);
        }
        noStroke();
        var w = map(brightness, 0, 255, 5, vScale + 1);
        rectMode(CENTER);
        if (switchFlag == false) {
          rect(width - i * vScale - vScale / 2, j * vScale - vScale / 2, w, w);
        } else {
          rect(i * vScale + vScale / 2, j * vScale - vScale / 2, w, w);
        }
      }
    }
  }
}

window.onload = () => {
  let bannerNode = document.querySelector('[alt="www.000webhost.com"]')
    .parentNode.parentNode;
  bannerNode.parentNode.removeChild(bannerNode);
};
