<?php

require_once("./highscorecrud.class.php");

class HighScore {

    private $username, $round, $kills;

    public function __construct(){
        $this->username = "";
        $this->round = 0;
        $this->kills = 0;
    }
}
