/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 * MicroEvent - from https://github.com/jeromeetienne/microevent.js
 */
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
    'use strict';

    function MicroEvent() {

    }

    MicroEvent.prototype = {
        on: function(event, fct){
            this._events = this._events || {};
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
        },
        off: function(event, fct){
            this._events = this._events || {};
            if( event in this._events === false) {
                return;
            }
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        },
        emit: function(event /* , args... */){
            this._events = this._events || {};
            if(event in this._events === false) {
                return;
            }
            for(var i = 0; i < this._events[event].length; i++){
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    };

    MicroEvent.mixin = function(destObject){
        var props = ['on', 'off', 'emit'];
        for(var i = 0; i < props.length; i ++){
            if( typeof destObject === 'function' ){
                destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
            } else{
                destObject[props[i]] = MicroEvent.prototype[props[i]];
            }
        }
    };

    VisSenseUtils.MicroEvent = MicroEvent;

}.call(this, this, this.VisSenseUtils));