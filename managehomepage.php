<?php
session_start();

$putfilesubmitbool = false;
$homepagesubmitbool = false;

if (isset($_POST['putfilesubmit'])) {
	if($_POST['foldername'] != ""){
		$foldername = $_POST['foldername'];
		$files = $_FILES['files'];
		if (!file_exists($foldername)) {
			mkdir($foldername);
		}
		foreach ($files['name'] as $key => $value) {
			move_uploaded_file($files['tmp_name'][$key], $foldername . "/" . $value);
		}
		$putfilesubmitbool = true;
	}
}
else if (isset($_POST['homepagesubmit'])){
	$title = $_POST['title'];
	$desc = $_POST['desc'];
	$genre = $_POST['genre'];
	$onclick = $_POST['onclick'];
	$image = $_FILES['image'];
	if(!empty($title) && !empty($desc) && !empty($genre) && !empty($onclick) && $image['error'] == 0 && $image['size'] != 0){
		move_uploaded_file($image['tmp_name'], "thumbnails/". $image['name']);
		$current_data = file_get_contents('websitedata.json');
		$array_data = json_decode($current_data, true);
		$my_array = array(
						'title' => $title,
						'description' => $desc,
						'image' => "thumbnails/" . $image['name'],
						'onclick' => $onclick,
						'genre' => $genre
					);
		$array_data[] = $my_array;
		$json_data = json_encode($array_data, JSON_PRETTY_PRINT);
		file_put_contents('websitedata.json', $json_data);
		$homepagesubmitbool = true;
	}

}
else if (isset($_POST['passwordsubmit'])){
	$pass = $_POST['password'];
	if ($pass == "khul ja sim sim") {
		$_SESSION['loggedin'] = true;
	}
}
else if (isset($_POST['logout'])){
	session_unset();
	session_destroy();
}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Manage Your Website</title>
	<style type="text/css">
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
		*{
			font-family: "Poppins", sans-serif;
		}
		body{
			background-color: #444;
			margin: 0;
			padding: 0;
			display: grid;
			justify-content: center;
		}
		#auth{
			position: absolute;
			height: 100vh;
			width: 100vw;
			background-color: #555;
			display: grid;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			justify-content: center;
			<?php 
			if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
				echo "display: none;";
			}
			?>
		}
		#auth section{
			padding: 20px;
			box-sizing: border-box;
			background-color: white;
			display: grid;
			justify-content: center;
			align-items: center;
		}
		#auth h3{
			text-align: center;
		}
		#auth input{
			margin: 15px;
			font-size: 18px;
			padding: 10px 15px;
		}
		#auth input[type=submit]{
			color: white;
			background-color: #483357;
		}
		.other{
			overflow: hidden;
			box-sizing: border-box;
			display: grid;
			grid-template-columns: auto 1fr;
			grid-gap: 0px;
			background-color: #fff;
			padding: 26px;
			border-radius: 15px;
			box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.4);
		}
		.other label{
			font-size: 1.2em;
			margin-right: 20px;
			grid-column: 1 / 2;
		}
		.other input{
			grid-column: 2 / 3;
			font-size: 16px;
			padding: 5px;
			max-width: 250px;
		}
		.other input[type=submit]{
			color: #fff;
			border-radius: 5px;
			border-style: none;
			background-color: #483357;
			margin: 10px;
		}
		.other div{
			grid-column: 1 / 3;
			margin-bottom: 40px;
			padding: 10px;
			border: 1px solid gray;
			white-space: nowrap;
			overflow-x: scroll;
			display: grid;
			grid-template-columns: 1fr auto;
			grid-column-gap: 10px;
			grid-row-gap: 10px;
		}
		.other div .filetext, .other div .foldertext{
			grid-column: 1 / 2;
			background-color: #d5b6a1;
		}
		.other div .foldertext{
			background-color: #a8dae1;
		}

		.other div .copybtn{
			grid-column: 2 / 3;
			border: 1px dashed black;
			cursor: pointer;
		}
		.other p{
			grid-column: 1 / 3;
			text-align: center;
			font-weight: 700;
			background-color: yellow;
		}
		h2{
			margin: 0;
			color: #fff;
			text-align: center;
			margin-top: 20px;
		}
		#logout{
			border-radius: 5px;
			border-style: none;
			margin: 50px 150px;
		}
		#logout input{
			width: 100%;
			padding: 5px;
			color: #fff;
			background-color: #2d1933;
			border-style: none;
			border-radius: 5px;
		}
	</style>

