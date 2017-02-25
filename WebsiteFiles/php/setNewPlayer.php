<?
require_once 'db_class.php';

$login = $_POST['login'];
$pswd = $_POST['pswd'];
$email = $_POST['email'];
$db = new Database();

// ADD NEW PLAYER
$db->query("INSERT INTO PLAYERS VALUES (DEFAULT, '$login', '$pswd', '$email', 1000)");
$db->execute();

// GET HIS ID
$db->query("SELECT PID FROM PLAYERS WHERE login = '$login'");
$res = $db->single();

// ADD HIM STANDARD CARDS
$query = "INSERT INTO PLAYERS_HAVE_CARDS VALUES ";
for ($i=1; $i<61; $i++) {
	$query .= "($res[PID], $i, 2)";
	if ($i<60) {
		$query .= ",";
	}
}
$query .= ";";

$db->query($query);
$db->execute();

// ADD STANDARD DECKS
$query = "INSERT INTO DECKS VALUES ";
for ($i=1; $i<4; $i++) {
	$query .= "(DEFAULT, $i)";
	if ($i<3) {
		$query .= ",";
	}
}
$query .= "; ";

$db->query($query);
$db->execute();

$did = $db->lastInsertId()-1;

$query = "INSERT INTO DECKS_HAVE_CARDS VALUES ";
for ($i=0; $i<3; $i++) {
	$j=20*$i+1;
	$did++;
	for ($j; $j<16+20*$i; $j++) {
		$query .= "($did, $j, 2)";
		if ($j<55) {
			$query .= ",";
		}
	}
}
$query .= "; ";

$did = $did-3;
$query .= "INSERT INTO PLAYERS_HAVE_DECKS VALUES ";
for ($i=0; $i<3; $i++) {
	$did++;
	$query .= "($res[PID], $did,";
	if ($i==0) {
		$query .= " 'Warriors Deck'),";
	} else if ($i==1) {
		$query .= " 'Scientists Deck'),";
	} else {
		$query .= " 'Artists Deck')";
	}
}
$query .= ";";

$db->query($query);
$db->execute();

echo $res['PID'];

?>