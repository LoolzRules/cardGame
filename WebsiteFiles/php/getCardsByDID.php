<?
require_once 'db_class.php';

$did = $_GET['did'];
$db = new Database();

$db->query("SELECT * FROM CARDS c, DECKS_HAVE_CARDS dc WHERE DID=$did AND dc.CID=c.CID;");

$res = $db->resultset();
$num = count($res);
$i=0;

echo '{';
foreach($res as $row) {
	if ($i==0) {
		echo "\"FID\":$row[FID],\"cards\":[";
	}
	for($i=0; $i<$row['num']; $i++) {
		echo "{\"CID\":$row[CID],\"name\":\"$row[name]\",\"description\":\"$row[description]\",\"cX\":$row[cX],\"HP\":$row[HP],\"DP\":$row[DP],\"AP\":$row[AP]}";
		if ($i<$row['num']-1) {
			echo ",";
		}
	}
	if (--$num>0) {
		echo ",";
	}
}
echo ']}';

?>