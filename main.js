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
 * Objects for destruction
 */
var destroyList = []; //Empty list at start

/**
 * Define Canvas and World
 */
const WIDTH=1200;
const HEIGHT=1200;
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
var round = 1; // Round will update at first game loop
var kills = 0;
var mouseXPosition;
var mouseYPosition;
var zombieHealth = 100;
var zombieSpeed = 5;
var maxZombieSpeed = 50;
var startX, startY;

/**
 * World objects
 */
var hero;
var platforms = [];
var zombies = [];
var bullets = [];
var bulletInterval;
spawnAllObjects();
spawnZombies(round);

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

    if(zombies.length == kills){
        round++;
        zombieHealth = zombieHealth * 1.1;
        zombieSpeed = zombieSpeed * 1.2;
        if(zombieSpeed > maxZombieSpeed){
            zombieSpeed = maxZombieSpeed;
        }
        spawnZombies(round);
    }

    $('#round').html(round);
    $('#kills').html(kills);

    if(win){
        winGame();
    }

    if(lose){
        loseGame();
    }

    if(win && lose){
        loseGame();
    }

    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

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
            destroyList.push(fixb);
        }
    }
    if(fixb.GetUserData().id == "bullet" && fixa.GetUserData().id == "zombie"){
        var currentZombieHealth = fixa.GetUserData().health;
        var newZombieHealth = currentZombieHealth - 40;
        if(newZombieHealth > 0){
            changeUserData(contact.GetFixtureA(), 'health', newZombieHealth);
        } else {
            destroyList.push(fixa);
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
        destroyList.push(fixa);
    }
    if(fixb.GetUserData().id == "bullet" && fixa.GetUserData().id != "hero"){
        fixb.SetLinearVelocity(new b2Vec2(0, 0));
        destroyList.push(fixb);
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
$('#b2dcan').mousedown(function(e){
    firing = true;
    bulletInterval = setInterval(shootBullet, 150);
});

$('#b2dcan').mouseup(function(e){
    firing = false;
    clearInterval(bulletInterval);
});

$('#b2dcan').mousemove(function(e){
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
    for(var i in platforms){
        destroyList.push(platforms[i].GetBody());
    }
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
    platforms.push(defineNewObject(1.0, 0.5, 0.05, (WIDTH/2), HEIGHT, (WIDTH/2), 5, 'border', 'static', 0, 0));
    platforms.push(defineNewObject(1.0, 0.5, 0.05, (WIDTH/2), 0, (WIDTH/2), 5, 'border', 'static', 0, 0));
    platforms.push(defineNewObject(1.0, 0.5, 0.05, 0, (HEIGHT/2), 5, HEIGHT, 'border', 'static', 0, 0));
    platforms.push(defineNewObject(1.0, 0.5, 0.05, WIDTH, (HEIGHT/2), 5, HEIGHT, 'border', 'static', 0, 0));

    // Platform

    // Hero
    if(!heroSpawned){
        hero = defineNewObject(1.0, 0.5, 0.0, (WIDTH/2), (HEIGHT/2), 0, 0, 'hero', 'dynamic', 10);
        // hero.GetBody().SetPosition(new b2Vec2((WIDTH/2), (HEIGHT/2)));
        hero.GetBody().SetFixedRotation(true);
        heroSpawned = true;
        changeUserData(hero, 'health', 100);
    }

    // spawnZombies(round);
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
        var zombie = defineNewObject(1.0, 0.5, 0.0, ((Math.random() * WIDTH) + 5), ((Math.random() * HEIGHT) + 5), 0, 0, 'zombie', 'dynamic', 5);
        changeUserData(zombie, 'health', zombieHealth);
        zombies.push(zombie);
    }

    // Stop zombies rotating around like wheels
    for(var i in zombies){
        zombies[i].GetBody().SetFixedRotation(true);
    }
}

/**
 * Sets each zombie's movement to chase the hero
 * Stops the zombie from orbiting round the hero by slowing the zombie down as it approaches the hero
 */
function moveZombies() {
    // Loop through all zombies
    for (var i in zombies) {
        var zombiePosition = zombies[i].GetBody().GetWorldCenter();
        var heroPosition = hero.GetBody().GetWorldCenter();

        // Calculate the vector from zombie to hero
        var xDirection = heroPosition.x - zombiePosition.x;
        var yDirection = heroPosition.y - zombiePosition.y;

        // Calculate the distance between the zombie and the hero
        var distance = Math.sqrt(xDirection * xDirection + yDirection * yDirection);

        // Normalize the direction vector
        if (distance > 0) {
            xDirection = xDirection / distance;
            yDirection = yDirection / distance;
        }

        // Adjust the force based on distance; use "arrive" behavior
        var maxForce = 20; // Maximum steering force
        var slowingRadius = 10; // Radius within which zombies start to slow down

        // Calculate the target speed based on the adjusted slowing radius
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
    return defineNewObject(1.0, 0.5, 0, ((hero.GetBody().GetWorldCenter().x) * SCALE), ((hero.GetBody().GetWorldCenter().y) * SCALE), 2, 2, 'bullet', 'bullet');
}

/**
 * Shoot bullets based on the current mouse position and the position of the hero
 */
function shootBullet(){
    var bullet = spawnBullet();
    var heroPosition = hero.GetBody().GetWorldCenter();
    bullet.GetBody().ApplyImpulse(new b2Vec2((mouseXPosition - heroPosition.x * SCALE), (mouseYPosition - heroPosition.y * SCALE)), heroPosition);
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
