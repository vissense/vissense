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
 * vismon.onPercentageChange(function() { ... });
 * vismon.onVisible(function() { ... });
 * vismon.onFullyVisible(function() { ... });
 * vismon.onHidden(function() { ... });
 *
 *
 * hasVisibilityChanged() // => true
 * hasVisibilityPercentageChanged // => true
 *
 * fireIfVisibilityChanged(function() { ... });
 * fireIfPercentageChanged(function() { ... });
 *
 */
;(function(window, VisSense, VisSenseUtils, undefined) {
  'use strict';

    function nextState(visobj, previousState) {
        var percentage = visobj.percentage();

        // check if nothing changed
        if(!!previousState && percentage === previousState.percentage()) {
          if(!previousState.hasPercentageChanged()) {
            return previousState;
          }
        }

        if(visobj.isHidden()) {
            return VisSenseUtils.VisState.hidden(percentage, previousState);
        }
        else if (visobj.isFullyVisible()) {
             return VisSenseUtils.VisState.fullyvisible(percentage, previousState);
        }
        else if (visobj.isVisible()) {
          return VisSenseUtils.VisState.visible(percentage, previousState);
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

        me._$$visobj = visobj;
        me._$$lastListenerId = -1;
        me._$$status = null;
        me._$$listeners = {};
    }

    // "read-only" access to VisSense instance
    VisMon.prototype.visobj = function() {
        return this._$$visobj;
    };

    /**
    * "read-only" access to status
    */
    VisMon.prototype.status = function() {
        return this._$$status;
    };

    VisMon.prototype.percentage = function() {
        return this._$$status.percentage();
    };
    /**
    * read-only access to status
    */
    VisMon.prototype.prev = function() {
        return this._$$status.prev();
    };

    // Adds a listener that will be called on update().
    //
    // var id = visobj.monitor()._bind(function() {
    //   doSomething();
    // });
    VisMon.prototype._bind = function(callback) {
        this._$$lastListenerId += 1;
        this._$$listeners[this._$$lastListenerId] = callback;
        return this._$$lastListenerId;
    };

    VisMon.prototype.off = function(listenerId) {
        delete this._$$listeners[listenerId];
        return true;
    };

    /**
    * expose update method
    */
    VisMon.prototype.update = function() {
        // update status
        this._$$status = nextState(this._$$visobj, this._$$status);
        // notify listeners
        fireListeners(this._$$listeners, this);
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
    VisMon.prototype.fireIfPercentageChanged = function(callback) {
        var me = this;

        return VisSenseUtils.fireIf(function() {
            return me.status().hasPercentageChanged();
        }, callback);
    };

    /**
    * Fires when visibility state changes
    */
    VisMon.prototype.onVisibilityChange = function (callback) {
        return this._bind(this.fireIfVisibilityChanged(callback));
    };

    /**
    * Fires when visibility percentage changes
    */
    VisMon.prototype.onPercentageChange = function (callback) {
        var me = this;
        return this._bind(this.fireIfPercentageChanged(function() {
            var prev = me.status().prev();
            callback(me.percentage(), prev && prev.percentage());
        }));
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
        return me._bind(handler);
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
        return me._bind(handler);
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
        return me._bind(handler);
    };

    VisMon.prototype.on = function(eventName, handler) {
        var emitEvents = {
            'hidden' : this.onHidden,
            'visible' : this.onVisible,
            'fullyvisible' : this.onFullyVisible,
            'percentagechange' : this.onPercentageChange,
            'visibilitychange' : this.onVisibilityChange
        };

        if(!emitEvents[eventName]) {
            throw new Error('VisMon: Event "'+ eventName +'" is not supported');
        }

        return emitEvents[eventName](handler);
    };

    VisSense.fn.monitor = function(incomingConfig) {
        var config = incomingConfig || {};

        if(!!config.detached) {
            return new VisMon(this, config);
        }

        if(this._$$monitor) {
            return this._$$monitor;
        }

        this._$$monitor = new VisMon(this, config);

        return this._$$monitor;
    };

}.call(this, this, this.VisSense, this.VisSenseUtils));