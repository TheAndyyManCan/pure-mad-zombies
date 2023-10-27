<?php

require_once("./db.php");

class HighScoreCrud {
    
    private static $db;
    private $sql, $stmt;

    public function __construct(){
        self::$db = db::getInstance();
    }
    
    public function addNewHighScore($round, $kills, $username='nouser'){
        $this->sql = "insert into highscores (username, round, kills) values (?,?,?);";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->bind_param("sii", $username, $round, $kills);
        $this->stmt->execute();
        $autoid = $this->stmt->insert_id;
        return $autoid;
    }

    public function getHighScoreById($scoreid, $style=MYSQLI_ASSOC){
        $this->sql = "select * from highscores where score_id = ?;";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->bind_param("i", $scoreid);
        $this->stmt->execute();
        $result = $this->stmt->get_result();
        $resultset = $result->fetch_all($style);
        return $resultset;
    }

    public function getAllHighScores($style=MYSQLI_ASSOC){
        $this->sql = "select * from highscores;";
        $this->stmt = self::$db->prepare($this->sql);
        $this->stmt->execute();
        $result = $this->stmt->get_result();
        $resultset = $result->fetch_all($style);
        return $resultset;
    }
}
