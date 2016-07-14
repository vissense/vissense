/**
 * @function
 * @name isFunction
 * @memberof twynUtils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 *
 * @description Checks if `value` is classified as a `function` object.
 *
 * @example
 *
 * twynUtils.isFunction(VisSense);
 * // => true
 *
 * twynUtils.isFunction(/abc/);
 * // => false
 *
 * From lodash: [isFunction](https://lodash.com/docs#isFunction)
 */
export default function isFunction(value) {
  return typeof value === 'function' || false;
};
