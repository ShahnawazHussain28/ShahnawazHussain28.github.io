var pages;
var zindex = 0;
var pagenumber = -2;

function setZindex(){
	pages = document.getElementsByClassName('pages');
	for (var i = 0; i < pages.length; i++) {
		zindex -= 1;
		pages[i].style.zIndex = zindex;
	}
}

function turnright(){
	if (pages && pagenumber < pages.length-1) {
		pagenumber++;	
		if (pagenumber == -1) {
			var currentpage = document.getElementById('cover');
		} else {
			var currentpage = document.getElementsByClassName('pages')[pagenumber];
		}
		currentpage.style.transform = "rotateY(-120deg)";
	loadCorrectly();
	}
}
function turnleft(){
	if (pagenumber >= -1) {
		if (pagenumber == -1) {
			var currentpage = document.getElementById('cover');
		} else {
			var currentpage = document.getElementsByClassName('pages')[pagenumber];
		}
		currentpage.style.transform = "rotateY(0deg)";
		pagenumber--;
	}
}


