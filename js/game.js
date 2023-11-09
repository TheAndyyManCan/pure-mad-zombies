'use strict';

class Game {

    _height;
    _width;
    _scale;
    _gravity;
    _framerate;
    _b2dcanvas;
    _b2dctx;
    _itemList = [];
    _destroyList = [];
    _mouseHandler = [];

    constructor(height, width, scale, gravityX, gravityY, framerate, canvasName){
        this._height = height;
        this._width = width;
        this._scale = scale;
        this._gravity = new b2Vec2(gravityX, gravityY);
        this._framerate = framerate;
        this._b2dcanvas = document.getElementById(canvasName);
        this._b2dctx = this.b2dcanvas.getContext('2d');
        this._world = new b2World(this.gravity, true);
    }

    // Getters
    get _height(){return this._height;}
    get _width(){return this._width;}
    get _scale(){return this._scale;}
    get _gravity(){return this._gravity;}
    get _framerate(){return this._framerate;}
    get _b2dcanvas(){return this._b2dcanvas;}
    get _b2dctx(){return this._b2dctx;}
    get _itemList(){return this._itemList}
    get _destroyList(){return this._destroyList;}
    get _mouseHandler(){return this._mouseHandler;}
    get _world(){return this._world;}

    // Setters
    set _height(height){this._height = height;}
    set _width(width){this._width = width;}
    set _scale(scale){this._scale = scale;}
    set _gravity(gravity){this._gravity = gravity;}
    set _framerate(framerate){this._framerate = framerate;}
    set _b2dcanvas(b2dcanvas){this._b2dcanvas = b2dcanvas;}
    set _b2dctx(b2dctx){this._b2dctx = b2dctx;}
    set _itemList(itemList){this._itemList = itemList;}
    set _destroyList(destroyList){this._destroyList = destroyList;}
    set _mouseHandler(mouseHandler){this._mouseHandler = mouseHandler;}
    set _world(world){this._world = world;}

    setupDebugDraw = () => {
        let b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        let debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(this.b2dctx);
        debugDraw.SetDrawScale(this.scale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this._world.SetDebugDraw(debugDraw);
    }

    update = () => {
        this._world.Step(
            1 / this._framerate, // framerate
            10, // velocity iterations
            10 // position iterations
        );

        this._gameLogic();
        this._world.DrawDebugData();
        this._world.ClearForces();
        this._destroyList();

        window.requestAnimationFrame(this.update);
    };

    _gameLogic = () => {

    };

    _addItem = (item) => {
        this._itemList.push(item);
    };

    _destroyList = () => {
        for(let i in this._destroyList){
            this.world.DestroyBody(this._destroyList[i]);
        }
        this._destroyList.length = 0;
    };

    addMouseHandler(mousectx, type, runfunc){
        this._mouseHandler.push(new MouseHandler(mousectx, type, runfunc));
    }

    _handleMouseDown = (e) => {

    }

    _handleMouseUp = (e) => {

    }

    _handleMouseMove = (e) => {

    }
}
