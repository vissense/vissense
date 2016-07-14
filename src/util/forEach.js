
/**
 * @function
 * @name forEach
 * @memberof VisSense.Utils
 *
 * @param {Array} array The target array to iterate.
 * @param {function} callback Function that consumes an elements of the array
 * @param {*} [thisArg] Value to use as this when executing callback.
 *
 * @returns {*} the result of the callback or undefined
 *
 * @description Iterates of the provided array
 *
 * @example
 *
 * var myArray = [1,2,3];
 * VisSense.Utils.forEach([1,2,3], function(num, index) {
 *   console.log('myArray[', index, '] = ', num);
 * });
 *
 */
export default function forEach(array, callback, thisArg) {
  for (var i = 0, n = array.length; i < n; i++) {
    var result = callback.call(thisArg, array[i], i, array);
    if (result !== undefined) {
      return result;
    }
  }
}
