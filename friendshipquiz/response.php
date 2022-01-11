<?php 
	echo "<script>var questions = [], answers = [];</script>";
	if (isset($_GET['user'])) {
		$current_data = file_get_contents('loginData.json');
		$array_data = json_decode($current_data, true);
		$questions = $array_data[$_GET['user']]['questions'];
		foreach ($questions as $key => $value) {
			echo "<script>questions.push(" . $key . ");</script>";
			echo "<script>answers.push(" . $value . ");</script>";
		}
	}


?>
<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="questionlist.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="utf-8">
	<title>Create Your Profile</title>
	<style type="text/css">
		body{
			font-family: sans-serif;
		}
		#container{
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0px);
			width: 90vw;
			max-width: 400px;
			box-sizing: border-box;
			margin: 10px;
			background-color: #aaa;
			display: none;
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
		#success{
			box-sizing: border-box;
			padding: 15px;
			text-align: center;
			border-radius: 10px;
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0%);
			background-color: white;
			width: 90vw;
			max-width: 400px;
			display: flex;
			flex-flow: column wrap;
			align-items: center;
			justify-content: center;
			display: none;
		}
		#createYourOwn{
			padding: 10px 20px;
			margin: 10px 15px 30px 15px;
			background-color: grey;
			border-style: none;
			border: 1px solid darkblue;
			color: white;
			border-radius: 5px;
			display: block;
			font-size: 20px;
			text-align: center;
		}
		#remarks{
			margin-bottom: 50px;
			border: 2px dashed blueviolet;
			padding: 10px 40px;
		}
		table{
			position: relative;
			left: 50%;
			transform: translate(-50%, 0%);
			width: 100%;
			border: 3px dashed blueviolet;
			margin-top: 10px;
		}
		th{
			background-color: palegreen;
			border: 1px solid darkgreen;
			font-size: 20px;
		}
		td{
			padding: 10px 20px;
			box-sizing: border-box;
			text-align: center;
			border: 1px solid black;
		}
	</style>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<form id="enterName" onsubmit="return false">
		<label>Your Name?</label>
		<input type="text" id="name" placeholder="Andrew">
		<input type="submit" onclick="getName()" value="Let's Dare">
	</form>
	<div id="container">
		<p id="qu"></p>
		<div class="opt" onclick="checkCorrect(0)"></div>
		<div class="opt" onclick="checkCorrect(1)"></div>
		<div class="opt" onclick="checkCorrect(2)"></div>
		<div class="opt" onclick="checkCorrect(3)"></div>
		<div class="opt" onclick="checkCorrect(4)"></div>
		<div class="opt" onclick="checkCorrect(5)"></div>
	</div>
	<div id="success">
		<h1>Your Score is: <span id="score"></span></h1>
		<h3 id="remarks">Not too bad</h3>
		<p id="createText" style="font-weight: bold;">Now it's your turn to create your Own Quiz and Share with your Friends</p>
		<button id="createYourOwn" onclick="createYourOwn()">Create Your Own Dare</button>
		<table id="table">
		</table>
	</div>


<script type="text/javascript">
	let container = document.getElementById('container');
	let qu = document.getElementById('qu');
	let opt = document.getElementsByClassName('opt');
	let scoredisplay = document.getElementById('score');
	let remarksDisplay = document.getElementById('remarks');
	let success = document.getElementById('success');
	let createText = document.getElementById('createText');
	let createYourOwnBtn = document.getElementById('createYourOwn');
	let friendName;
	let origName = "<?php echo $_GET['user']; ?>";
	var correctAns = 0;
	var index = 0;
	createYourOwnBtn.innerHTML = 'Create Your Own Dare';
	function setup(){
		if (index < questions.length) {
			var questionIndex = questions[index] - 1;
			qu.innerHTML = quList[questionIndex].question;
			for (var i = 0; i < 6; i++) {
				var quText = quList[questionIndex].options[i];
				// var replacedText = quText.replace("your", origName+"'s");
				// var replacedText = replacedText.replace("you", origName);
				// var replacedText = replacedText.replace("do", "does");
				opt[i].innerHTML = quText;
			}
		} else {
			container.style.display = 'none';
			success.style.display = 'flex';
			scoredisplay.innerHTML = correctAns + " / 10";
			setRemarks();
			displayTable();
			submitResponse();
		}
	}

	function displayTable(){
		let table = document.getElementById('table');
		table.innerHTML = 
		"<?php
		echo "<tr><th>Name</th><th>Points</th></tr>";
		$current_data = file_get_contents('loginData.json');
			$array_data = json_decode($current_data, true);
			if(array_key_exists('response', $array_data[$_GET['user']])){
				$response = $array_data[$_GET['user']]['response'];
				foreach ($response as $key) {
					echo '<tr>';
					foreach ($key as $name => $score) {
						echo '<td>' . $name . '</td>';
						echo '<td>' . $score . '</td>';
					}
					echo '<tr>';
				}
			} else {
				echo '<tr>';
				echo '<td>No one Participated</td>';
				echo '<td>0</td>';
				echo '</tr>';
			}
		?>";

	}

	function setRemarks(){
		if (correctAns == 10) {
			remarksDisplay.innerHTML = "You know them more than " + origName + "'s Parents. No one can break your Friendship.";
		} else if (7 <= correctAns && correctAns < 10){
			remarksDisplay.innerHTML = 'You know most about ' + origName + '. Your friendship is quiet strong.';
		} else if (4 <= correctAns && correctAns < 7){
			remarksDisplay.innerHTML = 'You know quiet well. You are good friends.';
		} else if (2 <= correctAns && correctAns < 4){
			remarksDisplay.innerHTML = 'You know a little bit. You are friends';
		} else if (correctAns < 2){
			remarksDisplay.innerHTML = "You don't know anything. Are you really friends !";
		}
	}
	function checkCorrect(a){
		if (answers[index] == a) {
			correctAns++;
			console.log("Correct");
		} else {
			console.log("Wrong");
		}
		index++;
		setup();
	}

	function getName(){
		friendName = document.getElementById('name').value;
		document.getElementById('enterName').style.display = 'none';
		container.style.display = 'block';
		setup();
	}

	function submitResponse(){
		$.ajax({
			method: "POST",
			url: "ajaxHandler.php",
			data: {
				friendName: friendName,
				score: correctAns,
				origName: origName
			}
		})
		.done(function(response){
			<?php
			if (isset($_COOKIE['id'])) {
				echo "createText.innerHTML = '';";
				echo "createYourOwnBtn.innerHTML = 'Show My Page';";
			} else {
			}
			?>
		});
	}
	function createYourOwn(){
		window.location.href = "/loginsystem";
	}


</script>
</body>
</html>