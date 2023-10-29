<?php
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
    require_once('php/OAuth.class.php');
    $handler = new ProviderHandler();
    $handler->addProvider('discord', '1167929726145413120', 'B8MUEZyDJ74IsS0T3Qp-iDvN82FJcZx_');
    $handler->performAction();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="./Box2dWeb-2.1.a.3.min.js" defer ></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous" defer ></script>
    <script src="https://code.createjs.com/1.0.0/easeljs.min.js" defer ></script>
    <script src="https://code.createjs.com/1.0.0/preloadjs.min.js" defer ></script>
    <script src="./main.js" defer ></script>
    <meta charset="UTF-8">
    <title>Pure Mad Zombies</title>
    <link rel="stylesheet" href="./main.css">
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
                </div>
                <?php
            }
        ?>
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
</body>
</html>
