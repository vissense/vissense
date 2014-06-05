/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/**
 * depends on ['vissense.core', 'vissense.utils', 'vissense.monitor', 'vissense.timer']
 */
 ;(function(window, VisSenseUtils) {
    var StopWatch = (function(window) {
        function StopWatch(p) {
            var s = this;

            var now = (function(window, p) {
                var pe = p === false ? false : !!window.performance && !!window.performance.now;
                return function() {
                    return pe ? window.performance.now() : new Date().getTime();
                };
            } (window, p));

            var $ = {
                ts : 0, // time start
                te : 0, // time end
                r : false // currently running
            };

            s.start = function() {
                $.r = true;
                $.ts = now();
                return 0;
            };
            s.restart = function() {
                return s.stopAndRestartIf(true);
            };
            s.stopAndRestartIf = function(condition) {
                return !condition ? 0 : s.stopAndThenRestartIf(true);
            };
            s.stopAndThenRestartIf = function(condition) {
                var r = s.stop();
                if(condition) {
                    s.start();
                }
                return r;
            };

            s.stop = function () {
                return s.stopIf($.r);
            };
            s.running = function () {
                return $.r;
            };

            s.stopIf = function (condition) {
                var t = s.time();
                if(condition) {
                    $.r = false;
                }
                return t;
            };

            s.time = function () {
                if (!$.r) {
                    return 0;
                } else {
                    $.te = now();
                }

                return $.te - $.ts;
            };
        }

        return StopWatch;
    }(window));

    function newStopWatch() {
        return new StopWatch();
    };

    VisSenseUtils.newStopWatch = newStopWatch;

}.call(this, this, this.VisSenseUtils));