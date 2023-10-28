'use strict';

/**
 * Box2d Web Definitions
 */
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

/**
 * EaselJS global
 */
var easelCan, easelCtx, loader, stage, stageHeight, stageWidth;


/**
 * Objects for destruction
 */
var destroyList = []; //Empty list at start

/**
 * Define Canvas and World
 */
const WIDTH=800;
const HEIGHT=800;
const SCALE=30;

var world = new b2World(
    // new b2Vec2(0, 9.81),
    new b2Vec2(0,0),
    true
);

/**
 * Game states
 */
var win = false;
var lose = false;
var heroSpawned = false;
var firing = false;
var round = 1;
var kills = 0;
var mouseXPosition;
var mouseYPosition;
var zombieHealth = 100;
var zombieSpeed = 0.5;
var maxZombieSpeed = 20;
var startX, startY;

/**
 * World objects
 */
var hero;
var leftWall;
var rightWall;
var topWall;
var bottomWall;
var zombies = [];
var zombieSpriteMap = [];
var bullets = [];
var bulletSpriteMap = [];
var bulletInterval;
spawnAllObjects();

/**
 * EaselJS Objects
 */
var easelHero, easelTopWall, easelBottomWall, easelLeftWall, easelRightWall, easelBackground;

/**
 * Initialization function
 */
