var board;
var col = 3;
var currentplayer = 0;
let displaytext;
var playable = true;
let replay;
let classifier;
let canvas, graphics;
var x = 0,
  y = 0;
var drawtimer = 0;
var state = "rest";
let aidraw;

function createBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  displaytext.html("O's Turn");
  replay.hide();
  currentplayer = 0;
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(300, 300);
  graphics = createGraphics(64, 64);
  background(255);

  //machine learning model
  const options = {
    task: "imageClassification",
    inputs: [64, 64, 4],
    outputs: ["label"],
  };
  classifier = ml5.neuralNetwork(options);
  const modelInfo = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  classifier.load(modelInfo, modelLoaded);
  displaytext = createP();
  displaytext
    .style("color", "#515151")
    .style("font-size", "32px")
    .style("width", "100%")
    .style("text-align", "center")
    .style("font-family", "sans-serif");
  replay = createButton("Play Again?");
  replay
    .style("font-size: 20px")
    .style("color:white")
    .style("background-color:#333")
    .style("border-radius:5px")
    .style("padding:10px")
    .style("position:absolute")
    .style("top", height/2 + "px")
    .style("left", "50%")
    .style("transform:translate(-50%,0)")
  replay.mouseClicked(function () {
    createBoard();
    background(255);
  });
  var aidrawlabel = createElement("span", "Draw Yourself")
  .style("font-size: 20px")
  .style("line-height: 0px");
  aidraw = createCheckbox();
  aidraw.id("aidraw").style("width:100%");
  aidrawlabel.parent(aidraw);
  createBoard(board);
}

function draw() {
  stroke(0);
  strokeWeight(3);
  line(100, 0, 100, height);
  line(200, 0, 200, height);
  line(0, 100, width, 100);
  line(0, 200, width, 200);

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
  
  if(mouseX <= width && mouseY <= height){
    if (replay.style("display") == "none" && board[y][x] == "") {
      if (aidraw.checked()) {
        state = "draw";
      } else {
        if (board[y][x] == "" && !winner(board)[0]) {
          if (currentplayer % 2 == 0) {
            board[y][x] = "o";
            displaytext.html("X's Turn");
            if (winner(board)[0] && winner(board)[1] == "o") {
              displaytext.html("CONGO! O wins");
              replay.show();
            }
            currentplayer++;
          } else if (currentplayer % 2 == 1) {
            board[y][x] = "x";
            displaytext.html("O's Turn");
            if (winner(board)[0] && winner(board)[1] == "x") {
              displaytext.html("CONGO! X wins");
              replay.show();
            }
            currentplayer++;
          }
          if (checkdraw(board) && !winner(board)[0]) {
            displaytext.html("It's a Tie");
            replay.show();
          }
        }
      }
    }
  }
}
function mouseDragged() {
  if (state == "draw") {
    if (board[y][x] == "") {
      strokeWeight(5);
      noFill();
      line(mouseX, mouseY, pmouseX, pmouseY);
      drawtimer = 0;
    }
  }
}

function drawclassify(){
  classifier.classify({ image: graphics }, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(result[0].label, nf(100*result[0].confidence, 2, 0)+"%");
  if(result[0].label == "cross"){
    board[y][x] = "x";
    currentplayer++;
    background(255);
  } else if (result[0].label == "circle"){
    board[y][x] = "o";
    currentplayer++;
    background(255);
  }
  if (winner(board)[0] && winner(board)[1] == "o") {
    displaytext.html("CONGO! O wins");
    replay.show();
  } else if (winner(board)[0] && winner(board)[1] == "x") {
    displaytext.html("CONGO! X wins");
    replay.show();
  }

  if (!winner(board)[0]) {
    if (currentplayer % 2 == 0) {
      displaytext.html("O's Turn");
    } else {
      displaytext.html("X's Turn");
    }
  }
  if (!winner(board)[0] && checkdraw(board)) {
    displaytext.html("It's a Tie");
    replay.show();
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

function checkdraw(board) {
  var tie = true;
  for (var j = 0; j < board.length; j++) {
    for (var i = 0; i < board[0].length; i++) {
      if (board[j][i] == "") {
        tie = false;
        break;
      }
    }
  }
  return tie;
}

function winner(board) {
  var winnerplayer = null;
  var comb1 =
    board[0][0] == board[0][1] &&
    board[0][1] == board[0][2] &&
    board[0][0] != "";
  if (comb1 == true) winnerplayer = board[0][0];
  var comb2 =
    board[1][0] == board[1][1] &&
    board[1][1] == board[1][2] &&
    board[1][0] != "";
  if (comb2 == true) winnerplayer = board[1][0];
  var comb3 =
    board[2][0] == board[2][1] &&
    board[2][1] == board[2][2] &&
    board[2][0] != "";
  if (comb3 == true) winnerplayer = board[2][0];
  var comb4 =
    board[0][0] == board[1][0] &&
    board[1][0] == board[2][0] &&
    board[0][0] != "";
  if (comb4 == true) winnerplayer = board[0][0];
  var comb5 =
    board[0][1] == board[1][1] &&
    board[1][1] == board[2][1] &&
    board[0][1] != "";
  if (comb5 == true) winnerplayer = board[0][1];
  var comb6 =
    board[0][2] == board[1][2] &&
    board[1][2] == board[2][2] &&
    board[0][2] != "";
  if (comb6 == true) winnerplayer = board[0][2];
  var comb7 =
    board[0][0] == board[1][1] &&
    board[1][1] == board[2][2] &&
    board[0][0] != "";
  if (comb7 == true) winnerplayer = board[0][0];
  var comb8 =
    board[0][2] == board[1][1] &&
    board[1][1] == board[2][0] &&
    board[0][2] != "";
  if (comb8 == true) winnerplayer = board[0][2];
  return [
    comb1 || comb2 || comb3 || comb4 || comb5 || comb6 || comb7 || comb8,
    winnerplayer,
  ];
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}