</head>
<body>
	<form id="auth" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
		<section>
			<h3>Tell me the secret word</h3>
			<input type="text" name="password" autocomplete="off">
			<input type="submit" name="passwordsubmit">
		</section>
	</form>


	<h2>Upload Files to Website</h2>
	<form class="other" method="post" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>" onsubmit="return confirm('Really want to do this?')">
		<?php 
		if (isset($_POST['putfilesubmit'])) {
			if ($putfilesubmitbool) {
				echo "<p>All files uploaded to " . $_POST['foldername'] . " folder</p>";
			} else {
				echo "<p>Please specify a Folder Name</p>";
			}
		}
		?>
		<label>Folder Name : </label>
		<input type="text" name="foldername"> <br>
		<label>All Files : </label>
		<input type="file" name="files[]" multiple> <br>
		<input type="submit" name="putfilesubmit" value="Upload Files">
	</form>

	<h2>Update Home Page</h2>
	<form class="other" method="post" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>" onsubmit="return confirm('Really want to do this?')">
		<?php 
		if (isset($_POST['homepagesubmit'])) {
			if($homepagesubmitbool == true){
				echo "<p>";
				echo "Homepage Successfully Updated with<br>";
				echo "Title: ". $_POST['title'] ."<br>";
				echo "Description: ". $_POST['desc'] ."<br>";
				echo "Genre: ". $_POST['genre'] ."<br>";
				echo "OnClick: ". $_POST['onclick'] ."<br>";
				echo "</p>";
			} else {
				echo "<p>Please Specify all Fields</p>";
			}
		}
		?>
		<label>Title : </label>
		<input type="text" name="title" autocomplete="off"> <br>
		<label>Description : </label>
		<input type="text" name="desc" autocomplete="off"> <br>
		<label>Genre : </label>
		<input type="text" name="genre" autocomplete="on"> <br>
		<label>onClick folder : </label>
		<input type="text" name="onclick" autocomplete="off"> <br>
		<label>Thumbnail : </label>
 		<input type="file" name="image"> <br>
		<input type="submit" name="homepagesubmit" value="New Entry">
	</form>

	<h2>Manage Files / Folders</h2>
	<form class="other" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>" onsubmit="return confirm('Really want to do this?')">
		<label>Folder Name : </label>
		<input type="text" name="foldertoscan">
		<input type="submit" name="scanfolder" value="Scan"><br>
		<?php
		function checkfolder($foldername){
			if(!is_dir($foldername)){
				echo "Folder Not Found";
				return;
			}
			$files = glob($foldername."/*");
			if (count($files) == 0) {
				echo "No File In This Folder";
			} else {
				foreach ($files as $file) {
					if (is_file($file)) {
						echo "<span class='filetext'>".$file."</span><span class='copybtn' onclick=\"navigator.clipboard.writeText('" . $file . "');\">Copy</span>";
					} else {
						echo "<span class='foldertext'>".$file."</span><span class='copybtn' onclick=\"navigator.clipboard.writeText('" . $file . "');\">Copy</span>";
						checkfolder($file);
					}
				}
			}
		}
		if (isset($_POST['scanfolder'])) {
			echo "<div>";
			$folder = $_POST['foldertoscan'];
			checkfolder($folder);
			echo "</div>";
		}
		?>
		<?php
		function deletefolder($foldername){
			$files = glob($foldername."/*");
			if (!is_dir($foldername)) {
				echo "<p>Folder Not Found</p>";
				return false;
			}
			if (count($files) == 0) {
				rmdir($foldername);
				return;
			}
			foreach ($files as $file) {
				if (is_file($file)) {
					unlink($file);
				} else {
					deletefolder($file);
					rmdir($foldername);
				}
			}
			return true;
		} 
		if (isset($_POST['deletedir'])) {
			$folder = $_POST['foldertodelete'];
			if(deletefolder($folder)){
				echo "<p>Successfully Deleted Everything</p>";
			}
		}
		?>
		<label>Folder Name : </label>
		<input type="text" name="foldertodelete">
		<input type="submit" name="deletedir" value="Delete Entire Folder"> <br>
		<?php
		if (isset($_POST['deletefile'])) {
			$file = $_POST['filetodelete'];
			if ($file != "") {
				if(unlink($file)){
					echo "<p>File Successfully Deleted</p>";
				} else {
					echo "<p>Could Not Delete File</p>";
				}
			} else {
				echo "<p>Please specify file name</p>";
			}
		}
		?>
		<label>Folder Name : </label>
		<input type="text" name="filetodelete">
		<input type="submit" name="deletefile" value="Delete Single File">
	</form>

	<form id="logout" id="logout" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
		<input type="submit" name="logout" value="Log Out">
	</form>

</body>
</html>
