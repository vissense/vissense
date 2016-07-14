
/**
 * @function
 * @name identity
 * @memberof twynUtils
 *
 * @param {*} value Any value.
 *
 * @returns {*} The given value.
 *
 * @description This function returns the first argument provided to it.
 *
 * @example
 *
 * var object = { 'name': 'Bradley' };
 * twynUtils.identity(object) === object;
 * // => true
 *
 */
export default function identity(value) {
  return value;
};
