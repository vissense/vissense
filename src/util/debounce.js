var defer = require('./defer');
var noop = require('./noop');

/**
 * @function
 * @name debounce
 * @memberof twynUtils
 *
 * @param {function} callback The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 *
 * @returns {function} A debounced version of the given function
 *
 * @description Returns a function that delays invoking `callback` until after
 * `delay` milliseconds have elapsed since the last time it was invoked.
 *
 * @example
 *
 * window.addEventListener('resize', twynUtils.debounce(function() {
 *   console.log('resized');
 * }, 200));
 * // => logs 'resized' after receiving resize events stopped for 200ms
 *
 */
export default function debounce(callback, delay) {
  var cancel = noop;
  return () => {
    var self = this, args = arguments;
    cancel();
    cancel = defer(() => {
      callback.apply(self, args);
    }, delay);
  };
};
