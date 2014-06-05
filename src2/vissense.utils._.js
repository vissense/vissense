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

  /** Used as a reference to the global object */
  var root = (typeof window === 'object' && window) || this;

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

  function noop() {}

  function now() {
      return new Date().getTime();
  }

  function defer(callback) {
      return root.setTimeout(function() {
          callback();
      }, 1);
  }

  VisSenseUtils = extend(VisSenseUtils, {
    noop:noop,
    extend:extend,
    now:now,
    defer:defer
  });

}.call(this, this, this.VisSenseUtils));