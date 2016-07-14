var isObject = require('./isObject');

/**
 * @function
 * @name defaults
 * @memberof twynUtils
 *
 * @param {Object} dest The destination object.
 * @param {Object} source The source object.
 *
 * @returns {Object}
 *
 * @description Assigns all properties of the source object to the destination
 * object if they are not present in the destination object.
 *
 * @example
 *
 * twynUtils.defaults({
 *   name: 'Max',
 *   gender: 'male'
 * }, {
 *   name: 'Bradley',
 *   age: 31
 * });
 * // => { name: 'Max', gender: 'male', age: 31 }
 *
 */
export default function defaults(dest, source) {
  var sourceIsObject = isObject(source);
  var destIsObject = isObject(dest);

  if (!sourceIsObject && !destIsObject) {
    return source;
  } else if (!sourceIsObject || !destIsObject) {
    return !sourceIsObject ? dest : source;
  }

  Object.keys(source).forEach((property) => {
    if (dest[property] === undefined) {
      dest[property] = source[property];
    }
  });

  return dest;
}
