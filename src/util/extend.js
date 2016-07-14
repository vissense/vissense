var isFunction = require('./isFunction');
/**
 * @function
 * @name extend
 * @memberof twynUtils
 *
 * @param {Object} dest The destination object.
 * @param {Object} source The source object.
 * @param {twynUtils.extendCallback} [callback] The function to customize assigning
 * values.
 *
 * @returns {Object}
 *
 * @description Overwrites all properties of the destination object with the
 * source object's properties. You can provide an optional callback function
 * to modify the behaviour and/or to manipulate the return value.
 *
 * @example
 *
 * twynUtils.extend({
 *   name: 'Max',
 *   age: 31
*   }, {
 *   name: 'Bradley',
 *   gender: 'male'
 * });
 * // => { name: 'Bradley', age: 31, gender: 'male' }
 *
 *
 * twynUtils.extend({
 *   name: 'Max',
 *   age: 31
 * }, {
 *   name: 'Bradley',
 *   gender: 'male'
 * }, function(destValue, srcValue, key) {
 *   if(key === 'age') return destValue + 42;
 *   return srcValue;
 * });
 * // => { name: 'Bradley', age: 73, gender: 'male' }
 *
 */
export default function extend(dest, source, callback) {
  var index = -1,
    props = Object.keys(source),
    length = props.length,
    ask = isFunction(callback);

  while (++index < length) {
    var key = props[index];
    dest[key] = ask ?
      callback(dest[key], source[key], key, dest, source) : source[key];
  }

  return dest;
};
