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
function nextState(visobj, previousState) {
    var state = visobj.state();
    var percentage = state.percentage;

    // check if nothing changed
    if(!!previousState && percentage === previousState.percentage()) {
      if(!previousState.hasPercentageChanged()) {
        return previousState;
      }
    }

    if(state.hidden) {
        return VisSense.VisState.hidden(percentage, previousState);
    }
    else if (state.fullyvisible) {
         return VisSense.VisState.fullyvisible(percentage, previousState);
    }

    // else element is visible
    return VisSense.VisState.visible(percentage, previousState);
}

/*--------------------------------------------------------------------------*/

function fireListeners(listeners, context) {
    var keys = Object.keys(listeners);
    for (var i = 0, n = keys.length; i < n; i++) {
        listeners[i].call(context || window);
    }
}
/*--------------------------------------------------------------------------*/

function VisMon(visobj, inConfig) {
    var me = this;
    var config = defaults(inConfig, {
        strategy: new VisMon.Strategy.NoopStrategy()
    });

    me._visobj = visobj;
    me._lastListenerId = -1;
    me._status = null;
    me._listeners = {};
    me._strategy = config.strategy;

    me._events = ['update', 'hidden', 'visible', 'fullyvisible', 'percentagechange', 'visibilitychange'];
    for (var i = 0, n = me._events.length; i < n; i++) {
        if (config[me._events[i]]) {
            me.on(me._events[i], config[me._events[i]]);
        }
    }
}

// "read-only" access to VisSense instance
VisMon.prototype.visobj = function() {
    return this._visobj;
};

/**
* "read-only" access to status
*/
VisMon.prototype.status = function() {
    return this._status;
};

VisMon.prototype.start = function() {
    this._strategy.start(this);
    return this;
};

VisMon.prototype.stop = function() {
    return this._strategy.stop(this);
};

VisMon.prototype.use = function(strategy) {
    this._strategy.stop();
    this._strategy = strategy;
    this._strategy.start(this);
};

// Adds a listener that will be called on update().
//
// var id = visobj.monitor().onUpdate(function() {
//   doSomething();
// });
VisMon.prototype.onUpdate = function(callback) {
    this._lastListenerId += 1;
    this._listeners[this._lastListenerId] = callback;
    return this._lastListenerId;
};

/**
* update state and notify listeners
*/
VisMon.prototype.update = function() {
    // update status
    this._status = nextState(this._visobj, this._status);
    // notify listeners
    fireListeners(this._listeners, this);


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

    return fireIf(function() {
        return me._status.hasVisibilityChanged();
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

    return fireIf(function() {
        return me._status.hasPercentageChanged();
    }, callback);
};

/**
* Fires when visibility state changes
*/
VisMon.prototype.onVisibilityChange = function (callback) {
    return this.onUpdate(this.fireIfVisibilityChanged(callback));
};

/**
* Fires when visibility percentage changes
*/
VisMon.prototype.onPercentageChange = function (callback) {
    var me = this;
    return this.onUpdate(this.fireIfPercentageChanged(function() {
        var status = me.status();
        var prev = status.prev();
        // call with '(newValue, oldValue, context)'
        callback(status.percentage(), prev && prev.percentage(), me);
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

    var fireIfVisible =  fireIf(function() {
        return me._status.isVisible();
    }, callback);

    // only fire when coming from state hidden or no previous state is present
    var handler = me.fireIfVisibilityChanged(fireIf(function() {
        return !me._status.prev() || me._status.wasHidden();
    }, fireIfVisible));
    return me.onUpdate(handler);
};

/**
* Fires when visibility changes and element becomes fully visible
*/
VisMon.prototype.onFullyVisible = function (callback) {
    var me = this;

    var fireIfFullyVisible =  fireIf(function() {
        return me._status.isFullyVisible();
    }, callback);

    var handler = me.fireIfVisibilityChanged(fireIfFullyVisible);
    return me.onUpdate(handler);
};

/**
* Fires when visibility changes and element becomes hidden
*/
VisMon.prototype.onHidden = function (callback) {
    var me = this;

    var fireIfHidden =  fireIf(function() {
        return me._status.isHidden();
    }, callback);

    var handler = me.fireIfVisibilityChanged(fireIfHidden);
    return me.onUpdate(handler);
};

VisMon.prototype.on = function(eventName, handler) {
    var me = this;
    switch(eventName) {
        case 'update': return me.onUpdate(handler);
        case 'hidden': return me.onHidden(handler);
        case 'visible': return me.onVisible(handler);
        case 'fullyvisible': return me.onFullyVisible(handler);
        case 'percentagechange': return me.onPercentageChange(handler);
        case 'visibilitychange': return me.onVisibilityChange(handler);
    }

    return -1;
};

VisSense.VisMon = VisMon;

VisSense.fn.monitor = function(config) {
    return new VisMon(this, config);
};
