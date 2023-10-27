<?php

require_once("./highscorecrud.class.php");

class HighScore {

    private $username, $round, $kills;

    public function __construct(){
        $this->username = "";
        $this->round = 0;
        $this->kills = 0;
    }

    public function getUsername(){return $this->username;}
    public function getRound(){return $this->round;}
    public function getKills(){return $this->kills;}

    private function setUsername($username){$this->username = $username;}
    private function setRound($round){$this->round = $round;}
    private function setKills($kills){$this->kills = $kills;}

    public function storeNewHighScore($username, $round, $kills){
        $target = new HighScoreCrud();
        $this->setUsername($username);
        $this->setRound($round);
        $this->setKills($kills);
        $id = $target->addNewHighScore($this->getRound(), $this->getKills(), $this->getUsername());
        if($id > 0){
            return true;
        } else {
            return false;
        }
    }

    public function getAllHighScores(){
        $source = new HighScoreCrud();
        $scores = $source->getAllHighScores();
        $highscores = array();
        if(count($scores) > 0){
            foreach($scores as $score){
                $newscore = new HighScore();
                $newscore->setUsername($score['username']);
                $newscore->setRound($score['round']);
                $newscore->getKills($score['kills']);
                array_push($highscores, $newscore);
            }
        }
        if(count($highscores) > 0){
            return $highscores;
        } else {
            return false;
        }
    }
}
