'use strict';

class defineObject {

    #userData = {};
    #uniqueName;
    #fixDef = new b2FixtureDef;
    #bodyDef = new b2BodyDef;
    #b2dobj;

    constructor(density, friction, restitution, x, y, SCALE){
        this.fixDef.density = density;
        this.fixDef.friction = friction;
        this.fixDef.restitution = restitution;
        this.bodyDef.position.x = x / SCALE;
        this.bodyDef.position.y = y / SCALE;
    }

    // Getters
    get userData(){return this.#userData;}
    get uniqueName(){return this.#uniqueName;}
    get fixDef(){return this.#fixDef;}
    get bodyDef(){return this.#bodyDef;}
    get b2dobj(){return this.#b2dobj;}

    // Setters
    set userData(userData){this.#userData = userData;}
    set uniqueName(uniqueName){this.#uniqueName = uniqueName;}
    set fixDef(fixDef){this.#fixDef = fixDef;}
    set bodyDef(bodyDef){this.#bodyDef = bodyDef;}
    set b2dobj(b2dobj){this.#b2dobj = b2dobj;}

    createObj(world){
        this.b2dobj = world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
    }

    changeUserData(property, newValue){
        let objdata = this.GetBody().GetUserData();
        this.userData = typeof objdata === undefined || objdata === null?{}:this.userData;
        this.userData[property] = newValue;
        this.GetBody().SetUserData(this.userData);
    }
}

class defineStaticObject extends defineObject {
    constructor(density, friction, restitution, x, y, width, height, objid, uniqueName, angle, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this.bodyDef.type = b2Body.b2_staticBody;
        this.bodyDef.angle = angle;
        this.fixDef.shape = new b2PolygonShape;
        this.fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        this.createObj(world);
        this.changeUserData("id", objid);
        this.changeUserData("uniqueName", uniqueName);
    }
}

class defineDynamicObject extends defineObject {
    constructor(density, friction, restitution, x, y, width, height, objid, uniqueName, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this.bodyDef.type = b2Body.b2_dynamicBody;
        this.fixDef.shape = new b2PolygonShape;
        this.fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        this.createObj(world);
        this.changeUserData('id', objid);
        this.changeUserData('uniqueName', uniqueName);
    }
}

class defineCircleObject extends defineObject {
    constructor(density, friction, restitution, x, y, objid, uniqueName, radius, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this.bodyDef.type = b2Body.b2_dynamicBody;
        this.fixDef.shape = new b2CircleShape(radius / SCALE);
        this.createObj(world);
        this.changeUserData('id', objid);
        this.changeUserData('uniqueName', uniqueName);
    }
}

