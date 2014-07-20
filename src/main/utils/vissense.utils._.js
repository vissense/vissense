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

  function extend(object, source, callback) {
    var index = -1,
        props = Object.keys(source),
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = callback ? callback(object[key], source[key], key, object, source) : source[key];
    }

    return object;
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

  function defaults(obj, source) {
    if (!isObject(obj)) {
        return source;
    }
    var keys = Object.keys(source);
    for (var i = 0, n = keys.length; i < n; i++) {
      var prop = keys[i];
      if (obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
    return obj;
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