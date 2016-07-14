var StrategyBase = require('./StrategyBase');
var defaults = require('../../util/defaults');
var throttle = require('../../util/throttle');
var createVisibilityApi = require('../../util/_element').createVisibilityApi;

/**
 * @typedef {Object} EventStrategyConfig
 * @name EventStrategyConfig
 * @memberof VisSense.EventStrategy#
 *
 * @property {number} [throttle=50] The time in milliseconds to debounce
 * the state update. Event might fire multiple times in a short period
 * of time. If you want this feature to be disabled set debounce to 0.
 * in milliseconds.
 *
 * @description A configuration object to configure a EventStrategy instance.
 */

/**
 * @class
 * @name EventStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @classdesc A strategy that registers listeners for events
 * that may change the percentage of the elements surface area within the
 * visible area of a viewer's browser window.
 *
 * Following events are listened to:
 * - scroll
 * - resize
 * - visibilitychange
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.EventStrategy({
 *      throttle: 100
 *   }),
 *   update: () => console.log('updated')
 * }).start();
 *
 */

export default class EventStrategy extends StrategyBase {
    constructor(config) {
        super();
        this._config = defaults(config, {
            throttle: 50
        });

        if (this._config.debounce > 0) {
            this._config.throttle = +this._config.debounce;
        }

        this._started = false;
    }

    start(monitor) {
        if (!this._started) {
            this._removeEventListeners = ((update) => {
                var referenceWindow = monitor.visobj().referenceWindow();
                var visibilityApi = createVisibilityApi(referenceWindow);

                var removeOnVisibilityChangeEvent = visibilityApi.onVisibilityChange(update);
                referenceWindow.addEventListener('scroll', update, false);
                referenceWindow.addEventListener('resize', update, false);
                referenceWindow.addEventListener('touchmove', update, false);

                return () => {
                    referenceWindow.removeEventListener('touchmove', update, false);
                    referenceWindow.removeEventListener('resize', update, false);
                    referenceWindow.removeEventListener('scroll', update, false);
                    removeOnVisibilityChangeEvent();
                };
            })(throttle(() => monitor.update(), this._config.throttle));

            this._started = true;
        }

        return this._started;
    }

    /**
     * @method
     * @name stop
     *
     * @param {VisSense.VisMon} monitor
     */
    stop() {
        if (!this._started) {
            return false;
        }

        this._removeEventListeners();

        this._started = false;

        return true;
    }
}


