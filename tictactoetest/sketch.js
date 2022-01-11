var board;
var col = 3;
var currentplayer = 0, initialPlayer;
let displaytext;
let replay, container, chatBox, chatInputBox, chatInput, chatSendBtn;
var x = 0,
  y = 0;
var drawtimer = 0;
var state = "rest";
let aidraw;
var myScore = 0, otherScore = 0, myScoreText, otherScoreText;

function createBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentplayer = 0;
  replay.hide();
}


function setup() {
  pixelDensity(1);
  container = select("#container");
  myScoreText = createP("You: 0").id("myscore").parent(container);
  otherScoreText = createP("Friend: 0").id("otherscore").parent(container);
  canvas = createCanvas(300, 300).parent(container);
  background("#003638");
  displaytext = createP("Here goes all the text").id("displaytext").parent(container);
  replay = createButton("Request Rematch").id("replay").style("top", (height/2)+"px").parent(container);
  replay.mouseClicked(reset);
  aidraw = createCheckbox("Draw Yourself").parent(container);
  aidraw.id("aidraw");
  createDiv("Send a Message").parent(container).id("sendamsg");
  chatBox = createDiv().id("chatbox").parent(container);
  chatInputBox = createDiv().id("chatinputbox").parent(container);
  chatInput = createInput("", "text").id("chatinput").parent(chatInputBox);
  chatSendBtn = createButton("Send").id("chatsendbtn").parent(chatInputBox);
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
    } else if (currentplayer % 2 == 1) {
      board[thisY][thisX] = "x";
      console.log("O's Turn");
      currentplayer++;
    }
    if (checkdraw(board)) {
      console.log("It's a Tie");
      displaytext.html("It's a Tie");
      replay.show();
    }
    if (winner(board)) {
      if ((currentplayer + 1) % 2 == initialPlayer) {
        console.log("You Win");
        displaytext.html("You Win");
        myScore++;
        myScoreText.html("You: " + myScore);
      } else {
        console.log("You Lose");
        displaytext.html("You Lose");
        otherScore++;
        otherScoreText.html("Friend: " + otherScore);
      }
    }
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

function startGame (){
	console.log("Start Game");
  chatBox.html("");
	createBoard(board);
	background("#003638");
  myScoreText.html("You: " + myScore);
  otherScoreText.html("Friend: " + otherScore);
}

function reset(){
	background("#003638");
	currentplayer = 0;
	createBoard(board);
}


window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
}
