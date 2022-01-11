<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Show My Friends</title>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<style type="text/css">
		body{
			font-family: sans-serif;
			background-color: #d1efff;
			margin: 0;
			padding: 0;
		}
		#container{
			width: 100vw;
			max-width: 450px;
			padding: 20px;
			box-sizing: border-box;
		}
		#sharelink{
			padding: 5px;
			border: 3px dashed blueviolet;
			max-width: 450px;
			padding-bottom: 20px;
			position: relative;
			left: 50%;
			transform: translate(-50%, 0%);
		}
		#link{
			width: calc(100% - 20px);
			margin: 10px;
			box-sizing: border-box;
			padding: 10px;
			padding-left: 0px;
			max-width: 400px;
			border: 2px solid blue;
			color: royalblue;
			white-space: nowrap;
			overflow-x: scroll;
			overflow-y: hidden;
		}
		#link span{
			border: 2px solid blue;
			margin: 0;
			padding: 10px 10px;
			font-size: 18px;
			font-weight: bolder;
			background-color: darkcyan;
			color: white;
			user-select: none;
			cursor: pointer;
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
			padding: 20px;
			box-sizing: border-box;
			text-align: center;
			border: 1px solid black;
		}
		i{
			font-size: 48px;
			color: white;
			background-color: green;
			padding: 5px 7px;
			box-sizing: border-box;
			border-radius: 50%;
			font-weight: bolder;
		}
		#sharebtn, #deletedare{
			padding: 10px 20px;
			font-size: 22px;
			border-radius: 5px;
			background-color: grey;
			border-style: none;
			border: 1px solid darkblue;
			color: white;
			position: relative;
			left: 50%;
			transform: translate(-50%, 0%);
			cursor: pointer;
		}
		#deletedare{
			padding: 7px 14px;
			margin-top: 20px;
		}
	</style>
	
	<script type="text/javascript">
		function deleteYourDare(){
			$.ajax({
				method: "POST",
				url: "ajaxHandler.php",
				data: {
					deletedare: ''
				}
			})
			.done(function(response){
				alert("Dare deleted... Now you can create a New One");
				window.location.href = "/loginsystem";
			});
		}
	</script>
</head>
<body>
	<div id="container">
		<div id='sharelink'>
			<p id="link">
				<span>Your link:</span> &nbsp;<?php echo "localhost/loginsystem?user=" . $_COOKIE['id']; ?>
			</p>
			<button id="sharebtn">SHARE <i class="fa fa-whatsapp"></i></button>
		</div>
		<table>
			<tr>
				<th>Name</th>
				<th>Marks</th>
			</tr>

			<?php 

			$current_data = file_get_contents('loginData.json');
			$array_data = json_decode($current_data, true);
			if(array_key_exists('response', $array_data[$_COOKIE['id']])){
				$response = $array_data[$_COOKIE['id']]['response'];
				foreach ($response as $key) {
					echo "<tr>";
					foreach ($key as $name => $score) {
						echo "<td>" . $name . "</td>";
						echo "<td>" . $score . "</td>";
					}
					echo "<tr>";
				}
			} else {
				echo "<tr>";
				echo "<td>Sorry No one Participated</td>";
				echo "<td>0</td>";
				echo "</tr>";
			}

			?>
		</table>
		<button id="deletedare" onclick="deleteYourDare()">Delete this dare</button>
	</div>
</body>
</html>


