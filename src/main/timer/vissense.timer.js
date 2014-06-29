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

        me._$$vismon = vismon;
        me._config = config || {};

        me._config.reinitializeImmediatelyOnHidden = true;
        me._config.checkIntervalVisible = 100;
        me._config.checkIntervalHidden = 100;

        me._$$again = Again.create({
            reinitializeOn: {
                'hidden': false,
                'visible': true
            }
        });

        me.start(me._config.checkIntervalVisible, me._config.checkIntervalHidden);
    }

    VisTimer.prototype.start = function(checkIntervalVisible, checkIntervalHidden) {
        if(!!this._$$started) {
            return false;
        }

        (function init(me) {
            me._config.checkIntervalVisible = checkIntervalVisible || me._config.checkIntervalVisible;
            me._config.checkIntervalHidden = checkIntervalHidden || me._config.checkIntervalHidden;

            var triggerVisMonUpdate = function() {
                me._$$vismon.update();
            };

            var triggerSelfUpdate = function() {
                var hasPrev = !!me._$$vismon.status().prev();
                var isHidden = me._$$vismon.status().isHidden();
                var wasHidden = me._$$vismon.status().wasHidden();

                if (isHidden !== wasHidden || !hasPrev) {
                    me._$$again.update(!!isHidden ? 'hidden' : 'visible');
                }
            };

            me._$$vismon.onHidden(triggerSelfUpdate);
            me._$$vismon.onVisible(triggerSelfUpdate);

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
        return this._$$vismon;
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
        return this._$$again.every(function() {
            callback(me._$$vismon);
        }, {
            'visible': interval,
            'hidden': hiddenInterval
        }, runNow);
    };

    VisTimer.prototype.stop = function(id) {
        return this._$$again.stop(id);
    };

    /**
    *
    * As this also stops the interval updating the state
    * the object is unusable after this call.
    */
    VisTimer.prototype.destroy = function() {
        return this._$$again.stopAll();
    };

    VisSense.fn.timer = function(incomingConfig) {
        var config = incomingConfig || {};

        if(!!config.detached) {
            return new VisTimer(this.monitor({ detached : true }), config);
        }

        if(this._$$timer) {
            return this._$$timer;
        }

        this._$$timer = new VisTimer(this.monitor(), config);

        return this._$$timer;
    };

}(this, this.Again, this.VisSense, this.VisSenseUtils));