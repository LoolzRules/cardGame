<?php
require_once 'db_class.php';

$pid = $_POST['pid'];
$result = $_POST['result'];

$db = new Database();

if ($result = "0") {
	$query = "UPDATE PLAYERS SET `rating`=`rating`-1 WHERE `PID`=$pid;";
} else {
	$query = "UPDATE PLAYERS SET `rating`=`rating`+1 WHERE `PID`=$pid;";
}

$db->query($query);
$db->execute();
?>