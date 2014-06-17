/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
;(function (global) {
    "use strict";

    var lastId = -1;

    // Visibility.js allow you to know, that your web page is in the background
    // tab and thus not visible to the user. This library is wrap under
    // Page Visibility API. It fix problems with different vendor prefixes and
    // add high-level useful functions.
    var self = {

        // Call callback only when page become to visible for user or
        // call it now if page is visible now or Page Visibility API
        // doesn’t supported.
        //
        // Return false if API isn’t supported, true if page is already visible
        // or listener ID (you can use it in `unbind` method) if page isn’t
        // visible now.
        //
        //   Visibility.onVisible(function () {
        //       startIntroAnimation();
        //   });
        onVisible: function (callback) {
            var support = self.isSupported();
            if ( !support || !self.hidden() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( !self.hidden() ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Call callback when visibility will be changed. First argument for
        // callback will be original event object, second will be visibility
        // state name.
        //
        // Return listener ID to unbind listener by `unbind` method.
        //
        // If Page Visibility API doesn’t supported method will be return false
        // and callback never will be called.
        //
        //   Visibility.change(function(e, state) {
        //       Statistics.visibilityChange(state);
        //   });
        //
        // It is just proxy to `visibilitychange` event, but use vendor prefix.
        change: function (callback) {
            if ( !self.isSupported() ) {
                return false;
            }
            lastId += 1;
            var number = lastId;
            self._callbacks[number] = callback;
            self._listen();
            return number;
        },

        // Remove `change` listener by it ID.
        //
        //   var id = Visibility.change(function(e, state) {
        //       firstChangeCallback();
        //       Visibility.unbind(id);
        //   });
        unbind: function (id) {
            delete self._callbacks[id];
        },

        // Call `callback` in any state, expect “prerender”. If current state
        // is “prerender” it will wait until state will be changed.
        // If Page Visibility API doesn’t supported, it will call `callback`
        // immediately.
        //
        // Return false if API isn’t supported, true if page is already after
        // prerendering or listener ID (you can use it in `unbind` method)
        // if page is prerended now.
        //
        //   Visibility.afterPrerendering(function () {
        //       Statistics.countVisitor();
        //   });
        afterPrerendering: function (callback) {
            var support   = self.isSupported();
            var prerender = 'prerender';

            if ( !support || prerender != self.state() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( prerender != state ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Return true if page now isn’t visible to user.
        //
        //   if ( !Visibility.hidden() ) {
        //       VideoPlayer.play();
        //   }
        //
        // It is just proxy to `document.hidden`, but use vendor prefix.
        hidden: function () {
            return !!(self._doc.hidden || self._doc.webkitHidden);
        },

        // Return visibility state: 'visible', 'hidden' or 'prerender'.
        //
        //   if ( 'prerender' == Visibility.state() ) {
        //       Statistics.pageIsPrerendering();
        //   }
        //
        // Don’t use `Visibility.state()` to detect, is page visible, because
        // visibility states can extend in next API versions.
        // Use more simpler and general `Visibility.hidden()` for this cases.
        //
        // It is just proxy to `document.visibilityState`, but use
        // vendor prefix.
        state: function () {
            return self._doc.visibilityState       ||
                   self._doc.webkitVisibilityState ||
                   'visible';
        },

        // Return true if browser support Page Visibility API.
        //
        //   if ( Visibility.isSupported() ) {
        //       Statistics.startTrackingVisibility();
        //       Visibility.change(function(e, state)) {
        //           Statistics.trackVisibility(state);
        //       });
        //   }
        isSupported: function () {
            return !!(self._doc.visibilityState ||
                      self._doc.webkitVisibilityState);
        },

        // Link to document object to change it in tests.
        _doc: document || {},

        // Callbacks from `change` method, that wait visibility changes.
        _callbacks: { },

        // Listener for `visibilitychange` event.
        _change: function(event) {
            var state = self.state();

            for ( var i in self._callbacks ) {
                self._callbacks[i].call(self._doc, event, state);
            }
        },

        // Set listener for `visibilitychange` event.
        _listen: function () {
            if ( self._init ) {
                return;
            }

            var event = 'visibilitychange';
            if ( self._doc.webkitVisibilityState ) {
                event = 'webkit' + event;
            }

            var listener = function () {
                self._change.apply(self, arguments);
            };
            if ( self._doc.addEventListener ) {
                self._doc.addEventListener(event, listener);
            } else {
                self._doc.attachEvent(event, listener);
            }
            self._init = true;
        }

    };

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = self;
    } else {
        global.Visibility = self;
    }

})(this);

;(function(/*window*/) {
  'use strict';
    // @href https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    if (!Date.now) {
       Date.now = function now() {
         return new Date().getTime();
       };
    }

    // @href https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
      Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
          }

          var result = [], prop, i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }
          return result;
        };
      }());
    }

}.call(this, this));
;(function(window, undefined) {
  'use strict';

    function _window(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	}

    function fireIf (when, callback) {
      return function () {
        if (when()) {
          return callback();
        }
      };
    }

    window.VisSenseUtils = {
        _window : _window,
        fireIf: fireIf
    };

}.call(this, this));
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
      }, 1);
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  function defaults(obj, source) {
    if (!isObject(obj)) {
        return obj;
    }

    for (var prop in Object.keys(source)) {
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

}.call(this, this, this.VisSenseUtils));
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
    'use strict';
    /*--------------------------------------------------------------------------*/
    // http://dustindiaz.com/rock-solid-addevent
    var EventCache = (function () {
        var listEvents = [];
        var remove = function(i) {
            var item = listEvents[i];
            if(!!item[0] && !!item[1] && !!item[2]) {
                if (item[0].removeEventListener) {
                    item[0].removeEventListener(item[1], item[2], item[3]);
                } else if (item[0].detachEvent) {
                    item[0].detachEvent('on' + item[1], item[2]);
                    item[0][item[1]+item[2]] = null;
                    item[0]['e'+item[1]+item[2]] = null;
                }
            }
            return item;
        };
        return {
            listEvents: listEvents,
            add: function(/*node, sEventName, fHandler*/) {
                listEvents.push(arguments);
                return listEvents.length - 1;
            },
            remove: remove,
            flush: function() {
                var i;
                for (i = listEvents.length - 1; i >= 0; i = i - 1) {
                    remove(i);
                }
            }
        };
    })();

    function addEvent(obj, type, fn) {
        var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            return EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj['e' + t + fn] = fn;
            obj[t + fn] = function () {
                obj['e' + t + fn].call(obj, window.event);
            };
            obj.attachEvent('on' + t, obj[t + fn]);
            return EventCache.add(obj, t, fn);
        }
        return -1;
    }

    // flush all remaining events
    addEvent(window, 'unload', EventCache.flush);

    VisSenseUtils.addEvent = addEvent;

}.call(this, this, this.VisSenseUtils));
;(function(window, VisSenseUtils, Visibility) {
  'use strict';

    /*--------------------------------------------------------------------------*/
    var PageVisibilityAPIAvailable = !!Visibility && !!Visibility.change && !!Visibility.isSupported && Visibility.isSupported();

    function isPageVisibilityAPIAvailable() {
      return !!PageVisibilityAPIAvailable;
    }

    function isPageVisible() {
      return PageVisibilityAPIAvailable ? !Visibility.hidden() : true;
    }

    function onPageVisibilityChange(callback) {
        if(PageVisibilityAPIAvailable) {
            Visibility.change(callback);
        }
    }

    VisSenseUtils.isPageVisibilityAPIAvailable = isPageVisibilityAPIAvailable;
    VisSenseUtils.isPageVisible = isPageVisible;
    VisSenseUtils.onPageVisibilityChange = onPageVisibilityChange;

}.call(this, this, this.VisSenseUtils, this.Visibility));
/**
 * Exports following functions to VisSenseUtils
 *
 * findEffectiveStyle
 * findEffectiveStyleProperty
 * isDisplayed
 * isVisibleByStyling
 * isHiddenInputElement
 */
