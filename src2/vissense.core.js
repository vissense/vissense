/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, Math, VisSenseUtils) {
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
    Vissense.prototype.isInViewport = function() {
      return VisSenseUtils.isInViewport(this._element);
    };

    Vissense.prototype.isFullyInViewport = function() {
      return VisSenseUtils.isFullyInViewport(this._element);
    };

    Vissense.prototype.getVisibilityPercentage = function() {
      return VisSenseUtils.getVisibilityPercentage(this._element);
    };

    Vissense.prototype.viewportHeight = function() {
      return VisSenseUtils.viewportHeight(this._element);
    };

    Vissense.prototype.viewportWidth = function() {
      return VisSenseUtils.viewportWidth(this._element);
    };

    /*--------------------------------------------------------------------------*/
    Vissense.prototype.isDisplayed = function() {
      return VisSenseUtils.isDisplayed(this._element);
    };

    Vissense.prototype.isVisibleByStyling = function() {
      return VisSenseUtils.isVisibleByStyling(this._element);
    };
    /*--------------------------------------------------------------------------*/

    Vissense.prototype.isFullyVisible = function() {
      return VisSenseUtils.isFullyVisible(this._element);
    };

    Vissense.prototype.isVisible = function() {
      return VisSenseUtils.isVisible(this._element);
    };

    Vissense.prototype.isHidden = function() {
      return VisSenseUtils.isHidden(this._element);
    };
    /**/
    Vissense.prototype.fireIfFullyVisible = function(callback) {
      return VisSenseUtils.fireIfElementFullyVisible(this._element, callback);
    };
    Vissense.prototype.fireIfVisible = function(callback) {
      return VisSenseUtils.fireIfVisible(this._element, callback);
    };
    Vissense.prototype.fireIfHidden = function (callback) {
        return VisSenseUtils.fireIfHidden(this._element, callback);
    };

    /*--------------------------------------------------------------------------*/

	Vissense.prototype.getFullyVisibleThreshold = VisSenseUtils.noop;

    /**
     * The semantic version number.
     */
    Vissense.VERSION = version;

    return Vissense;
  }

  /*--------------------------------------------------------------------------*/

  // export Vissense
  root[libName] = runInContext(root);
}.call(this, this, this.Math, this.VisSenseUtils));