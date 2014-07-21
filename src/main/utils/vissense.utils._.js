/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils, undefined) {
  'use strict';

  /*--------------------------------------------------------------------------*/

  function extend(dest, source, callback) {
    var index = -1,
        props = Object.keys(source),
        length = props.length;

    while (++index < length) {
      var key = props[index];
      dest[key] = callback ? callback(dest[key], source[key], key, dest, source) : source[key];
    }

    return dest;
  }

  function noop() {
  }

  function identity(i) {
    return i;
  }

  function now() {
      return new Date().getTime();
  }

  function defer(callback) {
      return window.setTimeout(function() {
          callback();
      }, 0 /*1*/);
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  function defaults(dest, source) {
    if (!isObject(dest)) {
        return source;
    }
    var keys = Object.keys(source);
    for (var i = 0, n = keys.length; i < n; i++) {
      var prop = keys[i];
      if (dest[prop] === void 0) {
        dest[prop] = source[prop];
      }
    }
    return dest;
  }

  VisSenseUtils = extend(VisSenseUtils, {
    noop:noop,
    identity:identity,
    isObject:isObject,
    defaults:defaults,
    extend:extend,
    now:now,
    defer:defer
  });

}(window, window.VisSenseUtils));