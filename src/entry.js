

var VisSense = require('./vissense');
var Utils = require('./utils');
var Strategy = require('./monitor/strategy/StrategyBase');
var CompositeStrategy = require('./monitor/strategy/CompositeStrategy');
var PollingStrategy = require('./monitor/strategy/PollingStrategy');
var EventStrategy = require('./monitor/strategy/EventStrategy');

var VisMon = require('./monitor/monitor');
var VisState = require('./helper/VisState');

VisSense.prototype.monitor = function (config) {
    return new VisMon(this, config);
};
/*
 * backward compatibility <1.0.0
*/

/*
 * VisSense should be able to be called without
 * "new" operator. e.g. VisSense(myElement)
 * */
function VisSenseWrapper(element, config) {
    return new VisSense(element, config);
}

Strategy.CompositeStrategy = CompositeStrategy;
Strategy.PollingStrategy = PollingStrategy;
Strategy.EventStrategy = EventStrategy;
VisMon.Strategy = Strategy;

VisSenseWrapper.Utils = Utils;
VisSenseWrapper.VisMon = VisMon;
VisSenseWrapper.VisState = VisState;


/**
 * @static
 * @method
 * @name of
 * @memberof VisSense
 *
 * @returns {VisSense} An initialized VisSense object.
 *
 * @description Constructs and returns a VisSense object.
 * This is syntactic sugar for `new VisSense(..)`.
 *
 * @example
 *
 * var myElement = document.getElementById('myElement');
 * var visElement = VisSense.of(myElement);
 *
 */
VisSenseWrapper.of = (element, config) => VisSenseWrapper(element, config);
VisSenseWrapper.fn = VisSense.prototype;

export default VisSenseWrapper;
