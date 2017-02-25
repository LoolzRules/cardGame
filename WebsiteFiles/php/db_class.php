<?php
define("DB_HOST", "dbproj.kz");
define("DB_USER", "DBgamer");
define("DB_PASS", "DBgamer");
define("DB_NAME", "game");
define("DB_PORT", "3306");

class Database{
    private $host      = DB_HOST;
    private $user      = DB_USER;
    private $pass      = DB_PASS;
    private $dbname    = DB_NAME;
    private $dbport    = DB_PORT;
 
    private $dbh; //database handler
    private $error; //error, exception holder
    private $stmt; //sql statement holder

    public $connected;
 
    public function __construct(){
        // Set DSN
        $dsn = 'mysql:host=' . $this->host . ';port=' . $this->dbport . ';dbname=' . $this->dbname;
        // Set options
        $options = array(
            PDO::ATTR_PERSISTENT    => true,
            PDO::ATTR_ERRMODE       => PDO::ERRMODE_EXCEPTION
        );
        // Create a new PDO instanace
        try{
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
            $this->connected = true;
        }
        // Catch any errors
        catch(PDOException $e){
            $this->error = $e->getMessage();
            $this->connected = false;
        }
    }
    //Construct your query
    public function query($query){
    	$this->stmt = $this->dbh->prepare($query);
	}
	//Bind the values to query parameters
	public function bind($param, $value, $type = null){
    if (is_null($type)) {
        switch (true) {
            case is_int($value):
                $type = PDO::PARAM_INT;
                break;
            case is_bool($value):
                $type = PDO::PARAM_BOOL;
                break;
            case is_null($value):
                $type = PDO::PARAM_NULL;
                break;
            default:
                $type = PDO::PARAM_STR;
        }
    }
    $this->stmt->bindValue($param, $value, $type);
	}
	//execute the query
	public function execute(){
    	return $this->stmt->execute();
	}
	//get the result as an array
	public function resultset(){
    	$this->execute();
    	return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	//get one single row as a result
	public function single(){
    	$this->execute();
    	return $this->stmt->fetch(PDO::FETCH_ASSOC);
	}
	//get the number of rows
	public function rowCount(){
    	return $this->stmt->rowCount();
	}
	//get the id of the row that was last inserted
	public function lastInsertId(){
    	return $this->dbh->lastInsertId();
	}
}