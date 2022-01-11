var board;
var col = 3;
var currentplayer = 'human', initialPlayer = 'ai';
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
  if (initialPlayer == 'ai') initialPlayer = 'human';
  else initialPlayer = 'ai';
  currentplayer = initialPlayer;
  replay.hide();
  if (currentplayer == 'human') {
    displaytext.html("Your Turn"); 
  } else {
    displaytext.html("AI's Turn");
    setTimeout(function(){findBestMove()}, 1000);
  }
}

function setup() {
  pixelDensity(1);
  container = select("#container");
  oScoreText = createP("You: " + oScore).id("oScore").parent(container);
  xScoreText = createP("AI: " + xScore).id("xScore").parent(container);
  canvas = createCanvas(250, 250).parent(container);
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
  line(width/3, 0, width/3, height);
  line(width*2/3, 0, width*2/3, height);
  line(0, height/3, width, height/3);
  line(0, height*2/3, width, height*2/3);

  for (var j = 0; j < board.length; j++) {
    for (var i = 0; i < board[0].length; i++) {
      var char = board[j][i];
      push();
      noFill();
      translate(i * width/3 + width/6, j * height/3 + height/6);
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
    if (currentplayer == 'human' && replay.style("display") == "none" && board[y][x] == "") {
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

  if ((result[0].label == "circle" && currentplayer == 'human') || (result[0].label == "cross" && currentplayer == 'ai')) {
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
  var crosssize = 25;
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
    if (currentplayer == 'human') {
      board[thisY][thisX] = "o";
      currentplayer = 'ai';
      console.log("AI's Turn");
      displaytext.html("AI's turn");
      setTimeout(function(){findBestMove()}, 500);
    } else if (currentplayer == 'ai') {
      board[thisY][thisX] = "x";
      currentplayer = 'human';
      console.log("Your Turn");
      displaytext.html("Your turn"); 
    }
    if (checkdraw(board)) {
      console.log("It's a Tie");
      displaytext.html("It's a Tie");
      replay.show();
    }
    if (winner(board)) {
      if (currentplayer == 'ai') {
        displaytext.html("You win");
        oScore++;
        oScoreText.html("You: " + oScore);
      } else {
        displaytext.html("AI wins");
        xScore++;
        xScoreText.html("AI: " + xScore);
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
  currentplayer = 'human';
  createBoard(board);
}

function findBestMove(){
  var bestScore = -Infinity;
  var move;
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[0].length; i++) {
      if (board[j][i] == "") {
        board[j][i] = 'x';
        var score = minimax(board, 0, false);
        board[j][i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = {y: j, x: i};
        } 
      }
    }
  }
  if(move) turnPlayed(move.x, move.y);
  currentplayer = 'human';
}


function minimax(thisBoard, depth, isMaximizing){
  if (winner(thisBoard)) {
    if (!isMaximizing) {
      return 10;
    } else {
      return -10;
    }
  }
  if (checkdraw(thisBoard)) {
    return 0;
  }
  if (isMaximizing) {
    var bestScore = -Infinity;
    for (let j = 0; j < thisBoard.length; j++) {
      for (let i = 0; i < thisBoard[0].length; i++) {
        if (thisBoard[j][i] == "") {
          thisBoard[j][i] = 'x';
          var score = minimax(thisBoard, depth+1, false);
          thisBoard[j][i] = '';
          bestScore = max(bestScore, score);
        }
      }
    }
    return bestScore;
  } else {
    var bestScore = Infinity;
    for (let j = 0; j < thisBoard.length; j++) {
      for (let i = 0; i < thisBoard[0].length; i++) {
        if (thisBoard[j][i] == "") {
          thisBoard[j][i] = 'o';
          var score = minimax(thisBoard, depth+1, true);
          thisBoard[j][i] = '';
          bestScore = min(bestScore, score);
        }
      }
    }
    return bestScore;
  }
}









// window.onload = () => {
//    let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
//    bannerNode.parentNode.removeChild(bannerNode);
// }

