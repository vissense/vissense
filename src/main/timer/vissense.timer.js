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

        me._$$again = Again.create({
            reinitializeImmediatelyOn: {
                'hidden': false,
                'visible': true
            }
        });

        (function init(me) {
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

            // check for other changes periodically
            // e.g. if accordion expands on page
            // or if dynamic content is added
            // TODO: make these values configureable!
            me.every(100, 100, triggerVisMonUpdate);
        }(this));
    }

    VisTimer.prototype.vismon = function() {
        return this._$$vismon;
    };

    /*
    * Run callback every `interval` milliseconds if element is visible and
    * every `hiddenInterval` milliseconds if element is hidden.
    */
    VisTimer.prototype.every = function (interval, hiddenInterval, callback) {
        if (!callback) {
            callback = hiddenInterval;
            hiddenInterval = 0;
        }
        return this._$$again.every(callback, {
            'visible': interval,
            'hidden': hiddenInterval
        });
    };

    VisTimer.prototype.stop = function(id) {
        return this._$$again.stop(id);
    };

    VisTimer.prototype.stopAll = function() {
        return this._$$again.stopAll();
    };

    function newVisTimer(vissense, config) {
        return new VisTimer(vissense.monitor(), config || {});
    }

    VisSense.timer = newVisTimer;

    VisSense.prototype.timer = function(config) {
        if(this._$$timer) {
            return this._$$timer;
        }
        this._$$timer = newVisTimer(this, config);
        return this._$$timer;
    };

}(this, this.Again, this.VisSense, this.VisSenseUtils));