;(function(window, VisSenseUtils, undefined) {
  'use strict';
    function _isVisibleByOffsetParentCheck(element) {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetParent
        if(!element.offsetParent) {
            var position = findEffectiveStyleProperty(element, 'position');
            if(position !== 'fixed') {
                return false;
            }
        }
        return true;
    }

    function isHiddenInputElement(element) {
        if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
            return element.type && String(element.type).toLowerCase() === 'hidden';
        }
        return false;
    }

	function findEffectiveStyle(element) {
		var w = VisSenseUtils._window(element);

		if (typeof element.style === 'undefined') {
			return undefined; // not a styled element
		}
		if (w.getComputedStyle) {
			// DOM-Level-2-CSS
			return w.getComputedStyle(element, null);
		}
		if (element.currentStyle) {
			// non-standard IE alternative
			return element.currentStyle;
			// TODO: this won't really work in a general sense, as
			//   currentStyle is not identical to getComputedStyle()
			//   ... but it's good enough for "visibility"
		}

		throw new Error('cannot determine effective stylesheet in this browser');
	}

	function findEffectiveStyleProperty(element, property) {
		var effectiveStyle = findEffectiveStyle(element);
		if(!effectiveStyle) {
		    return undefined;
		}
		var propertyValue = effectiveStyle[property];
		if (propertyValue === 'inherit' && element.parentNode.style) {
			return findEffectiveStyleProperty(element.parentNode, property);
		}
		return propertyValue;
	}

	function isDisplayed(element) {
		var display = findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	}

    function isVisibleByStyling(element) {
        if (element === VisSenseUtils._window(element).document) {
            return true;
        }

        if (!element || !element.parentNode){
            return false;
        }

        if(!_isVisibleByOffsetParentCheck(element)) {
            return false;
        }

        var displayed = isDisplayed(element);
        if(displayed !== true) {
            return false;
        }

        var opacity = findEffectiveStyleProperty(element, 'opacity');
        if(+opacity < 0.01) {
            return false;
        }

        var visibility = findEffectiveStyleProperty(element, 'visibility');
        if(visibility === 'hidden' || visibility === 'collapse') {
            return false;
        }

        if(isHiddenInputElement(element)) {
            return false;
        }

        return true;
    }

    (function(target) {
        target.isHiddenInputElement = isHiddenInputElement;
        target.findEffectiveStyle = findEffectiveStyle;
        target.findEffectiveStyleProperty = findEffectiveStyleProperty;
        target.isDisplayed = isDisplayed;
        target.isVisibleByStyling = isVisibleByStyling;
    }(VisSenseUtils));
}.call(this, this, this.VisSenseUtils));
/**
 * Exports following functions to VisSenseUtils
 *
 * viewportHeight
 * viewportWidth
 * isFullyInViewport
 * isInViewport
 * _getBoundingClientRect
 */
