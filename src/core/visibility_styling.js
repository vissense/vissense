(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	var _window = function(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	};

	var _findEffectiveStyle = function(element) {
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

	var findEffectiveStyleProperty = function findEffectiveStyleProperty(element, property) {
		var effectiveStyle = _findEffectiveStyle(element);
		var propertyValue = effectiveStyle[property];
		if (propertyValue === 'inherit' && element.parentNode.style) {
			return findEffectiveStyleProperty(element.parentNode, property);
		}
		return propertyValue;
	};

	var isDisplayed = function isDisplayed(element) {
		var display = findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	};

	var isHiddenInputElement = function(element) {
		if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
			return element.type && String(element.type).toLowerCase() === 'hidden';
		}
		return false;
	};

	module.findEffectiveStyleProperty = function(element, property) {
		return findEffectiveStyleProperty(element, property);
	};
	
	module.isVisibleByStyling = function(element) {
		if (element === _window(element).document) {
			return true;
		}
		if (!element || !element.parentNode){
			return false;
		}

		if(isHiddenInputElement(element)) {
			return false;
		}
		
		var visibility = findEffectiveStyleProperty(element, 'visibility');
		var displayed = isDisplayed(element);
		return (visibility !== 'hidden' && visibility !== 'collapse' && displayed);
	};

	return module;

}));
