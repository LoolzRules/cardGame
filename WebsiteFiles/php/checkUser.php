<?
require_once 'db_class.php';

$login = $_POST['login'];
$pswd = $_POST['pswd'];
$db = new Database();

$db->query("SELECT password, PID FROM PLAYERS WHERE login = '$login';");
$res = $db->single();

if ($res == null) {
	echo "f";
} else {
	if ($pswd != $res['password']) {
		echo 'w';
	} else {
		echo $res['PID'];
	}
}

?>