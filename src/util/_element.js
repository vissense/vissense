var forEach = require('./forEach');
var isElement = require('./isElement');
var noop = require('./noop');

/********************************************************** element-position */

/**
 * @private
 * @function
 * @name viewport
 * @memberof VisSense.Utils
 *
 * @param {Window} [referenceWindow=window] The window object.
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
export function viewport(referenceWindow) {
    var win = referenceWindow || window;
    return {
        height: win.innerHeight,
        width: win.innerWidth
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
 * @param {Window} [referenceWindow=window] The window object.
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
export function computedStyle(element, referenceWindow) {
    return (referenceWindow || window).getComputedStyle(element, null);
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
export function styleProperty(style, property) {
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
 * its and all parent nodes `position` style.
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
export function isDisplayed(element, style) {
    if (!style) {
        style = computedStyle(element);
    }

    var display = styleProperty(style, 'display');
    if (display === 'none') {
        return false;
    }

    var parent = element.parentNode;
    return isElement(parent) ? isDisplayed(parent) : true;
}

/**
 * @function
 * @name isVisibleByStyling
 * @memberof VisSense.Utils
 *
 * @param {DOMElement} element A DOM element
 * @param {Window} [referenceWindow=window] The window object.
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
export function isVisibleByStyling(element, referenceWindow) {
    if (element === (referenceWindow || window).document) {
        return true;
    }

    if (!element || !element.parentNode) {
        return false;
    }

    var style = computedStyle(element, referenceWindow);

    var visibility = styleProperty(style, 'visibility');
    if (visibility === 'hidden' || visibility === 'collapse') {
        return false;
    }

    return isDisplayed(element, style);
}
/******************************************************* element-styling end */


/******************************************************** element visibility */

/**
 * @private
 * @function
 * @name isInViewport
 * @memberof VisSense.Utils
 *
 * @param {BoundingClientRect} rect An object representing a rectangle with
 * properties ´bottom´, ´top´, ´left´ and ´right´ relative to the viewport.
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
export function isInViewport(rect, viewport) {
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
 * @param {Window} [referenceWindow=window] The window object.
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
export function percentage(element, referenceWindow) {
    var rect = element.getBoundingClientRect();
    var view = viewport(referenceWindow);

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
    return (vh * vw) / (rect.height * rect.width);
}

/*****************************************************element visibility end */


/*********************************************************** page visibility */
/* istanbul ignore next */
export function createVisibilityApi(referenceWindow) {
    return (function (document, undefined) {
        var entry = (propertyName, eventName) => ({
            property: propertyName,
            event: eventName
        });
        var event = 'visibilitychange';
        var dict = [
            entry('webkitHidden', 'webkit' + event),
            entry('msHidden', 'ms' + event),
            entry('mozHidden', 'moz' + event),
            entry('hidden', event)
        ];

        var api = forEach(dict, entry => {
            if (document[entry.property] !== undefined) {
                return {
                    isHidden: () => !!document[entry.property] || false,
                    onVisibilityChange: callback => {
                        document.addEventListener(entry.event, callback, false);
                        return () => document.removeEventListener(entry.event, callback, false);
                    }
                };
            }
        });

        return api || {
                isHidden: () => false,
                onVisibilityChange: () => noop
            };
    })((referenceWindow || window).document);
}

/**
 * @function
 * @name isPageVisible
 * @memberof VisSense.Utils
 *
 * @param {Window} [referenceWindow=window] The window object.
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
export function isPageVisible(referenceWindow) {
    return !createVisibilityApi(referenceWindow || window).isHidden();
}

