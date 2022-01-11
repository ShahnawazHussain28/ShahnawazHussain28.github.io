<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="questionlist.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="utf-8">
	<title>Create Your Profile</title>
	<style type="text/css">
		#container{
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0px);
			width: 90vw;
			max-width: 400px;
			box-sizing: border-box;
			margin: 10px;
			background-color: #aaa;
		}
		#qu{
			text-align: center;
			font-size: 24px;
			color: white;
		}
		.opt{
			box-sizing: border-box;
			height: 150px;
			width: 150px;
			background-color: grey;
			margin: 20px;
			display: inline-block;
			color: white;
			text-align: center;
			font-size: 18px;
			padding: 30px;
		}
		#share{
			height: 100vh;
			width: 100vw;
			position: fixed;
			top: 0;
			left: 0;
			background-color: white;
			display: none;
		}
	</style>
</head>
<body>
	<div id="container">
		<p id="qu"></p>
		<div class="opt" onclick="selectOpt(0)"></div>
		<div class="opt" onclick="selectOpt(1)"></div>
		<div class="opt" onclick="selectOpt(2)"></div>
		<div class="opt" onclick="selectOpt(3)"></div>
		<div class="opt" onclick="selectOpt(4)"></div>
		<div class="opt" onclick="selectOpt(5)"></div>
	</div>
	<div id="share">
	</div>


<script type="text/javascript">
	let share = document.getElementById('share');
	let container = document.getElementById('container');
	let qu = document.getElementById('qu');
	let opt = document.getElementsByClassName('opt');
	var quIndex = 0;

	setup();

	window.onbeforeunload = function(event){
		if (quIndex < quList.length) {
			return "";
		}
	}
	window.onunload = function(event){
		if (quIndex < quList.length) {
			$.ajax({
				method: "POST",
				url: "ajaxHandler.php",
				data: {
					notcompleted: ""
				}
			}).done(function(response){
				console.log(response);
			});
		}
	}

	function setup(){
		quIndex++;
		if (quIndex <= quList.length) {
			qu.innerHTML = quList[quIndex-1].question;
			for (var i = 0; i < Object.keys(quList[quIndex-1].options).length; i++) {
				opt[i].innerHTML = quList[quIndex-1].options[i];
			}
			removeExtraOpt(Object.keys(quList[quIndex-1].options).length);
		} else {
			container.style.display = 'none';
			share.style.display = 'block';
			window.location.href = "/loginsystem" ;

		}
	}

	function removeExtraOpt(ansLength){
		for(var element of opt){
			element.style.display = "inline-block";
		}
		for (var i = ansLength; i < opt.length; i++) {
			opt[i].style.display = 'none';
		}
	}

	function selectOpt(a){
		$.ajax({
			method: "POST",
			url: "ajaxHandler.php",
			data: {
				index: quIndex,
				ans: a
			}
		}).done(function(response){
			setup();
		});
	}


</script>
</body>
</html>