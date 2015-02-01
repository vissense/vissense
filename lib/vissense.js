/**
 * @license MIT
 *
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */

'use strict';

/**
 * An object representing the current browser viewport.
 *
 * @typedef Viewport
 * @type {Object}
 * @property {number} width - width of the viewport.
 * @property {number} height - height of the viewport.
 */

/**
 * An object representing a rectangle with properties
 * ´top´, ´right´, ´bottom´ and ´left´ relative to the viewport.
 *
 * @typedef Viewable
 * @type {Object}
 * @property {number} top - The distance to the browsers top border.
 * @property {number} right - The distance to the browsers right border.
 * @property {number} bottom - The distance to the browsers bottom border.
 * @property {number} left - The distance to the browsers left border.
 */


/**
 * @function
 * @name debounce
 * @memberof VisSense.Utils
 *
 * @param {function} callback The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 *
 * @returns {function} Returns a function that delays invoking `callback`
 *
 * @description Returns a function that delays invoking `callback` until after
 * `delay` milliseconds have elapsed since the last time it was invoked.
 *
 * @example
 *
 * window.addEventListener('resize', VisSense.Utils.debounce(function() {
 *   console.log('resizing');
 * }, 50));
 * // => logs 'resizing' at most every 50ms while resizing the browser window
 *
 */
function debounce(callback, delay) {
  var timer = null;
  return function () {
    var self = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(self, args);
    }, delay);
  };
}

/**
 * @function
 * @name defaults
 * @memberof VisSense.Utils
 *
 * @param {Object} dest The destination object.
 * @param {Object} source The source object.
 *
 * @returns {Object}
 *
 * @description Assigns all properties of the source object to the destination
 * object if they are not present in the destination object.
 *
 * @example
 *
 * VisSense.Utils.defaults({
 *   name: 'Max',
 *   gender: 'male'
 * }, {
 *   name: 'Bradley',
 *   age: 31
 * });
 * // => { name: 'Max', gender: 'male', age: 31 }
 *
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
 * @function
 * @name defer
 * @memberof VisSense.Utils
 *
 * @param {function} callback The function to defer.
 *
 * @description Defers executing the func function until the current call
 * stack has cleared.
 *
 * @example
 *
 * VisSense.Utils.defer(function() { console.log('Hello world.'); });
 * // => true
 *
 */
function defer(callback) {
  return window.setTimeout(function () {
    callback();
  }, 0);
}

/**
 * @function
 * @name fireIf
 * @memberof VisSense.Utils
 *
 * @param {function|*} when A function or any other value.
 * @param {function} callback A callback function to run if `when` evaluates
 * to a truthy value.
 *
 * @returns {function} Returns a function that runs the given callback function
 * only if `when` evaluates to a truthy value.
 *
 * @description Returns a function that when executed runs the given callback
 * function only if `when` evaluates to a truthy value.
 *
 * @example
 *
 * var a = 6;
 * VisSense.Utils.fireIf(function() { return a % 2 === 0; }, function() {
 *   return a % 3 === 0;
 * })();
 * // => true
 *
 */
function fireIf(when, callback) {
  return function () {
    return (isFunction(when) ? when() : when) ? callback() : undefined;
  };
}

/**
 * This callback lets you intercept the assignment of
 * individual properties. The return value will be assigned
 * to the `destKey` property of the `dest` object.
 * If this callback is not provided `sourceValue` will be assigned.
 *
 * @callback extendCallback
 * @memberof VisSense.Utils
 *
 * @param {*} destValue The destination value that will be replaced.
 * @param {*} sourceValue The source value than will replace the destination
 * value.
 * @param {*} destKey The destination key.
 * @param {*} sourceKey The source key.
 * @param {*} dest The given destination.
 * @param {*} source The given source.
 */

/**
 * @function
 * @name extend
 * @memberof VisSense.Utils
 *
 * @param {Object} dest The destination object.
 * @param {Object} source The source object.
 * @param {VisSense.Utils.extendCallback} [callback] The function to customize assigning
 * values.
 *
 * @returns {Object}
 *
 * @description Overwrites all properties of the destination object with the
 * source object's properties. You can provide an optional callback function
 * to modify the behaviour and/or to manipulate the return value.
 *
 * @example
 *
 * VisSense.Utils.extend({
 *   name: 'Max',
 *   age: 31
*   }, {
 *   name: 'Bradley',
 *   gender: 'male'
 * });
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
 *
 */
function extend(dest, source, callback) {
  var index = -1,
    props = Object.keys(source),
    length = props.length,
    ask = isFunction(callback);

  while (++index < length) {
    var key = props[index];
    dest[key] = ask ?
      callback(dest[key], source[key], key, dest, source) : source[key];
  }

  return dest;
}

/**
 * @function
 * @name identity
 * @memberof VisSense.Utils
 *
 * @param {*} value Any value.
 *
 * @returns {*} The given value.
 *
 * @description This function returns the first argument provided to it.
 *
 * @example
 *
 * var object = { 'name': 'Bradley' };
 * VisSense.Utils.identity(object) === object;
 * // => true
 *
 */
function identity(value) {
  return value;
}

/**
 * @function
 * @name isDefined
 * @memberof VisSense.Utils
 *
 * @param {*} value Any value.
 * @returns {boolean} `true` if the given value is undefined, otherwise `false`.
 *
 * @description Checks if the given value is undefined
 *
 * @example
 *
 * VisSense.Utils.isDefined(undefined) === false;
 * // => true
 *
 */
function isDefined(value) {
  return value !== undefined;
}

