var defer = require('./defer');
var noop = require('./noop');
var now = require('./now');

/**
 * @function
 * @name throttle
 * @memberof twynUtils
 *
 * @param {function} callback The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 *
 * @returns {function} A throttled version of the given function
 *
 * @description Returns a function that only invokes `callback` at most once
 * per every `wait` milliseconds.
 *
 * @example
 *
 * window.addEventListener('resize', twynUtils.throttle(function() {
 *   console.log('resizing..');
 * }, 100));
 * // => logs 'resizing..' at most every 100ms while resizing the browser window
 *
 */
export default function throttle(callback, wait, thisArg) {
    var cancel = noop;
    var last = false;

    return () => {
        var time = now();
        var args = arguments;
        var func = () => {
            last = time;
            callback.apply(thisArg, args);
        };

        if (last && time < last + wait) {
            cancel();
            cancel = defer(func, wait);
        } else {
            last = time;
            defer(func, 0);
        }
    };
}
