/**
 * @function
 * @name now
 * @memberof twynUtils
 *
 * @returns {number} Returns milliseconds since the Unix epoch.
 *
 * @description Gets the number of milliseconds that have elapsed since the
 * Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @example
 *
 * var start = twynUtils.now();
 * twynUtils.defer(function() {
 *   console.log(twynUtils.now() - start);
 * });
 * // => logs the time it took for the deferred function to be invoked
 *
 */
export default function now() {
  return new Date().getTime();
};
