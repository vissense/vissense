(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	var _window = function(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	};

	var getBoundingClientRect = function(element) {
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
	};
	
	var viewportHeight = function(element) {
		var w = _window(element);
		return w.innerHeight || w.document.documentElement.clientHeight;
	};

	var viewportWidth = function(element) {
		var w = _window(element);
		return w.innerWidth || w.document.documentElement.clientWidth;
	};

	
	module.isFullyInViewport = function(element) {
		var r = getBoundingClientRect(element);
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

	module.isInViewport = function(element) {
		var r = getBoundingClientRect(element);
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

	module.getVisibilityPercentage = function(element) {
		if(!module.isInViewport(element)) {
			return 0;
		}

		var r = getBoundingClientRect(element);
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
	};

	return module;
}));
