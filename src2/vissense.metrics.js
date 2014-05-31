/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/**
 * depends on ['vissense.core', 'vissense.utils', 'vissense.monitor', 'vissense.timer']
 */
 ;(function(window, VisSense, brwsrfyMetrics) {
    if(!brwsrfyMetrics) {
        throw new Error('global Metrics is not available');
    }

    /** Used as a safe reference for `undefined` in pre ES5 environments */
    var undefined;

    /** Used as a reference to the global object */
    var root = (typeof window === 'object' && window) || this;

    var parseConfig = function(config) {
        var c = {
            visibleUpdateInterval: 250,
            hiddenUpdateInterval: 1000
        };

        if(!!config) {
            if(config.visibleUpdateInterval > 0) {
                c.visibleUpdateInterval = config.visibleUpdateInterval;
            }

            if(config.hiddenUpdateInterval > 0) {
                c.hiddenUpdateInterval = config.hiddenUpdateInterval;
            }
        }

        return c;
    };

    /*
    * StopWatch
    */
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
                return this.getAndRestartIf(true);
            };
            this.getAndRestartIf = function(condition) {
                if(condition) {
                    var r = this.stop();
                    this.start();
                    return r;
                }
                return 0;
            };

            this.stop = function () {
                return this.stopIf(true);
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
                if($.startTime === 0) {
                    $.stopTime = 0;
                } else if ($.running) {
                    $.stopTime = now();
                }

                return $.stopTime - $.startTime;
            };

            function now() {
                return performanceEnabled ? window.performance.now() : new Date().getTime();
            };
        };

        return StopWatch;
    }(root));

    /*--------------------------------------------------------------------------*/


    function VisMetrics(vistimer, inConfig) {
        //VisSense.call(this, element, config);
        var self = this;
        var stopped = false;
        var timerIds = [];
        var config = parseConfig(inConfig);
        var report = new brwsrfyMetrics.Report();

        var watchVisible = new StopWatch();
        var watchFullyVisible = new StopWatch();
        var watchHidden = new StopWatch();
        var watchDuration = new StopWatch();

        report.addMetric('time.visible', new brwsrfyMetrics.Counter());
        report.addMetric('time.fullyvisible', new brwsrfyMetrics.Counter());
        report.addMetric('time.hidden', new brwsrfyMetrics.Counter());
        report.addMetric('time.relativeVisible', new brwsrfyMetrics.Counter());
        report.addMetric('visibility.changes', new brwsrfyMetrics.Timer());
        report.addMetric('percentage', new brwsrfyMetrics.Timer());
        //self.report.addMetric('ns.histogram', new brwsrfyMetrics.Histogram.createUniformHistogram(10));
        //self.report.addMetric('ns.exphistogram', new brwsrfyMetrics.Histogram.createExponentialDecayHistogram(10, 0.1));


        updatePercentage();

        updateVisibilityChanges();

        vistimer.vismon().onVisibilityPercentageChange(function() {
            if(stopped) {
                return;
            }

            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());
        });
        vistimer.vismon().onVisibilityChange(function() {
            if(stopped) {
                return;
            }

            updateVisibilityChanges();
        });

        vistimer.every(config.visibleUpdateInterval, config.hiddenUpdateInterval, function() {
            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());
        });

        VisMetrics.prototype.getMetric = function(name) {
            return report.getMetric(name);
        };

        VisMetrics.prototype.stopped = function() {
            return stopped;
        };

        VisMetrics.prototype.stop = function() {
            vistimer.stopAll();
            return stopped = true;
        };

        function updatePercentage() {
            var percentage = vistimer.vismon().status('visibility_percentage');
            report.getMetric('percentage').update(percentage);
        }
        function updateVisibilityChanges() {
            var state = vistimer.vismon().status('state');

            report.getMetric('visibility.changes').update(state);
        }

        function incIfPositive(counter, inc) {
            if(inc > 0) {
                counter.inc(inc);
            }
        }

        function stopAndUpdateTimers(vismon) {
            var timeVisible = watchVisible.getAndRestartIf(vismon.isFullyVisible() || vismon.isVisible());

            incIfPositive(report.getMetric('time.relativeVisible'), timeVisible * vismon.getVisibilityPercentage());
            incIfPositive(report.getMetric('time.visible'), timeVisible);

            incIfPositive(report.getMetric('time.fullyvisible'),
                watchFullyVisible.getAndRestartIf(vismon.isFullyVisible())
            );
            incIfPositive(report.getMetric('time.hidden'),
                watchHidden.getAndRestartIf(vismon.isHidden())
            );
            /*
            if(vismon.wasHidden()) {
            } else if(vismon.wasFullyVisible()) {
                watchFullyVisible.stop();
                fullyVisible.stop();
            }

            if(vismon.isFullyVisible()) {

                watchHidden.stop();
                report.getMetric('time.visible').inc(watchVisible.stop());
                report.getMetric('time.fullyvisible').inc(watchFullyVisible.stop());
                watchVisible.start();
                watchFullyVisible.start();
            } else if(vismon.isVisible()) {
                watchFullyVisible.stop();
                watchHidden.stop();

                report.getMetric('time.visible').inc(watchVisible.stop());
                watchVisible.start();
            } else if(vismon.isHidden()){
                watchFullyVisible.stop();
                watchVisible.stop();

                report.getMetric('time.hidden').inc(watchHidden.stop());
                watchHidden.start();
            }*/
        }
    }
    function newVisMetrics(vissense, config) {
        return new VisMetrics(vissense.timer(), config);
    };

    VisSense.metrics = newVisMetrics;
    VisSense.prototype.metrics = function(config) {
        return newVisMetrics(this, config);
    };


}.call(this, this, this.VisSense, this.brwsrfyMetrics));