/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, Math, Visibility) {
  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used as the semantic version number */
  var version = '0.0.3';

  /** Used as attribute name in the global object */
  var libName = 'VisSense';

  /** Used as the property name for wrapper metadata */
  var expando = '__' + libName + '@' + version + '__';

  /** Used as a reference to the global object */
  var root = (typeof window === 'object' && window) || this;

  var PageVisibilityAPIAvailable = !!Visibility && Visibility.isSupported && Visibility.isSupported();

  /*--------------------------------------------------------------------------*/
    function pageIsVisible() {
        return PageVisibilityAPIAvailable ? !Visibility.hidden() : true;
    }

    function _noop() {}

    function _fireIf (when, callback) {
      return function () {
        if (when()) {
          return callback();
        }
      };
    }

    function _window(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	}

	var _isHiddenInputElement = function(element) {
		if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
			return element.type && String(element.type).toLowerCase() === 'hidden';
		}
		return false;
	}

	function _getBoundingClientRect(element) {
		var r = element.getBoundingClientRect();
		// IE<9 wont return height or width
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

  /* @category Styling --------------------------------------------------------------------------*/

	function _findEffectiveStyle(element) {
		var w = _window(element);

		if (element.style === undefined) {
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
	};

	function _findEffectiveStyleProperty(element, property) {
		var effectiveStyle = _findEffectiveStyle(element);
		var propertyValue = effectiveStyle[property];
		if (propertyValue === 'inherit' && element.parentNode.style) {
			return _findEffectiveStyleProperty(element.parentNode, property);
		}
		return propertyValue;
	};

	function isDisplayed(element) {
		var display = _findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	};

    function isVisibleByStyling(element) {
        if (element === _window(element).document) {
            return true;
        }
        if (!element || !element.parentNode){
            return false;
        }

        if(_isHiddenInputElement(element)) {
            return false;
        }

        var visibility = _findEffectiveStyleProperty(element, 'visibility');
        var opacity = _findEffectiveStyleProperty(element, 'opacity');
        var displayed = isDisplayed(element);
        return (opacity !== '0' &&
            visibility !== 'hidden' &&
            visibility !== 'collapse' &&
            displayed === true);
    };

  /* @category Styling --------------------------------------------------------------------------*/

  /* @category Position --------------------------------------------------------------------------*/

	function viewportHeight(element) {
		var w = _window(element);
		return w.innerHeight || w.document.documentElement.clientHeight;
	};

	function viewportWidth(element) {
		var w = _window(element);
		return w.innerWidth || w.document.documentElement.clientWidth;
	};

	function isFullyInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		return (!!r &&
			r.top >= 0 &&
			r.left >= 0 &&
			r.bottom < viewportHeight(element) &&
			r.right < viewportWidth(element)
		);
	};

	function isInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		return ( !!r &&
			r.bottom > 0 &&
			r.right > 0 &&
			r.top < viewportHeight(element) &&
			r.left < viewportWidth(element)
		);
	};

	function getVisibilityPercentage(element) {
		if(!isInViewport(element) || !isVisibleByStyling(element)) {
			return 0;
		}

		var r = _getBoundingClientRect(element);
		if(!r || r.height <= 0 || r.width <= 0) {
			return 0;
		}

		var vh = 0; // visible height
		var vw = 0; // visible width

		if(r.top >= 0) {
			vh = Math.min(r.height, viewportHeight(element) - r.top);
		} else if(r.top < 0 && r.bottom > 0) {
			vh = Math.min(viewportHeight(element), r.bottom);
		}

		if(r.left >= 0) {
			vw = Math.min(r.width, viewportWidth(element) - r.left);
		} else if(r.left < 0 && r.right > 0) {
			vw = Math.min(viewportWidth(element), r.right);
		}

		var area = (vh * vw) / (r.height * r.width);
		return Math.max(area, 0);
	}


    /* @category Position --------------------------------------------------------------------------*/

    /* @category Visibility --------------------------------------------------------------------------*/
	function isFullyVisible(element) {
		return pageIsVisible() && isFullyInViewport(element) && isVisibleByStyling(element);
	}
    function isVisible(element) {
        return pageIsVisible() && isInViewport(element) && isVisibleByStyling(element);
    }
    function isHidden(element) {
        return !pageIsVisible() || !isVisible(element);
    }
    /**
    * Returns a function that invokes callback only if element is fully visible
    */
    function fireIfFullyVisible(element, callback) {
        return _fireIf(function() {
            return isFullyVisible(element);
        }, callback);
    };
    /**
    * Returns a function that invokes callback only if element is visible
    */
    function fireIfVisible(element, callback) {
        return _fireIf(function() {
            return isVisible(element);
        }, callback);
    };
    /**
    * Returns a function that invokes callback only if element is hidden
    */
    function fireIfHidden(element, callback) {
        return _fireIf(function() {
            return isHidden(element);
        }, callback);
    };
    /* @category Visibility --------------------------------------------------------------------------*/

  /**
   * Create a new `Vissense` function using the given `context` object.
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `Vissense` function.
   */
  function runInContext(context) {
    context = context || root;

    /** Used to detect DOM support */
    var document = (document = context.window) && document.document;

    /** Used to restore the original `Vissense` reference in `Vissense.noConflict` */
    var oldVissense = context['libName'];

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `Vissense` object which wraps the given element to enable
     * visibility operations
     *
     * @name _
     * @constructor
     * @param {*} value The value to wrap in a `Vissense` instance.
     * @returns {Object} Returns a `Vissense` instance.
     * @example
     *
     * var visElement = Vissense(element);
     *
     * visElement.isVisible();
     * // => true
     *
     * visElement.getVisibilityPercentage();
     * // => 0.93
     *
     */
    function Vissense(element, config) {
        var c = config || {};

        return new VissenseWrapper(element, c);
    }

    /**
     * A fast path for creating `Vissense` wrapper objects.
     */
    function VissenseWrapper(element, config) {
        if ( !element || 1 !== element.nodeType ) {
            throw new Error('InvalidArgument: no dom element');
        }

        this._element = element;
        this._config = config;
    }

    // ensure `new VissenseWrapper` is an instance of `Vissense`
    VissenseWrapper.prototype = Vissense.prototype;


    /**
     * An object used to flag environments features.
     */
    var support = Vissense.support = (function() {

      /**
       * Detect IE version
       */
    function getIEVersion() {
      var v = 3, div = document.createElement('div');
      while (
        div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
        div.getElementsByTagName('i')[0]
      ){}
      return v > 4 ? v : undefined;
    }

    /**
     * Detect IE
     */
    function isIE() {
      return !!getIEVersion();
    }

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
       return !!_findEffectiveStyle(document.getElementsByTagName('body')[0]);
      } catch(e) {}
      return false;
    }
      var support = {};
      support.MinIEVersion = 7;
      support.PageVisibilityAPIAvailable = PageVisibilityAPIAvailable;
      support.IEVersion = getIEVersion();
      support.DOMPresent = isDomPresent();
      support.CanReadStyle = canReadStyle();
      support.BrowserSupported = !(support.IEVersion < support.MinIEVersion);

      support.compatible = support.DOMPresent && support.CanReadStyle && support.BrowserSupported;

      return support;
    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Reverts the `Vissense` variable to its previous value and returns a reference to
     * the `Vissense` function.
     *
     * @returns {Function} Returns the `Vissense` function.
     * @example
     *
     * var vissense = vissense.noConflict(element);
     */
    function noConflict() {
      context[libName] = oldVissense;
      return this;
    }

    /*--------------------------------------------------------------------------*/

    // add functions
    Vissense.noConflict = noConflict;

    /* @category Position -------------------------------------------------------*/
    Vissense.isInViewport = isInViewport;
    Vissense.prototype.isInViewport = function() {
      return isInViewport(this._element);
    };

    Vissense.isFullyInViewport = isFullyInViewport;
    Vissense.prototype.isFullyInViewport = function() {
      return isFullyInViewport(this._element);
    };

    Vissense.getVisibilityPercentage = getVisibilityPercentage;
    Vissense.prototype.getVisibilityPercentage = function() {
      return getVisibilityPercentage(this._element);
    };

    Vissense.viewportHeight = viewportHeight;
    Vissense.prototype.viewportHeight = function() {
      return viewportHeight(this._element);
    };

    Vissense.viewportWidth = viewportWidth;
    Vissense.prototype.viewportWidth = function() {
      return viewportWidth(this._element);
    };

    /*--------------------------------------------------------------------------*/
    Vissense.isDisplayed = isDisplayed;
    Vissense.prototype.isDisplayed = function() {
      return isDisplayed(this._element);
    };

    Vissense.isVisibleByStyling = isVisibleByStyling;
    Vissense.prototype.isVisibleByStyling = function() {
      return isVisibleByStyling(this._element);
    };
    /*--------------------------------------------------------------------------*/

    Vissense.isFullyVisible = isFullyVisible;
    Vissense.prototype.isFullyVisible = function() {
      return isFullyVisible(this._element);
    };

    Vissense.isVisible = isVisible;
    Vissense.prototype.isVisible = function() {
      return isVisible(this._element);
    };

    Vissense.isHidden = isHidden;
    Vissense.prototype.isHidden = function() {
      return isHidden(this._element);
    };
    /**/
    Vissense.fireIfFullyVisible = fireIfFullyVisible;
    Vissense.prototype.fireIfFullyVisible = function(callback) {
      return fireIfElementFullyVisible(this._element, callback);
    };
    Vissense.fireIfVisible = fireIfVisible;
    Vissense.prototype.fireIfVisible = function(callback) {
      return fireIfVisible(this._element, callback);
    };
    Vissense.fireIfHidden = fireIfHidden;
    Vissense.prototype.fireIfHidden = function (callback) {
        return fireIfHidden(this._element, callback);
    };

    /*--------------------------------------------------------------------------*/

	Vissense.prototype.getFullyVisibleThreshold = _noop;

	Vissense.prototype.getTimeVisible = _noop;
	Vissense.prototype.getTimeFullyVisible = _noop;
	Vissense.prototype.getTimeVisibleRelative = _noop;

	Vissense.prototype.getVisibleRate = _noop;

	Vissense.prototype.getFullyVisibleRate = _noop;

	Vissense.prototype.getDuration = _noop;

    /**
     * The semantic version number.
     */
    Vissense.VERSION = version;

    return Vissense;
  }

  /*--------------------------------------------------------------------------*/

  // export Vissense
  root[libName] = runInContext(root);
}.call(this, this, this.Math, this.Visibility));