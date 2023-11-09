'use strict';

class PureMadZombies extends Game {

    /**
     * Game states
     */

    #pause = true;
    #lose = false;
    #heroSpawned = false;
    #firing = false;
    #round = 1;
    #kills = 0;
    #mouseXPosition;
    #mouseYPosition;
    #zombieHealth = 100;
    #zombieSpeed = 0.5;
    #maxZombieSpeed = 5;
    #startX;
    #startY;

    /**
     * World objects
     */
    #hero;
    #leftWall;
    #rightWall;
    #topWall;
    #bottomWall;
    #zombies = [];
    #zombieSpriteMap = [];
    #bullets = [];
    #bulletSpriteMap = [];
    #bulletInterval;

    // Getters
    get #pause(){return this.#pause;}
    get #lose(){return this.#lose;}
    get #heroSpawned(){return this.#heroSpawned;}
    get #firing(){return this.#firing;}
    get #round(){return this.#round;}
    get #kills(){return this.#kills;}
    get #mouseXPosition(){return this.#mouseXPosition;}
    get #mouseYPosition(){return this.#mouseYPosition;}
    get #zombieHealth(){return this.#zombieHealth;}
    get #zombieSpeed(){return this.#zombieSpeed;}
    get #maxZombieSpeed(){return this.#maxZombieSpeed;}
    get #startX(){return this.#startX;}
    get #startY(){return this.#startY;}
    get #hero(){return this.#hero;}
    get #leftWall(){return this.#leftWall;}
    get #rightWall(){return this.#rightWall;}
    get #topWall(){return this.#topWall;}
    get #bottomWall(){return this.#bottomWall;}
    get #zombies(){return this.#zombies;}
    get #zombieSpriteMap(){return this.#zombieSpriteMap;}
    get #bullets(){return this.#bullets;}
    get #bulletSpriteMap(){return this.#bulletSpriteMap;}
    get #bulletInterval(){return this.#bulletInterval;}

    set #pause(pause){this.#pause = pause;}
    set #lose(lose){this.#lose = lose;}
    set #heroSpawned(heroSpawned){this.#heroSpawned = heroSpawned;}
    set #firing(firing){this.#firing = firing;}
    set #round(round){this.#round = round;}
    set #kills(kills){this.#kills = kills;}
    set #mouseXPosition(mouseXPosition){this.#mouseXPosition = mouseXPosition;}
    set #mouseYPosition(mouseYPosition){this.#mouseYPosition = mouseYPosition;}
    set #zombieHealth(zombieHealth){this.#zombieHealth = zombieHealth;}
    set #zombieSpeed(zombieSpeed){this.#zombieSpeed = zombieSpeed;}
    set #maxZombieSpeed(maxZombieSpeed){this.#maxZombieSpeed = maxZombieSpeed;}
    set #startX(startX){this.#startX = startX;}
    set #startY(startY){this.#startY = startY;}
    set #hero(hero){this.#hero = hero;}
    set #leftWall(leftWall){this.#leftWall = leftWall;}
    set #rightWall(rightWall){this.#rightWall = rightWall;}
    set #topWall(topWall){this.#topWall = topWall;}
    set #bottomWall(bottomWall){this.#bottomWall = bottomWall;}
    set #zombies(zombies){this.#zombies = zombies;}
    set #zombieSpriteMap(zombieSpriteMap){this.#zombieSpriteMap = zombieSpriteMap;}
    set #bullets(bullets){this.#bullets = bullets;}
    set #bulletSpriteMap(bulletSpriteMap){this.#bulletSpriteMap = bulletSpriteMap;}
    set #bulletInterval(bulletInterval){this.#bulletInterval = bulletInterval;}

    constructor(height, width, scale, gravityX, gravityY, framerate, canvasName){
        super(height, width, scale, gravityX, gravityY, framerate, canvasName);
    }

    _destroyList = () => {

        for(var i in this._destroyList){

            if(this._destroyList[i].GetUserData().id == "zombie"){
                kills++;
            }

            this._world.DestroyBody(this._destroyList[i]);

        }
        this._destroyList.length = 0;
    };

    _gameLogic = () => {
        this.#decelerateHero();
        this.#moveZombies();
        if(this.#zombies.length == 0){
            this.#round = this.#round + 1;
            this.#zombieHealth = this.#zombieHealth * 1.1;
            this.#zombieSpeed = this.#zombieSpeed * 1.2;
            if(this.#zombieSpeed > this.#maxZombieSpeed){
                this.#zombieSpeed = this.#maxZombieSpeed;
            }
            this.#spawnZombies(this.#round);
        }
    };

    #decelerateHero = () => {

    };

    #moveZombies = () => {

    };

    #spawnZombies = (round) => {

    };
}
