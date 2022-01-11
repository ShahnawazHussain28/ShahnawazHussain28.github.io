let video;
let canvas;
let videosize = {
	height: null,
	width: null
}
var videoisready = false;
var scalefactor = 10;
var asciichar = ".-:=+*#%@"
var innertext = "";
var offset = 0;
var resolution = 1;
let intensitySlider;
let invertcheckbox;
let resupbtn, resdownbtn, freezebtn, controlsdiv;

function setup(){
	video = createCapture(VIDEO, videoloaded);
	video.hide();
	controlsdiv = select("#controls");
}

function draw(){
	if (videoisready){
		offset = intensitySlider.value();
		innertext = "";
		video.loadPixels();
		for (var y = 0; y < video.height; y++) {
			for (var x = 0; x < video.width; x++) {
				var index = ((video.width - x) + (y * video.width)) * 4;
				var r = video.pixels[index + 0];
				var g = video.pixels[index + 1];
				var b = video.pixels[index + 2];
				var bright = (r + g + b) / 3;
				var asciiindex = floor(map(bright, 0, 255, 0, (asciichar.length-1) + offset)) -offset;
				if(!video.pixels[index]){
					innertext += "&nbsp";
					continue;
				}
				if (asciiindex < 0) {
					innertext += "&nbsp";
				} else {
					innertext += asciichar[asciiindex];
				}
			}
			innertext += "<br>";
		}
		canvas.html(innertext);
	}
}

function invertColor(){
	if (this.checked()) {
		canvas.style("background: #fff").style("color: #000");
		select("body").style("background: #fff");
	} else {
		canvas.style("background: #000").style("color: #fff");
		select("body").style("background: #000");
	}
}

function setVideoScale(){
	var w = video.width / scalefactor;
	var h = video.height / scalefactor;
	videosize.width = w;
	videosize.height = h;
	video.size(w * resolution, h * resolution);
}

function videoloaded(){
	canvas = createDiv().id("canvas");
	canvas.style("background: #000")
		.style("font-family: monospace")
		.style("line-height: 8.5px")
		.style("text-align: center")
		.style("letter-spacing", "0.8px")
		.style("color: #fff")
		.style("white-space: nowrap")
	setVideoScale();
	videoisready = true;
	var parentdiv = select("#invertfreezebox");
	invertcheckbox = createCheckbox().id("invert").parent(parentdiv);
	invertcheckbox.changed(invertColor);
	freezebtn = createButton("Freeze").id("freeze").mouseClicked(freeze).parent(parentdiv);
	parentdiv = select("#resolutionintensitybox");
	intensitySlider = createSlider(-6, 8, 0, 1).id("slider").parent(parentdiv);
	resdownbtn = createButton("-").id("resdown").mouseClicked(resdown).parent(parentdiv);
	resupbtn = createButton("+").id("resup").mouseClicked(resup).parent(parentdiv);
}
function freeze(){
	if (isLooping()) {
		freezebtn.html("Move");
		noLoop();
	} else {
		freezebtn.html("Freeze");
		loop();
	}
}
function resup(){
	if (resolution >= 1.9) {
		return;
	}
	resolution += 0.1;
	calculateCSS();
	video.size(videosize.width * resolution, videosize.height * resolution);
}
function resdown(){
	if (resolution <= 0.4) {
		return;
	}
	resolution -= 0.1;
	calculateCSS();
	video.size(videosize.width * resolution, videosize.height * resolution);
}

function calculateCSS(){
	var fontsize = 1/(1.15*resolution) + "em";
	canvas.style("line-height", 8.5+(-(resolution-1)*5)+"px");
	canvas.style("font-size", fontsize);
}



window.onload = () => {
   let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
   bannerNode.parentNode.removeChild(bannerNode);
};