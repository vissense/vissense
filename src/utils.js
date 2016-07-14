var _async = require('./util/async');
var debounce = require('./util/debounce');
var defaults = require('./util/defaults');
var defer = require('./util/defer');
var extend = require('./util/extend');
var identity = require('./util/identity');
var isArray = require('./util/isArray');
var isDefined = require('./util/isDefined');
var isElement = require('./util/isElement');
var isFriendlyIframeContext = require('./util/isFriendlyIframeContext');
var isFunction = require('./util/isFunction');
var isIframeContext = require('./util/isIframeContext');
var isObject = require('./util/isObject');
var noop = require('./util/noop');
var now = require('./util/now');
var once = require('./util/once');
var forEach = require('./util/forEach');
var throttle = require('./util/throttle');


var _elementFunctions = require('./util/_element');

var percentage = _elementFunctions.percentage;
var viewport = _elementFunctions.viewport;
var isInViewport = _elementFunctions.isInViewport;
var isDisplayed = _elementFunctions.isDisplayed;
var styleProperty = _elementFunctions.styleProperty;
var computedStyle = _elementFunctions.computedStyle;
var isVisibleByStyling = _elementFunctions.isVisibleByStyling;
var isPageVisible = _elementFunctions.isPageVisible;
var createVisibilityApi = _elementFunctions.createVisibilityApi;


export default {
    async: _async,
    debounce: debounce,
    defaults: defaults,
    defer: defer,
    extend: extend,
    forEach: forEach,
    identity: identity,
    isArray: isArray,
    isDefined: isDefined,
    isElement: isElement,
    isFriendlyIframeContext: isFriendlyIframeContext,
    isFunction: isFunction,
    isIframeContext: isIframeContext,
    isObject: isObject,
    noop: noop,
    now: now,
    once: once,
    throttle: throttle,


    /**
     * backward compatibility to <1.0.0
     **/
    VisibilityApi: createVisibilityApi(),
    createVisibilityApi: createVisibilityApi,
    isPageVisible: isPageVisible,
    isVisibleByStyling: isVisibleByStyling,
    percentage: percentage,
    _viewport: viewport,
    _isInViewport: isInViewport,

    _isDisplayed: isDisplayed,

    _computedStyle: computedStyle,
    _styleProperty: styleProperty
};
