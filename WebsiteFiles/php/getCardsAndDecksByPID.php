<?
require_once 'db_class.php';

$pid = $_GET['pid'];
$db = new Database();


// LIST ALL CARDS THAT A PLAYER HAS
$db->query("SELECT DISTINCT `num`, CARDS.* FROM PLAYERS_HAVE_CARDS INNER JOIN CARDS ON (`PID`=$pid) AND (PLAYERS_HAVE_CARDS.CID=CARDS.CID);");

$res1 = $db->resultset();
$num1 = count($res1);

echo '{"cards":[';
foreach($res1 as $row1) {
	echo "{\"CID\":$row1[CID],\"name\":\"$row1[name]\",\"description\":\"$row1[description]\",\"cX\":$row1[cX],\"HP\":$row1[HP],\"DP\":$row1[DP],\"AP\":$row1[AP],\"FID\":$row1[FID],\"num\":$row1[num]}";
	if (--$num1>0) {
		echo ",";
	}
}
echo '],';


// LIST ALL DECKS AND CARDS IN THEM
$db->query("SELECT d.FID, phd.DID, phd.name FROM PLAYERS_HAVE_DECKS phd, DECKS d WHERE phd.PID=$pid AND phd.DID=d.DID");

$res2 = $db->resultset();
$num2 = count($res2);

echo '"decks":[';
foreach($res2 as $row2) {

	echo "{\"DID\":$row2[DID],\"FID\":$row2[FID],\"name\":\"$row2[name]\",\"deckCards\":[";

	$db->query("SELECT dhc.CID, dhc.num, c.AP, c.name FROM DECKS_HAVE_CARDS dhc, CARDS c WHERE dhc.DID=$row2[DID] AND dhc.CID=c.CID");

	$res3 = $db->resultset();
	$num3 = count($res3);
	foreach($res3 as $row3) {
		echo "{\"CID\":$row3[CID],\"num\":$row3[num],\"AP\":$row3[AP],\"name\":\"$row3[name]\"}";
		if (--$num3 > 0) {
			echo ',';
		}
	}

	echo ']}';
	if (--$num2 > 0) {
		echo ',';
	}
}
echo ']}';

?>