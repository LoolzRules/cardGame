<?
require_once 'db_class.php';

$pid = $_GET['pid'];
$fid = $_GET['fid'];
$name = $_GET['name'];

$db = new Database();

$db->query("INSERT INTO DECKS VALUES (DEFAULT, $fid);");
$db->execute();
$did = $db->lastInsertId();

$db->query("INSERT INTO PLAYERS_HAVE_DECKS VALUES ($pid, $did, '$name');");
$db->execute();

echo $did;

?>