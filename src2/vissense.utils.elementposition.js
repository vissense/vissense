/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 /**
 * Exports following functions to VisSenseUtils
 *
 * viewportHeight
 * viewportWidth
 * isFullyInViewport
 * isInViewport
 * _getBoundingClientRect
 */
;(function(window, VisSenseUtils) {
  'use strict';

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

	function viewportHeight(element) {
		var w = VisSenseUtils._window(element);
		return w.innerHeight || w.document.documentElement.clientHeight;
	};

	function viewportWidth(element) {
		var w = VisSenseUtils._window(element);
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
	}

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

    (function install(target) {
        target.viewportHeight = viewportHeight;
        target.viewportWidth = viewportWidth;
        target.isFullyInViewport = isFullyInViewport;
        target.isInViewport = isInViewport;
        target._getBoundingClientRect = _getBoundingClientRect;
    }(VisSenseUtils));
}.call(this, this, this.VisSenseUtils));