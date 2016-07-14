
/**
 * @function
 * @name isDefined
 * @memberof twynUtils
 *
 * @param {*} value Any value.
 * @returns {boolean} `true` if the given value is undefined, otherwise `false`.
 *
 * @description Checks if the given value is undefined
 *
 * @example
 *
 * twynUtils.isDefined(undefined) === false;
 * // => true
 *
 */
export default function isDefined(value) {
  return value !== undefined;
};
