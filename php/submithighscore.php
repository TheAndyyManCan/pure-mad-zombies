<?php
require_once(__DIR__."/highscore.class.php");
$username = $_POST['username'];
$round = (int)$_POST['round'];
$kills = (int)$_POST['kills'];
$highscore = new HighScore();
$result = $highscore->storeNewHighScore($username, $round, $kills);
?>
