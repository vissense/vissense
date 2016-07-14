var defer = require('../util/defer');
var defaults = require('../util/defaults');
var extend = require('../util/extend');
var forEach = require('../util/forEach');
var isArray = require('../util/isArray');
var isFunction = require('../util/isFunction');
var now = require('../util/now');

var PubSub = require('../helper/PubSub');
var VisState = require('../helper/VisState');

var CompositeStrategy = require('./strategy/CompositeStrategy');
var PollingStrategy = require('./strategy/PollingStrategy');
var EventStrategy = require('./strategy/EventStrategy');


/**
 * @private
 * @function
 * @name nextState
 *
 * @param {VisSense} visobj The VisSense element.
 * @param {VisSense~VisState} [currentState] The current state. Can be omitted
 * if the state of an element is determined the first time.
 *
 * @returns {VisSense~VisState} A visibility state object.
 *
 * This method determines and returns the new visibility state of an element.
 */
function nextState(visobj, currentState) {
    var newState = visobj.state();
    var percentage = newState.percentage;

    // check if nothing changed
    if (currentState &&
        percentage === currentState.percentage &&
        currentState.percentage === currentState.previous.percentage) {
        return currentState;
    }

    if (newState.hidden) {
        return VisState.hidden(percentage, currentState);
    }
    else if (newState.fullyvisible) {
        return VisState.fullyvisible(percentage, currentState);
    }

    // otherwise the element is visible
    return VisState.visible(percentage, currentState);
}

/**
 * @typedef {Object} VisMonConfig
 * @name VisMonConfig
 * @memberof VisSense.VisMon#
 *
 * @property {VisSense.VisMon.Strategy|VisSense.VisMon.Strategy[]} [strategy=[PollingStrategy,EventStrategy]]
 *   a strategy or array of strategies for observing the element.
 * @property {function} [start] function to run when monitoring the element starts
 * @property {function} [stop] function to run when monitoring the element stops
 * @property {function} [update] function to run when elements update function is called
 * @property {function} [hidden] function to run when element becomes hidden
 * @property {function} [visible] function to run when element becomes visible
 * @property {function} [fullyvisible] function to run when element becomes fully visible
 * @property {function} [percentagechange] function to run when the percentage of the element changes
 * @property {function} [visibilitychange] function to run when the visibility of the element changes
 * @property {boolean} [async=false] a boolean flag indicating whether events are synchronous or asynchronous
 *
 * A configuration object to configure a VisMon instance.
 */

/**
 * @class
 * @name VisMon
 * @memberof VisSense
 *
 * @param {VisSense} visobj The VisSense instance to monitor.
 * @param {VisSense.VisMon#VisMonConfig} config A configuration object.
 *
 * @property {VisSense} _visobj The given VisSense instance.
 * @property {VisSense~VisState|{}} _state The current state.
 * @property {VisSense.PubSub} _pubsub A publish/subscribe queue.
 * @property {VisSense.VisMon.Strategy} _strategy the strategy to use for
 *   observing the element.
 *
 * @description Creates a `VisSense` object which wraps the given element
 *   to enable visibility operations.
 *
 * @example
 *
 * var visElement = VisSense(element);
 *
 * var visMon = VisSense.VisMon(visElement, {
 *   update: function() {
 *     console.log('updated.');
 *   }
 * });
 *
 * or
 *
 * @example
 *
 * var visMon = VisSense(element).monitor({
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */

class VisMon {
    constructor(visobj, config) {
        var _config = defaults(config, {
            strategy: [
                new PollingStrategy(),
                new EventStrategy()
            ],
            async: false
        });
        this._visobj = visobj;
        this._state = {};
        this._started = false;

        var anyTopicName = '*#' + now();
        this._pubsub = new PubSub({
            async: _config.async,
            anyTopicName: anyTopicName
        });

        this._events = [
            anyTopicName,
            'start',
            'stop',
            'update',
            'hidden',
            'visible',
            'fullyvisible',
            'percentagechange',
            'visibilitychange'
        ];

        this._strategy = new CompositeStrategy(_config.strategy);
        this._strategy.init(this);

        this._pubsub.on('update', monitor => {
            var newValue = monitor._state.percentage;
            var oldValue = monitor._state.previous.percentage;
            if (newValue !== oldValue) {
                monitor._pubsub.publish('percentagechange', [monitor, newValue, oldValue]);
            }
        });

        this._pubsub.on('update', monitor => {
            if (monitor._state.code !== monitor._state.previous.code) {
                monitor._pubsub.publish('visibilitychange', [monitor]);
            }
        });

        this._pubsub.on('visibilitychange', monitor => {
            if (monitor._state.visible && !monitor._state.previous.visible) {
                monitor._pubsub.publish('visible', [monitor]);
            }
        });

        this._pubsub.on('visibilitychange', monitor => {
            if (monitor._state.fullyvisible) {
                monitor._pubsub.publish('fullyvisible', [monitor]);
            }
        });

        this._pubsub.on('visibilitychange', monitor => {
            if (monitor._state.hidden) {
                monitor._pubsub.publish('hidden', [monitor]);
            }
        });

        forEach(this._events, function (event) {
            if (isFunction(_config[event])) {
                this.on(event, _config[event]);
            }
        }, this);
    }

