<hide>
<?php
    require_once('php/OAuth.class.php');
    require_once('php/highscore.class.php');
    $handler = new ProviderHandler();
    $handler->addProvider('discord', '1167929726145413120', 'B8MUEZyDJ74IsS0T3Qp-iDvN82FJcZx_');
    $handler->performAction();
?>
</hide>
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="./js/Box2dWeb-2.1.a.3.min.js" defer ></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous" defer ></script>
    <script src="https://code.createjs.com/1.0.0/easeljs.min.js" defer ></script>
    <script src="https://code.createjs.com/1.0.0/preloadjs.min.js" defer ></script>
    <script src="./js/defs.js" defer ></script>
    <script src="./js/classlib.js" defer ></script>
    <script src="js/appFlow.js" defer ></script>
    <!-- <script src="./main.js" defer ></script> -->
    <meta charset="UTF-8">
    <title>Pure Mad Zombies</title>
    <link rel="stylesheet" href="./css/main.css">
</head>
<body>
    <div id="splashScreen">
        <div id="title">
            <h1 id="titleText">Pure Mad Zombies</h1>
            <h2 id="titleSubText">Click anywhere to begin...</h2>
        </div>
    </div>
    <div id="menuScreen">
        <?php
            if($handler->getStatus() == 'logged out' || $handler->getStatus() == null){
                ?>
                <div id="loginLinks">
                    <?php echo $handler->generateLoginText(); ?>
                </div>
                <?php
            } else {
                ?>
                <div id="userinfo">
                    <p>Username: <?php echo $handler->getProviderInstance()->getUserInfo()->username; ?></p>
                    <button id="play">Play</button>
                    <button id="about">About</button>
                    <?php echo $handler->generateLogoutButton(); ?>
                </div>
                <?php
            }
        ?>
        <div id="highScores">
            <?php
                $highscore = new HighScore();
                echo $highscore->displayHighScores();
            ?>
        </div>
    </div>
    <div id="aboutScreen">
        <div>
            <p>Controls:</p>
            <p>W: Move up</p>
            <p>A: Move left</p>
            <p>S: Move down</p>
            <p>D: Move right</p>
            <p>Mouse: Aim</p>
            <p>Mouse Left Click: Shoot</p>
            <br />
            <p>Kill as many zombies as possible. The game ends when your life ends. Death is inevitable.</p>
            <button id="menuButton">Back to menu</button>
        </div>
    </div>
    <canvas id="b2dcan" height="800" width="800"></canvas>
    <canvas id="easelcan" height="800" width="800"></canvas>
    <p id="roundDisplay">Round: <span id="round"></span></p>
    <p id="killDisplay">Kills: <span id="kills"></span></p>
    <div id="licenseLinks">
        <br /><a href="https://www.vecteezy.com/free-vector/shoot">Shoot Vectors by Vecteezy</a>
        <br /><a href="https://www.vecteezy.com/free-vector/flame">Flame Vectors by Vecteezy</a>
        <br /><a href="https://www.vecteezy.com/free-vector/brick-texture">Brick Texture Vectors by Vecteezy</a>
        <br /><a href="https://www.vecteezy.com/free-vector/zombie">Zombie Vectors by Vecteezy</a>
        <br /><a href="https://www.vecteezy.com/free-vector/punishment">Punishment Vectors by Vecteezy</a>
    </div>
    <script>
        'use strict';
        var username = <?php echo "'".$handler->getProviderInstance()->getUserInfo()->username."'" ?>;
    </script>
</body>
</html>
