/**
 * @function
 * @name isArray
 * @memberof twynUtils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if `value` is an `Array`, otherwise `false`.
 *
 * @description Checks if `value` is classified as an `Array` object
 *
 * @example
 *
 * twynUtils.isArray([1, 2, 3]);
 * // => true
 *
 * (function() { return twynUtils.isArray(arguments); })();
 * // => false
 *
 * From lodash: [isArray](https://lodash.com/docs#isArray)
 */
export default function isArray(value) {
  return (value &&
    typeof value === 'object' && typeof value.length === 'number' &&
    Object.prototype.toString.call(value) === '[object Array]') || false;
};
