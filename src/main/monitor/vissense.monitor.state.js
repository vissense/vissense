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
;(function(window, VisSense, VisSenseUtils, undefined) {
  'use strict';

    var STATES = {
        HIDDEN: 0,
        VISIBLE: 1,
        FULLY_VISIBLE: 2
    };

    function VisState(state, percentage, prev) {
        this._$$state = state;
        this._$$percentage = percentage;
        this._$$prev = prev;
    }

    VisState.prototype.isVisible = function() {
        return this._$$state ===  STATES.VISIBLE || this.isFullyVisible();
    };

    VisState.prototype.isFullyVisible = function() {
        return this._$$state ===  STATES.FULLY_VISIBLE;
    };

    VisState.prototype.isHidden = function() {
        return this._$$state ===  STATES.HIDDEN;
    };

    VisState.prototype.state = function() {
        return this._$$state;
    };

    VisState.prototype.wasVisible = function() {
        return !!this._$$prev && this._$$prev.isVisible();
    };

    VisState.prototype.wasFullyVisible = function() {
        return !!this._$$prev && this._$$prev.isFullyVisible();
    };

    VisState.prototype.wasHidden = function() {
        return !!this._$$prev && this._$$prev.isHidden();
    };

    VisState.prototype.hasVisibilityChanged = function() {
        return !this._$$prev || this._$$state !== this._$$prev._$$state;
    };

    VisState.prototype.prev = function() {
        return this._$$prev;
    };

    VisState.prototype.hasPercentageChanged = function() {
        return !this._$$prev || this._$$percentage !== this._$$prev._$$percentage;
    };

    VisState.prototype.percentage = function() {
        return this._$$percentage;
    };

    function state(status, percentage, prev) {
        if(!!prev) {
            // disable getting previous state from prev
            prev.prev = VisSenseUtils.noop;
        }

        return new VisState(status, percentage, prev);
    }

    // export
    VisSenseUtils.VisState = {
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

}.call(this, this, this.VisSense, this.VisSenseUtils));