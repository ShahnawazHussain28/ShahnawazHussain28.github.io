<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title></title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<?php 
		if (isset($_GET['user'])) {
			echo "<script>window.location.href = '/loginsystem/form.php?user=" . $_GET['user'] . "';</script>";
		}
		if (isset($_GET['c'])) {
			if ($_GET['c'] == 't') {
				setcookie("id", 'anything', time() - (3600 * 30), "/");
			}
		}

		if (isset($_COOKIE['id'])) {
			echo "<script>window.location.href = '/loginsystem/form.php';</script>";
		}

	?>

	<form action="form.php" method="post">
		<label>Your Name?</label>
		<input type="text" name="name" placeholder="Andrew">
		<input type="submit" value="Let's Go" name="login">
		<input type="submit" value="Clear Cookie" name="clear">
	</form>
</body>
</html>