var StrategyBase = require('./StrategyBase');
var isArray = require('../../util/isArray');
var isFunction = require('../../util/isFunction');

/**
 * @class
 * @name CompositeStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @param {VisSense.VisMon.Strategy[]} strategies
 *
 * @property {VisSense.VisMon.Strategy[]} _strategies A list of strategies
 *
 * @classdesc A composite strategy to combine two or more strategies
 * Its a proxy that will call every strategies start() and stop() methods.
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.CompositeStrategy([
 *      new VisSense.VisMon.Strategy.EventStrategy(...),
 *      new VisSense.VisMon.Strategy.PollingStrategy(...)
 *   ]),
 *   update: () => console.log('updated')
 * }).start();
 *
 */
export default class CompositeStrategy extends StrategyBase {
    constructor(strategies) {
        super();
        this._strategies = !strategies ? [] : (isArray(strategies) ? strategies : [strategies]);
    }

    init(monitor) {
        this._strategies
            .filter(strategy => isFunction(strategy.init))
            .forEach(strategy => strategy.init(monitor));
    }

    start(monitor) {
        this._strategies
            .filter(strategy => isFunction(strategy.start))
            .forEach(strategy => strategy.start(monitor));
    }

    stop(monitor) {
        this._strategies
            .filter(strategy => isFunction(strategy.stop))
            .forEach(strategy => strategy.stop(monitor));
    }
};
