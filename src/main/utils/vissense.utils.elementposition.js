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
;(function(window, VisSenseUtils, undefined) {
  'use strict';

	function _getBoundingClientRect(element) {
		var r = element.getBoundingClientRect();
		// height and width are not standard elements - so lets add them
		if(r.height === undefined || r.width === undefined) {
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

	/**
	* return the viewport (does *not* subtract scrollbar size)
	*/
    function viewport(element) {
        var w = element ? VisSenseUtils._window(element) : window;
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

	function isFullyInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(!r || (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);

		return r.top >= 0 &&
			r.left >= 0 &&
			r.bottom <= view.height &&
			r.right <= view.width;
	}

	function isInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(!r || (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);
		return r.bottom > 0 &&
			r.right > 0 &&
			r.top < view.height &&
			r.left < view.width;
	}

    VisSenseUtils.viewport = viewport;
    VisSenseUtils.isFullyInViewport = isFullyInViewport;
    VisSenseUtils.isInViewport = isInViewport;
    VisSenseUtils._getBoundingClientRect = _getBoundingClientRect;

}(window, window.VisSenseUtils));