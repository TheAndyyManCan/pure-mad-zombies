<?php
    require_once('php/OAuth.class.php');
    $handler = new ProviderHandler();
    $handler->addProvider('discord', '1167929726145413120', 'B8MUEZyDJ74IsS0T3Qp-iDvN82FJcZx_');
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
    <canvas id="b2dcan" height="800" width="800"></canvas>
    <canvas id="easelcan" height="800" width="800"></canvas>
    <p>Round: <span id="round"></span></p>
    <p>Kills: <span id="kills"></span></p>
    <br /><a href="https://www.vecteezy.com/free-vector/shoot">Shoot Vectors by Vecteezy</a>
    <br /><a href="https://www.vecteezy.com/free-vector/flame">Flame Vectors by Vecteezy</a>
    <br /><a href="https://www.vecteezy.com/free-vector/brick-texture">Brick Texture Vectors by Vecteezy</a>
    <br /><a href="https://www.vecteezy.com/free-vector/zombie">Zombie Vectors by Vecteezy</a>
    <br /><a href="https://www.vecteezy.com/free-vector/punishment">Punishment Vectors by Vecteezy</a>
</body>
</html>
