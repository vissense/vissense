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
;(function(window, Math, VisSense, VisSenseUtils, undefined) {
  'use strict';

    var states =  {
        HIDDEN: 0,
        VISIBLE: 1,
        FULLY_VISIBLE: 2
    };

    /*--------------------------------------------------------------------------*/

    var VisState = (function() {
        var STATES = {
            HIDDEN: 0,
            VISIBLE: 1,
            FULLY_VISIBLE: 2
        };

        function VisState(state) {
            this.isVisible = function() {
                return state ===  STATES.VISIBLE || this.isFullyVisible();
            };
            this.isFullyVisible = function() {
                return state ===  STATES.FULLY_VISIBLE;
            };
            this.isHidden = function() {
                return state ===  STATES.HIDDEN;
            };
            this.state = function() {
                return state;
            };
        }

        function withPrevious(visstate, prev) {
            if(!!prev) {
                // disable getting previous state from prev
                prev.prev = VisSenseUtils.noop;
            }

            visstate.wasVisible = function() {
                return !!prev && prev.isVisible();
            };

            visstate.wasFullyVisible = function() {
                return !!prev && prev.isFullyVisible();
            };

            visstate.wasHidden = function() {
                return !!prev && prev.isHidden();
            };

            visstate.hasVisibilityChanged = function() {
                return !prev || visstate.state() !== prev.state();
            };

            visstate.prev = function() {
                return prev;
            };

            return visstate;
        }

        function withPercentage(visstate, percentage) {
            visstate.hasVisibilityPercentageChanged = function() {
                return !this.prev() || percentage !== this.prev().percentage();
            };
            visstate.percentage = function() {
                return percentage;
            };
            return visstate;
        }

        function state(status, percentage, prev) {
            return withPrevious(withPercentage(new VisState(status), percentage), prev);
        }

        var exports = {};

        exports.hidden = function(percentage, prev) {
            return state(STATES.HIDDEN, percentage, prev || null);
        };

        exports.visible = function(percentage, prev) {
            return state(STATES.VISIBLE, percentage, prev || null);
        };
        exports.fullyvisible = function(percentage, prev) {
            return state(STATES.FULLY_VISIBLE, percentage, prev || null);
        };

        return exports;
    }());

    function nextState(visobj, visstate) {
        var percentage = visobj.getVisibilityPercentage();

        if(visobj.isHidden()) {
            return VisState.hidden(percentage, visstate);
        }
        else if (visobj.isFullyVisible()) {
             return VisState.fullyvisible(percentage, visstate);
        }
        else if (visobj.isVisible()) {
          return VisState.visible(percentage, visstate);
        }

        throw new Error('IllegalState');
    };

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            listeners[i].call(context || window);
        }
    }
    /*--------------------------------------------------------------------------*/


    function VisMon(visobj, config) {
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
        me.status = function(prop) {
            return _private.status;
        };

        me.getVisibilityPercentage = function() {
            return me.status().percentage();
        }
        /**
        * read-only access to status
        */
        me.prev = function(prop) {
            return me.status().prev();
        };

        // Adds a listener.
        //
        // var id = visobj.monitor().register(function() {
        //   doSomething();
        // });
        me.register = function(callback) {
            _private.listeners[++lastListenerId] = callback;
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
        return new VisMon(visobj, config);
    };

    VisSense.prototype.monitor = function(config) {
        return VisSense.monitor(this, config);
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
        var handler = this.fireIfVisibilityChanged(VisSenseUtils.fireIf(function() {
            return !me.status().prev() || me.status().wasHidden();
        }, fireIfVisible));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var me = this;
        var fireIfFullyVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isFullyVisible();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfFullyVisible);
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var me = this;

        var fireIfHidden =  VisSenseUtils.fireIf(function() {
            return me.status().isHidden();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfHidden);
        return this.register(handler);
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
            throw new Error("VisMon: Event '"+ eventName +"' is not supported");
        }

        return emitEvents[eventName](handler);
    };

}.call(this, this, this.Math, this.VisSense, this.VisSenseUtils));