'use strict';

class defineObject {

    #userData = {};
    #uniqueName;
    #fixDef = new b2FixtureDef;
    #bodyDef = new b2BodyDef;
    #b2dobj;

    // Getters
    get _userData(){return this.#userData;}
    get _uniqueName(){return this.#uniqueName;}
    get _fixDef(){return this.#fixDef;}
    get _bodyDef(){return this.#bodyDef;}
    get _b2dobj(){return this.#b2dobj;}

    // Setters
    set _userData(userData){this.#userData = userData;}
    set _uniqueName(uniqueName){this.#uniqueName = uniqueName;}
    set _fixDef(fixDef){this.#fixDef = fixDef;}
    set _bodyDef(bodyDef){this.#bodyDef = bodyDef;}
    set _b2dobj(b2dobj){this.#b2dobj = b2dobj;}

    constructor(density, friction, restitution, x, y, SCALE){
        this._fixDef.density = density;
        this._fixDef.friction = friction;
        this._fixDef.restitution = restitution;
        this._bodyDef.position.x = x / SCALE;
        this._bodyDef.position.y = y / SCALE;
    }

    _createObj(world){
        this._b2dobj = world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
    }

    changeUserData(property, newValue){
        let objdata = this.getBody().GetUserData();
        this._userData = typeof objdata === undefined || objdata === null?{}:this.userData;
        this._userData[property] = newValue;
        this.getBody().SetUserData(this.userData);
    }

    getBody(){
        return this._b2dobj.GetBody();
    }
}

class defineStaticObject extends defineObject {
    constructor(density, friction, restitution, x, y, width, height, objid, uniqueName, angle, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this._bodyDef.type = b2Body.b2_staticBody;
        this._bodyDef.angle = angle;
        this._fixDef.shape = new b2PolygonShape;
        this._fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        this._createObj(world);
        this.changeUserData("id", objid);
        this.changeUserData("uniqueName", uniqueName);
    }
}

class defineDynamicObject extends defineObject {
    constructor(density, friction, restitution, x, y, width, height, objid, uniqueName, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this._bodyDef.type = b2Body.b2_dynamicBody;
        this._fixDef.shape = new b2PolygonShape;
        this._fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        this._createObj(world);
        this.changeUserData('id', objid);
        this.changeUserData('uniqueName', uniqueName);
    }
}

class defineCircleObject extends defineObject {
    constructor(density, friction, restitution, x, y, objid, uniqueName, radius, SCALE, world){
        super(density, friction, restitution, x, y, SCALE, world);
        this._bodyDef.type = b2Body.b2_dynamicBody;
        this._fixDef.shape = new b2CircleShape(radius / SCALE);
        this._createObj(world);
        this.changeUserData('id', objid);
        this.changeUserData('uniqueName', uniqueName);
    }
}

