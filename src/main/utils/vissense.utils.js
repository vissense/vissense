/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
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
    function _viewport(element) {
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


    /********************************************************** element-position end */

    /********************************************************** element-styling */

    /**
    * element.offsetParent
    *
    * Firefox: null if element is hidden (style.display := "none")
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

    function _findEffectiveStyleProperty(element, property, computedStyleProvider) {
        if (element.style === undefined) {
            return; // not a styled element, e.g. document
        }
        var w =  computedStyleProvider || _window(element);
        var effectiveStyle =  w.getComputedStyle(element, null);
        return effectiveStyle && effectiveStyle.getPropertyValue(property);
    }

    function _isDisplayed(element) {
        var display = _findEffectiveStyleProperty(element, 'display', _window(element));
        if (display === 'none') {
            return false;
        }

        var visibility = _findEffectiveStyleProperty(element, 'visibility', _window(element));
        if (visibility === 'hidden' || visibility === 'collapse') {
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

        return true;
    }
    /********************************************************** element-styling end */

    /********************************************************** element visibility */

    function _isInViewport(rect, viewport) {
        if(!rect || (rect.width <= 0 || rect.height <= 0)) {
            return false;
        }
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < viewport.height &&
            rect.left < viewport.width;
    }

    function percentage(element) {
        if(!isPageVisible()) {
            return 0;
        }

        var rect = _getBoundingClientRect(element);
        var view = _viewport(element);

        if(!_isInViewport(rect, view) || !isVisibleByStyling(element)) {
           return 0;
        }

        var vh = 0; // visible height
        var vw = 0; // visible width

        if(rect.top >= 0) {
            vh = Math.min(rect.height, view.height - rect.top);
        } else if(rect.bottom > 0) {
            vh = Math.min(view.height, rect.bottom);
        } /* otherwise {
            this path cannot be taken otherwise element would not be in viewport
        } */

        if(rect.left >= 0) {
            vw = Math.min(rect.width, view.width - rect.left);
        } else if(rect.right > 0) {
            vw = Math.min(view.width, rect.right);
        } /* otherwise {
             this path cannot be taken otherwise element would not be in viewport
        } */

        // rect's height and width are greater than 0 because element is in viewport
        return (vh * vw) / (rect.height * rect.width);
    }

    /********************************************************** element visibility end */

    /********************************************************** page visibility - hard dependency to Visibilityjs*/
    var PageVisibilityAPIAvailable = Visibility && Visibility.change && Visibility.isSupported && Visibility.isSupported();

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
        isVisibleByStyling : isVisibleByStyling,

        _window : _window,

        _viewport : _viewport,
        _isInViewport : _isInViewport,

        _getBoundingClientRect : _getBoundingClientRect,
        _isDisplayed : _isDisplayed,
        _findEffectiveStyleProperty:_findEffectiveStyleProperty

    });


}.call(this, window, window.Visibility || null));