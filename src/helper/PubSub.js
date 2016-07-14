var isFunction = require('../util/isFunction');
var defaults = require('../util/defaults');
var async = require('../util/async');
var noop = require('../util/noop');

/**
 * Invokes all consumers with the given arguments.
 * @param {function[]} consumers An array of functions taking the args array as parameter.
 * @param {*} args An array of arguments to pass to the function
 */
var fireListenersSynchronously = (consumers, args) => consumers.forEach(consumer =>consumer(args));

/**
 * @class
 * @name PubSub
 * @memberof VisSense
 */
export default class PubSub {
    constructor(config) {
        this._cache = {};
        this._onAnyCache = [];
        this._config = defaults(config, {
            async: false,
            anyTopicName: '*'
        });
    }


    on(topic, callback) {
        if (!isFunction(callback)) {
            console.warn('Discarding invalid listener on topic', topic);
            return noop;
        }

        var applyCallback = (args) => callback.apply(undefined, args || []);

        var listener = !this._config.async ? applyCallback : async(applyCallback);

        var unregister = (listener, array, topicNameForLogMessage) => () => {
            var index = array.indexOf(listener);

            if (index > -1) {
                console.debug('Unregistering listener from topic', topicNameForLogMessage);
                array.splice(index, 1);

                console.debug('Topic', topicNameForLogMessage, 'has now', array.length, 'listeners');
                return true;
            }

            return false;
        };

        if (topic === this._config.anyTopicName) {
            this._onAnyCache.push(listener);
            return unregister(listener, this._onAnyCache, '*');
        }

        if (!this._cache[topic]) {
            console.debug('Initializing queue for topic', topic);
            this._cache[topic] = [];
        }

        this._cache[topic].push(listener);

        return unregister(listener, this._cache[topic], topic);
    }

    publish(topic, args) {
        var listeners = (this._cache[topic] || [])
            .concat(topic === this._config.anyTopicName ? [] : this._onAnyCache);

        var enableAsync = !!this._config.async;

        /*
         var syncOrAsyncPublish = enableAsync ? async(fireListenersSynchronously) : (listeners, args) => {
         fireListenersSynchronously(listeners, args);
         return noop;
         };*/

        var syncOrAsyncPublish = null;
        if (enableAsync) {
            syncOrAsyncPublish = async(fireListenersSynchronously)
        } else {
            syncOrAsyncPublish = (listeners, args) => {
                fireListenersSynchronously(listeners, args);
                return noop;
            };
        }

        console.debug('publishing topic', enableAsync ? '(async)' : '(sync)', topic, 'to', listeners.length, 'listeners');

        return syncOrAsyncPublish(listeners, args || []);
    }
}
