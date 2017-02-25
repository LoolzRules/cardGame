<?php
require_once 'db_class.php';

$did = $_POST['did'];

$db = new Database();

$db->query("DELETE FROM DECKS WHERE `DID`=$did;");
$db->execute();

?>