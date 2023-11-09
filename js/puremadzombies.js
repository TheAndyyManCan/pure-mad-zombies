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
    get pause(){return this.#pause;}
    get lose(){return this.#lose;}
    get heroSpawned(){return this.#heroSpawned;}
    get firing(){return this.#firing;}
    get round(){return this.#round;}
    get kills(){return this.#kills;}
    get mouseXPosition(){return this.#mouseXPosition;}
    get mouseYPosition(){return this.#mouseYPosition;}
    get zombieHealth(){return this.#zombieHealth;}
    get zombieSpeed(){return this.#zombieSpeed;}
    get maxZombieSpeed(){return this.#maxZombieSpeed;}
    get startX(){return this.#startX;}
    get startY(){return this.#startY;}
    get hero(){return this.#hero;}

}
