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
    /*--------------------------------------------------------------------------*/


    function VisMetrics(vistimer, inConfig) {
        //VisSense.call(this, element, config);
        var self = this;
        var stopped = false;
        var timerIds = [];
        var config = parseConfig(inConfig);
        var report = new brwsrfyMetrics.Report();

        //self.report.addMetric('ns.counter', new brwsrfyMetrics.Counter());
        report.addMetric('visibility.changes', new brwsrfyMetrics.Timer());
        report.addMetric('percentage', new brwsrfyMetrics.Timer());
        //self.report.addMetric('ns.histogram', new brwsrfyMetrics.Histogram.createUniformHistogram(10));
        //self.report.addMetric('ns.exphistogram', new brwsrfyMetrics.Histogram.createExponentialDecayHistogram(10, 0.1));


        updatePercentage();

        updateVisibilityChanges();

        vistimer.vismon().onVisibilityPercentageChange(function() {
            if(!stopped) {
                updatePercentage();
            }
        });

        vistimer.vismon().onVisibilityChange(function() {
            if(!stopped) {
                updateVisibilityChanges();
            }
        });

        vistimer.every(config.visibleUpdateInterval, config.hiddenUpdateInterval, function() {
            updatePercentage();
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
    }
    function newVisMetrics(vissense, config) {
        return new VisMetrics(vissense.timer(), config);
    };

    VisSense.metrics = newVisMetrics;
    VisSense.prototype.metrics = function(config) {
        return newVisMetrics(this, config);
    };


}.call(this, this, this.VisSense, this.brwsrfyMetrics));