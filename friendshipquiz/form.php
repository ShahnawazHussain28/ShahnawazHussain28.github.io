<script type="text/javascript">
	function joinPage(){
		window.location.href = '/loginsystem/join.php';
	}
</script>

<?php
$userName = uniqid();
$current_data = file_get_contents('loginData.json');
$array_data = json_decode($current_data, true);


if(isset($_GET['user'])){
	if ($_GET['user'] == $_COOKIE['id']) {
		login($array_data);
	} else {
		echo "<script>window.location.href = '/loginsystem/response.php?user=" . $_GET['user'] . "';</script>";
	}
} else {
	login($array_data);
}




function isRegistered($json){
	$user_available = false;
	if(isset($_COOKIE['id'])){
		foreach ($json as $key => $value) {
			if($key == $_COOKIE['id']){
				$user_available = true;
			}
		}
	}
	return $user_available;
}


function register($json){
	$myid = '';
	$myNameTaken = false;
	foreach ($json as $key => $value) {
		if ($key == $_POST['name']) {
			$myNameTaken = true;
		}
	}
	if ($myNameTaken) {
		$myid = $GLOBALS['userName'];
	} else {
		$myid = $_POST['name'];
	}
	
	$new_data = array(
		'name' => $_POST['name']
	);
	$json[$myid] = $new_data;
	$json_data = json_encode($json, JSON_PRETTY_PRINT);
	file_put_contents('loginData.json', $json_data);
	setcookie("id", $myid, time() + (3600 * 30), "/");
	echo "You are Successfully registered ". $_POST['name'];
}

function login($json){
	$user_available = isRegistered($json);
	if($user_available){
		echo "<script>window.location.href = '/loginsystem/showmyfriends.php';</script>";
	} else {
		register($json);
		echo "<script>window.location.href = '/loginsystem/join.php';</script>";
	}
}

?>