;(function(window, VisSenseUtils) {
  'use strict';

	function _getBoundingClientRect(element) {
		var r = element.getBoundingClientRect();
		// height and width are not standard elements - so lets add them
		if(typeof r.height === 'undefined' || typeof r.width === 'undefined') {
			// copying object because attributes cannot be added to 'r'
			return {
				top: r.top,
				bottom: r.bottom,
				left: r.left,
				right: r.right,
				height: element.clientHeight,
				width: element.clientWidth
			};
		}
		return r;
	}

    function viewport(element) {
		var w = VisSenseUtils._window(element);
		return {
		    height: w.innerHeight || w.document.documentElement.clientHeight,
		    width: w.innerWidth || w.document.documentElement.clientWidth
		};
	}

	function isFullyInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);

		return (!!r &&
			r.top >= 0 &&
			r.left >= 0 &&
			r.bottom < view.height &&
			r.right < view.width
		);
	}

	function isInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);
		return ( !!r &&
			r.bottom > 0 &&
			r.right > 0 &&
			r.top < view.height &&
			r.left < view.width
		);
	}

    VisSenseUtils.viewport = viewport;
    VisSenseUtils.isFullyInViewport = isFullyInViewport;
    VisSenseUtils.isInViewport = isInViewport;
    VisSenseUtils._getBoundingClientRect = _getBoundingClientRect;

}.call(this, this, this.VisSenseUtils));
/*
 *
 * getVisibilityPercentage
 * isVisible
 * isFullyVisible
 * isHidden
 * fireIfHidden
 * fireIfFullyVisible
 * fireIfVisible
 */