    visobj() {
        return this._visobj;
    }


    /**
     * @method
     * @name publish
     * @memberof VisSense.VisMon#
     *
     * @param {String} eventName The name of the event
     * @param {*} args The arguments to pass to the subscribers of the event
     *
     * @returns Returns a function that cancels the event execution - this can only
     * be done if the monitor has an async queue (option async enabled).
     *
     * @description
     * Invokes all subscribers of the given event with the provided arguments.
     * This method throws an error if an internal event is published.
     *
     * @example
     *
     * var monitor = VisSense(element).monitor();
     *
     * monitor.publish('myEvent', [arg1, arg2]);
     */
    publish(eventName, args) {
        var isInternalEvent = this._events.indexOf(eventName) >= 0;
        if (isInternalEvent) {
            throw new Error('Cannot publish internal event "' + eventName + '" from external scope.');
        }

        return this._pubsub.publish(eventName, args);
    }


    /**
     * @method
     * @name state
     * @memberof VisSense.VisMon#
     *
     * @returns {VisSense~VisState|{}} The current state.
     *
     * @description Returns an object representing the current
     * visibility state.
     *
     * @example
     *
     * var visMon = VisSense.VisMon(...);
     *
     * visElement.state();
     * // => {
     *    code: 1,
     *    state: 'visible',
     *    percentage: 0.33,
     *    fullyvisible: false,
     *    visible: true,
     *    hidden: false,
     *    previous: {
     *      code: 1,
     *      state: 'visible',
     *      percentage: 0.42,
     *      fullyvisible: false,
     *      visible: true,
     *      hidden: false
     *    }
     *  }
     *
     */
    state() {
        return this._state;
    }


    /**
     * @method
     * @name start
     * @memberof VisSense.VisMon#
     *
     * @returns {VisMon} itself.
     *
     * @description Starts monitoring the provided element.
     * This will determine the element visibility once and
     * subequentially execute every strategies `start` method.
     * Call `stop` to stop observing the element.
     *
     * @example
     * var myElement = document.getElementById('myElement');
     * var monitor = VisSense.of(myElement).monitor().start();
     * ...
     * monitor.stop();
     *
     * @example
     *
     * var visobj = new VisSense(myElement);
     * var monitor = VisSense.VisMon(..., {
     *   strategy: [
     *     new ViSense.VisMon.Strategy.EventStrategy(...)
     *     new ViSense.VisMon.Strategy.PollingStrategy(...)
     *   ]
     * });
     *
     * monitor.start();
     *
     */
    start(config) {
        if (this._started) {
            return this;
        }
        var _config = defaults(config, {
            async: false
        });

        if (this._cancelAsyncStart) {
            this._cancelAsyncStart();
        }

        if (_config.async) {
            return this.startAsync();
        }

        this._started = true;

        // the contract for strategies says, that
        // the monitor has been updated at least once
        // when their `start` method is called.
        this.update();

        this._pubsub.publish('start', [this]);

        this._strategy.start(this);

        return this;
    }

    /**
     * @method
     * @name startAsync
     * @memberof VisSense.VisMon#
     *
     * @returns {VisMon} itself.
     *
     * @description Asynchronously starts monitoring the provided element.
     */
    startAsync(config) {
        if (this._cancelAsyncStart) {
            this._cancelAsyncStart();
        }
        var cancelAsyncStart = defer(() => this.start(extend(defaults(config, {}), {async: false})));
        this._cancelAsyncStart = () => {
            cancelAsyncStart();
            this._cancelAsyncStart = null;
        };
        return this;
    }

    /**
     * @method
     * @name stop
     * @memberof VisSense.VisMon#
     *
     * @returns {*} The return value of the strategies stop function.
     *
     * @description Stops monitoring the provided element.
     *
     * @example
     *
     * var visMon = VisSense.VisMon(..., {
 *   strategy: [
 *     new ViSense.VisMon.Strategy.EventStrategy(...)
 *     new ViSense.VisMon.Strategy.PollingStrategy(...)
 *   ]
 * }).start();
     *
     * ...
     *
     * visElement.stop();
     *
     */
    stop() {
        if (this._cancelAsyncStart) {
            this._cancelAsyncStart();
        }

        if (this._started) {
            this._strategy.stop(this);
            this._pubsub.publish('stop', [this]);
        }

        this._started = false;
    }

    /**
     * @method
     * @name update
     * @memberof VisSense.VisMon#
     *
     * @returns {undefined}
     *
     * @description Updates the state of the monitor object. This method invokes
     * a visibility check and fires any registered listener accordingly.
     *
     * @example
     *
     * var vismon = VisSense(...)
     *  .monitor({
 *    update: function() {
 *      console.log('update');
 *    }
 *  });
     *
     * vismon.update();
     * // -> prints 'update' to console
     */
    update() {
        if (this._started) {
            // update state
            this._state = nextState(this._visobj, this._state);

            // notify listeners
            this._pubsub.publish('update', [this]);
        }
    }


