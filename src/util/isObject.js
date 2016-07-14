/**
 * @function
 * @name isObject
 * @memberof twynUtils
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, otherwise `false`.
 *
 * @description Checks if `value` is the language type of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and
 * `new String('')`)
 *
 * @example
 *
 * twynUtils.isObject({});
 * // => true
 *
 * twynUtils.isObject([1, 2, 3]);
 * // => true
 *
 * twynUtils.isObject(1);
 * // => false
 *
 *
 * From lodash: [isObject](https://lodash.com/docs#isObject)
 */
export default function isObject(value) {
  var type = typeof value;
  return (type === 'function' || (value && type === 'object')) || false;
};
