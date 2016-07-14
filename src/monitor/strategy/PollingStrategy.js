/**
 * @typedef {Object} PollingStrategyConfig
 * @name PollingStrategyConfig
 * @memberof VisSense.VisMon.Strategy.PollingStrategy#
 *
 * @property {number} [interval=5000] The interval between state updates
 * in milliseconds.
 *
 * @description A configuration object to configure a PollingStrategy instance.
 */

/**
 * @class
 * @name PollingStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @param {VisSense.VisMon.Strategy.PollingStrategy#PollingStrategyConfig} [config={interval:1000}] The config object
 *
 * @property {VisSense.VisMon.Strategy.PollingStrategy#PollingStrategyConfig} _config The internal config object
 *
 * @classdesc A strategy that will periodically update the objects
 * visibility state.
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.PollingStrategy({
 *     interval: 5000
 *   }),
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */

var StrategyBase = require('./StrategyBase');
var defaults = require('../../util/defaults');

export default class PollingStrategy extends StrategyBase {
    constructor(config) {
        super();
        this._config = defaults(config, {
            interval: 1000
        });
        this._started = false;
    }

    start(monitor) {
        if (!this._started) {
            var intervalId = setInterval(() => monitor.update(), this._config.interval);

            this._clearInterval = () => clearInterval(intervalId);

            this._started = true;
        }

        return this._started;
    }

    stop() {
        if (!this._started) {
            return false;
        }

        this._clearInterval();

        this._started = false;

        return true;
    }
}
