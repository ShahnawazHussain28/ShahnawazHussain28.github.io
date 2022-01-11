<?php 

$current_data = file_get_contents('loginData.json');
$array_data = json_decode($current_data, true);
if(isset($_POST['index']) && isset($_POST['ans'])){
	$index = $_POST['index'];
	$ans = $_POST['ans'];
	$array_data[$_COOKIE['id']]['questions'][$index] = $ans;
} else if(isset($_POST['friendName']) && isset($_POST['score'])) {
	$addfriend = array($_POST['friendName'] => $_POST['score']);
	$array_data[$_POST['origName']]['response'][] = $addfriend;
} else if(isset($_POST['notcompleted'])){
	setcookie('id', 'anything', time() - (3600 * 30), '/'); 
	if (array_key_exists($_COOKIE['id'], $array_data)) {
		unset($array_data[$_COOKIE['id']]);
	}
} else if(isset($_POST['deletedare'])) { 
	unset($array_data[$_COOKIE['id']]);
	setcookie('id', 'anything', time() - 108000, '/');	
}

$json_data = json_encode($array_data, JSON_PRETTY_PRINT);
file_put_contents('loginData.json', $json_data);

echo "success";

?>