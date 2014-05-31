/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window) {
  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used as a reference to the global object */
  var root = (typeof window === 'object' && window) || this;

  var utils = root.VisSenseUtils = {};

  /*--------------------------------------------------------------------------*/
	// http://dustindiaz.com/rock-solid-addevent
	var EventCache = (function () {
		var listEvents = [];
		return {
			listEvents: listEvents,
			add: function (/*node, sEventName, fHandler*/) {
				listEvents.push(arguments);
			},
			flush: function () {
				var i, item;
				for (i = listEvents.length - 1; i >= 0; i = i - 1) {
					item = listEvents[i];
					if (item[0].removeEventListener) {
						item[0].removeEventListener(item[1], item[2], item[3]);
					}
					if (item[1].substring(0, 2) !== 'on') {
						item[1] = 'on' + item[1];
					}
					if (item[0].detachEvent) {
						item[0].detachEvent(item[1], item[2]);
					}
					item[0][item[1]] = null;
				}
			}
		};
	})();

	function addEvent(obj, type, fn) {
		var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
			EventCache.add(obj, type, fn);
		} else if (obj.attachEvent) {
			obj['e' + t + fn] = fn;
			obj[t + fn] = function () {
				obj['e' + t + fn](window.event);
			};
			obj.attachEvent('on' + t, obj[t + fn]);
			EventCache.add(obj, t, fn);
		} else {
			obj['on' + t] = obj['e' + t + fn];
		}
	};


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

    function now() {
        return new Date().getTime();
    }

    function defer(callback) {
        return root.setTimeout(function() {
            callback();
        }, 0);
    }


    utils.addEvent = addEvent;
    utils.extend = extend;
    utils.now = now;
    utils.defer = defer;

    addEvent(root, 'unload', EventCache.flush);

}.call(this, this));