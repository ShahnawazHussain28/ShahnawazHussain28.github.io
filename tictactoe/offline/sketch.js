var board;
var col = 3;
var currentplayer = 0, initialPlayer = 1;
let displaytext;
let replay, container, chatBox, chatInputBox, chatInput, chatSendBtn;
let classifier;
let canvas, graphics;
var x = 0, y = 0;
var drawtimer = 0;
var state = "rest";
let aidraw;
var oScore = 0, xScore = 0, oScoreText, xScoreText;

function createBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  initialPlayer++;
  initialPlayer = initialPlayer % 2;
  currentplayer = initialPlayer;
  replay.hide();
  if (currentplayer == 0) {
    displaytext.html("O's Turn"); 
  } else {
    displaytext.html("X's Turn");
  }
}


function setup() {
  pixelDensity(1);
  container = select("#container");
  oScoreText = createP("O: " + oScore).id("oScore").parent(container);
  xScoreText = createP("X: " + xScore).id("xScore").parent(container);
  canvas = createCanvas(300, 300).parent(container);
  graphics = createGraphics(64, 64);
  background("#003638");
  //machine learning model
  const options = {
    task: "imageClassification",
    inputs: [64, 64, 4],
    outputs: ["label"],
  };
  classifier = ml5.neuralNetwork(options);
  const modelInfo = {
    model: "../model/model.json",
    metadata: "../model/model_meta.json",
    weights: "../model/model.weights.bin",
  };
  classifier.load(modelInfo, modelLoaded);
  displaytext = createP().id("displaytext").parent(container);

  replay = createButton("Replay").id("replay").style("top", (height/2)+"px").parent(container);
  replay.mouseClicked(reset);
  aidraw = createCheckbox("Draw Yourself").parent(container);
  aidraw.id("aidraw");
  createBoard(board);
}

function draw() {
  stroke(255);
  strokeWeight(3);
  line(100, 0, 100, height);
  line(200, 0, 200, height);
  line(0, 100, width, 100);
  line(0, 200, width, 200);

  for (var j = 0; j < board.length; j++) {
    for (var i = 0; i < board[0].length; i++) {
      var char = board[j][i];
      push();
      noFill();
      translate(i * 100 + 50, j * 100 + 50);
      place(char);
      pop();
    }
  }
  if (state == "draw") {
    drawtimer++;
  }
  if (drawtimer >= frameRate()*2) {
    drawclassify();
    state = "rest";
    drawtimer = 0;
  }
}




function mousePressed() {
  x = floor(map(mouseX, 0, width, 0, board[0].length));
  y = floor(map(mouseY, 0, height, 0, board.length));
  if(mouseX > 0  && mouseX <= width && mouseY > 0 && mouseY <= height){
    if (replay.style("display") == "none" && board[y][x] == "") {
      if (aidraw.checked()) {
        state = "draw";
      } else {
        turnPlayed(x, y);
      }
    }
  }
}
function mouseDragged() {
  if (state == "draw") {
    strokeWeight(5);
    noFill();
    line(mouseX, mouseY, pmouseX, pmouseY);
    drawtimer = 0;
  }
}

function drawclassify(){
  push();
  graphics.copy(
    canvas,
    x * (width / 3) + 2,
    y * (height / 3) + 2,
    100 - 4,
    100 - 4,
    0,
    0,
    64,
    64
  );
  graphics.filter(INVERT);
  pop();
  classifier.classify({ image: graphics }, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(result[0].label, nf(100*result[0].confidence, 2, 0)+"%");

  if ((result[0].label == "cross" && currentplayer % 2 == 1) || (result[0].label == "circle" && currentplayer % 2 == 0)) {
    turnPlayed(x, y);
    background("#003638");
  } else {
    displaytext.html("Draw Properly");
    background("#003638");
  }
}

function modelLoaded() {
  console.log("model loaded successfully");
}

function place(char) {
  var crosssize = 30;
  if (char == "x") {
    line(0, 0, crosssize, crosssize);
    line(0, 0, -crosssize, -crosssize);
    line(0, 0, crosssize, -crosssize);
    line(0, 0, -crosssize, crosssize);
  } else if (char == "o") {
    circle(0, 0, crosssize * 2);
  } else {
    // Do nothing
  }
}

function turnPlayed(thisX, thisY){
  if (!winner(board)) {
    if (currentplayer % 2 == 0) {
      board[thisY][thisX] = "o";
      currentplayer++;
      console.log("X's Turn");
      displaytext.html("X's turn");
    } else if (currentplayer % 2 == 1) {
      board[thisY][thisX] = "x";
      console.log("O's Turn");
      displaytext.html("O's turn"); 
      currentplayer++;
    }
    if (checkdraw(board)) {
      console.log("It's a Tie");
      displaytext.html("It's a Tie");
      replay.show();
    }
    if (winner(board)) {
      if ((currentplayer + 1) % 2 == 0) {
        displaytext.html("O wins");
        oScore++;
        oScoreText.html("O: " + oScore);
      } else {
        displaytext.html("X wins");
        xScore++;
        xScoreText.html("X: " + xScore);
      }
      replay.show();
    }
  }
}


function checkdraw(board) {
  for (var j = 0; j < board.length; j++) {
    for (var i = 0; i < board[0].length; i++) {
      if (board[j][i] == "") {
        return false;
      }
    }
  }
  return true;
}

function winner(board) {
  var comb1 =
    board[0][0] == board[0][1] &&
    board[0][1] == board[0][2] &&
    board[0][0] != "";
  var comb2 =
    board[1][0] == board[1][1] &&
    board[1][1] == board[1][2] &&
    board[1][0] != "";
  var comb3 =
    board[2][0] == board[2][1] &&
    board[2][1] == board[2][2] &&
    board[2][0] != "";
  var comb4 =
    board[0][0] == board[1][0] &&
    board[1][0] == board[2][0] &&
    board[0][0] != "";
  var comb5 =
    board[0][1] == board[1][1] &&
    board[1][1] == board[2][1] &&
    board[0][1] != "";
  var comb6 =
    board[0][2] == board[1][2] &&
    board[1][2] == board[2][2] &&
    board[0][2] != "";
  var comb7 =
    board[0][0] == board[1][1] &&
    board[1][1] == board[2][2] &&
    board[0][0] != "";
  var comb8 =
    board[0][2] == board[1][1] &&
    board[1][1] == board[2][0] &&
    board[0][2] != "";
  return (comb1 || comb2 || comb3 || comb4 || comb5 || comb6 || comb7 || comb8);
}

function reset(){
  background("#003638");
  currentplayer = 0;
  createBoard(board);
}

// window.onload = () => {
//    let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
//    bannerNode.parentNode.removeChild(bannerNode);
// }
