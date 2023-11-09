<?php

require_once(__DIR__."/db.php");

class HighScoreCrud {

    private static $db;
    private $sql, $stmt;

    public function __construct(){
        self::$db = db::getInstance();
    }

    /**
     * Adds a new high score to the database
     * @param $round int The round the user reached
     * @param $kills int The amount of kills the user achieved
     * @param $username String The username of the user who achieved the high score. 'nouser' by default if no user is logged in
     * @return int Returns the auto generated id of the database entry. Will return 0 if unsuccessful
     */
    public function addNewHighScore($round, $kills, $username='nouser'){
        $this->sql = "insert into highscores (username, round, kills) values (?,?,?);";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->bind_param("sii", $username, $round, $kills);
        $this->stmt->execute();
        $autoid = $this->stmt->insert_id;
        return $autoid;
    }

    /**
     * Retrieves a high score from the database using the scoreid
     * @param $scoreid int The id of the score to be retrieved
     * @param $style MYSQLI The style which the data should be returned in. Associative array by default
     * @return array Returns an associative array with the results of the database query
     */
    public function getHighScoreById($scoreid, $style=MYSQLI_ASSOC){
        $this->sql = "select * from highscores where score_id = ?;";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->bind_param("i", $scoreid);
        $this->stmt->execute();
        $result = $this->stmt->get_result();
        $resultset = $result->fetch_all($style);
        return $resultset;
    }

    /**
     * Retrieves an array of all high scores stored in the database
     * @param $style MYSQLI The style which the data should be returned in. Associative array by default
     * @return array Returns an associative array with the results of the database query
     */
    public function getAllHighScores($style=MYSQLI_ASSOC){
        $this->sql = "select * from highscores order by round desc, kills desc;";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->execute();
        $result = $this->stmt->get_result();
        $resultset = $result->fetch_all($style);
        return $resultset;
    }
}
