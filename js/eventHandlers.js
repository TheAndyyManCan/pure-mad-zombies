'use strict';
let b2Listener = new Box2D.dynamics.b2ContactListener();
b2Listener.BeginContact = (contact) => {};
b2Listener.EndContact = (contact) => {};
b2Listener.PreSolve = (contact, Impulse) => {};
b2Listener.PostSolve = (contact, oldManifest) => {};

/**
 * Mouse controls
 */

class MouseHandler {
    constructor(target, type, runfunc){
        target.addEventListener(type, (e) => {
            runfunc(e);
        });
    }
}
