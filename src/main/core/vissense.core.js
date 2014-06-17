/**
 * @license
 * VisSense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
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