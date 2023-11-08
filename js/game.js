'use strict';

class Game {

    #height;
    #width;
    #scale;
    #gravity;
    #framerate;
    #b2dcanvas;
    #b2dctx;
    #itemList = [];
    #destroyList = [];
    #mouseHandler = [];

    constructor(height, width, scale, gravityX, gravityY, framerate, canvasName){
        this.height = height;
        this.width = width;
        this.scale = scale;
        this.gravity = new b2Vec2(gravityX, gravityY);
        this.framerate = framerate;
        this.b2dcanvas = document.getElementById(canvasName);
        this.b2dctx = this.b2dcanvas.getContext('2d');
        this.world = new b2World(this.gravity, true);
    }

    // Getters
    get height(){return this.#height;}
    get width(){return this.#width;}
    get scale(){return this.#scale;}
    get gravity(){return this.#gravity;}
    get framerate(){return this.#framerate;}
    get b2dcanvas(){return this.#b2dcanvas;}
    get b2dctx(){return this.#b2dctx;}
    get itemList(){return this.#itemList}
    get destroyList(){return this.#destroyList;}
    get mouseHandler(){return this.#mouseHandler;}

    // Setters
    set height(height){this.#height = height;}
    set width(width){this.#width = width;}
    set scale(scale){this.#scale = scale;}
    set gravity(gravity){this.#gravity = gravity;}
    set framerate(framerate){this.#framerate = framerate;}
    set b2dcanvas(b2dcanvas){this.#b2dcanvas = b2dcanvas;}
    set b2dctx(b2dctx){this.#b2dctx = b2dctx;}
    set itemList(itemList){this.#itemList = itemList;}
    set destroyList(destroyList){this.#destroyList = destroyList;}
    set mouseHandler(mouseHandler){this.#mouseHandler = mouseHandler;}

    setupDebugDraw = () => {
        let b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        let debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(this.b2dctx);
        debugDraw.SetDrawScale(this.scale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    }

    update = () => {
        this.world.Step(
            1 / this.#framerate, // framerate
            10, // velocity iterations
            10 // position iterations
        );

        this.gameLogic();
        this.world.DrawDebugData();
        this.world.ClearForces();
        this.destroyList();

        window.requestAnimationFrame(this.update);
    };

    gameLogic = () => {

    };

    addItem = (item) => {
        this.#itemList.push(item);
    };

    destroyList = () => {
        for(let i in this.#destroyList){
            this.world.DestroyBody(this.#destroyList[i]);
        }
        this.#destroyList.length = 0;
    };

    addMouseHandler(mousectx, type, runfunc){
        this.#mouseHandler.push(new MouseHandler(mousectx, type, runfunc));
    }

    handleMouseDown = (e) => {

    }

    handleMouseUp = (e) => {

    }

    handleMouseMove = (e) => {

    }
}
