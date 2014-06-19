/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/*
 * depends on ['vissense.core', 'vissense.monitor']
 */
;(function(window, VisSense, VisSenseUtils, undefined) {
    'use strict';

    // Stop timer from `every` method by it’s ID.
    function cancel(timer) {
        clearInterval(timer.id);
        clearTimeout(timer.delay);
        delete timer.id;
        delete timer.delay;
    }

    function run(timer, interval, runNow) {
        var runner = function () {
            timer.last = new Date();
            timer.callback.call(window);
        };

        if ( runNow ) {
            var now  = new Date();
            var last = now - timer.last;

            if ( interval > last ) {
                timer.delay = setTimeout(function () {
                    runner();
                    timer.id = setInterval(runner, interval);
                }, interval - last);
            } else {
                runner();
                timer.id = setInterval(runner, interval);
            }

        } else {
          timer.id = setInterval(runner, interval);
        }
    }
    /*--------------------------------------------------------------------------*/

    function VisTimer(vismon, config) {
        var me = this;

        me._$$lastTimerId = -1;
        me._$$timers = {};
        me._$$initialized = false;
        me._$$vismon = vismon;
        me._$$config = config || {};

        me._$$config.reinitializeImmediatelyOnHidden = true;

        (function init(me) {
            var triggerVisMonUpdate = function() {
                me._$$vismon.update();
            };

            // react on tab changes
            VisSenseUtils.onPageVisibilityChange(triggerVisMonUpdate);

            vismon.onVisible(function() {
              me._cancelAndReinitialize();
            });

            vismon.onHidden(function() {
              me._cancelAndReinitialize();
            });

            triggerVisMonUpdate();

            VisSenseUtils.defer(function() {
                me._cancelAndReinitialize();
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

    // Run callback every `interval` milliseconds if page is visible and
    // every `hiddenInterval` milliseconds if page is hidden.
    //
    //   visobj.timer().every(60 * 1000, 5 * 60 * 1000, function () {
    //       doSomeStuff();
    //   });
    //
    // You can skip `hiddenInterval` and callback will be called only if
    // page is visible.
    //
    //   visobj.timer().every(1000, function () {
    //       doSomethingKewl();
    //   });
    //
    // It is analog of `setInterval(callback, interval)` but use visibility
    // state.
    //
    // It return timer ID, that you can use in `Vissense.stop(id)` to stop
    // timer (`clearInterval` analog).
    // Warning: timer ID is different from interval ID from `setInterval`,
    // so don’t use it in `clearInterval`.
    VisTimer.prototype.every = function (interval, hiddenInterval, callback) {
        if (!callback) {
            callback = hiddenInterval;
            hiddenInterval = null;
        }

        this._$$lastTimerId += 1;
        var id = this._$$lastTimerId;

        this._$$timers[id] = {
            visible:  interval,
            hidden:   hiddenInterval,
            callback: callback
        };
        this._run(id, false);

        return id;
    };

    // Stop timer from `every` method by ID.
    //
    //   slideshow = Vissense.every(5 * 1000, function () {
    //       changeSlide();
    //   });
    //   $('.stopSlideshow').click(function () {
    //       Vissense.stop(slideshow);
    //   });
    VisTimer.prototype.stop = function(id) {
        if ( !this._$$timers[id] ) {
            return false;
        }
        cancel(this._$$timers[id]);
        delete this._$$timers[id];
        return true;
    };

    VisTimer.prototype.stopAll = function() {
        for (var id in this._$$timers) {
            if(this._$$timers.hasOwnProperty(id)) {
              cancel(this._$$timers[id]);
            }
        }
        this._$$timers = {};
    };

    // Try to run timer from every method by it’s ID. It will be use
    // `interval` or `hiddenInterval` depending on visibility state.
    // If page is hidden and `hiddenInterval` is null,
    // it will not run timer.
    //
    // Argument `runNow` say, that timers must be execute now too.
    VisTimer.prototype._run = function(id, runNow) {
        var interval, timer = this._$$timers[id];

        if (this._$$vismon.status().isHidden()) {
            if ( null === timer.hidden ) {
                return;
            }
            interval = timer.hidden;
        } else {
            interval = timer.visible;
        }

        run(timer, interval, runNow);
    };


    VisTimer.prototype._cancelAndReinitialize = function() {
        var isHidden = this._$$vismon.status().isHidden();
        var wasHidden = this._$$vismon.status().wasHidden();

        if (isHidden !== wasHidden) {
            for (var id in this._$$timers) {
                if(this._$$timers.hasOwnProperty(id)) {
                    cancel(this._$$timers[id]);

                    this._run(id, !isHidden ? true : this._$$config.reinitializeImmediatelyOnHidden);
                }
            }
        }
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

}.call(this, this, this.VisSense, this.VisSenseUtils));