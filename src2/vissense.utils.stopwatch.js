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
      performance.now = performance.now ||
      performance.mozNow ||
      performance.msNow ||
      performance.oNow ||
      performance.webkitNow ||
      // fallback to Date
      Date.now;
    })(window);

    var StopWatch = (function(window) {
        var getNow = (function(window) {
            return function(performance) {
                  return performance ? window.performance.now : Date.now;
             };
        } (window));

        function StopWatch(performance) {
            var s = this;

            var $ = {
                ts : 0, // time start
                te : 0, // time end
                r : false // currently running
            };

            var now = s.now = getNow(performance);

            s.start = function(optNow) {
                $.r = true;
                $.ts = +optNow || now();
                return 0;
            };
            s.restart = function(optNow) {
                return s.stopAndRestartIf(true, optNow);
            };

            /**
            * Does neither stop nor restart if condition is false
            */
            s.stopAndRestartIf = function(condition, optNow) {
                return !condition ? 0 : s.stopAndThenRestartIf(true, optNow);
            };

            /**
            * Definitely stops, but restart only if condition is true
            */
            s.stopAndThenRestartIf = function(condition, optNow) {
                var r = s.stop(optNow);
                if(condition) {
                    s.start(optNow);
                }
                return r;
            };

            s.stop = function (optNow) {
                return s.stopIf($.r, optNow);
            };
            s.running = function () {
                return $.r;
            };

            s.stopIf = function (condition, optNow) {
                var t = s.time(optNow);
                if(condition) {
                    $.r = false;
                }
                return t;
            };

            s.time = function (optNow) {
                if (!$.r) {
                    return 0;
                } else {
                    $.te = +optNow || now();
                }

                return $.te - $.ts;
            };
        }

        StopWatch.now = function(performance) {
            return getNow(performance)();
        };

        return StopWatch;
    }(window));

    function newStopWatch() {
        return new StopWatch();
    };

    VisSenseUtils.newStopWatch = newStopWatch;

}.call(this, this, this.VisSenseUtils));