;(function(window, Math, VisSenseUtils, undefined) {
  'use strict';

	function getVisibilityPercentage(element) {
		if(!VisSenseUtils.isInViewport(element) || !VisSenseUtils.isVisibleByStyling(element) || !VisSenseUtils.isPageVisible()) {
			return 0;
		}

		var r = VisSenseUtils._getBoundingClientRect(element);
		if(!r || r.height <= 0 || r.width <= 0) {
			return 0;
		}

		var vh = 0; // visible height
		var vw = 0; // visible width
		var viewport = VisSenseUtils.viewport(element);

		if(r.top >= 0) {
			vh = Math.min(r.height, viewport.height - r.top);
		} else if(r.top < 0 && r.bottom > 0) {
			vh = Math.min(viewport.height, r.bottom);
		}

		if(r.left >= 0) {
			vw = Math.min(r.width, viewport.width - r.left);
		} else if(r.left < 0 && r.right > 0) {
			vw = Math.min(viewport.width, r.right);
		}

		var area = (vh * vw) / (r.height * r.width);

		return Math.max(area, 0);
	}

	function isFullyVisible(element) {
		return VisSenseUtils.isPageVisible() &&
		VisSenseUtils.isFullyInViewport(element) &&
		VisSenseUtils.isVisibleByStyling(element);
	}

    function isVisible(element) {
        return VisSenseUtils.isPageVisible() &&
        VisSenseUtils.isInViewport(element) &&
        VisSenseUtils.isVisibleByStyling(element);
    }

    function isHidden(element) {
        return !isVisible(element);
    }

    /**
    * Returns a function that invokes callback only if element is fully visible
    */
    function fireIfFullyVisible(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isFullyVisible(element);
        }, callback);
    }

    /**
    * Returns a function that invokes callback only if element is visible
    */
    function fireIfVisible(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isVisible(element);
        }, callback);
    }

    /**
    * Returns a function that invokes callback only if element is hidden
    */
    function fireIfHidden(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isHidden(element);
        }, callback);
    }

    (function(target) {
        target.getVisibilityPercentage = getVisibilityPercentage;
        target.isFullyVisible = isFullyVisible;
        target.isVisible = isVisible;
        target.isHidden = isHidden;
        target.fireIfFullyVisible = fireIfFullyVisible;
        target.fireIfVisible = fireIfVisible;
        target.fireIfHidden = fireIfHidden;
    }(VisSenseUtils));

}.call(this, this, this.Math, this.VisSenseUtils));
;(function(window, VisSenseUtils, undefined) {
  'use strict';

    /**
     * An object used to flag environments features.
     */
    var support = (function(window, document) {
        /**
        * Detect IE version
        */
        function getIEVersion() {
          var v = 4, div = document.createElement('div');
          while (
            div.innerHTML = '<!--[if gt IE '+v+']><i></i><![endif]-->',
            div.getElementsByTagName('i')[0]
          ){
            v++;
          }
          return v > 4 ? v : undefined;
        }

        /**
         * Detect IE
         
        function isIE() {
          return !!getIEVersion();
        }*/

        /**
         * Detect if the DOM is supported.
         */
        function isDomPresent() {
          try {
           return document.createDocumentFragment().nodeType === 11;
          } catch(e) {}
          return false;
        }

        function canReadStyle() {
          try {
           return !!VisSenseUtils.findEffectiveStyle(document.getElementsByTagName('body')[0]);
          } catch(e) {}
          return false;
        }

        var support = {};
        support.MinIEVersion = 7;
        support.PageVisibilityAPIAvailable = VisSenseUtils.isPageVisibilityAPIAvailable();
        support.IEVersion = getIEVersion();
        support.DOMPresent = isDomPresent();
        support.CanReadStyle = canReadStyle();
        support.BrowserSupported = support.IEVersion >= support.MinIEVersion;

        support.compatible = support.DOMPresent && support.CanReadStyle && support.BrowserSupported;

        return support;
    }(window, window.document));

    VisSenseUtils.support = function() {
        return support;
    };

}.call(this, this, this.VisSenseUtils));
;(function(window, Math, VisSenseUtils, undefined) {
  'use strict';

    /**
     * Creates a `VisSense` object which wraps the given element to enable
     * visibility operations
     *
     * @example
     *
     * var visElement = VisSense(element);
     *
     * visElement.isVisible();
     * // => true
     *
     * visElement.getVisibilityPercentage();
     * // => 0.93
     *
     */
    function VisSense(element, config) {
        if (!(this instanceof VisSense)) {
            return new VisSense(element, config);
        }

        // currently only ELEMENT_NODEs are supported
        // see https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
        if ( !element || 1 !== element.nodeType ) {
            throw new Error('InvalidArgument: not an element node');
        }

        this._element = element;
        this._config = config || {};
    }

    /* @category Position -------------------------------------------------------*/

    VisSense.prototype.isInViewport = function() {
      return VisSenseUtils.isInViewport(this._element);
    };

    VisSense.prototype.isFullyInViewport = function() {
      return VisSenseUtils.isFullyInViewport(this._element);
    };

    VisSense.prototype.getVisibilityPercentage = function() {
      return VisSenseUtils.getVisibilityPercentage(this._element);
    };

    VisSense.prototype.viewport = function() {
      return VisSenseUtils.viewport(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.isDisplayed = function() {
      return VisSenseUtils.isDisplayed(this._element);
    };

    VisSense.prototype.isVisibleByStyling = function() {
      return VisSenseUtils.isVisibleByStyling(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.isFullyVisible = function() {
      return VisSenseUtils.isFullyVisible(this._element);
    };

    VisSense.prototype.isVisible = function() {
      return VisSenseUtils.isVisible(this._element);
    };

    VisSense.prototype.isHidden = function() {
      return VisSenseUtils.isHidden(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.fireIfFullyVisible = function(callback) {
      return VisSenseUtils.fireIfElementFullyVisible(this._element, callback);
    };

    VisSense.prototype.fireIfVisible = function(callback) {
      return VisSenseUtils.fireIfVisible(this._element, callback);
    };

    VisSense.prototype.fireIfHidden = function (callback) {
        return VisSenseUtils.fireIfHidden(this._element, callback);
    };

    /*--------------------------------------------------------------------------*/

	VisSense.prototype.getFullyVisibleThreshold = VisSenseUtils.noop;

  /*--------------------------------------------------------------------------*/

  // export VisSense
  window.VisSense = VisSense;

}.call(this, this, this.Math, this.VisSenseUtils));
/**
 * detects visibility changes of an element.
 *
 * example:
 * var elem = document.getElementById('myElement');
 * var visobj = VisSense(eleme):
 * var vismon = visobj.monitor();
 *
 * vismon.onVisibilityChange(function() { ... });
 * vismon.onVisibilityPercentageChange(function() { ... });
 * vismon.onVisible(function() { ... });
 * vismon.onFullyVisible(function() { ... });
 * vismon.onHidden(function() { ... });
 *
 *
 * hasVisibilityChanged() // => true
 * hasVisibilityPercentageChanged // => true
 *
 * fireIfVisibilityChanged(function() { ... });
 * fireIfVisibilityPercentageChanged(function() { ... });
 *
 */
;(function(window, Math, VisSense, VisSenseUtils, undefined) {
  'use strict';
    /*--------------------------------------------------------------------------*/

    var VisState = (function() {
        var STATES = {
            HIDDEN: 0,
            VISIBLE: 1,
            FULLY_VISIBLE: 2
        };

        function VisState(state) {
            this.isVisible = function() {
                return state ===  STATES.VISIBLE || this.isFullyVisible();
            };
            this.isFullyVisible = function() {
                return state ===  STATES.FULLY_VISIBLE;
            };
            this.isHidden = function() {
                return state ===  STATES.HIDDEN;
            };
            this.state = function() {
                return state;
            };
        }

        function withPrevious(visstate, prev) {
            if(!!prev) {
                // disable getting previous state from prev
                prev.prev = VisSenseUtils.noop;
            }

            visstate.wasVisible = function() {
                return !!prev && prev.isVisible();
            };

            visstate.wasFullyVisible = function() {
                return !!prev && prev.isFullyVisible();
            };

            visstate.wasHidden = function() {
                return !!prev && prev.isHidden();
            };

            visstate.hasVisibilityChanged = function() {
                return !prev || visstate.state() !== prev.state();
            };

            visstate.prev = function() {
                return prev;
            };

            return visstate;
        }

        function withPercentage(visstate, percentage) {
            visstate.hasVisibilityPercentageChanged = function() {
                return !this.prev() || percentage !== this.prev().percentage();
            };
            visstate.percentage = function() {
                return percentage;
            };
            return visstate;
        }

        function state(status, percentage, prev) {
            return withPrevious(withPercentage(new VisState(status), percentage), prev);
        }

        var exports = {};

        exports.hidden = function(percentage, prev) {
            return state(STATES.HIDDEN, percentage, prev || null);
        };

        exports.visible = function(percentage, prev) {
            return state(STATES.VISIBLE, percentage, prev || null);
        };
        exports.fullyvisible = function(percentage, prev) {
            return state(STATES.FULLY_VISIBLE, percentage, prev || null);
        };

        return exports;
    }());

    function nextState(visobj, visstate) {
        var percentage = visobj.getVisibilityPercentage();

        if(visobj.isHidden()) {
            return VisState.hidden(percentage, visstate);
        }
        else if (visobj.isFullyVisible()) {
             return VisState.fullyvisible(percentage, visstate);
        }
        else if (visobj.isVisible()) {
          return VisState.visible(percentage, visstate);
        }

        throw new Error('IllegalState');
    }

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            if(listeners.hasOwnProperty(i)) {
                listeners[i].call(context || window);
            }
        }
    }
    /*--------------------------------------------------------------------------*/


    function VisMon(visobj) {
        var me = this;

        var lastListenerId = -1;
        var _private = {
          status: null,
          listeners: []
        };

        // read-only access to VisSense instance
        me.visobj = function() {
            return visobj;
        };

        /**
        * read-only access to status
        */
        me.status = function() {
            return _private.status;
        };

        me.getVisibilityPercentage = function() {
            return me.status().percentage();
        };
        /**
        * read-only access to status
        */
        me.prev = function() {
            return me.status().prev();
        };

        // Adds a listener.
        //
        // var id = visobj.monitor().register(function() {
        //   doSomething();
        // });
        me.register = function(callback) {
            //var lastListenerId = lastListenerId + 1;
            //_private.listeners[lastListenerId] = callback;
            _private.listeners[++lastListenerId] = callback;
            return lastListenerId;
        };

        /**
        * expose update method
        */
        me.update = function() {
            _private.status = nextState(visobj, _private.status);

            // notify listeners
            fireListeners(_private.listeners, me);
        };
    }

    VisSense.monitor = function monitor(visobj, config) {
        return new VisMon(visobj, config || {});
    };

    VisSense.prototype.monitor = function(config) {
        return VisSense.monitor(this, config);
    };


    /**
    * Returns a function that invokes callback only
    * if the visibility state changes.
    *
    * shorthand for
    * if(visobj.hasVisibilityChanged()) {
    *   callback();
    * }
    * visobj.fireIfVisibilityChanged(callback)
    */
    VisMon.prototype.fireIfVisibilityChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityChanged();
        }, callback);
    };

    /**
    * Returns a function that invokes callback only
    * if visibility rate changes.
    * This does not occur when element is hidden but may
    * be called multiple times if element is in state
    * `VISIBLE` and (depending on the config) `FULLY_VISIBLE`
    */
    VisMon.prototype.fireIfVisibilityPercentageChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityPercentageChanged();
        }, callback);
    };

    /**
    * Fires when visibility state changes
    */
    VisMon.prototype.onVisibilityChange = function (callback) {
        return this.register(this.fireIfVisibilityChanged(callback));
    };

    /**
    * Fires when visibility percentage changes
    */
    VisMon.prototype.onVisibilityPercentageChange = function (callback) {
        return this.register(this.fireIfVisibilityPercentageChanged(callback));
    };

    /**
    * Fires when visibility changes and and state transits from:
    * HIDDEN => VISIBLE
    * HIDDEN => FULLY_VISIBLE
    * Fires NOT when state transits from:
    * VISIBLE => FULLY_VISIBLE or
    * FULLY_VISIBLE => VISIBLE
    *
    * VisSense(document.getElementById('example1')).monitor().onVisible(function() {
    *   Animations.startAnimation();
    * });
    */
    VisMon.prototype.onVisible = function (callback) {
        var me = this;

        var fireIfVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isVisible();
        }, callback);

        // only fire when coming from state hidden or no previous state is present
        var handler = this.fireIfVisibilityChanged(VisSenseUtils.fireIf(function() {
            return !me.status().prev() || me.status().wasHidden();
        }, fireIfVisible));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var me = this;
        var fireIfFullyVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isFullyVisible();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfFullyVisible);
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var me = this;

        var fireIfHidden =  VisSenseUtils.fireIf(function() {
            return me.status().isHidden();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfHidden);
        return this.register(handler);
    };

    VisMon.prototype.on = function(eventName, handler) {
        var emitEvents = {
            'hidden' : this.onHidden,
            'visible' : this.onVisible,
            'fullyvisible' : this.onFullyVisible,
            'percentagechange' : this.onVisibilityPercentageChange,
            'visibilitychange' : this.onVisibilityChange
        };

        if(!emitEvents[eventName]) {
            throw new Error('VisMon: Event "'+ eventName +'" is not supported');
        }

        return emitEvents[eventName](handler);
    };

}.call(this, this, this.Math, this.VisSense, this.VisSenseUtils));