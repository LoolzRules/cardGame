<?php
require_once 'php\db_class.php';
require_once 'php\session_class.php';
$thesession = new Session();
if (is_logged_in()) {
    header("Location: menu.php"); /* Redirect browser */
    exit();
}
?>

<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>Login</title>

		<link href="css/style.css" rel="stylesheet">
		
		<script src="js/jquery-3.0.0.min.js"></script>

	</head>

	<body>

		<div id="mainLogin">

			<div id="login">
				<input type="text" name="getLogin" placeholder="Login">
				<input type="password" name="getPswd" placeholder="Password">
				<button id="goLogin" role="button">Log In</button>
				<button id="switchReg" role="button">Do not have an account?</button>
			</div>

			<div id="register">
				<input type="text" name="setLogin" placeholder="Set your login">
				<input type="password" name="setPswd1" placeholder="Set your password">
				<input type="password" name="setPswd2" placeholder="Confirm your password">
				<input type="text" name="setEmail" placeholder="Set your e-mail">
				<button id="goRegister" role="button">Register</button>
				<button id="switchLog" role="button">Have an account?</button>
			</div>

		</div>

		<script src="js/login.js"></script>

	</body>

</html>