/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 /**
 * Exports following functions to VisSenseUtils
 *
 * findEffectiveStyle
 * findEffectiveStyleProperty
 * isDisplayed
 * isVisibleByStyling
 * isHiddenInputElement
 */
;(function(window, VisSenseUtils) {
  'use strict';
    function _isVisibleByOffsetParentCheck(element) {
        // http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
        if(element.offsetParent === null) {
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
	};
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
	};

	function isDisplayed(element) {
		var display = findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	};

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
    };

    (function(target) {
        target.isHiddenInputElement = isHiddenInputElement;
        target.findEffectiveStyle = findEffectiveStyle;
        target.findEffectiveStyleProperty = findEffectiveStyleProperty;
        target.isDisplayed = isDisplayed;
        target.isVisibleByStyling = isVisibleByStyling;
    }(VisSenseUtils));
}.call(this, this, this.VisSenseUtils));