function init(){
    easelCan = document.getElementById('easelcan');
    easelCtx = easelCan.getContext("2d");
    stage = new createjs.Stage(easelCan);
    stage.snapPixelsEnabled = true;
    stageWidth = stage.canvas.width;
    stageHeight = stage.canvas.height;
    var manifest = [
        {src:'background.jpg', id:'background'},
        {src:'hero.png', id:'hero'},
        {src:'horizontalWall.jpg', id:'hWall'},
        {src:'verticalWall.jpg', id:'vWall'},
        {src:'bullet.png', id:'bullet'},
        {src:'zombie.png', id:'zombie'}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', handleComplete);
    loader.loadManifest(manifest, true, "./assets/");

    /**
     * Debug draw
     */
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("b2dcan").getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

}

function handleComplete(){
    easelBackground = makeBitmap(loader.getResult('background'), stageWidth, stageHeight);
    easelBackground.x = 0;
    easelBackground.y = 0;

    easelLeftWall = makeBitmap(loader.getResult('hWall'), 10, HEIGHT);
    easelLeftWall.x = leftWall.GetBody().GetPosition().x*SCALE;
    easelLeftWall.y = leftWall.GetBody().GetPosition().y*SCALE;

    easelRightWall = makeBitmap(loader.getResult('hWall'), 10, HEIGHT);
    easelRightWall.x = rightWall.GetBody().GetPosition().x*SCALE;
    easelRightWall.y = rightWall.GetBody().GetPosition().y*SCALE;

    easelTopWall = makeBitmap(loader.getResult('vWall'), WIDTH, 10);
    easelTopWall.x = topWall.GetBody().GetPosition().x*SCALE;
    easelTopWall.y = topWall.GetBody().GetPosition().y*SCALE;

    easelBottomWall = makeBitmap(loader.getResult('vWall'), WIDTH, 10);
    easelBottomWall.x = bottomWall.GetBody().GetPosition().x*SCALE;
    easelBottomWall.y = bottomWall.GetBody().GetPosition().y*SCALE;

    easelHero = makeBitmap(loader.getResult('hero'), 10, 10);

    stage.addChild(easelBackground, easelLeftWall, easelRightWall, easelTopWall, easelBottomWall, easelHero);

    spawnZombies(round);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', tick);
}

function tick(e){
    update();
    stage.update(e);
}

//Update World Loop
function update(){
    world.Step(
        1/60, //framerate
        10, //velocity iterations
        10 //position iterations
    );
    world.DrawDebugData();
    world.ClearForces();
    // world.SetGravity(new b2Vec2(hero.GetBody().GetPosition().x, hero.GetBody().GetPosition().y));

    for(var i in destroyList){

        if(destroyList[i].GetUserData().id == "zombie"){
            kills++;
        }

        world.DestroyBody(destroyList[i]);

    }
    destroyList.length = 0;

    decelerateHero();
    moveZombies();

    if(zombies.length == 0){
        round++;
        zombieHealth = zombieHealth * 1.1;
        zombieSpeed = zombieSpeed * 1.2;
        if(zombieSpeed > maxZombieSpeed){
            zombieSpeed = maxZombieSpeed;
        }
        spawnZombies(round);
    }

    /**
     * Update sprite co-ordinates
     */
    easelHero.x = hero.GetBody().GetPosition().x*SCALE;
    easelHero.y = hero.GetBody().GetPosition().y*SCALE;

    for(var i in zombies){
        zombieSpriteMap[i].sprite.x = zombies[i].GetBody().GetPosition().x*SCALE;
        zombieSpriteMap[i].sprite.y = zombies[i].GetBody().GetPosition().y*SCALE;
    }

    for(var i in bullets){
        bulletSpriteMap[i].sprite.x = bullets[i].GetBody().GetPosition().x * SCALE;
        bulletSpriteMap[i].sprite.y = bullets[i].GetBody().GetPosition().y * SCALE;
    }

    $('#round').html(round);
    $('#kills').html(kills);

    if(lose){
        loseGame();
    }
}
init();

/**
 * Listeners
 */
var listener = new Box2D.Dynamics.b2ContactListener;
listener.BeginContact = function(contact) {
    var fixa = contact.GetFixtureA().GetBody();
    var fixb = contact.GetFixtureB().GetBody();

    /*
     * If a bullet hits a zombie, reduce the zombie's health
     * If the zombie runs out of health, destroy the zombie
     */
    if(fixa.GetUserData().id == "bullet" && fixb.GetUserData().id == "zombie"){
        var currentZombieHealth = fixb.GetUserData().health;
        var newZombieHealth = currentZombieHealth - 40;
        if(newZombieHealth > 0){
            changeUserData(contact.GetFixtureB(), 'health', newZombieHealth);
        } else {
            destroyZombie(contact.GetFixtureB());
        }
    }
    if(fixb.GetUserData().id == "bullet" && fixa.GetUserData().id == "zombie"){
        var currentZombieHealth = fixa.GetUserData().health;
        var newZombieHealth = currentZombieHealth - 40;
        if(newZombieHealth > 0){
            changeUserData(contact.GetFixtureA(), 'health', newZombieHealth);
        } else {
            destroyZombie(contact.GetFixtureA());
        }
    }

    /**
     * If a zombie hits the hero, then reduces the hero's health by 25
     * If the hero runs out of health, the game ends
     */
    if(fixa.GetUserData().id == "zombie" && fixb.GetUserData().id == "hero"){
        var currentHeroHealth = fixb.GetUserData().health;
        var newHeroHealth = currentHeroHealth - 25;
        if(newHeroHealth > 0){
            changeUserData(contact.GetFixtureB(), 'health', newHeroHealth);
        } else {
            lose = true;
        }
    }
    if(fixb.GetUserData().id == "zombie" && fixa.GetUserData().id == "hero"){
        var currentHeroHealth = fixa.GetUserData().health;
        var newHeroHealth = currentHeroHealth - 25;
        if(newHeroHealth > 0){
            changeUserData(contact.GetFixtureA(), 'health', newHeroHealth);
        } else {
            lose = true;
        }
    }

    /**
     * If a bullet hits anything other than the hero, destroy the bullet
     * Stops loads of bullets just floating around
     */
    if(fixa.GetUserData().id == "bullet" && fixb.GetUserData().id != "hero"){
        fixa.SetLinearVelocity(new b2Vec2(0, 0));
        destroyBullet(contact.GetFixtureA());
    }
    if(fixb.GetUserData().id == "bullet" && fixa.GetUserData().id != "hero"){
        fixb.SetLinearVelocity(new b2Vec2(0, 0));
        destroyBullet(contact.GetFixtureB());
    }
}

listener.EndContact = function(contact) {
    var fixa = contact.GetFixtureA().GetBody().GetUserData();
    var fixb = contact.GetFixtureB().GetBody().GetUserData();
}

listener.PostSolve = function(contact, impulse) {
    var fixa = contact.GetFixtureA().GetBody().GetUserData();
    var fixb = contact.GetFixtureB().GetBody().GetUserData();
}

listener.PreSolve = function(contact, oldManifold) {
    var fixa = contact.GetFixtureA().GetBody().GetUserData();
    var fixb = contact.GetFixtureB().GetBody().GetUserData();

    if((fixa.id == "bullet" && fixb.id == "hero") || (fixa.id == "hero" && fixb.id == "bullet")){
        contact.SetEnabled(false);
    }
}
this.world.SetContactListener(listener);

/**
 * Keyboard controls
 */
$(document).keydown(function(e){
    if(e.keyCode == 65){
        goLeft();
    }
    if(e.keyCode == 68){
        goRight();
    }
    if(e.keyCode == 87){
        goUp();
    }
    if(e.keyCode == 83){
        goDown();
    }
});

$(document).keyup(function(e){
});

/**
 * Mouse controls
 */
$('#easelcan').mousedown(function(e){
    firing = true;
    bulletInterval = setInterval(shootBullet, 150);
});

$('#easelcan').mouseup(function(e){
    firing = false;
    clearInterval(bulletInterval);
});

$('#easelcan').mousemove(function(e){
    mouseXPosition = e.offsetX;
    mouseYPosition = e.offsetY;
})

/**
 * Utility functions and objects
 */

function winGame(){
    window.alert('You win!');
    restartGame();
}

function loseGame(){
    window.alert('You lose!');
    restartGame();
}

/**
 * Reset global variables to defaults
 * Delete all objects and respawn all objects
 */
function restartGame(){
    win = false;
    lose = false;
    round = 1;
    kills = 0;
    zombieSpeed = 5;
    zombieHealth = 100;
    deleteAllObjects();
    setTimeout(spawnAllObjects, 1000);
}

/**
 * Loop through all object arrays and add each object to the destroyList
 */
function deleteAllObjects(){
    destroyList.push(rightWall.GetBody());
    destroyList.push(leftWall.GetBody());
    destroyList.push(topWall.GetBody());
    destroyList.push(bottomWall.GetBody());
    for(var i in zombies){
        destroyList.push(zombies[i].GetBody());
    }

    if(heroSpawned){
        destroyList.push(hero.GetBody());
        heroSpawned = false;
    }
}

/**
 * Spawn Objects
 */
function spawnAllObjects(){
    //Ground
    bottomWall = defineNewObject(1.0, 0.5, 0.05, (WIDTH/2), HEIGHT, (WIDTH/2), 10, 'border', 'static', 0, 0);
    topWall = defineNewObject(1.0, 0.5, 0.05, (WIDTH/2), 0, (WIDTH/2), 10, 'border', 'static', 0, 0);
    leftWall = defineNewObject(1.0, 0.5, 0.05, 0, (HEIGHT/2), 10, HEIGHT, 'border', 'static', 0, 0);
    rightWall = defineNewObject(1.0, 0.5, 0.05, WIDTH, (HEIGHT/2), 10, HEIGHT, 'border', 'static', 0, 0);

    // Platform

    // Hero
    if(!heroSpawned){
        hero = defineNewObject(1.0, 0.5, 0.0, (WIDTH/2), (HEIGHT/2), 0, 0, 'hero', 'dynamic', 10);
        // hero.GetBody().SetPosition(new b2Vec2((WIDTH/2), (HEIGHT/2)));
        hero.GetBody().SetFixedRotation(true);
        heroSpawned = true;
        changeUserData(hero, 'health', 100);
    }
}

/**
 * Zombies
 */
function spawnZombies(round){
    // Increase the number of zombies each round
    var numberOfZombies = (round + 1) * 2;

    // Set a maximum amount of zombies at 30
    if(numberOfZombies > 30){
        numberOfZombies = 30;
    }

    // Spawn the correct amount of zombies, set their health and add them to the zombies array
    for (var i = 0; i <= numberOfZombies; i++){

        // Give each zombie random co-ordinates
        var x = Math.random() * WIDTH + 10;
        var y = Math.random() * HEIGHT + 10;
        if(x > WIDTH || y > HEIGHT){
            x = Math.random() * WIDTH + 10;
            y = Math.random() * HEIGHT + 10;
        }

        // Define a new zombie object
        var zombie = defineNewObject(1.0, 0.5, 0.0, x, y, 0, 0, 'zombie', 'dynamic', 5);
        // Create a new zombite sprite and add it to the stage
        var zombieSprite = makeBitmap(loader.getResult('zombie'), 10, 10);
        stage.addChild(zombieSprite);
        // Add zombie health
        changeUserData(zombie, 'health', zombieHealth);
        // Add the zombie to the zombies array
        zombies.push(zombie);
        // Add the zombie and the associated sprite to the sprite map
        zombieSpriteMap.push({zombie: zombie, sprite: zombieSprite});
    }

    // Stop zombies rotating around like wheels
    for(var i in zombies){
        zombies[i].GetBody().SetFixedRotation(true);
    }
}

/**
 * Destroy a zombie after it has been shot
 * Adds the zombies body object to the destroyList
 * Removes the zombie from the zombies array and removes the zombie and sprite from the zombie sprite map array
 * @param (Object) A box2d object to be destroyed
 */
function destroyZombie(zombie){
    destroyList.push(zombie.GetBody());
    var index = zombies.indexOf(zombie);
    if(index !== -1){
        zombies.splice(index, 1);
        var zombieSprite = zombieSpriteMap[index].sprite;
        stage.removeChild(zombieSprite);
        zombieSpriteMap.splice(index, 1);
    }
}

/**
 * Sets each zombie's movement to chase the hero
 * Stops the zombie from orbiting round the hero by slowing the zombie down as it approaches the hero
 */
function moveZombies() {
    // Loop through all zombies
    for (var i in zombies) {
        // Get the zombie and hero positions
        var zombiePosition = zombies[i].GetBody().GetWorldCenter();
        var heroPosition = hero.GetBody().GetWorldCenter();

        // Calculate the vector from zombie to hero
        var xDirection = heroPosition.x - zombiePosition.x;
        var yDirection = heroPosition.y - zombiePosition.y;

        // Calculate the distance between the zombie and the hero
        var distance = Math.sqrt(xDirection * xDirection + yDirection * yDirection);

        // Normalize the direction vector
        if (distance > 0) { // Avoid dividing by 0
            xDirection = xDirection / distance;
            yDirection = yDirection / distance;
        }

        // Adjust the force based on distance
        var maxForce = 20; // Maximum steering force
        var slowingRadius = 5; // Radius within which zombies start to slow down

        // Calculate the target speed based on the slowing radius
        var targetSpeed = (distance / slowingRadius) * zombieSpeed;

        // Calculate desired velocity based on target speed
        var desiredVelocityX = xDirection * targetSpeed;
        var desiredVelocityY = yDirection * targetSpeed;

        // Calculate the steering force
        var steerX = desiredVelocityX - zombies[i].GetBody().GetLinearVelocity().x;
        var steerY = desiredVelocityY - zombies[i].GetBody().GetLinearVelocity().y;

        // Adjust the force based on the maximum steering force
        steerX = Math.min(steerX, maxForce);
        steerY = Math.min(steerY, maxForce);

        // Apply the steering force to the zombie
        zombies[i].GetBody().ApplyForce(new b2Vec2(steerX, steerY), zombiePosition);
    }
}

/**
 * Shooting mechanics
 */
function spawnBullet(){
    var bullet = defineNewObject(1.0, 0.5, 0, ((hero.GetBody().GetWorldCenter().x) * SCALE), ((hero.GetBody().GetWorldCenter().y) * SCALE), 2, 2, 'bullet', 'bullet');
    var bulletSprite = makeBitmap(loader.getResult('bullet'), 4, 4);
    stage.addChild(bulletSprite);
    bullets.push(bullet);
    bulletSpriteMap.push({bullet: bullet, sprite: bulletSprite});
    return bullet;
}

/**
 * Shoot bullets based on the current mouse position and the position of the hero
 */
function shootBullet(){
    var bullet = spawnBullet();
    var heroPosition = hero.GetBody().GetWorldCenter();
    bullet.GetBody().ApplyImpulse(new b2Vec2((mouseXPosition - heroPosition.x * SCALE), (mouseYPosition - heroPosition.y * SCALE)), heroPosition);
}

function destroyBullet(bullet){
    destroyList.push(bullet.GetBody());
    var index = bullets.indexOf(bullet);
    if(index !== -1){
        bullets.splice(index, 1);
        var bulletSprite = bulletSpriteMap[index].sprite;
        stage.removeChild(bulletSprite);
        bulletSpriteMap.splice(index, 1);
    }
}

/**
 * Player movements
 */
function goLeft(){
    hero.GetBody().ApplyImpulse(new b2Vec2(-5, 0), hero.GetBody().GetWorldCenter());
    // Set a maximum velocity
    if(hero.GetBody().GetLinearVelocity().x < -10){
        hero.GetBody().SetLinearVelocity(new b2Vec2(-10, hero.GetBody().GetLinearVelocity().y));
    }
}

function goRight(){
    hero.GetBody().ApplyImpulse(new b2Vec2(5, 0), hero.GetBody().GetWorldCenter());
    // Set a maximum velocity
    if(hero.GetBody().GetLinearVelocity().x > 10){
        hero.GetBody().SetLinearVelocity(new b2Vec2(10, hero.GetBody().GetLinearVelocity().y));
    }
}

function goUp(){
    hero.GetBody().ApplyImpulse(new b2Vec2(0, -5), hero.GetBody().GetWorldCenter());
    // Set a maximum velocity
    if(hero.GetBody().GetLinearVelocity().y < -10){
        hero.GetBody().SetLinearVelocity(new b2Vec2(hero.GetBody().GetLinearVelocity().x, -10));
    }
}

function goDown(){
    hero.GetBody().ApplyImpulse(new b2Vec2(0, 5), hero.GetBody().GetWorldCenter());
    // Set a maximum velocity
    if(hero.GetBody().GetLinearVelocity().y > 10){
        hero.GetBody().SetLinearVelocity(new b2Vec2(hero.GetBody().GetLinearVelocity().x, 10));
    }
}

/**
 * Gradually reduce the hero's speed each time the function is called
 * If the hero's speed it less than 0 +- 0.1 then stop the hero's movement
 * This stops the hero from keeping momentum when it should be stopped
 * Should be called every time the world is updated
 */
function decelerateHero(){
    var x, y;
    var currentX = hero.GetBody().GetLinearVelocity().x;
    var currentY = hero.GetBody().GetLinearVelocity().y;

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

    hero.GetBody().SetLinearVelocity(new b2Vec2(x, y));
}

/**
 * Define a new Box2D object
 * Object can be static or dynamic. Can also be defined as a bullet
 * @param (float) density How dense the new object should be. Usually will be 1.0 unless there are specific density requirements
 * @param (float) friction How much friction the object should have when colliding with other objects
 * @param (float) restitution How 'bouncy' and object is when colliding with other objects
 * @param (int) x The x co-ordinate of the centre of the new object
 * @param (int) y The y co-ordinate of the centre of the new object
 * @param (int) width The width of the object measured in pixels
 * @param (int) height The height of the object measured in pixels
 * @param (string) objid An id which will be referred to by Box2D
 * @param (string) objtype The type of the object, should be 'static', 'dynamic' or 'bullet'. Will be 'static' by default
 * @param (float) r The radius of the object if a circle is being defined. Is 0 by default
 * @param (float) angle The angle of the object if the object type is static. Is 0 by default
 * @return (object) Returns a Box2D object defined with the parameters provided
 */
function defineNewObject(density, friction, restitution, x, y, width, height, objid, objtype, r=0,angle=0){
    var fixDef = defineFixtureDefinition(density, friction, restitution);
    var bodyDef = defineBodyDefinition(x, y, objtype, angle);
    defineFixtureDefinitionShape(fixDef, width, height, r);
    var thisobj = world.CreateBody(bodyDef).CreateFixture(fixDef);
    thisobj.GetBody().SetUserData({id:objid});
    return thisobj;
}

/**
 * Define the fixture definition of a Box2D object
 * @param (float) deinsity How dense the object should be. Usually will be 1.0 unless there are specific density requirements
 * @param (float) friction How much friction the object should have when colliding with other objects
 * @param (float) restitution How 'bouncy' an object is when colliding with other objects
 * @return (Object) A Box2D Fixture Definition object to be applied to a Box2D Object
 */
function defineFixtureDefinition(density, friction, restitution){
    var fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    return fixDef;
}

/**
 * Define the body definition of a Box2D object
 * @param (int) x The x co-ordinate of the centre of the object
 * @param (int) y The y co-ordinate of the centre of the object
 * @param (String) objtype The type of object being created. Should be 'static', 'dynamic' or 'bullet'. Will be 'static' by default.
 * @param (float) angle The angle of the object if the object type is static
 * @return (Object) Returns a Body Definition object to be used with a Box2D object
 */
function defineBodyDefinition(x, y, objtype, angle){
    var bodyDef = new b2BodyDef;

    switch(objtype){
        case 'static':
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.angle = angle;
            break;
        case 'dynamic':
            bodyDef.type = b2Body.b2_dynamicBody;
            break;
        case 'bullet':
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.bullet = true;
            break;
        default:
            bodyDef.type = b2Body.b2_staticBody;
            break;
    }

    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;

    bodyDef.gravityScale = 0.0;
    return bodyDef;
}

/**
 * Define the shape of a Box2D object
 * @param (Object) fixDef The Fixture Definition of the Box2D object
 * @param (int) width The width of the object measured in pixels
 * @param (int) height The height of the object measured in pixels
 * @param (float) radius The radius of the object if the object is a circle. Is 0 by default
 * @return void
 */
function defineFixtureDefinitionShape(fixDef, width, height, r=0){
    if(r > 0){
        fixDef.shape = new b2CircleShape(r/SCALE);
    } else {
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
    }
}

// function defineRevJoint(body1, body2){
//     var joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
//     joint.Initialize(body1.GetBody(), body2.GetBody(), body1.GetBody().GetWorldCenter(), body2.GetBody().GetWorldCenter());
// }

// function defineDistanceJoint(body1, body2){
//     var joint = new Box2D.Dynamics.Joints.b2DistanceJointDef();
//     joint.Initialize(body1.GetBody(), body2.GetBody(), body1.GetBody().GetWorldCenter(), body2.GetBody().GetWorldCenter());
//     joint.collideConnected = true;
//     console.log(joint);
// }

/**
 * Changes the user data of a Box2D object
 * Can change existing user data items or create a new user data item
 * @param (Object) target A Box2D object to change user data/add user data to
 * @param (String) property The property that's value is to be changed. Using a previously unused property will add that property to the object
 * @param (Any) The value to be changed/added to the user data property
 * @returns void
 */
function changeUserData(target, property, newValue){
    var currentData = target.GetBody().GetUserData();
    currentData[property] = newValue;
    target.GetBody().SetUserData(currentData);
}

/**
 * EaselJS Helpers
 */
function makeBitmap(loaderimage, b2x, b2y){
    var image = new createjs.Bitmap(loaderimage);
    var scalex = (b2x * 2) / image.image.naturalWidth;
    var scaley = (b2y * 2) / image.image.naturalHeight;
    image.scaleX = scalex;
    image.scaleY = scaley;
    image.regX = image.image.width / 2;
    image.regY = image.image.height / 2;
    return image;
}
