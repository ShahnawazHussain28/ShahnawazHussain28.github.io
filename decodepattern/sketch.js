let nodes = [], qunodes = [];
var qupatterns = ["14789", "1235789", "7415963", "753269148", "123456789", "321478965", "547123", "124357689", "572941368", "183492765", "865423197", "753219864", "245689731", ];
var pattern = "";
var prevNode;
var isDrawing = false;
var conMouseX, conMouseY;
var quIndex = 0, centerText = "CRACK THIS", centerTextP;
var wrongattempts = 0, score = 0;
var soundIsOn = true, vibrationIsOn = true;
let soundBtn, VibrationBtn, shareBtn;
var winVibPat = [400, 100, 120, 50, 100, 40, 140, 160, 290, 200, 100, 200, 200], snapVibPat = [70];
var winAudio = new Audio("winsound.mp3"), backgroundImg;;

function preload(){
	backgroundImg = loadImage("gameBack.jpg");
}

function setup(){
	pixelDensity(1);
	if (windowWidth > 500) {
		createCanvas(400, windowHeight-85).parent(select(".wrapper"));
	} else {
		createCanvas(windowWidth, windowHeight-85).parent(select(".wrapper"));
	}
	for (var j = 0; j < 3; j++) {
		for (var i = 0; i < 3; i++) {
			var gap = height / 7;
			var x = width/2 + ((i-1) * gap);
			var y = height*3/4 + ((j-1) * gap);
			nodes.push(new Node(x, y, j*3 + i + 1));

			var qugap = height / 9;
			var qux = width/2 + ((i-1) * qugap);
			var quy = height/4 + ((j-1) * qugap);
			qunodes.push(new Node(qux, quy, j*3 + i + 1));
		}
	}
	centerTextP = select("#centerText").style("top", height*0.4+"px").html(centerText);
	soundBtn = createElement("i").class("fa fa-volume-up").id("vol").mouseClicked(toggleSound).parent(select(".wrapper"));
	VibrationBtn = createElement("i").class("fa fa-mobile").id("vib").mouseClicked(toggleVibration).parent(select(".wrapper"));
	shareBtn = createButton("SHARE").parent(select(".wrapper")).mouseClicked(share);
	strokeWeight(10);
	stroke(255);
}
function draw(){
	conMouseX = constrain(mouseX, nodes[0].x - 20, nodes[8].x + 20);
	conMouseY = constrain(mouseY, nodes[0].y - 20, nodes[8].y + 20);
	// background(51);
	image(backgroundImg, 0, 0, backgroundImg.width, height)
	// filter(BLUR, 10);
	push();
	strokeWeight(5);
	drawPattern(qunodes, qupatterns[quIndex]);
	drawPattern(nodes, pattern);
	pop();
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].show();
		qunodes[i].show();
	}
	noStroke();
	fill(255);
	textSize(28);
	textAlign(LEFT);
	text("Score: "+score, 5, 5, width);
	textSize(16);
	textAlign(RIGHT);
	text("Wrong Attempts: "+wrongattempts, -5, 5, width);
	textSize(32);
	
}

function touchStarted(){
	pattern = "";
	centerText = "CRACK THIS";
	centerTextP.html(centerText);
	if (mouseX > nodes[0].x - 50 && mouseY > nodes[0].y - 50 && mouseX < nodes[nodes.length-1].x + 50 && mouseY < nodes[nodes.length-1].y + 50) {
		isDrawing = true;
	}
}

function mouseDragged(){
	if (isDrawing) {
		createPattern();
	}
}

function touchEnded(){
	isDrawing = false;
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].visited = false;
	}
	prevNode = undefined;
	if(pattern.length > 1){
		if (evaluate(qupatterns[quIndex], pattern)){
			score++;
			pattern = "";
			quIndex++;
			if (soundIsOn) winAudio.play();
			if (vibrationIsOn) playVibration(winVibPat);
			centerText = "CRACK THIS ONE";
			centerTextP.html(centerText);
		} else {
			if (partialCorrect(qupatterns[quIndex], pattern)){
				centerText = "Try REVERSE";
				centerTextP.html(centerText);
			} else {
				centerText = "Try Once More";
				centerTextP.html(centerText);
			}
			wrongattempts++;
		}
		if (quIndex == qupatterns.length) {
			quIndex--;
		}
	}
}