    /**
     * @method
     * @name on
     * @memberof VisSense.VisMon#
     *
     * @param {string} topic The name of the topic to bind the callback to.
     * @param {function} callback A callback function.
     *
     * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
     *
     * @description Binds a callback function to a specific event.
     * Valid events are:
     *  - ´start´
     *  - ´stop´
     *  - ´update´
     *  - ´hidden´
     *  - ´visible´
     *  - ´fullyvisible´
     *  - ´percentagechange´
     *  - ´visibilitychange´
     *
     * @example
     *
     * var monitor = VisSense(...).monitor(...);
     *  monitor.on('fullyvisible', function() {
 *   Animations.startAnimation();
 * });
     *
     * monitor.on('percentagechange', function(newValue) {
 *   if(newValue < 0.8) {
 *     Animations.stopAnimation();
 *   }
 * });
     *
     * monitor.start();
     *
     */
    on(topic, callback) {
        return this._pubsub.on(topic, callback);
    }

}


/**
 * This callback function will unregister a previously registered listener.
 * It will be returned from any function registering a listener.
 * Returns `true` if the listener was successfully unregistered, otherwise
 * `false`.
 *
 * @callback RemoveListenerCallback
 * @memberof VisSense.VisMon#
 * @param {boolean} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the monitor updates its
 * state.
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnUpdateCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the visibility state
 * changes.
 *
 * A visibility change can occur if a state transits from
 * - HIDDEN to VISIBILE or FULLY_VISIBILE
 * - VISIBLE to FULLY_VISIBLE or HIDDEN
 * - FULLY_VISIBLE to HIDDEN or VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback VisMon.OnVisibilityChangeCallback
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the visibility
 * percentage changes.
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * This callback will currently be provided with different
 * parameters than the others. This is likely to change in
 * future versions in favour of a uniform approach.
 *
 * @callback OnPercentageChangeCallback
 * @memberof VisSense.VisMon#
 *
 * @param {number} newValue The new visible percentage.
 * @param {number} oldValue The former visible percentage.
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes visible.
 *
 * This can occur if a state changes from
 * - HIDDEN to VISIBLE
 * - HIDDEN to FULLY_VISIBLE
 *
 * *NOTE*: This does not occur when changing from
 * - FULLY_VISIBLE to VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnVisibleCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes fully visible.
 *
 * This can occur if a state changes from
 * - HIDDEN to FULLY_VISIBLE
 * - VISIBLE to FULLY_VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnFullyVisibleCallback
 * @memberof VisSense.VisMon
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes hidden.
 *
 * This can occur if a state changes from
 * - FULLY_VISIBLE to HIDDEN
 * - VISIBLE to HIDDEN
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnHiddenCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */


VisMon.Builder = (function () {
    var combineStrategies = (config, strategies) => {
        var combinedStrategies = null;
        var forceDisableStrategies = config.strategy === false;
        var enableStrategies = !forceDisableStrategies && (config.strategy || strategies.length > 0);

        if (!enableStrategies) {
            if (forceDisableStrategies) {
                combinedStrategies = [];
            } else {
                combinedStrategies = config.strategy;
            }
        } else {
            var configStrategyIsDefined = !!config.strategy;
            var configStrategyIsArray = isArray(config.strategy);
            var configStrategyAsArray = configStrategyIsDefined ? (!configStrategyIsArray ?
                [config.strategy] : config.strategy) : [];

            combinedStrategies = configStrategyAsArray.concat(strategies);
        }

        return combinedStrategies;
    };

    return function (visobj) {
        var config = {};
        var strategies = [];
        var events = [];

        var productBuilt = false;
        var product = null;

        return {
            set: function (name, value) {
                config[name] = value;
                return this;
            },
            strategy: function (strategy) {
                strategies.push(strategy);
                return this;
            },
            on: function (event, handler) {
                events.push([event, handler]);
                return this;
            },
            /**
             * Creates the configured monitor.
             *
             * There is a special case in which all strategies
             * are disabled and hence the caller has to take
             * care of the update mechanism - this is especially useful
             * for testing.
             * This happens when the property 'strategy' is set to false
             * or ends up being an empty array.
             *
             * builder.set('strategy', false);
             * or
             * builder.options({
       *   strategy: false
       * });
             *
             * @param [consumer] if given will return this methods result
             * as return parameter. The built monitor is passed as first argument.
             *
             * @returns {*|VisSense.VisMon}
             */
            build: function (consumer) {
                var manufacture = function () {
                    var combinedStrategies = combineStrategies(config, strategies);

                    if (combinedStrategies === []) {
                        console.debug('No strategies given - update process must be handled by caller. ');
                    }

                    config.strategy = combinedStrategies;

                    var monitor = visobj.monitor(config);

                    forEach(events, event => monitor.on(event[0], event[1]));

                    productBuilt = true;
                    product = monitor;

                    return product;
                };

                if (productBuilt) {
                    console.warn('Attempt to build an already built monitor.');
                }

                var monitor = productBuilt ? product : manufacture();

                if (isFunction(consumer)) {
                    return consumer(monitor);
                } else {
                    return monitor;
                }
            }
        };
    };
})();

export default VisMon;
