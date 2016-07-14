/**
 * @function
 * @name defer
 * @memberof twynUtils
 *
 * @param {function} callback The function to defer.
 * @param {number} [delay=0] The time in milliseconds to delay the invocation.
 *
 * @returns {function} A function when called will cancel the invocation.
 *
 * @description Defers executing the callback function until the current call
 * stack has cleared. The request can be cancelled by calling the returned
 * function.
 *
 * @example
 *
 * var prefetch = function () { ... };
 *
 * var cancelPrefetch = twynUtils.defer(prefetch, 9001);
 *
 * if ( someone_changed_his_mind ) {
 *   cancelPrefetch();
 * }
 * // => true
 *
 */
export default function defer(callback, delay) {
  var timer = setTimeout(callback, delay || 0);
  return () => {
    clearTimeout(timer);
  };
};
