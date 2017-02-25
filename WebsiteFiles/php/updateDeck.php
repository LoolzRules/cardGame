<?
require_once 'db_class.php';

$did = $_POST['did'];
$name = $_POST['name'];
$cards = $_POST['cards'];

$db = new Database();

$query = "DELETE FROM DECKS_HAVE_CARDS WHERE `DID`=$did; ";
$query .= "UPDATE PLAYERS_HAVE_DECKS SET `name`='$name' WHERE `DID`=$did; ";
$query .= "INSERT INTO DECKS_HAVE_CARDS VALUES ";

$num = count($cards);
foreach ($cards as $card) {
	$query .= "($did, $card[0], $card[1])";
	if (--$num>0) {
		$query .= ",";
	}
}

$query .= ";";
$db->query($query);
$db->execute();

?>