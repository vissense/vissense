
/**
 * @function
 * @name isElement
 * @memberof twynUtils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if the given value is a DOM Element,
 * otherwise `false`.
 *
 * @description Checks if `value` is a DOM Element.
 *
 * @example
 *
 * var elem = document.getElementById('myElement')
 * twynUtils.isElement(elem);
 * // => true
 *
 * twynUtils.isElement(document);
 * // => false
 *
 * twynUtils.isElement(document.body);
 * // => true
 *
 */
export default function isElement(value) {
  return value && value.nodeType === 1 || false;
};
