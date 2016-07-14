var defer = require('./defer');

/**
 * @function
 * @name async
 * @memberof twynUtils
 *
 * @param {function} callback The function that should be proxied.
 * @param {number} [delay=0] The time in milliseconds to delay the invocation.
 *
 * @returns {function} A proxy function when called will defer
 * the actual function call.
 *
 * @description Returns a proxy function for the given callback which
 * will defer the actual invocation until the current call stack has cleared.
 *
 * @example
 *
 * var prefetch = function () { ... };
 *
 * var prefetchAsync = twynUtils.async(prefetch, 2000);
 *
 * var cancelPrefetch = prefetchAsync();
 * if ( someone_changed_his_mind ) {
 *   cancelPrefetch();
 * }
 * // => true
 *
 */
export default function async(callback, delay) {
  return function() {
    var args = arguments;
    return defer(()  => callback.apply(undefined, args), delay || 0);
  };
}