/**
 * @function
 * @name isArray
 * @memberof VisSense.Utils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if `value` is an `Array`, otherwise `false`.
 *
 * @description Checks if `value` is classified as an `Array` object
 *
 * @example
 *
 * VisSense.Utils.isArray([1, 2, 3]);
 * // => true
 *
 * (function() { return VisSense.Utils.isArray(arguments); })();
 * // => false
 *
 * From lodash: [isArray](https://lodash.com/docs#isArray)
 */
function isArray(value) {
  return (value &&
    typeof value === 'object' && typeof value.length === 'number' &&
    Object.prototype.toString.call(value) === '[object Array]') || false;
}

/**
 * @function
 * @name isElement
 * @memberof VisSense.Utils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if the given value is a DOM Element,
 * otherwise `false`.
 *
 * @description Checks if `value` is a DOM Element.
 *
 * @example
 *
 * var elem = document.getElementById('myElement')
 * VisSense.Utils.isElement(elem);
 * // => true
 *
 * VisSense.Utils.isElement(document);
 * // => false
 *
 * VisSense.Utils.isElement(document.body);
 * // => true
 *
 */
function isElement(value) {
  return value && value.nodeType === 1 || false;
}

/**
 * @function
 * @name isFunction
 * @memberof VisSense.Utils
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 *
 * @description Checks if `value` is classified as a `function` object.
 *
 * @example
 *
 * VisSense.Utils.isFunction(VisSense);
 * // => true
 *
 * VisSense.Utils.isFunction(/abc/);
 * // => false
 *
 * From lodash: [isFunction](https://lodash.com/docs#isFunction)
 */
function isFunction(value) {
  return typeof value === 'function' || false;
}

/**
 * @function
 * @name isObject
 * @memberof VisSense.Utils
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, otherwise `false`.
 *
 * @description Checks if `value` is the language type of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and
 * `new String('')`)
 *
 * @example
 *
 * VisSense.Utils.isObject({});
 * // => true
 *
 * VisSense.Utils.isObject([1, 2, 3]);
 * // => true
 *
 * VisSense.Utils.isObject(1);
 * // => false
 *
 *
 * From lodash: [isObject](https://lodash.com/docs#isObject)
 */
function isObject(value) {
  var type = typeof value;
  return (type === 'function' || (value && type === 'object')) || false;
}

/**
 * @function
 * @name noop
 * @memberof VisSense.Utils
 *
 * @returns undefined
 *
 * @description A no-operation function.
 *
 * @example
 *
 * var object = { 'name': 'Bradley' };
 * VisSense.Utils.noop(object) === undefined;
 * // => true
 *
 */
function noop() {
}

/**
 * @function
 * @name now
 * @memberof VisSense.Utils
 *
 * @returns {number} Returns milliseconds since the Unix epoch.
 *
 * @description Gets the number of milliseconds that have elapsed since the
 * Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @example
 *
 * var start = VisSense.Utils.now();
 * VisSense.Utils.defer(function() {
 *   console.log(VisSense.Utils.now() - start);
 * });
 * // => logs the time it took for the deferred function to be invoked
 *
 */
function now() {
  return new Date().getTime();
}

/********************************************************** element-position */

/**
 * @private
 * @function
 * @name viewport
 * @memberof VisSense.Utils
 *
 * @returns {Viewport} The current viewport size.
 *
 * @description Gets the current viewport size of the browser window.
 *
 * @example
 *
 * VisSense.Utils._viewport();
 * // => e.g. { height: 1280, width: 790 }
 *
 */
function viewport() {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
}
/****************************************************** element-position end */

/*********************************************************** element-styling */

/**
 * @private
 * @function
 * @name computedStyle
 * @memberof VisSense.Utils
 *
 * @param {DOMElement} element A DOM element.
 *
 * @returns {CSSStyleDeclaration} Returns the elements computed style.
 *
 * @description Returns the elements computed style.
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * VisSense.Utils._computedStyle(element);
 * // => CSSStyleDeclaration {parentRule: null, length: 0, cssText: "", ... }
 *
 */
function computedStyle(element) {
  return window.getComputedStyle(element, null);
}

/**
 * @private
 * @function
 * @name styleProperty
 * @memberof VisSense.Utils
 *
 * @param {CSSStyleDeclaration} style A style of an element.
 * @param {string} property A name of the property to fetch.
 *
 * @returns {*} The value of the property.
 *
 * @description Returns the elements computed style property by name.
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * var style = VisSense.Utils._computedStyle(element);
 * VisSense.Utils._styleProperty(style, 'display');
 * // => 'block'
 *
 */
function styleProperty(style, property) {
  return style.getPropertyValue(property);
}

/**
 * @private
 * @function
 * @name isDisplayed
 * @memberof VisSense.Utils
 *
 * @param {DOMElement} element A DOM element
 * @param {CSSStyleDeclaration} [style] the elements style
 *
 * @returns {boolean} `true` if the element is visible by its
 * style and by the style of its parents, otherwise `false`.
 *
 * @description A recursive function that checks if the element is visible by
 * its style and by the style of its parents. It does so by checking the values
 * of ´display´ and ´visibility´.
 * There is an optional style parameter which can be provided if you already
 * have computed the style of the element.
 * *NOTE*: This function calls window.getComputedStyle which is rather
 * expensive!
 *
 * @see http://jsperf.com/getcomputedstyle-vs-style-vs-css/2
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * var style =
 * VisSense.Utils._isDisplayed(element);
 * // => true
 *
 */
