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
        function StopWatch(performance) {

            var $ = {
                startTime : 0,
                stopTime : 0,
                running : false
            };

            var performanceEnabled = performance === false ? false : !!window.performance && !!window.performance.now;

            this.start = function() {
                $.running = true;
                $.startTime = now();
                return 0;
            };
            this.restart = function() {
                return this.stopAndRestartIf(true);
            };
            this.stopAndRestartIf = function(condition) {
                return !condition ? 0 : this.stopAndThenRestartIf(true);
            };
            this.stopAndThenRestartIf = function(condition) {
                var r = this.stop();
                if(condition) {
                    this.start();
                }
                return r;
            };

            this.stop = function () {
                return this.stopIf($.running);
            };
            this.running = function () {
                return $.running;
            };

            this.stopIf = function (condition) {
                var t = this.time();
                if(condition) {
                    $.running = false;
                }
                return t;
            };

            this.time = function () {
                if (!$.running) {
                    return 0;
                } else {
                    $.stopTime = now();
                }

                return $.stopTime - $.startTime;
            };

            function now() {
                return performanceEnabled ? window.performance.now() : new Date().getTime();
            };
        };

        return StopWatch;
    }(window));

    function newStopWatch() {
        return new StopWatch();
    };

    VisSenseUtils.newStopWatch = newStopWatch;

}.call(this, this, this.VisSenseUtils));