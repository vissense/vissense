/*! { "name": "vissense", "version": "0.1.0-rc1", "copyright": "(c) 2014 tbk" } */
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

;(function(window, Visibility, undefined) {
    'use strict';

    function _window(element) {
        var doc = element && element.ownerDocument;
        return doc ? doc.defaultView || doc.parentWindow : window;
    }

    /**
    * Returns a function that invokes callback only if call to when() is true
    */
    function fireIf(when, callback) {
        return function() {
            return when() ? callback() : undefined;
        };
    }

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

    /********************************************************** element-position */

    function _getBoundingClientRect(element) {
        var r = element.getBoundingClientRect();
        // height and width are not standard elements - so lets add them
        if(r.height === undefined || r.width === undefined) {
            // copying object because attributes cannot be added to 'r'
            return extend({
                height: element.clientHeight,
                width: element.clientWidth
            }, r);
        }
        return r;
    }

    /**
    * return the viewport (does *not* subtract scrollbar size)
    */
    function viewport(element) {
        var w = element ?   _window(element) : window;
        if(w.innerWidth === undefined) {
            return {
                height: w.document.documentElement.clientHeight,
                width: w.document.documentElement.clientWidth
            };
        }
        return {
            height: w.innerHeight,
            width: w.innerWidth
        };
    }

    function isFullyInViewport(element) {
        var r = _getBoundingClientRect(element);
        if(!r || (r.width <= 0 || r.height <= 0)) {
            return false;
        }
        var view = viewport(element);

        return r.top >= 0 &&
            r.left >= 0 &&
            r.bottom <= view.height &&
            r.right <= view.width;
    }

    function isInViewport(element) {
        var r = _getBoundingClientRect(element);
        if(!r || (r.width <= 0 || r.height <= 0)) {
            return false;
        }
        var view = viewport(element);
        return r.bottom > 0 &&
            r.right > 0 &&
            r.top < view.height &&
            r.left < view.width;
    }


    /********************************************************** element-position end */

    /********************************************************** element-styling */

    /**
    * element.offsetParent
    *
    * Firefox: null if element is hidden (style.distplay := "none")
    * Webkit: null if the element is hidden
    * or if the style.position of the element itself is set to "fixed".
    * Internet Explorer (9): null if the style.position of the element itself is set to "fixed".
    * (Having style.display := "none" does not affect this browser.)
    *
    * more info: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetParent
    */
    function _isVisibleByOffsetParentCheck(element) {
        if(!element.offsetParent) {
            var position = _findEffectiveStyleProperty(element, 'position');
            if(position !== 'fixed') {
                return false;
            }
        }
        return true;
    }

    function _findEffectiveStyle(element) {
        var w =  _window(element);

        if (element.style === undefined) {
            return; // not a styled element
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

        throw new Error('cannot determine effective stylesheet');
    }

    function _findEffectiveStyleProperty(element, property) {
        var effectiveStyle = _findEffectiveStyle(element);
        if(!effectiveStyle) {
            return;
        }
        var propertyValue = effectiveStyle[property];
        if (propertyValue === 'inherit' && element.parentNode.style) {
            return _findEffectiveStyleProperty(element.parentNode, property);
        }
        return propertyValue;
    }

    function _isDisplayed(element) {
        var display = _findEffectiveStyleProperty(element, 'display');
        if (display === 'none') {
            return false;
        }
        if (element.parentNode && element.parentNode.style) {
            return _isDisplayed(element.parentNode);
        }
        return true;
    }

    function isVisibleByStyling(element) {
        if (element ===  _window(element).document) {
            return true;
        }

        if (!element || !element.parentNode){
            return false;
        }

        if(!_isVisibleByOffsetParentCheck(element)) {
            return false;
        }

        var displayed = _isDisplayed(element);
        if(displayed !== true) {
            return false;
        }

        var visibility = _findEffectiveStyleProperty(element, 'visibility');
        if(visibility === 'hidden' || visibility === 'collapse') {
            return false;
        }

        return true;
    }
    /********************************************************** element-styling end */

    /********************************************************** element visibility */

    function percentage(element) {
        if(!isPageVisible() || !isInViewport(element) || !isVisibleByStyling(element)) {
            return 0;
        }
        // r's height and width are greater than 0 because element is in viewport
        var r =   _getBoundingClientRect(element);

        var vh = 0; // visible height
        var vw = 0; // visible width
        var view = viewport(element);

        if(r.top >= 0) {
            vh = Math.min(r.height, view.height - r.top);
        } else if(r.bottom > 0) {
            vh = Math.min(view.height, r.bottom);
        } /* otherwise {
            this path cannot be taken otherwise element would not be in viewport
        } */

        if(r.left >= 0) {
            vw = Math.min(r.width, view.width - r.left);
        } else if(r.right > 0) {
            vw = Math.min(view.width, r.right);
        } /* otherwise {
             this path cannot be taken otherwise element would not be in viewport
        } */

        var area = (vh * vw) / (r.height * r.width);

        return Math.max(area, 0);
    }

    function isFullyVisible(element) {
        return  isPageVisible() &&
            isFullyInViewport(element) &&
            isVisibleByStyling(element);
    }

    function isVisible(element) {
        return  isPageVisible() &&
            isInViewport(element) &&
            isVisibleByStyling(element);
    }

    function isHidden(element) {
        return !isVisible(element);
    }
    /********************************************************** element visibility end */

    /********************************************************** page visibility */
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
    /********************************************************** page visibility end */

    window.VisSenseUtils = extend({}, {
        _window : _window,
        fireIf: fireIf,

        noop:noop,
        identity:identity,
        isObject:isObject,
        defaults:defaults,
        extend:extend,
        now:now,
        defer:defer,

        isPageVisibilityAPIAvailable : isPageVisibilityAPIAvailable,
        isPageVisible : isPageVisible,
        onPageVisibilityChange : onPageVisibilityChange,

        percentage : percentage,
        isFullyVisible : isFullyVisible,
        isVisible : isVisible,
        isHidden : isHidden,

        viewport : viewport,
        isFullyInViewport : isFullyInViewport,
        isInViewport : isInViewport,

        _getBoundingClientRect : _getBoundingClientRect,
        _isDisplayed : _isDisplayed,
        _findEffectiveStyle : _findEffectiveStyle,
        isVisibleByStyling : isVisibleByStyling
    });


}.call(this, window, window.Visibility || null));
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
     * visElement.percentage();
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
            throw new Error('InvalidArgument: Not an element node');
        }

        this._element = element;
        this._config = config || {};
    }

    VisSense.prototype.percentage = function() {
      return VisSenseUtils.percentage(this._element);
    };

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

    /**
    * Returns a function that invokes callback only if element is hidden
    */
    VisSense.prototype.fireIfFullyVisible = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.isFullyVisible();
        }, callback);
    };

    /**
    * Returns a function that invokes callback only if element is hidden
    */
    VisSense.prototype.fireIfVisible = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.isVisible();
        }, callback);
    };

    /**
    * Returns a function that invokes callback only if element is hidden
    */
    VisSense.prototype.fireIfHidden = function (callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.isHidden();
        }, callback);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.getFullyVisibleThreshold = VisSenseUtils.noop;

    /*--------------------------------------------------------------------------*/

    VisSense.fn = VisSense.prototype;

    // export VisSense
    window.VisSense = VisSense;
    window.VisSense.version = '0.1.0-rc1';

}(window, Math, window.VisSenseUtils));