function drawPattern(thisnode, pat){
	stroke(100);
	if (pat[0]) {
		circle(thisnode[pat[0]-1].x, thisnode[pat[0]-1].y, 15);
	}
	for (var i = 0; i < pat.length-1; i++) {
		var currIndex = parseInt(pat[i])-1;
		var nextIndex = parseInt(pat[i+1])-1;
		line(thisnode[currIndex].x, thisnode[currIndex].y, thisnode[nextIndex].x, thisnode[nextIndex].y);
		fill(225, 100);
		circle(thisnode[currIndex].x, thisnode[currIndex].y, 15);
		if (i == pat.length-2) {
			circle(thisnode[nextIndex].x, thisnode[nextIndex].y, 15);
		}
	}
	if (prevNode) {
		line(prevNode.x, prevNode.y, conMouseX, conMouseY);
	}
}

class Node{
	constructor(x, y, id){
		this.x = x;
		this.y = y;
		this.id = id;
		this.visited = false;
	}
	show(){
		if (this.visited) stroke("yellow");
		else stroke(200);
		point(this.x, this.y);
	}
}

function createPattern(){
	var radius = 35;
	for (var i = 0; i < nodes.length; i++) {
		if (dist(conMouseX, conMouseY, nodes[i].x, nodes[i].y) < radius) {
			if (!nodes[i].visited) {
				fillGap(nodes[i]);
				nodes[i].visited = true;
				pattern += i + 1;
				prevNode = nodes[i];
				if (vibrationIsOn) {
					playVibration(snapVibPat);
				}
			}
		}
	}
}

function fillGap(node){
	if (!prevNode) return;
	var middleNode;
	if ((prevNode.id == 1 && node.id == 3) || (prevNode.id == 3 && node.id == 1)) {
		if (!nodes[1].visited) middleNode = nodes[1];
	} else if ((prevNode.id == 4 && node.id == 6) || (prevNode.id == 6 && node.id == 4)) {
		if (!nodes[4].visited) middleNode = nodes[4];
	} else if ((prevNode.id == 7 && node.id == 9) || (prevNode.id == 9 && node.id == 7)) {
		if (!nodes[7].visited) middleNode = nodes[7];
	} else if ((prevNode.id == 1 && node.id == 7) || (prevNode.id == 7 && node.id == 1)) {
		if (!nodes[3].visited) middleNode = nodes[3];
	} else if ((prevNode.id == 2 && node.id == 8) || (prevNode.id == 8 && node.id == 2)) {
		if (!nodes[4].visited) middleNode = nodes[4];
	} else if ((prevNode.id == 3 && node.id == 9) || (prevNode.id == 9 && node.id == 3)) {
		if (!nodes[5].visited) middleNode = nodes[5];
	} else if ((prevNode.id == 1 && node.id == 9) || (prevNode.id == 9 && node.id == 1)) {
		if (!nodes[4].visited) middleNode = nodes[4];
	} else if ((prevNode.id == 3 && node.id == 7) || (prevNode.id == 7 && node.id == 3)) {
		if (!nodes[4].visited) middleNode = nodes[4];
	}
	if (middleNode) {
		middleNode.visited = true;
		pattern += middleNode.id;
	}
}

function evaluate(qu, res){
	var evaluation = true;
	if (qu.length != res.length) {
		evaluation = false;
		return evaluation;
	} else {
		for (var i = 0; i < qu.length; i++) {
			if(qu[i] != res[i]){
				evaluation = false;
				break;
			}
		}
		if (evaluation == false) {
			evaluation = true;
			for (var i = 0; i < qu.length; i++) {
				if(qu[i] != res[res.length - 1 - i]){
					evaluation = false;
					break;
				}
			}
		}
	}
	return evaluation;
}

function toggleSound(){
	if (soundIsOn) {
		soundBtn.class("fa fa-times");
		soundIsOn = false;
	} else {
		soundBtn.class("fa fa-volume-up");
		soundIsOn = true;
	}
}

function toggleVibration(){
	if (vibrationIsOn) {
		VibrationBtn.class("fa fa-times");
		vibrationIsOn = false;
	} else {
		VibrationBtn.class("fa fa-mobile");
		vibrationIsOn = true;
	}
}

function playVibration(vibPat){
	navigator.vibrate(vibPat);
}


function share(){
	var shareData = {
		title: "Decode Pattern",
		text: "Be an expert Decoder. Crack the Patterns and Prove Yourself",
		url: window.location.href
	}
	if (navigator.canShare) {
		navigator.share(shareData).catch((err) => console.log("Cannot Share"));
	}
}


function partialCorrect(qu, res){
	var evaluation = false;
	if (qu.length != res.length) {
		return evaluation;
	} else {
		for (var j = 0; j < qu.length; j++) {
			for (var i = 0; i < res.length; i++) {
				if (qu[j] == res[i]) {
					evaluation = true;
					break;
				} else {
					evaluation = false;
				}
			}
			if (evaluation == false) {
				break;
			}
		}
	}
	return evaluation;
}



window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
};