/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */

 /**
 * detects visibility changes of an element.
 *
 * example:
 * var elem = document.getElementById('myElement');
 * var visobj = VisSense(eleme):
 * var vismon = visobj.monitor();
 *
 * vismon.onVisibilityChange(function() { ... });
 * vismon.onVisibilityPercentageChange(function() { ... });
 * vismon.onVisible(function() { ... });
 * vismon.onFullyVisible(function() { ... });
 * vismon.onHidden(function() { ... });
 *
 *
 * hasVisibilityChanged() // => true
 * hasVisibilityPercentageChanged // => true
 *
 * fireIfVisibilityChanged(function() { ... });
 * fireIfVisibilityPercentageChanged(function() { ... });
 *
 */
;(function(window, VisSense, VisSenseUtils, undefined) {
  'use strict';

    function nextState(visobj, visstate) {
        var percentage = visobj.percentage();

        if(visobj.isHidden()) {
            return VisSenseUtils.VisState.hidden(percentage, visstate);
        }
        else if (visobj.isFullyVisible()) {
             return VisSenseUtils.VisState.fullyvisible(percentage, visstate);
        }
        else if (visobj.isVisible()) {
          return VisSenseUtils.VisState.visible(percentage, visstate);
        }

        throw new Error('IllegalState');
    }

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            if(listeners.hasOwnProperty(i)) {
                listeners[i].call(context || window);
            }
        }
    }
    /*--------------------------------------------------------------------------*/


    function VisMon(visobj) {
        var me = this;

        var lastListenerId = -1;
        var _private = {
          status: null,
          listeners: []
        };

        // read-only access to VisSense instance
        me.visobj = function() {
            return visobj;
        };

        /**
        * read-only access to status
        */
        me.status = function() {
            return _private.status;
        };

        me.percentage = function() {
            return me.status().percentage();
        };
        /**
        * read-only access to status
        */
        me.prev = function() {
            return me.status().prev();
        };

        // Adds a listener.
        //
        // var id = visobj.monitor().register(function() {
        //   doSomething();
        // });
        me.register = function(callback) {
            lastListenerId += 1;
            _private.listeners[lastListenerId] = callback;
            //_private.listeners[++lastListenerId] = callback;
            return lastListenerId;
        };

        /**
        * expose update method
        */
        me.update = function() {
            _private.status = nextState(visobj, _private.status);

            // notify listeners
            fireListeners(_private.listeners, me);
        };
    }

    VisSense.monitor = function monitor(visobj, config) {
        return new VisMon(visobj, config || {});
    };

    VisSense.prototype.monitor = function(config) {
        if(this._$$monitor) {
            return this._$$monitor;
        }
        this._$$monitor = VisSense.monitor(this, config);
        return this._$$monitor;
    };


    /**
    * Returns a function that invokes callback only
    * if the visibility state changes.
    *
    * shorthand for
    * if(visobj.hasVisibilityChanged()) {
    *   callback();
    * }
    * visobj.fireIfVisibilityChanged(callback)
    */
    VisMon.prototype.fireIfVisibilityChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityChanged();
        }, callback);
    };

    /**
    * Returns a function that invokes callback only
    * if visibility rate changes.
    * This does not occur when element is hidden but may
    * be called multiple times if element is in state
    * `VISIBLE` and (depending on the config) `FULLY_VISIBLE`
    */
    VisMon.prototype.fireIfVisibilityPercentageChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityPercentageChanged();
        }, callback);
    };

    /**
    * Fires when visibility state changes
    */
    VisMon.prototype.onVisibilityChange = function (callback) {
        return this.register(this.fireIfVisibilityChanged(callback));
    };

    /**
    * Fires when visibility percentage changes
    */
    VisMon.prototype.onVisibilityPercentageChange = function (callback) {
        return this.register(this.fireIfVisibilityPercentageChanged(callback));
    };

    /**
    * Fires when visibility changes and and state transits from:
    * HIDDEN => VISIBLE
    * HIDDEN => FULLY_VISIBLE
    * Fires NOT when state transits from:
    * VISIBLE => FULLY_VISIBLE or
    * FULLY_VISIBLE => VISIBLE
    *
    * VisSense(document.getElementById('example1')).monitor().onVisible(function() {
    *   Animations.startAnimation();
    * });
    */
    VisMon.prototype.onVisible = function (callback) {
        var me = this;

        var fireIfVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isVisible();
        }, callback);

        // only fire when coming from state hidden or no previous state is present
        var handler = me.fireIfVisibilityChanged(VisSenseUtils.fireIf(function() {
            return !me.status().prev() || me.status().wasHidden();
        }, fireIfVisible));
        return me.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var me = this;
        var fireIfFullyVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isFullyVisible();
        }, callback);

        var handler = me.fireIfVisibilityChanged(fireIfFullyVisible);
        return me.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var me = this;

        var fireIfHidden =  VisSenseUtils.fireIf(function() {
            return me.status().isHidden();
        }, callback);

        var handler = me.fireIfVisibilityChanged(fireIfHidden);
        return me.register(handler);
    };

    VisMon.prototype.on = function(eventName, handler) {
        var emitEvents = {
            'hidden' : this.onHidden,
            'visible' : this.onVisible,
            'fullyvisible' : this.onFullyVisible,
            'percentagechange' : this.onVisibilityPercentageChange,
            'visibilitychange' : this.onVisibilityChange
        };

        if(!emitEvents[eventName]) {
            throw new Error('VisMon: Event "'+ eventName +'" is not supported');
        }

        return emitEvents[eventName](handler);
    };

}.call(this, this, this.VisSense, this.VisSenseUtils));