function isDisplayed(element, style) {
  if (!style) {
    style = computedStyle(element);
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
 * @function
 * @name isVisibleByStyling
 * @memberof VisSense.Utils
 *
 * @param {DOMElement} element A DOM element
 *
 * @returns {boolean} `true` if the element is visible by style and the style of
 * its parents, otherwise `false`.
 *
 * @description Checks if the element is visible by its style. If the given
 * element is the `document` then it will always return `true` (even if
 * `document.hidden` is `true` - this does not affect it's styling).
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * VisSense.Utils.isVisibleByStyling(element);
 * // => true
 *
 */
function isVisibleByStyling(element) {
  if (element === document) {
    return true;
  }

  if (!element || !element.parentNode) {
    return false;
  }

  var style = computedStyle(element);
  var displayed = isDisplayed(element, style);
  if (displayed !== true) {
    return false;
  }

  return true;
}
/******************************************************* element-styling end */

/******************************************************** element visibility */

/**
 * @private
 * @function
 * @name isInViewport
 * @memberof VisSense.Utils
 *
 * @param {Viewable} rect An object representing a rectangle with properties
 * ´bottom´, ´top´, ´left´ and ´right´ relative to the viewport.
 * @param {Viewport} viewport An object representing the viewport with
 * properties ´height´ and ´width´.
 *
 * @returns {boolean} `true` of the provided rectangle is in the given
 * viewport, otherwise `false`.
 *
 * @description Checks if the provided rectangle is in the given
 * viewport. The function solely exists for the fact that "All calls
 * to get any calculated dimension from the DOM should be cached or avoided".
 *
 * @see http://dcousineau.com/blog/2013/09/03/high-performance-js-tip/
 *
 * @example
 *
 * var rect = element.getBoundingClientRect();
 * var view = VisSense.Utils.viewport();
 * VisSense.Utils._isInViewport(rect, viewport);
 * // => true
 *
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
 * @function
 * @name percentage
 * @memberof VisSense.Utils
 *
 * @param {DOMElement} element A DOM element.
 *
 * @returns {number} the percentage of the elements surface area within the
 * visible area of a viewer's browser window on an in focus web page.
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * VisSense.Utils.percentage(element);
 * // => e.g. 0.333
 *
 */
function percentage(element) {
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
  }
  /* otherwise {
   this path cannot be taken otherwise element would not be in viewport
   } */

  if (rect.left >= 0) {
    vw = Math.min(rect.width, view.width - rect.left);
  } else if (rect.right > 0) {
    vw = Math.min(view.width, rect.right);
  }
  /* otherwise {
   this path cannot be taken otherwise element would not be in viewport
   } */

  // rect's height and width are greater than 0 because element is in viewport
  return Math.round((vh * vw) / (rect.height * rect.width) * 1000) / 1000;
}

/*****************************************************element visibility end */

/*********************************************************** page visibility */
var VisibilityApi = (function (undefined) {
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
 * @function
 * @name isPageVisible
 * @memberof VisSense.Utils
 *
 * @returns {boolean} Returns true if the current tab is in the foreground
 *   otherwise false.
 *
 * @description This method determines the visibility of the current tab and
 * returns true if it is the foreground. If the browser does not communicate
 * the state via ´document.hidden´ (or vendor specific derivatives) it will
 * always return true.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
 *
 * @example
 *
 * VisSense.Utils.isPageVisible();
 * // => true
 *
 */
function isPageVisible() {
  return VisibilityApi ? !document[VisibilityApi[0]] : true;
}

/******************************************************************** events */
var PubSub = (function (undefined) {
  function PubSub() {
    this._cache = {};
  }

  PubSub.prototype.on = function(/*String*/ topic, callback) {
    if(!isFunction(callback)) {
      console.warn('Discarding invalid listener on topic %s', topic);
      return noop;
    }

    if (!this._cache[topic]) {
      console.debug('Initializing queue for topic %s', topic);
      this._cache[topic] = [];
    }

    var listener = function(args) {
      return callback.apply(undefined, args || []);
    };

    this._cache[topic].push(listener);

    var me = this;
    return function off() {
      var index = me._cache[topic].indexOf(listener);
      if (index > -1) {
        console.debug('Unregistering listener from topic %s', topic);
        me._cache[topic].splice(index, 1);
        console.debug('Topic %s has now %i listeners', topic, me._cache[topic].length);
        return true;
      }
      return false;
    };
  };

  PubSub.prototype.publish = function(/*String*/ topic, args) {
    var listeners = this._cache[topic];
    var listenersCount = listeners ? listeners.length : 0;

    console.debug('publishing topic %s to %i listeners', topic, listenersCount);

    for(var i = 0; i < listenersCount; i++) {
      listeners[i](args || []);
    }
  };

  return PubSub;
})();

/**************************************************************** events end */
/**
 * @typedef VisSense~VisSenseConfig
 * @type {Object}
 * @property {number} [fullyvisible=1] The percentage limit an element is
 * considered fully visible.
 * @property {number} [hidden=0] The percentage an element limit is considered
 * hidden.
 * @property {VisSense~PercentageHook} [percentageHook=VisSense.Utils.percentage]
 * A callback function to determine the visible percentage of the element.
 * If not provided it will fallback to VisSense.Utils.percentage.
 * @property {VisSense~VisibilityHook[]} [percentageHooks=[]]
 * An array of callback functions to intercept the visibility procedure.
 * By default a visibility hook using the VisibilityAPI will be registered.
 *
 * @description A configuration object to configure a VisSense instance.
 */

/**
 * @callback VisSense~PercentageHook
 *
 * @param {DOMElement} element The element to get the visible percentage of.
 * @returns {number} The visible percentage of the element (between 0 and 1).
 *
 * @description This callback function that will be called to determine
 * the visible area of the element.
 */
/**
 * @callback VisSense~VisibilityHook
 *
 * @param {DOMElement} element The target element.
 * @returns {boolean} `false` if the element is hidden, `true` otherwise.
 *
 * @description This callback function that will be called to intercept
 * the default visibility process.
 */

/**
 * @class
 * @name VisSense
 * @throws {Error} Will throw an error if the first argument is not a DOM
 * Element.
 *
 * @param {DOMElement} element A DOM element.
 * @param {VisSense~VisSenseConfig} [config={fullyvisible: 1, hidden: 0}] A
 * configuration object.
 *
 * @description Creates a `VisSense` object which wraps the given element
 * to enable visibility operations.
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * var vis = VisSense(element); // or new VisSense(element)
 *
 * vis.isVisible();
 * // => true
 *
 * vis.percentage();
 * // => 0.93
 *
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
    fullyvisible: 1,
    hidden: 0,
    percentageHook: percentage,
    visibilityHooks: []
  });

  // page must be visible in order for the element to be visible
  this._config.visibilityHooks.push(function() {
    return isPageVisible();
  });
}

/**
 * @method
 * @name state
 * @memberof VisSense#
 *
 * @returns {VisSense~VisState} A state object.
 *
 * @description Returns an object representing the current state.
 * This function always invokes the full visibility scan and
 * therefore produces a new object everytime.
 *
 * @example
 *
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
 *
 */
VisSense.prototype.state = function () {
  for (var i = 0, n = this._config.visibilityHooks.length; i < n; i++) {
    if (!this._config.visibilityHooks[i](this._element)) {
      console.debug('visibilityHook returned false -> element is not visible.');
      return VisSense.VisState.hidden(0);
    }
  }
  var perc = this._config.percentageHook(this._element);

  if (perc <= this._config.hidden) {
    return VisSense.VisState.hidden(perc);
  }
  else if (perc >= this._config.fullyvisible) {
    return VisSense.VisState.fullyvisible(perc);
  }

  return VisSense.VisState.visible(perc);
};

/**
 * @method
 * @name percentage
 * @memberof VisSense#
 *
 * @returns {number} The currently visible area of the element.
 *
 * @description Returns the currently visible area of the element in percent (0..1)
 *
 * @example
 *
 * var visElement = VisSense(element);
 *
 * visElement.precentage();
 * // => 0.33
 *
 */
VisSense.prototype.percentage = function () {
  return this.state().percentage;
};

/**
 * @method
 * @name isFullyVisible
 * @memberof VisSense#
 *
 * @returns {boolean} `true` if the element is fully visible, otherwise `false`.
 *
 * @description Checks if the element is currently fully visible.
 *
 * @example
 *
 * var visElement = VisSense(element);
 * visElement.isFullyVisible();
 * // => true
 *
 */
VisSense.prototype.isFullyVisible = function () {
  return this.state().fullyvisible;
};

/**
 * @method
 * @name isVisible
 * @memberof VisSense#
 *
 * @returns {boolean} `true` if the element is visible, otherwise `false`.
 *
 * @description Checks if the element is currently visible.
 *
 * @example
 *
 * var visElement = VisSense(element);
 * visElement.isVisible();
 * // => true
 *
 */
VisSense.prototype.isVisible = function () {
  return this.state().visible;
};

/**
 * @method
 * @name isHidden
 * @memberof VisSense#
 *
 * @returns {boolean} `true` if the element is hidden, otherwise `false`.
 *
 * @description Checks if the element is currently hidden.
 *
 * @example
 *
 * var visElement = VisSense(element);
 * visElement.isHidden();
 * // => false
 *
 */
VisSense.prototype.isHidden = function () {
  return this.state().hidden;
};

VisSense.fn = VisSense.prototype;

/**
 * @static
 * @method
 * @name of
 * @memberof VisSense
 *
 * @returns {VisSense} The constructed VisSense object.
 *
 * @description Constructs a VisSense object.
 *
 * @example
 *
 * var myElement = document.getElementById('myElement');
 * var visElement = VisSense.of(m<Element);
 *
 */
VisSense.of = function (element, config) {
  return new VisSense(element, config);
};

var STATES = {
  HIDDEN: [0, 'hidden'],
  VISIBLE: [1, 'visible'],
  FULLY_VISIBLE: [2, 'fullyvisible']
};

/**
 * An object representing the visibility state of an element.
 *
 * @typedef  {Object} VisSense~VisState
 *
 * @property {number} code A number representation
 * of an visibility state. This is either 0, 1 or 2.
 * @property {string} state An string representation of an visibility state.
 * This is either 'hidden', 'visible' or 'fullyvisible'.
 * @property {number} percentage The visible percentage of the element.
 * @property {VisSense~VisState|{}} previous The previous state if any,
 * otherwise `{}` will be returned. This value's
 * `previous` property will always be deleted.
 * @property {boolean} fullyvisible `true` if the element is fully visible,
 * otherwise `false`.
 * @property {boolean} visible `true` if the element is visible, otherwise
 * `false`.
 * @property {boolean} hidden `true` if the element is hidden, otherwise
 * `false`.
 */
VisSense.VisState = (function() {
  /**
   * @private
   * @function
   * @name newVisState
   * @memberof VisSense~VisState
   *
   * @param {Array} state A state definition consisting of a code and a
   * string representation.
   * @param {number} percentage A number between 0 and 1 which represents
   * the currently visible area of an element.
   * @param {VisSense~VisState} [previous] The previous state of the element.
   *
   * @returns {VisSense~VisState} A state object.
   *
   * @description Constructs and returns a state object.
   *
   * @example
   *
   * var visElement = VisSense(element);
   *
   * visElement.isHidden();
   * // => false
   *
   */
  function newVisState(state, percentage, previous) {
    if (previous) {
      delete previous.previous;
    }

    return {
      code: state[0],
      state: state[1],
      percentage: percentage,
      previous: previous || {},
      fullyvisible: state[0] === STATES.FULLY_VISIBLE[0],
      visible: state[0] === STATES.VISIBLE[0] ||
      state[0] === STATES.FULLY_VISIBLE[0],
      hidden: state[0] === STATES.HIDDEN[0]
    };
  }

  return {
    /**
     * @static
     * @function
     * @name hidden
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "hidden".
     */
    hidden: function (percentage, previous) {
      return newVisState(STATES.HIDDEN, percentage, previous);
    },
    /**
     * @static
     * @function
     * @name visible
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "visible".
     */
    visible: function (percentage, previous) {
      return newVisState(STATES.VISIBLE, percentage, previous);
    },
    /**
     * @static
     * @function
     * @name fullyvisible
     * @memberof VisSense~VisState
     *
     * @param {number} percentage A number between 0 and 1 which represents
     * the currently visible area of an element.
     * @param {VisSense~VisState} [previous] The previous state of the element.
     *
     * @returns {VisSense~VisState} A state object representing
     * the state "fullyvisible".
     */
    fullyvisible: function (percentage, previous) {
      return newVisState(STATES.FULLY_VISIBLE, percentage, previous);
    }
  };
})();

/**
 * @private
 * @function
 * @name nextState
 *
 * @param {VisSense} visobj The VisSense element.
 * @param {VisSense~VisState} [currentState] The current state. Can be omitted
 * if the state of an element is determined the first time.
 *
 * @returns {VisSense~VisState} A visibility state object.
 *
 * This method determines and returns the new visibility state of an element.
 */
function nextState(visobj, currentState) {
  var newState = visobj.state();
  var percentage = newState.percentage;

  // check if nothing changed
  if (currentState &&
    percentage === currentState.percentage &&
    currentState.percentage === currentState.previous.percentage) {
    return currentState;
  }

  if (newState.hidden) {
    return VisSense.VisState.hidden(percentage, currentState);
  }
  else if (newState.fullyvisible) {
    return VisSense.VisState.fullyvisible(percentage, currentState);
  }

  // otherwise the element is visible
  return VisSense.VisState.visible(percentage, currentState);
}

/*---------------------------------------------------------------------------*/

/**
 * @typedef {Object} VisMonConfig
 * @name VisMonConfig
 * @memberof VisSense.VisMon#
 *
 * @property {VisSense.VisMon.Strategy|VisSense.VisMon.Strategy[]} [strategy=[PollingStrategy,EventStrategy]]
 * @property {function} [update]
 * @property {function} [hidden]
 * @property {function} [visible]
 * @property {function} [fullyvisible]
 * @property {function} [percentagechange]
 * @property {function} [visibilitychange]
 *
 * A configuration object to configure a VisMon instance.
 */

/**
 * @class
 * @name VisMon
 * @memberof VisSense
 *
 * @param {VisSense} visobj The VisSense instance to monitor.
 * @param {VisSense.VisMon#VisMonConfig} config A configuration object.
 *
 * @property {VisSense} _visobj The given VisSense instance.
 * @property {VisSense~VisState|{}} _state The current state.
 * @property {VisSense.PubSub} _pubsub A publish/subscribe queue.
 * @property {VisSense.VisMon.Strategy} _strategy the strategy to use for
 *   observing the element.
 *
 * @description Creates a `VisSense` object which wraps the given element
 *   to enable visibility operations.
 *
 * @example
 *
 * var visElement = VisSense(element);
 *
 * var visMon = VisSense.VisMon(visElement, {
 *   update: function() {
 *     console.log('updated.');
 *   }
 * });
 *
 * or
 *
 * @example
 *
 * var visMon = VisSense(element).monitor({
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */
function VisMon(visobj, config) {
  this._visobj = visobj;
  this._state = {};
  this._pubsub = new PubSub();
  this._events = [
    'update',
    'hidden',
    'visible',
    'fullyvisible',
    'percentagechange',
    'visibilitychange'
  ];

  var _config = defaults(config, {
    strategy: [
      new VisMon.Strategy.PollingStrategy(),
      new VisMon.Strategy.EventStrategy()
    ]
  });

  this._setStrategy(_config.strategy);

  this._pubsub.on('update', function (monitor) {
    if (monitor._state.code !== monitor._state.previous.code) {
      monitor._pubsub.publish('visibilitychange', [monitor]);
    }
  });

  this._pubsub.on('update', function (monitor) {
    var newValue = monitor._state.percentage;
    var oldValue = monitor._state.previous.percentage;
    if (newValue !== oldValue) {
      monitor._pubsub.publish('percentagechange', [newValue, oldValue, monitor]);
    }
  });

  this._pubsub.on('visibilitychange', function (monitor) {
    if (monitor._state.fullyvisible) {
      monitor._pubsub.publish('fullyvisible', [monitor]);
    }
  });

  this._pubsub.on('visibilitychange', function (monitor) {
    if (monitor._state.visible && !monitor._state.previous.visible) {
      monitor._pubsub.publish('visible', [monitor]);
    }
  });

  this._pubsub.on('visibilitychange', function (monitor) {
    if (monitor._state.hidden) {
      monitor._pubsub.publish('hidden', [monitor]);
    }
  });

  for (var i = 0, n = this._events.length; i < n; i++) {
    if (_config[this._events[i]]) {
      this.on(this._events[i], _config[this._events[i]]);
    }
  }
}
VisMon.prototype._setStrategy = function (strategies) {
  this._strategy = new VisMon.Strategy.CompositeStrategy(strategies);
};

VisMon.prototype.visobj = function () {
  return this._visobj;
};

/**
 * @method
 * @name state
 * @memberof VisSense.VisMon#
 *
 * @returns {VisSense~VisState|{}} The current state.
 *
 * @description Returns an object representing the current
 * visibility state.
 *
 * @example
 *
 * var visMon = VisSense.VisMon(...);
 *
 * visElement.state();
 * // => {
 *    code: 1,
 *    state: 'visible',
 *    percentage: 0.33,
 *    fullyvisible: false,
 *    visible: true,
 *    hidden: false,
 *    previous: {
 *      code: 1,
 *      state: 'visible',
 *      percentage: 0.42,
 *      fullyvisible: false,
 *      visible: true,
 *      hidden: false
 *    }
 *  }
 *
 */
VisMon.prototype.state = function () {
  return this._state;
};

/**
 * @method
 * @name start
 * @memberof VisSense.VisMon#
 *
 * @returns {VisSense.VisMon} itself.
 *
 * @description Starts monitoring the provided element.
 *
 * @example
 *
 * var visMon = VisSense.VisMon(..., {
 *   strategy: [
 *     new ViSense.VisMon.Strategy.EventStrategy(...)
 *     new ViSense.VisMon.Strategy.PollingStrategy(...)
 *   ]
 *});
 *
 * visElement.start();
 *
 */
VisMon.prototype.start = function () {
  this.update();

  this._strategy.start(this);

  return this;
};

/**
 * @method
 * @name stop
 * @memberof VisSense.VisMon#
 *
 * @returns {*} The return value of the strategies stop function.
 *
 * @description Stops monitoring the provided element.
 *
 * @example
 *
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
 *
 */
VisMon.prototype.stop = function () {
  return this._strategy.stop(this);
};

/**
 * @method
 * @name use
 * @memberof VisSense.VisMon#
 *
 * @returns {VisSense.VisMon} itself.
 *
 * @description Changes the update strategy for observing the element.
 *
 * @example
 *
 * var visMon = VisSense(...)
 *  .monitor(...)
 *  .start()
 *  .use(new VisSense.VisMon.Strategy.EventStrategy(...));
 *
 */
VisMon.prototype.use = function (strategy) {
  this.stop();
  this._setStrategy(strategy);
  return this.start();
};

/**
 * @method
 * @name update
 * @memberof VisSense.VisMon#
 *
 * @returns {undefined}
 *
 * @description Updates the state of the monitor object. This method invokes
 * a visibility check and fires any registered listener accordingly.
 *
 * @example
 *
 * var visMon = VisSense(...)
 *  .monitor(...)
 *  .start()
 *  .use(new VisSense.VisMon.Strategy.EventStrategy(...));
 *
 */
VisMon.prototype.update = function () {
  // update state
  this._state = nextState(this._visobj, this._state);

  // notify listeners
  this._pubsub.publish('update', [this]);
};

/**
 * This callback function will unregister a previously registered listener.
 * It will be returned from any function registering a listener.
 * Returns `true` if the listener was successfully unregistered, otherwise
 * `false`.
 *
 * @callback RemoveListenerCallback
 * @memberof VisSense.VisMon#
 * @param {boolean} vismon A reference to the monitor.
 */

/**
 * This callback function will be called everytime the monitor updates its
 * state.
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnUpdateCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * @method
 * @name onUpdate
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnUpdateCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Fires every time an object updates its state.
 *
 * @example
 *
 * var visMon = VisSense.VisMon(...);
 *
 * visMon.onUpdate(function() {
 *   console.log('updated!');
 * });
 *
 */
VisMon.prototype.onUpdate = function (callback) {
  return this._pubsub.on('update', callback);
};

/**
 * This callback function will be called everytime the visibility state
 * changes.
 *
 * A visibility change can occur if a state transits from
 * - HIDDEN to VISIBILE or FULLY_VISIBILE
 * - VISIBLE to FULLY_VISIBLE or HIDDEN
 * - FULLY_VISIBLE to HIDDEN or VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback VisMon.OnVisibilityChangeCallback
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * @method
 * @name onVisibilityChange
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnVisibilityChangeCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Fires when the visibility state changes.
 *
 * @example
 *
 * var visMon = VisSense.VisMon(...);
 *
 * visMon.onVisibilityChange(function() {
 *   console.log('visibility changed');
 * });
 *
 */
VisMon.prototype.onVisibilityChange = function (callback) {
  return this._pubsub.on('visibilitychange', callback);
};

/**
 * This callback function will be called everytime the visibility
 * percentage changes.
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * This callback will currently be provided with different
 * parameters than the others. This is likely to change in
 * future versions in favour of a uniform approach.
 *
 * @callback OnPercentageChangeCallback
 * @memberof VisSense.VisMon#
 *
 * @param {number} newValue The new visible percentage.
 * @param {number} oldValue The former visible percentage.
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */


/**
 * @method
 * @name onPercentageChange
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnPercentageChangeCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Fires when the visible percentage changes.
 *
 * By default this event does not occur when the element is in state
 * 'HIDDEN' or 'FULLY_VISIBLE' but may be called multiple times if
 * element is in state 'VISIBLE'.
 *
 * @example
 *
 * var visMon = VisSense.VisMon(...);
 *
 * visMon.onPercentageChange(function() {
 *   console.log('percentage changed');
 * });
 *
 */
VisMon.prototype.onPercentageChange = function (callback) {
  return this._pubsub.on('percentagechange', callback);
};

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes visible.
 *
 * This can occur if a state changes from
 * - HIDDEN to VISIBLE
 * - HIDDEN to FULLY_VISIBLE
 *
 * *NOTE*: This does not occur when changing from
 * - FULLY_VISIBLE to VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnVisibleCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * @method
 * @name onVisible
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnVisibleCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Registers a listener that fires when the element becomes visible.
 *
 * @example
 *
 * VisSense(document.getElementById('example1')).monitor()
 *   .onVisible(function() {
 *     Animations.startAnimation();
 *   });
 *
 */
VisMon.prototype.onVisible = function (callback) {
  return this._pubsub.on('visible', callback);
};

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes fully visible.
 *
 * This can occur if a state changes from
 * - HIDDEN to FULLY_VISIBLE
 * - VISIBLE to FULLY_VISIBLE
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnFullyVisibleCallback
 * @memberof VisSense.VisMon
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * @method
 * @name onFullyVisible
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnFullyVisibleCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Fires when visibility changes and element becomes fully visible.
 *
 * @example
 *
 * VisSense(document.getElementById('example1')).monitor()
 *   .onFullyVisible(function() {
 *     Animations.startAnimation();
 *   });
 *
 */
VisMon.prototype.onFullyVisible = function (callback) {
  return this._pubsub.on('fullyvisible', callback);
};

/**
 * This callback function will be called everytime the visibility
 * states changes and the element becomes hidden.
 *
 * This can occur if a state changes from
 * - FULLY_VISIBLE to HIDDEN
 * - VISIBLE to HIDDEN
 *
 * As all listeners, it can be removed with the returned
 * `RemoveListenerCallback` function of the method registering it.
 *
 * @callback OnHiddenCallback
 * @memberof VisSense.VisMon#
 * @param {VisSense.VisMon} vismon A reference to the monitor.
 */

/**
 * @method
 * @name onHidden
 * @memberof VisSense.VisMon#
 *
 * @param {VisSense.VisMon#OnHiddenCallback} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Fires when visibility changes and element becomes hidden.
 *
 * @example
 *
 * VisSense(document.getElementById('example1')).monitor()
 *   .onFullyVisible(function() {
 *     Animations.startAnimation();
 *   });
 *
 */
VisMon.prototype.onHidden = function (callback) {
  return this._pubsub.on('hidden', callback);
};


/**
 * @method
 * @name on
 * @memberof VisSense.VisMon#
 *
 * @param {string} topic The name of the topic to bind the callback to.
 * @param {function} callback A callback function.
 *
 * @returns {VisSense.VisMon#RemoveListenerCallback} A function when called will remove the listener.
 *
 * @description Binds a callback function to a specific event.
 * Valid events are:
 *  - ´update´
 *  - ´hidden´
 *  - ´visible´
 *  - ´fullyvisible´
 *  - ´percentagechange´
 *  - ´visibilitychange´
 *
 * @example
 *
 * var monitor = VisSense(...).monitor(...);
 *  monitor.on('fullyvisible', function() {
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
 *
 */
VisMon.prototype.on = function (topic, callback) {

  var me = this;
  switch (topic) {
    case 'update':
      return me.onUpdate(callback);
    case 'hidden':
      return me.onHidden(callback);
    case 'visible':
      return me.onVisible(callback);
    case 'fullyvisible':
      return me.onFullyVisible(callback);
    case 'percentagechange':
      return me.onPercentageChange(callback);
    case 'visibilitychange':
      return me.onVisibilityChange(callback);
  }

  return this._pubsub.on(topic, callback);
};

/**
 * @abstract
 * @class
 * @name Strategy
 * @memberof VisSense.VisMon
 * @classdesc The base class of all strategies used by VisMon objects.
 */
VisMon.Strategy = function () {
};

/**
 * @method
 * @name start
 * @memberof VisSense.VisMon.Strategy#
 *
 * @param {VisSense.VisMon} monitor
 */
VisMon.Strategy.prototype.start = function (/*jshint unused:false*/monitor) {
  throw new Error('Strategy#start needs to be overridden.');
};

/**
 * @method
 * @name stop
 * @memberof VisSense.VisMon.Strategy#
 *
 * @param {VisSense.VisMon} monitor
 */
VisMon.Strategy.prototype.stop = function (/*jshint unused:false*/monitor) {
  throw new Error('Strategy#stop needs to be overridden.');
};

/**
 * @class
 * @name CompositeStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @param {VisSense.VisMon.Strategy[]} strategies
 *
 * @property {VisSense.VisMon.Strategy[]} _strategies A list of strategies
 *
 * @classdesc A composite strategy to combine two or more strategies
 * Its a proxy that will call every strategies start() and stop() methods.
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.CompositeStrategy([
 *      new VisSense.VisMon.Strategy.EventStrategy(...),
 *      new VisSense.VisMon.Strategy.PollingStrategy(...)
 *   ]),
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */
VisMon.Strategy.CompositeStrategy = function (strategies) {
  this._strategies = isArray(strategies) ? strategies : [strategies];
};

VisMon.Strategy.CompositeStrategy.prototype = Object.create(
  VisMon.Strategy.prototype
);

/**
 * @method
 * @name start
 * @memberof VisSense.VisMon.Strategy.CompositeStrategy#
 *
 * @param {VisSense.VisMon} monitor
 *
 * Calls the start method of all strategies.
 */
VisMon.Strategy.CompositeStrategy.prototype.start = function (monitor) {
  for (var i = 0, n = this._strategies.length; i < n; i++) {
    this._strategies[i].start(monitor);
  }
};

/**
 * @method
 * @name stop
 * @memberof VisSense.VisMon.Strategy.CompositeStrategy#
 *
 * @param {VisSense.VisMon} monitor
 *
 * Calls the stop method of all strategies.
 */
VisMon.Strategy.CompositeStrategy.prototype.stop = function (monitor) {
  for (var i = 0, n = this._strategies.length; i < n; i++) {
    this._strategies[i].stop(monitor);
  }
};

/**
 * @typedef {Object} PollingStrategyConfig
 * @name PollingStrategyConfig
 * @memberof VisSense.VisMon.Strategy.PollingStrategy#
 *
 * @property {number} [interval=5000] The interval between state updates
 * in milliseconds.
 *
 * @description A configuration object to configure a PollingStrategy instance.
 */

/**
 * @class
 * @name PollingStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @param {VisSense.VisMon.Strategy.PollingStrategy#PollingStrategyConfig} [config={interval:1000}] The config object
 *
 * @property {VisSense.VisMon.Strategy.PollingStrategy#PollingStrategyConfig} _config The internal config object
 *
 * @classdesc A strategy that will periodically update the objects
 * visibility state.
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.PollingStrategy({
 *     interval: 5000
 *   }),
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */
VisMon.Strategy.PollingStrategy = function (config) {
  this._config = defaults(config, {
    interval: 1000
  });
  this._started = false;
};

VisMon.Strategy.PollingStrategy.prototype = Object.create(
  VisMon.Strategy.prototype
);

/**
 * @method
 * @name start
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.PollingStrategy#
 */
VisMon.Strategy.PollingStrategy.prototype.start = function (monitor) {
  if (!this._started) {
    this._clearInterval = (function update(interval) {
      var intervalId = setInterval(function() {
        monitor.update();
      }, interval);

      return function() {
        clearInterval(intervalId);
      };
    }(this._config.interval));

    this._started = true;
  }

  return this._started;
};

/**
 * @method
 * @name stop
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.PollingStrategy#
 */
VisMon.Strategy.PollingStrategy.prototype.stop = function () {
  if (!this._started) {
    return false;
  }

  this._clearInterval();

  this._started = false;

  return true;
};

/**
 * @typedef {Object} EventStrategyConfig
 * @name EventStrategyConfig
 * @memberof VisSense.VisMon.Strategy.EventStrategy#
 *
 * @property {number} [debounce=50] The time in milliseconds to debounce
 * the state update. Event might fire multiple times in a short period
 * of time. If you want this feature to be disabled set debounce to 0.
 * in milliseconds.
 *
 * @description A configuration object to configure a EventStrategy instance.
 */

/**
 * @class
 * @name EventStrategy
 * @extends VisSense.VisMon.Strategy
 * @memberof VisSense.VisMon.Strategy
 *
 * @classdesc A strategy that registers listeners for events
 * that may change the percentage of the elements surface area within the
 * visible area of a viewer's browser window.
 *
 * Following events are listened to:
 * - scroll
 * - resize
 * - visibilitychange
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: new VisSense.VisMon.Strategy.EventStrategy({
 *      debounce: 100
 *   }),
 *   update: function() {
 *     console.log('updated.');
 *   }
 * }).start();
 *
 */
VisMon.Strategy.EventStrategy = function (config) {
  this._config = defaults(config, {
    debounce: 50
  });
  this._started = false;
};

VisMon.Strategy.EventStrategy.prototype = Object.create(
  VisMon.Strategy.prototype
);

/**
 * @method
 * @name start
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.EventStrategy#
 */
VisMon.Strategy.EventStrategy.prototype.start = function (monitor) {

  if (!this._started) {
    var me = this;

    this._removeEventListeners = (function() {
      var update = debounce(function () {
        monitor.update();
      }, me._config.debounce);

      if (VisibilityApi) {
        addEventListener(VisibilityApi[1], update);
      }
      addEventListener('scroll', update);
      addEventListener('resize', update);

      return function() {
        removeEventListener('resize', update);
        removeEventListener('scroll', update);
        if (VisibilityApi) {
          removeEventListener(VisibilityApi[1], update);
        }
      };
    })();

    this._started = true;
  }

  return this._started;
};

/**
 * @method
 * @name stop
 *
 * @param {VisSense.VisMon} monitor
 *
 * @memberof VisSense.VisMon.Strategy.EventStrategy#
 */
VisMon.Strategy.EventStrategy.prototype.stop = function () {
  if (!this._started) {
    return false;
  }

  this._removeEventListeners();

  this._started = false;

  return true;
};

VisSense.VisMon = VisMon;

VisSense.PubSub = PubSub;

/**
 * @method
 * @name monitor
 * @memberof VisSense#
 *
 * @param {VisSense.VisMon#VisMonConfig} config A config object
 *
 * @returns {VisSense.VisMon} A VisMon object observing the element.
 *
 * @example
 *
 * var visMon = VisSense(...).monitor({
 *   strategy: [new VisSense.VisMon.Strategy.EventStrategy(...)]
 *   update: function() {
 *     console.log('updated.');
 *   }
 * });
 *
 */
VisSense.fn.monitor = function (config) {
  return new VisMon(this, config);
};

/**
 * @static
 * @namespace Utils
 * @name Utils
 * @memberof VisSense
 */
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
