/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, Visibility) {
    /** Used as a safe reference for `undefined` in pre ES5 environments */
    var undefined;

    /** Used as a reference to the global object */
    var root = (typeof window === 'object' && window) || this;

    /*--------------------------------------------------------------------------*/

    /*
    * taken from
    * http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
    */
    function extend(base, sub) {
      // Avoid instantiating the base class just to setup inheritance
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
      // for a polyfill
      // Also, do a recursive merge of two prototypes, so we don't overwrite
      // the existing prototype, but still maintain the inheritance chain
      // Thanks to @ccnokes
      var origProto = sub.prototype;
      sub.prototype = Object.create(base.prototype);
      for (var key in origProto)  {
         sub.prototype[key] = origProto[key];
      }
      // Remember the constructor property was set wrong, let's fix it
      sub.prototype.constructor = sub;
      // In ECMAScript5+ (all modern browsers), you can make the constructor property
      // non-enumerable if you define it like this instead
      Object.defineProperty(sub.prototype, 'constructor', {
        enumerable: false,
        value: sub
      });
    }
    function noop() {
    }

    function _window(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	}

    function now() {
        return new Date().getTime();
    }

    function defer(callback) {
        return root.setTimeout(function() {
            callback();
        }, 0);
    }

    function fireIf (when, callback) {
      return function () {
        if (when()) {
          return callback();
        }
      };
    }

    (function init(window, libName) {
        window[libName] = {
            now : now,
            noop : noop,
            defer : defer,
            extend : extend,
            window : _window,
            fireIf: fireIf
        };
    }(root, 'VisSenseUtils'));

}.call(this, this, this.Visibility));