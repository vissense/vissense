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
 * hasPercentageChanged // => true
 *
 * fireIfVisibilityChanged(function() { ... });
 * fireIfPercentageChanged(function() { ... });
 *
 */
var STATES = {
    HIDDEN: 0,
    VISIBLE: 1,
    FULLY_VISIBLE: 2
};

function VisState(state, percentage, prev) {
    this._state = state;
    this._percentage = percentage;
    this._prev = prev;
}

VisState.prototype.isVisible = function() {
    return this._state ===  STATES.VISIBLE || this.isFullyVisible();
};

VisState.prototype.isFullyVisible = function() {
    return this._state ===  STATES.FULLY_VISIBLE;
};

VisState.prototype.isHidden = function() {
    return this._state ===  STATES.HIDDEN;
};

VisState.prototype.state = function() {
    return this._state;
};

VisState.prototype.wasVisible = function() {
    return !!this._prev && this._prev.isVisible();
};

VisState.prototype.wasFullyVisible = function() {
    return !!this._prev && this._prev.isFullyVisible();
};

VisState.prototype.wasHidden = function() {
    return !!this._prev && this._prev.isHidden();
};

VisState.prototype.hasVisibilityChanged = function() {
    return !this._prev || this._state !== this._prev._state;
};

VisState.prototype.prev = function() {
    return this._prev;
};

VisState.prototype.hasPercentageChanged = function() {
    return !this._prev || this._percentage !== this._prev._percentage;
};

VisState.prototype.percentage = function() {
    return this._percentage;
};

function state(status, percentage, prev) {
    if(!!prev) {
        delete prev._prev;
        prev.prev = noop;
    }

    return new VisState(status, percentage, prev);
}

// export
VisSense.VisState = {
    hidden: function(percentage, prev) {
        return state(STATES.HIDDEN, percentage, prev || null);
    },
    visible:function(percentage, prev) {
        return state(STATES.VISIBLE, percentage, prev || null);
    },
    fullyvisible: function(percentage, prev) {
        return state(STATES.FULLY_VISIBLE, percentage, prev || null);
    }
};