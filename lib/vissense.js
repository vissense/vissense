/**
 * @license
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 ;(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() { return factory(root, root.document); });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(root, root.document);
    } else {
        // Browser globals
        root.VisSense = factory(root, root.document);
    }

}(this, function (window, document, undefined) {
    'use strict';

    /**
     * @doc function
     * @name VisSense.Utils:debounce
     *
     * @param {*} fn The function to debounce.
     * @param {*} delay The number of milliseconds to delay.

     * @returns {Number} Returns a function that delays invoking `fn` until after `delay` milliseconds
     * have elapsed since the last time it was invoked.
     * 
     * @description Returns a function that delays invoking `fn` until after `delay` milliseconds
     * have elapsed since the last time it was invoked.
     *
     * ```javascript
     * window.addEventListener('resize', VisSense.Utils.debounce(function() { 
     *   console.log('resizing...'); 
     * }, 50));
     * // => logs 'scrolling...' at most every 50ms while the user resizes the browser window
     * ```
     */
    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var self = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, args);
            }, delay);
        };
    }

    /**
     * @doc function
     * @name VisSense.Utils:defaults
     *
     * @param {Object} dest The destination object.
     * @param {Object} source The source object.
     *
     * @description Assigns all properties of the source object to the destination object
     * if they are not present in the destination object.
     * 
     * ```javascript
     * VisSense.Utils.defaults({ name: 'Max', gender: 'male' }, { name: 'Bradley', age: 31 });
     * // => { name: 'Max', gender: 'male', age: 31 }
     * ```
     */
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

    /**
     * @doc function
     * @name VisSense.Utils:defer
     *
     * @param {Function} callback The function to defer.
     *
     * @description Defers executing the func function until the current call stack has cleared.
     *
     * ```javascript
     * VisSense.Utils.defer(function() { console.log('Hello world.'); });
     * // => true
     * ```
     */
    function defer(callback) {
        return window.setTimeout(function() {
          callback();
        }, 0 /*1*/);
    }

    /**
     * @doc function
     * @name VisSense.Utils:fireIf
     *
     * @param {Function|Boolean} when A function or any other value
     * @param {*} callback A function to run if _when_ evaluates to a truthy value
     *
     * @returns {Function} Returns a function that runs the given callback only 
     * if _when_ evaluates to a truthy value.
     *
     * @description A function that when executed runs the given callback only 
     * if _when_ evaluates to a truthy value.
     *
     * ```javascript
     * var a = 6;
     * VisSense.Utils.fireIf(function() { return a % 2 === 0; }, function() {
     *   return a % 3 === 0;
     * })();
     * // => true
     * ```
     */
    function fireIf(when, callback) {
        return function() {
            return (isFunction(when) ? when() : when) ? callback() : undefined;
        };
    }

    /**
     * @doc function
     * @name VisSense.Utils:extend
     *
     * @param {Object} dest The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize assigning values.
     *
     * @description Overwrites all properties of the destination object with the source object's properties.
     * You can provide an optional callback function to modify the behaviour and/or to manipulate
     * the return value.
     * 
     * ```javascript
     * VisSense.Utils.extend({ name: 'Max', age: 31 }, { name: 'Bradley', gender: 'male' });
     * // => { name: 'Bradley', age: 31, gender: 'male' }
     *
     *
     * VisSense.Utils.extend({
     *   name: 'Max',
     *   age: 31
     * }, {
     *   name: 'Bradley',
     *   gender: 'male'
     * }, function(destValue, srcValue, key) {
     *   if(key === 'age') return destValue + 42;
     *   return srcValue;
     * });
     * // => { name: 'Bradley', age: 73, gender: 'male' }
     * ```
     */
    function extend(dest, source, callback) {
        var index = -1,
            props = Object.keys(source),
            length = props.length,
            ask = isFunction(callback);

        while (++index < length) {
            var key = props[index];
            dest[key] = ask ? callback(dest[key], source[key], key, dest, source) : source[key];
        }

        return dest;
    }

    /**
     * @doc function
     * @name VisSense.Utils:identity
     *
     * @param {*} value Any value
     *
     * @returns {*} The given value.
     *
     * @description This method returns the first argument provided to it.
     *
     * ```javascript
     * var object = { 'name': 'Bradley' };
     * VisSense.Utils.identity(object) === object;
     * // => true
     * ```
     */
    function identity(value) {
        return value;
    }
    
    /**
     * @doc function
     * @name VisSense.Utils:isDefined
     *
     * @param {*} value Any value
     *
     * @description Checks if value is *not* undefined
     *
     * ```javascript
     * VisSense.Utils.isDefined(undefined) === false;
     * // => true
     * ```
     */
    function isDefined(value) {
        return value !== undefined;
    }

    /**
     * .
     * @doc function
     * @name VisSense.Utils:isArray
     *
     * @param {*} value The value to check.
     *
     * @returns {boolean} Returns `true` if `value` is an `Array`, else `false`.
     *
     * @description Checks if `value` is classified as an `Array` object
     *
     * ```javascript
     * VisSense.Utils.isArray([1, 2, 3]);
     * // => true
     *
     * (function() { return VisSense.Utils.isArray(arguments); })();
     * // => false
     * ```
     * From lodash: [isArray](https://lodash.com/docs#isArray)
     */
    function isArray(value) {
        return (value && typeof value === 'object' && typeof value.length === 'number' &&
            Object.prototype.toString.call(value) === '[object Array]') || false;
    }

     /**
     * @doc function
     * @name VisSense.Utils:isElement
     *
     * @param {*} value The value to check.
     *
     * @returns {boolean} Returns true if the given value is a DOM Element, else false.
     *
     * @description Checks if `value` is a DOM Element.
     *
     * ```javascript
     * var elem = document.getElementById('myElement')
     * VisSense.Utils.isElement(elem);
     * // => true
     *
     * VisSense.Utils.isElement(document);
     * // => false
     *
     * VisSense.Utils.isElement(document.body);
     * // => true
     * ```
     */
    function isElement(value) {
        return value && value.nodeType === 1 || false;
    }

    /**
     * @doc function
     * @name VisSense.Utils:isFunction
     *
     * @param {*} value The value to check.
     *
     * @returns {boolean} Returns true if the value is a function, else false.
     *
     * @description Checks if `value` is classified as a `Function` object.
     *
     * ```javascript
     * VisSense.Utils.isFunction(VisSense);
     * // => true
     *
     * VisSense.Utils.isFunction(/abc/);
     * // => false
     * ```
     * From lodash: [isFunction](https://lodash.com/docs#isFunction)
     */
    function isFunction(value) {
        return typeof value === 'function' || false;
    }

    /**
     * @doc function
     * @name VisSense.Utils:isObject
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     *
     * @description Checks if `value` is the language type of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * ```javascript
     * VisSense.Utils.isObject({});
     * // => true
     *
     * VisSense.Utils.isObject([1, 2, 3]);
     * // => true
     *
     * VisSense.Utils.isObject(1);
     * // => false
     * ```
     *
     * From lodash: [isObject](https://lodash.com/docs#isObject)
     */
    function isObject(value) {
        var type = typeof value;
        return (type === 'function' || (value && type === 'object')) || false;
    }

    /**
     * @doc function
     * @name VisSense.Utils:noop
     *
     * @description A no-operation function.
     *
     * ```javascript
     * var object = { 'name': 'Bradley' };
     * VisSense.Utils.noop(object) === undefined;
     * // => true
     * ```
     */
    function noop() {
    }

    /**
     * @doc function
     * @name VisSense.Utils:now
     *
     * @returns {Number} Returns milliseconds since the Unix epoch.
     * 
     * @description Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * ```javascript
     * var start = VisSense.Utils.now();
     * VisSense.Utils.defer(function() { console.log(VisSense.Utils.now() - start); });
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     * ```
     */
    function now() {
        return new Date().getTime();
    }

    /********************************************************** element-position */

    /**
     * @private function
     * @name VisSense.Utils:_viewport
     *
     * @returns {Object} Returns the viewport size.
     * 
     * @description Gets the current viewport size of the browser window.
     *
     * ```javascript
     * VisSense.Utils._viewport();
     * // => e.g. { height: 1280, width: 790 }
     * ```
     */
    function viewport() {
        return {
            height: window.innerHeight,
            width: window.innerWidth
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
    function isVisibleByOffsetParentCheck(element, computedStyle) {
        if (!element.offsetParent) {
            var position = styleProperty(computedStyle, 'position');
            if (position !== 'fixed') {
                return false;
            }
        }
        return true;
    }

    /**
     * @private function
     * @name VisSense.Utils:_computedStyle
     *
     * @param {DOMElement} element A DOM element
     *
     * @returns {CSSStyleDeclaration} Returns the elements computed style.
     *
     * @description Returns the elements computed style.
     * This function solely exists for the check to the ´style´ property before
     * invoking the expensive function getComputedStyle.
     *
     * ```javascript
     * var element = document.getElementById('myElement');
     * VisSense.Utils._computedStyle(element);
     * // => CSSStyleDeclaration {parentRule: null, length: 0, cssText: "", alignContent: "", alignItems: "", ... }
     * ```
     */
    function computedStyle(element) {
        if (!isDefined(element.style)) {
            return null; // not a styled element, e.g. document
        }
        return window.getComputedStyle(element, null);
    }

    /**
     * @private function
     * @name VisSense.Utils:_styleProperty
     *
     * @param {CSSStyleDeclaration} style A style of an element
     * @param {String} property A name of the property to fetch
     *
     * @returns {*} Returns the value of the property or undefined if style is not thruthy.
     *
     * @description Returns the elements computed style property by name.
     * This function solely exists for caching reasons.
     *
     * ```javascript
     * var element = document.getElementById('myElement');
     * var style = VisSense.Utils._computedStyle(element);
     * VisSense.Utils._styleProperty(style, 'display');
     * // => 'block'
     * ```
     */
    function styleProperty(style, property) {
        return style ? style.getPropertyValue(property) : undefined;
    }

    /**
     * @private function
     * @name VisSense.Utils:_isDisplayed
     *
     * @param {DOMElement} element A DOM element
     * @param {CSSStyleDeclaration} [style] the elements style
     *
     * @returns {Boolean} Return true if the element is visible by its
     *                    style and by the style of its parents.
     *
     * @description A recursive function that checks if the element is visible by its
     * style and by the style of its parents. It does so by checking the values
     * of ´display´ and ´visibility´ as well as calling ´isVisibleByOffsetParentCheck´.
     * There is an optional style parameter which can be provided if you already
     * have computed the style of the element.
     * *NOTE:* This function calls window.getComputedStyle which is very expensive!
     *
     * @see http://jsperf.com/getcomputedstyle-vs-style-vs-css/2
     *
     * ```javascript
     * var element = document.getElementById('myElement');
     * var style =
     * VisSense.Utils._isDisplayed(element);
     * // => true
     * ```
     */
    function isDisplayed(element, style) {
        if (!style) {
            style = computedStyle(element);
            if (!style) {
                return false;
            }
        }

        var display = styleProperty(style, 'display');
        if (display === 'none') {
            return false;
        }

        var visibility = styleProperty(style, 'visibility');
        if (visibility === 'hidden' || visibility === 'collapse') {
            return false;
        }

        if (element.parentNode && element.parentNode.style) {
            return isDisplayed(element.parentNode, computedStyle(element));
        }

        return true;
    }

    /**
     * @doc function
     * @name VisSense.Utils:isVisibleByStyling
     *
     * @param {DOMElement} element A DOM element
     *
     * @returns {Boolean} True if the element is visible by style and the style of its parents.
     *
     * @description Checks if the element is visible by its style.
     *
     * ```javascript
     * var element = document.getElementById('myElement');
     * VisSense.Utils.isVisibleByStyling(element);
     * // => true
     * ```
     */
    function isVisibleByStyling(element) {
        if (element ===  document) {
            return true;
        }

        if (!element || !element.parentNode){
            return false;
        }

        var style = computedStyle(element);
        var displayed = isDisplayed(element, style);
        if (displayed !== true) {
            return false;
        }

        if (!isVisibleByOffsetParentCheck(element, style)) {
            return false;
        }

        return true;
    }
    /********************************************************** element-styling end */

    /********************************************************** element visibility */

    /**
     * @private function
     * @name VisSense.Utils:_isInViewport
     *
     * @param {Object} rect An object representing a rectangle with properties ´bottom´, ´top´, ´left´
     *                 and ´right´ relative to the viewport.
     * @param {Object} viewport An object representing the viewport with properties ´height´ and ´width´.
     *
     * @returns {Boolean} Returns true of the provided rectangle is in the given viewport otherwise false.
     *
     * @description Just checks if the provided rectangle is in the given viewport.
     * The function solely exists for the fact that "All calls to get any calculated
     * dimension from the DOM should be cached or avoided".
     *
     * @see http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
     *
     * ```javascript
     * var rect = element.getBoundingClientRect();
     * var view = VisSense.Utils.viewport();
     * VisSense.Utils._isInViewport(rect, viewport);
     * // => true
     * ```
     */
    function isInViewport(rect, viewport) {
        if (!rect || (rect.width <= 0 || rect.height <= 0)) {
            return false;
        }
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < viewport.height &&
            rect.left < viewport.width;
    }

    /**
     * @doc function
     * @name VisSense.Utils:percentage
     *
     * @param {DOMElement} element A DOM element.
     *
     * @returns {Boolean} Returns true if the current tab is in the foreground otherwise false.
     *
     * @description This method determines the visibility of the current tab and returns true
     * if it is the foreground. If the browser does not communicate the state via
     * ´document.hidden´ (or vendor specific derivatives) it will always return true.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
     *
     * ```javascript
     * var start = VisSense.Utils.now();
     * VisSense.Utils.defer(function() { console.log(VisSense.Utils.now() - start); });
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     * ```
     */
    function percentage(element) {
        if (!isPageVisible()) {
            return 0;
        }

        var rect = element.getBoundingClientRect();
        var view = viewport();

        if (!isInViewport(rect, view) || !isVisibleByStyling(element)) {
           return 0;
        }

        var vh = 0; // visible height
        var vw = 0; // visible width

        if (rect.top >= 0) {
            vh = Math.min(rect.height, view.height - rect.top);
        } else if (rect.bottom > 0) {
            vh = Math.min(view.height, rect.bottom);
        } /* otherwise {
            this path cannot be taken otherwise element would not be in viewport
        } */

        if (rect.left >= 0) {
            vw = Math.min(rect.width, view.width - rect.left);
        } else if (rect.right > 0) {
            vw = Math.min(view.width, rect.right);
        } /* otherwise {
             this path cannot be taken otherwise element would not be in viewport
        } */

        // rect's height and width are greater than 0 because element is in viewport
        return Math.round( (vh * vw) / (rect.height * rect.width) * 1000) / 1000;
    }

    /********************************************************** element visibility end */

    /********************************************************** page visibility */
    var VisibilityApi = (function(undefined) {
        var event = 'visibilitychange';
        var dict = [
            ['hidden', event],
            ['mozHidden', 'moz' + event],
            ['webkitHidden', 'webkit' + event],
            ['msHidden', 'ms' + event]
        ];

        for (var i = 0, n = dict.length; i < n; i++) {
            if (document[dict[i][0]] !== undefined) {
                return dict[i];
            }
        }
    })();

    /**
     * @doc function
     * @name VisSense.Utils:isPageVisible
     *
     * @returns {Boolean} Returns true if the current tab is in the foreground otherwise false.
     *
     * @description This method determines the visibility of the current tab and returns true
     * if it is the foreground. If the browser does not communicate the state via
     * ´document.hidden´ (or vendor specific derivatives) it will always return true.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
     *
     * ```javascript
     * VisSense.Utils.isPageVisible();
     * // => true
     * ```
     */
    function isPageVisible() {
        return VisibilityApi ? !document[VisibilityApi[0]] : true;
    }

    /********************************************************** page visibility end */

    /**
     * @doc interface
     * @name VisSense
     *
     * @property {DOMElement} _element the DOM element
     * @property {Object} _config the configuration object
     *
     * @description Creates a `VisSense` object which wraps the given element to enable
     * visibility operations.
     *
     *
     * ```javascript
     * var element = document.getElementById('myElement');
     * var vis = VisSense(element); // or new VisSense(element)
     *
     * vis.isVisible();
     * // => true
     *
     * vis.percentage();
     * // => 0.93
     * ```
     */
    function VisSense(element, config) {
        if (!(this instanceof VisSense)) {
            return new VisSense(element, config);
        }

        if (!isElement(element)) {
            throw new Error('not an element node');
        }

        this._element = element;
        this._config = defaults(config, {
            fullyvisible : 1,
            hidden: 0
        });
    }

    /**
     * @doc method
     * @name VisSense:state
     *
     * @returns {Object} a state object
     *
     * @description returns an object representing the current state.
     *
     * ```javascript
     * var visElement = VisSense(element);
     * visElement.state();
     * // => {
     *    code: 1,
     *    state: 'visible',
     *    percentage: 0.33,
     *    fullyvisible: false,
     *    visible: true,
     *    hidden: false,
     *    previous: {}
     *  }
     * ```
     */
    VisSense.prototype.state = function() {
      var perc = percentage(this._element);
        if (perc <= this._config.hidden) {
          return VisSense.VisState.hidden(perc);
        }
        else if (perc >= this._config.fullyvisible) {
          return VisSense.VisState.fullyvisible(perc);
        }

        return VisSense.VisState.visible(perc);
    };

    /**
     * @doc method
     * @name VisSense:percentage
     *
     * @returns {Number} the currently visible area of the element
     *
     * @description the currently visible area of the element in percent (0..1)
     *
     *
     * ```javascript
     * var visElement = VisSense(element);
     *
     *
     * visElement.precentage();
     * // => 0.33
     * ```
     */
    VisSense.prototype.percentage = function() {
      return this.state().percentage;
    };

    /**
     * @doc method
     * @name VisSense:isFullyVisible
     *
     * @returns {Boolean} true if element is fully visible, otherwise false
     *
     * @description checks if the element is currently fully visible.
     *
     * ```javascript
     * var visElement = VisSense(element);
     *
     *
     * visElement.ifFullyVisible();
     * // => true
     * ```
     */
    VisSense.prototype.isFullyVisible = function() {
      return this.state().fullyvisible;
    };

    /**
     * @doc method
     * @name VisSense:isVisible
     *
     * @returns {Boolean} true if element is visible, otherwise false
     *
     * @description checks if the element is currently visible.
     *
     * ```javascript
     * var visElement = VisSense(element);
     *
     *
     * visElement.isVisible();
     * // => true
     * ```
     */
    VisSense.prototype.isVisible = function() {
      return this.state().visible;
    };

    /**
     * @doc method
     * @name VisSense:isHidden
     *
     * @returns {Boolean} true if element is hidden, otherwise false
     *
     * @description checks if the element is currently hidden.
     *
     * ```javascript
     * var visElement = VisSense(element);
     *
     *
     * visElement.isHidden();
     * // => false
     * ```
     */
    VisSense.prototype.isHidden = function() {
      return this.state().hidden;
    };

    VisSense.fn = VisSense.prototype;

    VisSense.of = function(element, config) {
        return new VisSense(element, config);
    };

    var STATES = {
        HIDDEN: [0, 'hidden'],
        VISIBLE: [1, 'visible'],
        FULLY_VISIBLE: [2, 'fullyvisible']
    };

    function newVisState(state, percentage, previous) {
        if (previous && previous) {
            delete previous.previous;
        }

        return (function(state, percentage, previous) {
            return {
               code: state[0],
               state: state[1],
               percentage: percentage,
               previous: previous,
               fullyvisible: state[0] ===  STATES.FULLY_VISIBLE[0],
               visible: state[0] ===  STATES.VISIBLE[0] || state[0] ===  STATES.FULLY_VISIBLE[0],
               hidden: state[0] ===  STATES.HIDDEN[0]
            };
        })(state, percentage, previous);
    }

    VisSense.VisState = {
        hidden: function(percentage, previous) {
            return newVisState(STATES.HIDDEN, percentage, previous || {});
        },
        visible:function(percentage, previous) {
            return newVisState(STATES.VISIBLE, percentage, previous || {});
        },
        fullyvisible: function(percentage, previous ) {
            return newVisState(STATES.FULLY_VISIBLE, percentage, previous || {});
        }
    };

    /**
    *
    * @param visobj
    * @param previousState
    */
    function nextState(visobj, currentState) {
        var newState = visobj.state();
        var percentage = newState.percentage;

        // check if nothing changed
        if (currentState && percentage === currentState.percentage && currentState.percentage === currentState.previous.percentage) {
          return currentState;
        }

        if (newState.hidden) {
          return VisSense.VisState.hidden(percentage, currentState);
        }
        else if (newState.fullyvisible) {
          return VisSense.VisState.fullyvisible(percentage, currentState);
        }

        // else element is visible
        return VisSense.VisState.visible(percentage, currentState);
    }

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        var keys = Object.keys(listeners);
        for (var i = 0, n = keys.length; i < n; i++) {
            listeners[i].call(context || window);
        }
    }
    /*--------------------------------------------------------------------------*/

    /**
     * @doc interface
     * @name VisSense.VisMon
     *
     * @property {VisSense} _visobj the VisSense instance
     * @property {Number} _lastListenerId the latest listener id
     * @property {VisState} _state the current state
     * @property {VisMon.Strategy} _strategy the strategy to use for observing the element
     *
     * @description Creates a `VisSense` object which wraps the given element to enable
     * visibility operations.
     *
     *
     * ```javascript
     * var visElement = VisSense(element);
     *
     * var visMon = VisSense.VisMon(visElement, {
     *   update: function() {
     *     console.log('updated.');
     *   }
     * });
     * ```
     * or:
     *
     * ```javascript
     * var visMon = VisSense(...).monitor({
     *   update: function() {
     *     console.log('updated.');
     *   }
     * }).start();
     * ```
     */
    function VisMon(visobj, inConfig) {
        var me = this;
        var config = defaults(inConfig, {
            strategy: new VisMon.Strategy.NoopStrategy()
        });
        var strategies = isArray(config.strategy) ? config.strategy : [config.strategy];

        me._strategy = new VisMon.Strategy.CompositeStrategy(strategies);
        me._visobj = visobj;
        me._lastListenerId = -1;
        me._state = {};
        me._listeners = {};

        me._events = ['update', 'hidden', 'visible', 'fullyvisible', 'percentagechange', 'visibilitychange'];
        for (var i = 0, n = me._events.length; i < n; i++) {
            if (config[me._events[i]]) {
                me.on(me._events[i], config[me._events[i]]);
            }
        }
    }

    VisMon.prototype.visobj = function() {
        return this._visobj;
    };

    /**
     * @doc method
     * @name VisSense.VisMon:state
     *
     * @returns {Object} a copy of the current state
     *
     * @description returns an object representing the current state.
     *
     *
     * ```javascript
     * var visMon = VisSense.VisMon(...);
     *
     *
     * visElement.state();
     * // => {
     *    code: 1,
     *    state: 'visible',
     *    percentage: 0.33,
     *    fullyvisible: false,
     *    visible: true,
     *    hidden: false,
     *    previous: { ... }
     *  }
     * ```
     */
    VisMon.prototype.state = function() {
        return this._state;
    };

    /**
     * @doc method
     * @name VisSense.VisMon:start
     *
     * @returns {VisMon} itself
     *
     * @description starts monitoring the provided element
     *
     * ```javascript
     * var visMon = VisSense.VisMon(..., {
     *   strategy: [
     *     new ViSense.VisMon.Strategy.EventStrategy(...)
     *     new ViSense.VisMon.Strategy.PollingStrategy(...)
     *   ]
     *});
     *
     * visElement.start();
     * ```
     */
    VisMon.prototype.start = function() {
        this._strategy.start(this);
        return this;
    };

    /**
     * @doc method
     * @name VisSense.VisMon:stop
     *
     * @returns {*} the return value of the strategies stop function
     *
     * @description stops monitoring the provided element
     *
     * ```javascript
     * var visMon = VisSense.VisMon(..., {
     *   strategy: [
     *     new ViSense.VisMon.Strategy.EventStrategy(...)
     *     new ViSense.VisMon.Strategy.PollingStrategy(...)
     *   ]
     * }).start();
     *
     * ...
     *
     * visElement.stop();
     * ```
     */
    VisMon.prototype.stop = function() {
        return this._strategy.stop(this);
    };

    /**
     * @doc method
     * @name VisSense.VisMon:use
     *
     * @returns {VisMon} itself
     *
     * @description changes the update strategy for observing the element
     *
     * ```javascript
     * var visMon = VisSense(...)
     *  .monitor(...)
     *  .start()
     *  .use(new VisSense.VisMon.Strategy.EventStrategy(...));
     * ```
     */
    VisMon.prototype.use = function(strategy) {
        this.stop();
        this._strategy = strategy;
        return this.start();
    };

    /**
     * @doc method
     * @name VisSense.VisMon:update
     *
     * @returns {undefined}
     *
     * @description changes the update strategy for observing the element
     *
     * ```javascript
     * var visMon = VisSense(...)
     *  .monitor(...)
     *  .start()
     *  .use(new VisSense.VisMon.Strategy.EventStrategy(...));
     * ```
     */
    VisMon.prototype.update = function() {
        // update state
        this._state = nextState(this._visobj, this._state);
        // notify listeners
        fireListeners(this._listeners, this);
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onUpdate
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires every time the objects ´update´ method is called.
     *
     * ```javascript
     * var visMon = VisSense.VisMon(...);
     *
     * visMon.onUpdate(function() {
     *   console.log('updated!');
     * });
     * ```
     */
    VisMon.prototype.onUpdate = function(callback) {
        if (!isFunction(callback)) {
            return -1;
        }
        this._lastListenerId += 1;
        this._listeners[this._lastListenerId] = callback.bind(undefined, this);
        return this._lastListenerId;
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onVisibilityChange
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires when visibility state changes
     *
     *
     * ```javascript
     * var visMon = VisSense.VisMon(...);
     *
     * visMon.onVisibilityChange(function() {
     *   console.log('visibility changed');
     * });
     * ```
     */
    VisMon.prototype.onVisibilityChange = function (callback) {
        var me = this;
        return this.onUpdate(function() {
            if (me._state.code !== me._state.previous.code) {
                callback(me);
            }
        });
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onPercentageChange
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires when visibility percentage changes
     *
     * By default this event does not occur when element is in state
     * 'HIDDEN' or 'FULLY_VISIBLE' but may be called multiple times if
     * element is in state `VISIBLE`.
     *
     *
     * ```javascript
     * var visMon = VisSense.VisMon(...);
     *
     * visMon.onPercentageChange(function() {
     *   console.log('percentage changed');
     * });
     * ```
     */
    VisMon.prototype.onPercentageChange = function (callback) {
        var me = this;
        return this.onUpdate(function() {
            var newValue = me._state.percentage;
            var oldValue = me._state.previous.percentage;
            if (newValue !== oldValue) {
                callback(newValue, oldValue, me);
            }
        });
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onVisible
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires when element becomes visible
     *
     * Fires when visibility changes and and state transits from:
     * HIDDEN => VISIBLE
     * HIDDEN => FULLY_VISIBLE
     * Fires NOT when state transits from:
     * VISIBLE => FULLY_VISIBLE or
     * FULLY_VISIBLE => VISIBLE
     *
     *
     * ```javascript
     * VisSense(document.getElementById('example1')).monitor().onVisible(function() {
     *   Animations.startAnimation();
     * });
     * ```
     */
    VisMon.prototype.onVisible = function (callback) {
        var me = this;
        return me.onVisibilityChange(fireIf(function() {
            return me._state.visible && !me._state.previous.visible;
        }, callback));
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onFullyVisible
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires when visibility changes and element becomes fully visible
     *
     * ```javascript
     * VisSense(document.getElementById('example1')).monitor().onFullyVisible(function() {
     *   Animations.startAnimation();
     * });
     * ```
     */
    VisMon.prototype.onFullyVisible = function (callback) {
        var me = this;
        return me.onVisibilityChange(fireIf(function() {
            return me._state.fullyvisible;
        }, callback));
    };

    /**
     * @doc method
     * @name VisSense.VisMon:onHidden
     *
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Fires when visibility changes and element becomes hidden
     *
     * ```javascript
     * VisSense(document.getElementById('example1')).monitor().onFullyVisible(function() {
     *   Animations.startAnimation();
     * });
     * ```
     */
    VisMon.prototype.onHidden = function (callback) {
        var me = this;

        return me.onVisibilityChange(fireIf(function() {
            return me._state.hidden;
        }, callback));
    };


    /**
     * @doc method
     * @name VisSense.VisMon:on
     *
     * @param {String} eventName The name of the event to bind the callback to
     * @param {Function} callback A callback function
     *
     * @returns {Function} A function when called will unregister the callback
     *
     * @description Binds a callback to specific event.
     * Valid events are:
     *  - ´update´
     *  - ´hidden´
     *  - ´visible´
     *  - ´fullyvisible´
     *  - ´percentagechange´
     *  - ´visibilitychange´
     *
     * ```javascript
     * var monitor = VisSense(...).monitor(...);
       monitor.on('fullyvisible', function() {
     *   Animations.startAnimation();
     * });
     *
     * monitor.on('percentagechange', function(newValue) {
     *   if(newValue < 0.8) {
     *     Animations.stopAnimation();
     *   }
     * });
     *
     * monitor.start();
     * ```
     */
    VisMon.prototype.on = function(eventName, callback) {
        var me = this;
        switch(eventName) {
            case 'update': return me.onUpdate(callback);
            case 'hidden': return me.onHidden(callback);
            case 'visible': return me.onVisible(callback);
            case 'fullyvisible': return me.onFullyVisible(callback);
            case 'percentagechange': return me.onPercentageChange(callback);
            case 'visibilitychange': return me.onVisibilityChange(callback);
        }

        return -1;
    };

    /********************************************************** strategies */

    VisMon.Strategy = function() {};

    VisMon.Strategy.prototype.start = function() {
        throw new Error('Strategy#start needs to be overridden.');
    };

    VisMon.Strategy.prototype.stop = function() {
        throw new Error('Strategy#stop needs to be overridden.');
    };

    VisMon.Strategy.NoopStrategy = function() {};

    VisMon.Strategy.NoopStrategy.prototype = Object.create(VisMon.Strategy.prototype);

    VisMon.Strategy.NoopStrategy.prototype.start = function(monitor) {
        monitor.update();
    };

    VisMon.Strategy.NoopStrategy.prototype.stop = function() {};

    /**
     * @doc interface
     * @name VisSense.VisMon.Strategy:CompositeStrategy
     *
     * @property {Array<VisMon.Strategy} _strategies A list of strategies
     *
     * @description A composite strategy to combine two or more strategies
     * Its a proxy that will call every strategies start() and stop() methods.
     *
     * ```javascript
     * var visMon = VisSense(...).monitor({
     *   strategy: new VisSense.VisMon.Strategy.CompositeStrategy([
     *      new VisSense.VisMon.Strategy.EventStrategy(...),
     *      new VisSense.VisMon.Strategy.PollingStrategy(...)
     *   ]),
     *   update: function() {
     *     console.log('updated.');
     *   }
     * }).start();
     * ```
     */
    VisMon.Strategy.CompositeStrategy = function(strategies) {
        this._strategies = isArray(strategies) ? strategies : [];
        this._started = false;
    };

    VisMon.Strategy.CompositeStrategy.prototype = Object.create(VisMon.Strategy.prototype);

    VisMon.Strategy.CompositeStrategy.prototype.start = function(monitor) {
       for (var i = 0, n = this._strategies.length; i < n; i++) {
            this._strategies[i].start(monitor);
       }
    };

    VisMon.Strategy.CompositeStrategy.prototype.stop = function(monitor) {
        for (var i = 0, n = this._strategies.length; i < n; i++) {
            this._strategies[i].stop(monitor);
        }
    };

    /**
     * @doc interface
     * @name VisSense.VisMon.Strategy:PollingStrategy
     *
     * @param {Object} config The config object
     * @property {Number} _config The internal config object
     *
     * @description A polling strategy that will periodically call
     * monitor.update().
     *
     * ```javascript
     * var visMon = VisSense(...).monitor({
     *   strategy: new VisSense.VisMon.Strategy.PollingStrategy({
     *     interval: 5000
     *   }),
     *   update: function() {
     *     console.log('updated.');
     *   }
     * });
     * ```
     */
    VisMon.Strategy.PollingStrategy = function(config) {
        this._config = defaults(config, {
            interval: 1000
        });
        this._started = false;
    };

    VisMon.Strategy.PollingStrategy.prototype = Object.create(VisMon.Strategy.prototype);

    VisMon.Strategy.PollingStrategy.prototype.start = function(monitor) {
        var me = this;

        if (!me._started) {
            me._update = function() {
                monitor.update();
            };
            addEventListener('visibilitychange', me._update);

            (function update() {
                monitor.update();
                me._timeoutId = setTimeout(update, me._config.interval);
            }());

            me._started = true;
        }

        return me._started;
    };

    VisMon.Strategy.PollingStrategy.prototype.stop = function() {
        var me = this;
        if (!me._started) {
            return false;
        }
        clearTimeout(me._timeoutId);
        removeEventListener('visibilitychange', me._update);

        me._started = false;

        return true;
    };

    /**
     * @doc interface
     * @name VisSense.VisMon.Strategy:EventStrategy
     *
     * @property {Object} _config An optional config object
     *
     * @description A strategy that registers listeners for events
     * that may change the content in the viewport.
     * - scroll
     * - resize
     * - visibilitychange
     *
     * ```javascript
     * var visMon = VisSense(...).monitor({
     *   strategy: new VisSense.VisMon.Strategy.EventStrategy({
     *      debounce: 100
     *   }),
     *   update: function() {
     *     console.log('updated.');
     *   }
     * }).start();
     * ```
     */
    VisMon.Strategy.EventStrategy = function(config) {
        this._config = defaults(config, {
            debounce: 30
        });
        this._started = false;
    };

    VisMon.Strategy.EventStrategy.prototype = Object.create(VisMon.Strategy.prototype);

    VisMon.Strategy.EventStrategy.prototype.start = function(monitor) {
        var me = this;
        if (!me._started) {
            me._update = debounce(function() {
                monitor.update();
            }, me._config.debounce);

            addEventListener('visibilitychange', me._update);
            addEventListener('scroll', me._update);
            addEventListener('resize', me._update);

            me._update();

            me._started = true;
        }

        return this._started;
    };

    VisMon.Strategy.EventStrategy.prototype.stop = function() {
        var me = this;
        if (!me._started) {
            return false;
        }
        removeEventListener('resize', me._update);
        removeEventListener('scroll', me._update);
        removeEventListener('visibilitychange', me._update);

        me._started = false;

        return true;
    };
    /********************************************************** strategies - end */

    VisSense.VisMon = VisMon;

    /**
     * @doc method
     * @name VisSense:monitor
     *
     * @param {Object} config A config object
     *
     * @description Creates a `VisMon` object to observe the element
     *
     * ```javascript
     * var visMon = VisSense(...).monitor({
     *   strategy: [new VisSense.VisMon.Strategy.EventStrategy(...)]
     *   update: function() {
     *     console.log('updated.');
     *   }
     * });
     * ```
     */
    VisSense.fn.monitor = function(config) {
        return new VisMon(this, config);
    };

    VisSense.Utils = {
        debounce: debounce,
        defaults: defaults,
        defer: defer,
        extend: extend,
        fireIf: fireIf,
        identity: identity,
        isArray: isArray,
        isDefined: isDefined,
        isElement: isElement,
        isFunction: isFunction,
        isObject: isObject,
        isPageVisible: isPageVisible,
        isVisibleByStyling: isVisibleByStyling,
        noop: noop,
        now: now,
        percentage: percentage,

        _viewport: viewport,
        _isInViewport: isInViewport,

        _isDisplayed: isDisplayed,

        _computedStyle: computedStyle,
        _styleProperty: styleProperty
    };

    return VisSense;
}));