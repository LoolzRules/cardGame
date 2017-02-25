<?
require_once 'db_class.php';

$login = $_GET['login'];
$db = new Database();

$db->query("SELECT login FROM PLAYERS WHERE login = '$login';");
$res = $db->single();

if ($res != null) {
	echo "e";
} else {
	echo "n";
}

?>