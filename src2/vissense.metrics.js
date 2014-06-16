/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/**
 * depends on ['vissense.core', 'vissense.utils', 'vissense.monitor', 'vissense.timer', 'vissense.stopwatch']
 */
 ;(function(window, VisSense, VisSenseUtils, brwsrfyMetrics, undefined) {
  'use strict';

    var DEFAULT_CONFIG = {
        visibleUpdateInterval: 200,
        hiddenUpdateInterval: 200,
        updatePercentageOnPageHidden:false
    };

    var parseConfig = function(config) {
        if(!!config) {
            if(config.visibleUpdateInterval < 1 || config.hiddenUpdateInterval < 1) {
                throw new Error('InvalidArgument: update interval needs to be positive.');
            }
        }

        return VisSenseUtils.defaults(config, DEFAULT_CONFIG);
    };

    /*--------------------------------------------------------------------------*/


    function VisMetrics(vistimer, inConfig) {
        //VisSense.call(this, element, config);
        var self = this;
        var stopped = false;
        var timerIds = [];
        var config = parseConfig(inConfig);
        var report = new brwsrfyMetrics.Report();

        var watchVisible = VisSenseUtils.newStopWatch();
        var watchFullyVisible = VisSenseUtils.newStopWatch();
        var watchHidden = VisSenseUtils.newStopWatch();
        var watchDuration = VisSenseUtils.newStopWatch();

        /* Counter */
        report.addMetric('time.visible', new brwsrfyMetrics.Counter());
        report.addMetric('time.fullyvisible', new brwsrfyMetrics.Counter());
        report.addMetric('time.hidden', new brwsrfyMetrics.Counter());
        report.addMetric('time.relativeVisible', new brwsrfyMetrics.Counter());
        report.addMetric('time.duration', new brwsrfyMetrics.Counter());

        /* Timer */
        report.addMetric('visibility.changes', new brwsrfyMetrics.Timer());
        // percentage histogram (only updates if page is visible)
        report.addMetric('percentage', new brwsrfyMetrics.Timer());

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
            if(stopped || !VisSenseUtils.isPageVisible()) {
                return;
            }

            updateVisibilityChanges();
        });

        vistimer.every(config.visibleUpdateInterval, config.hiddenUpdateInterval, function() {
            if(stopped || !VisSenseUtils.isPageVisible()) {
                return;
            }

            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());
        });

        this.getMetric = function(name) {
            return report.getMetric(name);
        };

        this.summary = function() {
            return report.summary();
        };

        this.stopped = function() {
            return stopped;
        };

        this.stop = function() {
            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());

            vistimer.stopAll();
            return stopped = true;
        };
        /**
        * Updates the percentage metrics (e.g. the ´mean´ visibility percentage)
        *
        * Does not update if the page is currently not visible!
        * This would impact the validity of the result because some
        * browsers only allow a maximum interval time of 1 second
        * when the target tab is hidden.
        */
        function updatePercentage() {
            if(!config.updatePercentageOnPageHidden && !VisSenseUtils.isPageVisible()) {
                return;
            }

            var percentage = vistimer.vismon().status().percentage();
            report.getMetric('percentage').update(percentage);
        }

        function updateVisibilityChanges() {
            var state = vistimer.vismon().status().state();

            report.getMetric('visibility.changes').update(state);
        }

        function fireIfPositive(value, callback) {
            if(value > 0) {
                callback(value);
            }
        }

        function stopAndUpdateTimers(vismon) {
            var status = vismon.status();
            var timeVisible = watchVisible.stopAndThenRestartIf(status.isVisible());

            fireIfPositive(timeVisible, function(value) {
                report.getMetric('time.visible').inc(value);
                report.getMetric('time.relativeVisible').inc(value * status.percentage());
            });

            fireIfPositive(watchFullyVisible.stopAndThenRestartIf(status.isFullyVisible()), function(value) {
                report.getMetric('time.fullyvisible').inc(value);
            });
            fireIfPositive(watchHidden.stopAndThenRestartIf(status.isHidden()), function(value) {
                report.getMetric('time.hidden').inc(value);
            });
            fireIfPositive(watchDuration.restart(), function(value) {
                report.getMetric('time.duration').inc(value);
            });
        }
    }

    function newVisMetrics(vissense, config) {
        return new VisMetrics(vissense.timer(), config);
    }

    VisSense.metrics = newVisMetrics;
    VisSense.prototype.metrics = function(config) {
        return newVisMetrics(this, config);
    };


}.call(this, this, this.VisSense, this.VisSenseUtils, this.brwsrfyMetrics));