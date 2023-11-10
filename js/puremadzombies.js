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

    spawnAllObjects = () => {
        // Ground and walls
        this.#bottomWall = new defineStaticObject(1.0, 0.5, 0.05, (this._width / 2), this._height, (this._width / 2), 10, 'border', 'bottomWall', 0, this._scale, this._world);
        this.#topWall = defineStaticObject(1.0, 0.5, 0.05, (this._width / 2), 0, (this._width / 2), 10, 'border', 'topWall', 0, this._scale, this._world);
        this.#leftWall = defineStaticObject(1.0, 0.5, 0.05, 0, (this._height / 2), 10, this._height, 'border', 'leftWall', 0, this._scale, this._world);
        this.#rightWall = defineStaticObject(1.0, 0.5, 0.05, this._width, (this._height / 2), 10, this._height, 'border', 'leftWall', 0, this._scale, this._world);

        // Hero
        if(!this.#heroSpawned){
            this.#hero = defineCircleObject(1.0, 0.5, 0.0, (this._width / 2), (this._height / 2), 'hero', 'hero', 10, this._scale, this._world);
            this.#hero.GetBody().SetFixedRotation(true);
            this.#heroSpawned = true;
            this.#hero.changeUserData('health', 100);
        }
    };

    #decelerateHero = () => {

        let x, y;
        let currentX = this.#hero.GetBody().GetLinearVelocity().x;
        let currentY = this.#hero.GetBody().GetLinearVelocity().y;

        if((currentX < 0.1 && currentX > 0) || (currentX > -0.1 && currentX < 0)){
            x = 0;
        } else if(currentX > 0){
            x = currentX - 0.1;
        } else if(currentX < 0){
            x = currentX + 0.1;
        }

        if((currentY < 0.1 && currentY > 0) || (currentY > -0.1 && currentY < 0)){
            y = 0;
        } else if(currentY > 0){
            y = currentY - 0.1;
        } else if(currentY < 0){
            y = currentY + 0.1;
        }

        this.#hero.GetBody().SetLinearVelocity(new b2Vec2(x, y));

    };

    #moveZombies = () => {

        for(let i in this.#zombies){
            // Get the zombie and hero positions
            let zombiePosition = this.#zombies[i].GetBody().GetWorldCenter();
            let heroPosition = this.#hero.GetBody().GetWorldCenter();

            // Calculate the vector from the zombie to the hero
            let xDirection = heroPosition.x - zombiePosition.x;
            let yDirection = heroPosition.y - zombiePosition.y;

            // Calculate the distance between the zombie and the hero
            let distance = Math.sqrt(xDirection * xDirection - yDirection * yDirection);

            // Normalize the direction vector
            if(distance > 0){ // Avoid dividing by 0
                xDirection = xDirection / distance;
                yDirection = yDirection / distance;
            }

            // Adjust the force based on the distance
            let maxForce = 20; // Maximum steering force
            let slowingRadius = 5; // Radius within which zombies start to slow down

            // Calculate the target speed based on the slowing radius
            let targetSpeed = (distance / slowingRadius) * this.#zombieSpeed;

            // Calculate desired velocity based on the target speed
            let desiredVelocityX = xDirection * targetSpeed;
            let desiredVelocityY = yDirection * targetSpeed;

            // Calculate the steering force
            let steerX = desiredVelocityX - this.#zombies[i].GetBody().GetLinearVelocity().x;
            let steerY = desiredVelocityY - this.#zombies[i].GetBody().GetLinearVelocity().y;

            // Adjust the force based on the maximum steering force
            steerX = Math.min(steerX, maxForce);
            steerY = Math.min(steerY, maxForce);

            // Apply the steering force to the zombie
            this.#zombies[i].GetBody().ApplyForce(new b2Vec2(steerX, steerY), zombiePosition);
        }
    };

    #spawnZombies = () => {
        // Increase the number of zombies each round
        let numberOfZombies = (this.#round + 1) * 2;

        // Set a maximum amount of zombies at 30
        numberOfZombies = Math.min(numberOfZombies, 30);

        // Spawn the correct amount of zombies, set their health and add them to the zombies array
        for(let i = 0; i <= numberOfZombies; i++){
            // Give each zombie random co-ordinates
            let x, y;

            do {
                x = Math.random() * this._width + 10;
                y = Math.random() * this._height + 10;
            } while (x > this._width && y > this._height);

            // Define a new zombie object
            let zombie = new defineCircleObject(1.0, 0.5, 0.0, x, y, 'zombie', 'zombie'+[i], 5, this._scale, this._world);
            // Add zombie health
            zombie.changeUserData('health', this.#zombieHealth);
            // Add the zombie to the zombies array
            this.#zombies.push(zombie);
        }

        // Stop zombies rotating like wheels
        for(let i in this.#zombies){
            this.#zombies[i].GetBody().SetFixedRotation(true);
        }
    };
}
