/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 */
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
  'use strict';

    // Date.now polyfill
    if (!Date.now) {
       Date.now = function now() {
         return new Date().getTime();
       };
    }

    // performance.now polyfill
    (function (window) {
      window.performance = window.performance || {};
      // handle vendor prefixing
      window.performance.now = window.performance.now ||
      window.performance.mozNow ||
      window.performance.msNow ||
      window.performance.oNow ||
      window.performance.webkitNow ||
      Date.now;  // fallback to Date
    })(window);

    var StopWatch = (function(window) {
        var getNow = (function(window) {
            return function(performance) {
                  return performance ? window.performance.now : Date.now;
             };
        } (window));

        function StopWatch(performance) {
            var me = this;

            var $ = {
                ts : 0, // time start
                te : 0, // time end
                r : false // currently running
            };

            var now = me.now = getNow(performance);

            me.start = function(optNow) {
                $.r = true;
                $.ts = +optNow || now();
                return 0;
            };
            me.restart = function(optNow) {
                return me.stopAndRestartIf(true, optNow);
            };

            me.stop = function (optNow) {
                return me.stopIf($.r, optNow);
            };
            me.running = function () {
                return $.r;
            };

            me.stopIf = function (condition, optNow) {
                var t = me.time(optNow);
                if(condition) {
                    $.r = false;
                }
                return t;
            };

            me.time = function (optNow) {
                if (!$.r) {
                    return 0;
                } else {
                    $.te = +optNow || now();
                }

                return $.te - $.ts;
            };

            /**
            * Does neither stop nor restart if condition is false
            */
            me.stopAndRestartIf = function(condition, optNow) {
                return !condition ? 0 : me.stopAndThenRestartIf(true, optNow);
            };

            /**
            * Definitely stops, but restart only if condition is true
            */
            me.stopAndThenRestartIf = function(condition, optNow) {
                var r = me.stop(optNow);
                if(condition) {
                    me.start(optNow);
                }
                return r;
            };
        }

        StopWatch.now = function(performance) {
            return getNow(performance)();
        };

        return StopWatch;
    }(window));

    VisSenseUtils.newStopWatch = function() {
        return new StopWatch();
    };

}.call(this, this, this.VisSenseUtils));