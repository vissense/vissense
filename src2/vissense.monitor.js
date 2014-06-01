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
;(function(window, Math, VisSense, VisSenseUtils) {
    /** Used as a safe reference for `undefined` in pre ES5 environments */
    var undefined;

    /** Used as a reference to the global object */
    var root = (typeof window === 'object' && window) || this;

    var states =  {
        HIDDEN: 0,
        VISIBLE: 1,
        FULLY_VISIBLE: 2
    };

    var updateTriggerEvents = ['readystatechange', 'scroll', 'resize'];

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
                return !prev || state !== prev.state();
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

        exports.state = state;

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
        } else if (visobj.isFullyVisible()) {
             return VisState.fullyvisible(percentage, visstate);
        } else if (visobj.isVisible()) {
          return VisState.visible(percentage, visstate);
        }
        throw new Error('IllegalState');
    };

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            listeners[i].call(context || root);
        }
    }
    /*--------------------------------------------------------------------------*/


    function VisMon(visobj, config) {
        var self = this;

        var lastListenerId = -1;
        var _private = {
          status: null,
          listeners: []
        };

        // read-only access to VisSense instance
        self.visobj = function() {
            return visobj;
        };

        /**
        * read-only access to status
        */
        self.status = function(prop) {
            return _private.status;
        };

        self.getVisibilityPercentage = function() {
            return self.status().percentage();
        }
        /**
        * read-only access to status
        */
        self.prev = function(prop) {
            return self.status().prev();
        };

        // Adds a listener.
        //
        // var id = visobj.monitor().register(function() {
        //   doSomething();
        // });
        self.register = function(callback) {
            lastListenerId += 1;
            _private.listeners[lastListenerId] = callback;
            return lastListenerId;
        };

        /**
        * expose update method
        */
        VisMon.prototype.update = _update;

        (function init() {
            // recognize tab/window changes
            VisSenseUtils.onPageVisibilityChange(_update);

            for(var i in updateTriggerEvents) {
                VisSenseUtils.addEvent(root, updateTriggerEvents[i], _update);
            }

            _update();
            // reschedule update immediately
            VisSenseUtils.defer(_update);
        }());

        function _update() {
            _private.status = nextState( visobj, _private.status);

            // notify listeners
            fireListeners(_private.listeners, self);
        }
    }

    function monitor(visobj, config) {
        return new VisMon(visobj, config);
    };

    VisSense.monitor = monitor;
    VisSense.prototype.monitor = function(config) {
        return monitor(this, config);
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
        var self = this;
        return VisSenseUtils.fireIf(function() {
            return self.status().hasVisibilityChanged();
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
        var self = this;
        return VisSenseUtils.fireIf(function() {
            return self.status().hasVisibilityPercentageChanged();
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
        var self = this;

        var fireIfVisible =  VisSenseUtils.fireIf(function() {
            return self.status().isVisible();
        }, callback);

        // only fire when coming from state hidden or no previous state is present
        var handler = this.fireIfVisibilityChanged(VisSenseUtils.fireIf(function() {
            return !self.status().prev() || self.status().wasHidden();
        }, fireIfVisible));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var self = this;
        var fireIfFullyVisible =  VisSenseUtils.fireIf(function() {
            return self.status().isFullyVisible();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfFullyVisible);
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var self = this;

        var fireIfHidden =  VisSenseUtils.fireIf(function() {
            return self.status().isHidden();
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