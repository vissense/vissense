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

    function _noop() {}

    function fireIf(when, callback) {
      return function () {
        if (when()) {
          callback(arguments);
        }
      };
    }

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            listeners[i].call(context || root);
        }
    }

    function state(visobj) {
        if(visobj.isHidden()) {
            return states.HIDDEN;
        } else if (visobj.isFullyVisible()) {
            return states.FULLY_VISIBLE;
        }

        return states.VISIBLE;
    }

    function _nextStatus(visobj, oldStatus) {
        var prev = !oldStatus ? null : {
            'state':oldStatus.state,
            'visibility_percentage': oldStatus.visibility_percentage
        };

        var s = {};

        s.prev = prev;
        s.state = state(visobj);
        s.visibility_percentage = parseFloat(visobj.getVisibilityPercentage().toFixed(4));

        return s;
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
            return _private.status[prop];
        };

        self.getVisibilityPercentage = function() {
            return self.status('visibility_percentage');
        }
        /**
        * read-only access to status
        */
        self.prev = function(prop) {
            var prev = self.status('prev');
            return prev && prop ? prev[prop] : prev;
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
            _private.status = _nextStatus( visobj, _private.status);

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

  /*--------------------------------------------------------------------------*/
    VisMon.prototype.wasHidden = function() {
        var prev = this.prev();
        return !!prev && (prev.state === states.HIDDEN);
    };

    VisMon.prototype.wasVisible = function() {
        var prev = this.prev();
        return !!prev && (prev.state === states.VISIBLE) || this.wasFullyVisible();
    };

    VisMon.prototype.wasFullyVisible = function() {
        var prev = this.prev();
        return !!prev && (prev.state === states.FULLY_VISIBLE);
    };

    VisMon.prototype.isHidden = function() {
        return this.status('state') === states.HIDDEN;
    };

    VisMon.prototype.isVisible = function() {
        return this.status('state') === states.VISIBLE || this.isFullyVisible();
    };

    VisMon.prototype.isFullyVisible = function() {
        return this.status('state') === states.FULLY_VISIBLE;
    };

    /**
    * returns whether the state has changed.
    *
    * if no previous state is available (because it is the initial state)
    * the visibility is considered changed. However, this is only true for
    * the execution cycle in which the instance was created.
    *
    * VisSense(document.getElementById('example1')).monitor().hasVisibilityChanged();
    * // = true
    */
    VisMon.prototype.hasVisibilityChanged = function() {
        var prev = this.prev();
        return !prev || (prev.state !== this.status('state'));
    };

    VisMon.prototype.hasVisibilityPercentageChanged = function() {
        var prev = this.status('prev');
        var vp = this.status('visibility_percentage');
        /* true if there is no previous state or if visibility changed */
        return !prev || (prev.visibility_percentage !== vp);
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
        return fireIf(function() {
            return self.hasVisibilityChanged();
        }, function() {
            callback();
        });
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
        return fireIf(function() {
            return self.hasVisibilityPercentageChanged();
        }, callback);
    };

    /**
    * Fires when visibility state changes
    */
    VisMon.prototype.onVisibilityChange = function (callback) {
        var handler = this.fireIfVisibilityChanged(callback);
        return this.register(handler);
    };

    /**
    * Fires when visibility percentage changes
    */
    VisMon.prototype.onVisibilityPercentageChange = function (callback) {
        var handler = this.fireIfVisibilityPercentageChanged(callback);
        return this.register(handler);
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
        var handler = this.fireIfVisibilityChanged(fireIf(function() {
            return !self.prev() || self.wasHidden();
        }, this.visobj().fireIfVisible(callback)));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var handler = this.fireIfVisibilityChanged(this.visobj().fireIfFullyVisible(callback));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var handler = this.fireIfVisibilityChanged(this.visobj().fireIfHidden(callback));
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