/**
 * @function
 * @name once
 * @memberof twynUtils
 *
 * @param {function} callback The function to proxy.
 *
 * @returns {function} A proxy function that will only be invoked once.
 *
 * @description Returns a function that is restricted to invoking `callback`
 * once. Repeat calls to the function return the value of the first call.
 *
 * @example
 *
 * var calculateExpensiveNumber = function() { ... };
 * var expensiveNumber = once(calculateExpensiveNumber);
 *
 * var a = expensiveNumber() * 3.1415 + expensiveNumber();
 * // => exensiveNumber is actually invocing `calculateExpensiveNumber` only once
 *
 */
export default function once(callback) {
  var called = false, cache;
  return () => {
    if (!called) {
      cache = callback.apply(undefined, arguments);
      called = true;
    }
    return cache;
  };
};
