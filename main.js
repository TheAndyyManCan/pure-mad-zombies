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
const WIDTH=800;
const HEIGHT=600;
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
var startX, startY;

/**
 * World objects
 */
var hero;
var platforms = [];
spawnAllObjects();

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

    for(var i in destroyList){
        world.DestroyBody(destroyList[i]);
    }
    destroyList.length = 0;

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
    var fixa = contact.GetFixtureA().GetBody().GetUserData();
    var fixb = contact.GetFixtureB().GetBody().GetUserData();
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

}
this.world.SetContactListener(listener);

/**
 * Keyboard controls
 */
$(document).keydown(function(e){
});

$(document).keyup(function(e){
});

/**
 * Mouse controls
 */
$('#b2dcan').mousedown(function(e){
});

$('#b2dcan').mouseup(function(e){
});

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

function restartGame(){
    win = false;
    lose = false;
    deleteAllObjects();
    setTimeout(spawnAllObjects(), 1000);
}

function deleteAllObjects(){
    for(var i in platforms){
        destroyList.push(platforms[i].GetBody());
    }

    if(heroSpawned){
        destroyList.push(hero.GetBody());
    }
}

function spawnAllObjects(){
    //Ground
    // platforms.push(defineNewObject(1.0, 0.5, 0.2, (WIDTH/2), HEIGHT, (WIDTH/2), 5, 'ground', 'static', 0, 0));

    // Platform

    // Hero
    hero = defineNewObject(1.0, 0.5, 0.2, (WIDTH/2), (HEIGHT/2), 0, 0, 'hero', 'dynamic', 10);
    heroSpawned = true;
}

function defineNewObject(density, friction, restitution, x, y, width, height, objid, objtype, r=0,angle=0){
    var fixDef = defineFixtureDefinition(density, friction, restitution);
    var bodyDef = defineBodyDefinition(x, y, objtype, angle);
    defineFixtureDefinitionShape(fixDef, width, height, r);
    var thisobj = world.CreateBody(bodyDef).CreateFixture(fixDef);
    thisobj.GetBody().SetUserData({id:objid});
    return thisobj;
}

function defineFixtureDefinition(density, friction, restitution){
    var fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    return fixDef;
}

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
        default:
            bodyDef.type = b2Body.b2_staticBody;
            break;
    }

    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;

    bodyDef.gravityScale = 0.0;
    return bodyDef;
}

function defineFixtureDefinitionShape(fixDef, width, height, r=0){
    if(r > 0){
        fixDef.shape = new b2CircleShape(r/SCALE);
    } else {
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
    }
}

function defineRevJoint(body1, body2){
    var joint = new Box2d.Dynamics.Joints.b2RevoluteJointDef();
    joint.Initialize(body1.GetBody(), body2.GetBody());
}

function changeUserData(target, property, newValue){
    var currentData = target.GetBody().GetUserData();
    currentData[property] = newValue;
    target.GetBody().SetUserData(currentData);
}
