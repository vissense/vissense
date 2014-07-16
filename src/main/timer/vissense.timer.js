/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/*
 * depends on ['againjs', 'vissense.core', 'vissense.monitor']
 */
;(function(window, Again, VisSense, VisSenseUtils, undefined) {
    'use strict';

    function VisTimer(vismon, config) {
        var me = this;

        me._vismon = vismon;
        me._config = config || {};

        me._config.reinitializeImmediatelyOnHidden = true;
        me._config.checkIntervalVisible = 100;
        me._config.checkIntervalHidden = 100;

        me._again = Again.create({
            reinitializeOn: {
                'hidden': false,
                'visible': true
            }
        });

        me.start(me._config.checkIntervalVisible, me._config.checkIntervalHidden);
    }

    VisTimer.prototype.start = function(checkIntervalVisible, checkIntervalHidden) {
        if(!!this._started) {
            return false;
        }

        (function init(me) {
            me._config.checkIntervalVisible = checkIntervalVisible || me._config.checkIntervalVisible;
            me._config.checkIntervalHidden = checkIntervalHidden || me._config.checkIntervalHidden;

            var triggerVisMonUpdate = function() {
                me._vismon.update();
            };

            var triggerSelfUpdate = function() {
                var hasPrev = !!me._vismon.status().prev();
                var isHidden = me._vismon.status().isHidden();
                var wasHidden = me._vismon.status().wasHidden();

                if (isHidden !== wasHidden || !hasPrev) {
                    me._again.update(!!isHidden ? 'hidden' : 'visible');
                }
            };

            me._vismon.onHidden(triggerSelfUpdate);
            me._vismon.onVisible(triggerSelfUpdate);

            // react on tab changes
            VisSenseUtils.onPageVisibilityChange(triggerVisMonUpdate);

            triggerVisMonUpdate();

            VisSenseUtils.defer(function() {
                triggerSelfUpdate();
                // reschedule update immediately
                VisSenseUtils.defer(triggerVisMonUpdate);
            });

            // check for other changes periodically. this is needed for example
            // if an accordion expands on the page or dynamic content has been added
            me.every(me._config.checkIntervalVisible, me._config.checkIntervalHidden, triggerVisMonUpdate, true);
        }(this));

        return true;
    };

    VisTimer.prototype.vismon = function() {
        return this._vismon;
    };

    /*
    * Run callback every `interval` milliseconds if element is visible and
    * every `hiddenInterval` milliseconds if element is hidden.
    */
    VisTimer.prototype.every = function (interval, hiddenInterval, callback, runNow) {
        if (!callback) {
            callback = hiddenInterval;
            hiddenInterval = 0;
        }
        var me = this;
        return this._again.every(function() {
            callback(me._vismon);
        }, {
            'visible': interval,
            'hidden': hiddenInterval
        }, runNow);
    };

    VisTimer.prototype.stop = function(id) {
        return this._again.stop(id);
    };

    /**
    *
    * As this also stops the interval updating the state
    * the object is unusable after this call.
    */
    VisTimer.prototype.destroy = function() {
        return this._again.stopAll();
    };

    VisSense.fn.timer = function(incomingConfig) {
        var config = incomingConfig || {};

        if(!!config.detached) {
            return new VisTimer(this.monitor({ detached : true }), config);
        }

        if(this._timer) {
            return this._timer;
        }

        this._timer = new VisTimer(this.monitor(), config);

        return this._timer;
    };

}(window, window.Again, window.VisSense, window.VisSenseUtils));
